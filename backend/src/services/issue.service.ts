import { Issue } from "@/models/issue.model";
import { Society } from "@/models/society.model";
import { AuditLog } from "@/models/audit.model";
import { User } from "@/models/user.model";
import { Membership } from "@/models/membership.model";
import { calculatePriority } from "@/utils/priority";
import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export class IssueService {
  static async createIssue(userId: string, societyId: string, data: { title: string; description: string; category: string; severity?: string; image?: string }) {
    const society = await Society.findById(societyId);
    if (!society) {
      throw new Error("Society not found");
    }

    const existingIssue = await Issue.findOne({
      society: societyId,
      category: data.category,
      title: { $regex: `^${data.title}$`, $options: "i" },
      status: { $ne: "resolved" },
    });

    if (existingIssue) {
      const alreadyReported = existingIssue.reporters.some((id) => id.toString() === userId);

      if (alreadyReported) {
        return {
          isDuplicate: true,
          alreadyReported: true,
          message: `You have already reported this issue. ${existingIssue.reportCount} people have reported it.`,
          issue: existingIssue,
        };
      }

      existingIssue.reporters.push(new mongoose.Types.ObjectId(userId) as any);
      existingIssue.reportCount += 1;

      const isBreached = existingIssue.status !== "resolved" && new Date() > existingIssue.slaDeadline;
      existingIssue.priorityScore = calculatePriority({
        category: existingIssue.category,
        reportCount: existingIssue.reportCount,
        isBreached,
      });

      await existingIssue.save();
      return {
        isDuplicate: true,
        alreadyReported: false,
        message: `${existingIssue.reportCount} people have reported this issue.`,
        issue: existingIssue,
      };
    }

    const defaultSLAsFallback: Record<string, number> = {
      plumbing: 24,
      electricity: 12,
      lift: 4,
      security: 2,
      cleanliness: 48,
      water: 6,
    };
    const slaHours = society.defaultSLAs?.[data.category as keyof typeof society.defaultSLAs] || defaultSLAsFallback[data.category] || 24;
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);
    const priorityScore = calculatePriority({
      category: data.category,
      reportCount: 1,
      isBreached: false,
    });

    let imageUrl = undefined;
    if (data.image) {
      try {
        if (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY) {
          const uploadRes = await cloudinary.uploader.upload(data.image, {
            folder: "civicpulse_issues",
          });
          imageUrl = uploadRes.secure_url;
        } else {
          imageUrl = data.image;
        }
      } catch (err) {
        console.error("Cloudinary Issue Upload Error (falling back to direct image data):", err);
        imageUrl = data.image;
      }
    }

    const issue = await Issue.create({
      title: data.title,
      description: data.description,
      category: data.category,
      severity: data.severity,
      priorityScore,
      reporters: [userId],
      reportedBy: userId,
      society: societyId,
      slaDeadline,
      imageUrl,
    });

    return { isDuplicate: false, issue };
  }

  static async checkAndEscalateOverdueIssues(societyId?: string) {
    const now = new Date();
    const query: any = {
      status: { $ne: "resolved" },
      isEscalated: false,
      slaDeadline: { $lte: now },
    };

    if (societyId) {
      query.society = societyId;
    }

    const overdueIssues = await Issue.find(query);

    for (const issue of overdueIssues) {
      issue.isEscalated = true;
      issue.breachedAt = issue.breachedAt || now;
      issue.priorityScore = calculatePriority({
        category: issue.category,
        reportCount: issue.reportCount,
        isBreached: true,
      });

      try {
        await AuditLog.create({
          issue: issue._id,
          action: "escalation",
          oldValue: "SLA Active",
          newValue: "SLA Breached",
        });
      } catch (logErr) {
        console.error("Failed to create audit log for escalation:", logErr);
      }

      await issue.save();
    }

    return overdueIssues.length;
  }

  static async getSocietyIssues(societyId: string) {
    await this.checkAndEscalateOverdueIssues(societyId);

    const ONE_DAY_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000);

    return Issue.find({
      society: societyId,
      $nor: [
        { status: "resolved", updatedAt: { $lt: ONE_DAY_AGO } },
        { isEscalated: true, breachedAt: { $lt: ONE_DAY_AGO } },
        { isEscalated: true, breachedAt: { $exists: false }, slaDeadline: { $lt: ONE_DAY_AGO } }
      ]
    })
      .populate("reportedBy", "name email profilePic gender")
      .populate("assignedTo", "name email profilePic role gender")
      .sort({ priorityScore: -1, createdAt: -1 });
  }

  static async updateIssueStatus(issueId: string, userId: string, status: string) {
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new Error("Issue not found");
    }

    const isBreached = issue.isEscalated || (issue.slaDeadline && new Date(issue.slaDeadline) <= new Date());
    if (isBreached) {
      throw new Error("This issue's SLA has been breached and cannot be modified");
    }

    if (issue.status === "resolved") {
      throw new Error("This issue is already resolved and cannot be reopened");
    }

    const user = await User.findById(userId);
    const isSuperAdmin = user?.platformRole === "SUPER_ADMIN";
    const membership = await Membership.findOne({
      userId,
      societyId: issue.society,
    });
    const isSocietyAdmin = (user as any)?.role === "admin" || (membership as any)?.role === "admin";
    const isAssignee = issue.assignedTo && issue.assignedTo.toString() === userId;
    const isReporter =
      (issue.reportedBy && issue.reportedBy.toString() === userId) ||
      (issue.reporters && issue.reporters.map((r: any) => r.toString()).includes(userId));

    if (!isSuperAdmin && !isSocietyAdmin && !isAssignee && !isReporter) {
      throw new Error("You are not authorized to update the status of this issue");
    }

    const oldStatus = issue.status;
    await AuditLog.create({
      issue: issue._id,
      action: "status_change",
      performedBy: userId,
      oldValue: oldStatus,
      newValue: status,
    });

    issue.status = status as any;
    await issue.save();
    return issue;
  }

  static async assignIssue(issueId: string, assignerId: string, memberId: string) {
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new Error("Issue not found");
    }

    const isBreached = issue.isEscalated || (issue.slaDeadline && new Date(issue.slaDeadline) <= new Date());
    if (isBreached) {
      throw new Error("This issue's SLA has been breached and cannot be modified");
    }

    if (issue.status === "resolved") {
      throw new Error("Cannot reassign a resolved issue");
    }

    const member = await User.findById(memberId);
    if (!member) {
      throw new Error("Member user not found");
    }

    const oldAssignedId = issue.assignedTo;
    const oldMember = oldAssignedId ? await User.findById(oldAssignedId) : null;

    issue.assignedTo = new mongoose.Types.ObjectId(memberId) as any;
    issue.assignedAt = new Date();
    issue.assignedBy = new mongoose.Types.ObjectId(assignerId) as any;

    await issue.save();

    await AuditLog.create({
      issue: issue._id,
      action: "assignment",
      performedBy: assignerId,
      assignedTo: memberId,
      oldValue: oldMember ? oldMember.name : "Unassigned",
      newValue: member.name,
    });

    return issue;
  }

  static async getIssueById(issueId: string, user: { id: string; role?: string; society?: string; platformRole?: string }) {
    const issue = await Issue.findById(issueId)
      .populate("reportedBy", "name email flatNumber profilePic gender")
      .populate("assignedTo", "name email role profilePic gender")
    if (!issue) {
      throw new Error("Issue not found");
    }

    const isSuperAdmin = user.platformRole === "SUPER_ADMIN";

    if (!isSuperAdmin) {
      const rawSociety = issue.society as any;
      const issueSocietyId = typeof rawSociety === "object" ? rawSociety?._id?.toString() : rawSociety?.toString();

      const isSameSociety = Boolean(user.society && issueSocietyId && issueSocietyId === user.society);

      if (!isSameSociety) {
        const hasMembership = await Membership.exists({
          userId: user.id,
          societyId: issueSocietyId,
        });

        if (!hasMembership) {
          throw new Error("Access denied: You do not belong to this organization.");
        }
      }
    }

    if (issue.status !== "resolved" && !issue.isEscalated && issue.slaDeadline && new Date() >= issue.slaDeadline) {
      issue.isEscalated = true;
      issue.breachedAt = issue.breachedAt || new Date();
      issue.priorityScore = calculatePriority({
        category: issue.category,
        reportCount: issue.reportCount,
        isBreached: true,
      });
      try {
        await AuditLog.create({
          issue: issue._id,
          action: "escalation",
          oldValue: "SLA Active",
          newValue: "SLA Breached",
        });
      } catch (e) {
        console.error("Audit log error on getIssueById:", e);
      }
      await issue.save();
    }

    return {
      _id: issue._id,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
      severity: issue.severity,
      priority: issue.priorityScore,
      reportCount: issue.reportCount,
      reportedBy: issue.reportedBy,
      assignedTo: issue.assignedTo,
      reporters: issue.reporters,
      society: issue.society,
      slaDeadline: issue.slaDeadline,
      isEscalated: issue.isEscalated,
      breachedAt: issue.breachedAt,
      imageUrl: issue.imageUrl,
      createdAt: issue.createdAt,
      updatedAt: issue.updatedAt,
    };
  }

  static async toggleReporter(issueId: string, userId: string) {
    const issue = await Issue.findById(issueId);
    if (!issue) throw new Error("Issue not found");

    const isBreached = issue.isEscalated || (issue.slaDeadline && new Date(issue.slaDeadline) <= new Date());
    if (isBreached) {
      throw new Error("This issue's SLA has been breached and cannot be modified");
    }

    if (issue.status === "resolved") {
      throw new Error("Cannot update report count for a resolved issue");
    }

    const hasReported = issue.reporters.some((rid) => rid.toString() === userId);
    if (hasReported) {
      issue.reporters = issue.reporters.filter((rid) => rid.toString() !== userId);
      issue.reportCount = Math.max(0, issue.reportCount - 1);
    } else {
      issue.reporters.push(userId as any);
      issue.reportCount += 1;
    }

    await issue.save();
    return issue;
  }
}
