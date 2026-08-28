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

    const slaHours = society.defaultSLAs[data.category as keyof typeof society.defaultSLAs] || 24;
    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);
    const priorityScore = calculatePriority({
      category: data.category,
      reportCount: 1,
      isBreached: false,
    });

    let imageUrl = undefined;
    if (data.image) {
      try {
        const uploadRes = await cloudinary.uploader.upload(data.image, {
          folder: "civicpulse_issues",
        });
        imageUrl = uploadRes.secure_url;
      } catch (err) {
        console.error("Cloudinary Upload Error:", err);
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

  static async getSocietyIssues(societyId: string) {
    const overdueIssues = await Issue.find({
      society: societyId,
      status: { $ne: "resolved" },
      isEscalated: false,
      slaDeadline: { $lt: new Date() },
    });

    for (const issue of overdueIssues) {
      issue.isEscalated = true;
      issue.breachedAt = new Date();
      issue.priorityScore = calculatePriority({
        category: issue.category,
        reportCount: issue.reportCount,
        isBreached: true,
      });

      await AuditLog.create({
        issue: issue._id,
        action: "escalation",
        oldValue: "SLA Active",
        newValue: "SLA Breached",
      });

      await issue.save();
    }

    return Issue.find({ society: societyId })
      .populate("reportedBy", "name")
      .populate("assignedTo", "name")
      .sort({ priorityScore: -1 });
  }

  static async updateIssueStatus(issueId: string, userId: string, status: string) {
    const issue = await Issue.findById(issueId);
    if (!issue) {
      throw new Error("Issue not found");
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

  static async getIssueById(issueId: string, user: { id: string; role?: string; society?: string }) {
    const issue = await Issue.findById(issueId)
      .populate("reportedBy", "name flatNumber")
      .populate("assignedTo", "name role");

    if (!issue) {
      throw new Error("Issue not found");
    }

    if (issue.society.toString() !== user.society) {
      throw new Error("Access denied");
    }

    if (user.role === "resident") {
      const isReporter = issue.reporters.some((r) => r.toString() === user.id);
      if (!isReporter) {
        throw new Error("Not allowed to view this issue");
      }
    }

    if (user.role === "member") {
      if (!issue.assignedTo) {
        throw new Error("Not assigned to this issue");
      }
      const assignedId =
        typeof issue.assignedTo === "object" && (issue.assignedTo as any)._id
          ? (issue.assignedTo as any)._id.toString()
          : (issue.assignedTo as any).toString();

      if (assignedId !== user.id) {
        throw new Error("Not assigned to this issue");
      }
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
      slaDeadline: issue.slaDeadline,
      imageUrl: issue.imageUrl,
      createdAt: issue.createdAt,
    };
  }

  static async toggleReporter(issueId: string, userId: string) {
    const issue = await Issue.findById(issueId);
    if (!issue) throw new Error("Issue not found");

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
