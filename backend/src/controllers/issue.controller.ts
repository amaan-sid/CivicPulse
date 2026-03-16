import { Request, Response } from "express";
import { Issue } from "../models/issue.model";
import { Society } from "../models/society.model";
import { calculatePriority } from "../utils/priority";
import { AuditLog } from "../models/audit.model";
import mongoose from "mongoose";
import { User } from "../models/user.model";

const ensureLinkedSociety = (req: Request, res: Response) => {
  if (!req.user?.society) {
    res.status(403).json({
      message: "Your account is not linked to a society yet. Please contact an admin."
    });
    return null;
  }

  return req.user.society;
};

// Create Issue (Resident)
export const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, category, severity } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = req.user;
    const userSociety = ensureLinkedSociety(req, res);

    if (!userSociety) {
      return;
    }

    const society = await Society.findById(userSociety);

    if (!society) {
      return res.status(404).json({ message: "Society not found" });
    }

    const existingIssue = await Issue.findOne({
      society: userSociety,
      category,
      title: { $regex: `^${title}$`, $options: "i" },
      status: { $ne: "resolved" }
    });

    if (existingIssue) {

      const alreadyReported = existingIssue.reporters.some(
        (id) => id.toString() === user.id
      );

      if (alreadyReported) {
        return res.status(200).json({
          message: `You have already reported this issue. ${existingIssue.reportCount} people have reported it.`,
          issue: existingIssue
        });
      }

      existingIssue.reporters.push(
        new mongoose.Types.ObjectId(user.id)
      );

      existingIssue.reportCount += 1;

      const isBreached =
        existingIssue.status !== "resolved" &&
        new Date() > existingIssue.slaDeadline;

      existingIssue.priorityScore = calculatePriority({
        category: existingIssue.category,
        reportCount: existingIssue.reportCount,
        isBreached
      });

      await existingIssue.save();

      return res.status(200).json({
        message: `${existingIssue.reportCount} people have reported this issue.`,
        issue: existingIssue
      });
    }

    const slaHours = society.defaultSLAs[category as keyof typeof society.defaultSLAs] || 24;

    const slaDeadline = new Date(Date.now() + slaHours * 60 * 60 * 1000);

    const isBreached = false;

    const priorityScore = calculatePriority({
      category,
      reportCount: 1,
      isBreached
    });

    const issue = await Issue.create({
      title,
      description,
      category,
      severity,
      priorityScore,
      reporters: [user.id],
      reportedBy: user.id,
      society: userSociety,
      slaDeadline
    });

    res.status(201).json(issue);

  } catch (error) {
    console.error("CREATE ISSUE ERROR:", error);
    res.status(500).json({ message: "Failed to create issue" });
  }
};


export const getSocietyIssues = async (req: Request, res: Response) => {
  try {
    const { role, id, society } = req.user!;
    const userSociety = ensureLinkedSociety(req, res);

    if (!userSociety) {
      return;
    }

    const overdueIssues = await Issue.find({
      society: userSociety,
      status: { $ne: "resolved" },
      isEscalated: false,
      slaDeadline: { $lt: new Date() }
    });

    for (const issue of overdueIssues) {
      issue.isEscalated = true;
      issue.breachedAt = new Date();

      issue.priorityScore = calculatePriority({
        category: issue.category,
        reportCount: issue.reportCount,
        isBreached: true
      });

      await AuditLog.create({
        issue: issue._id,
        action: "escalation",
        performedBy: issue.assignedBy || issue.reportedBy,
        oldValue: "SLA Active",
        newValue: "SLA Breached"
      });

      await issue.save();
    }

    let filter: any = { society: userSociety };

    if (role === "resident") {
      filter.reporters = id;
    }

    if (role === "staff") {
      filter.assignedTo = id;
    }

    const issues = await Issue.find(filter)
      .populate("reportedBy", "name flatNumber")
      .populate("assignedTo", "name role")
      .sort({ priorityScore: -1 });

    res.json(issues);

  } catch (error) {
    console.error("GET ISSUES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
};


// Update Issue Status (Staff/Admin)
export const updateIssueStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;


    const issue = await Issue.findById(req.params.id);


    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const oldStatus = issue.status;

    await AuditLog.create({
      issue: issue._id,
      action: "status_change",
      performedBy: req.user!.id,
      oldValue: oldStatus,
      newValue: status
    });
    issue.status = status;
    await issue.save();

    res.json(issue);

  } catch (error) {
    res.status(500).json({ message: "Failed to update issue" });
  }
};

export const assignIssue = async (req: Request, res: Response) => {
  try {
    const { staffId } = req.body;

    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const staff = await User.findById(staffId);
    if (!staff) {
      return res.status(404).json({ message: "Staff user not found" });
    }

    const oldAssignedId = issue.assignedTo;
    const staffOld = await User.findById(oldAssignedId);

    issue.assignedTo = new mongoose.Types.ObjectId(staffId);
    issue.assignedAt = new Date();
    issue.assignedBy = new mongoose.Types.ObjectId(req.user!.id);

    await issue.save();

    await AuditLog.create({
      issue: issue._id,
      action: "assignment",
      performedBy: req.user!.id,
      oldValue: staffOld.name,
      newValue: staff.name  
    });

    res.json({ message: "Issue assigned successfully", issue });

  } catch (error) {
    console.error("ASSIGN ISSUE ERROR:", error);
    res.status(500).json({ message: "Assignment failed" });
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const { role, id, society } = req.user!;
    const userSociety = ensureLinkedSociety(req, res);
    const issueId = req.params.id;

    if (!userSociety) {
      return;
    }

    const issue = await Issue.findById(issueId)
      .populate("reportedBy", "name flatNumber")
      .populate("assignedTo", "name role");

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    if (issue.society.toString() !== userSociety) {
      return res.status(403).json({ message: "Access denied" });
    }

    if (role === "resident") {
      const isReporter = issue.reporters.some(
        (r) => r.toString() === id
      );
      if (!isReporter) {
        return res.status(403).json({ message: "Not allowed to view this issue" });
      }
    }

    if (role === "staff") {
   const b = issue.assignedTo.toString();
  const assignedId =
    typeof issue.assignedTo === "object"
      ? issue.assignedTo._id.toString()
      : b;

  if (assignedId !== id) {
    return res.status(403).json({ message: "Not assigned to this issue" });
  }

}

    // Format response for frontend
    const formattedIssue = {
      _id: issue._id,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      status: issue.status,
      priority: issue.priorityScore,
      reportCount: issue.reportCount,
      slaDeadline: issue.slaDeadline,
      createdAt: issue.createdAt
    };

    res.json(formattedIssue);

  } catch (error) {
    console.error("GET ISSUE BY ID ERROR:", error);
    res.status(500).json({ message: "Failed to fetch issue" });
  }
};
