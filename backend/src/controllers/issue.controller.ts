import { Request, Response } from "express";
import { IssueService } from "@/services/issue.service";

export const createIssue = async (req: Request, res: Response) => {
  try {
    const { title, description, category, severity, image } = req.body;

    if (!title || !description || !category) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const user = req.user;
    const targetSocietyId = req.body.societyId || user?.society || (user as any)?.currentSocietyId;

    if (!targetSocietyId) {
      return res.status(400).json({ message: "Organization context is required to report an issue." });
    }

    const result = await IssueService.createIssue(user.id, targetSocietyId, {
      title,
      description,
      category,
      severity,
      image,
    });

    if (result.isDuplicate) {
      return res.status(200).json({
        message: result.message,
        issue: result.issue,
      });
    }

    res.status(201).json(result.issue);
  } catch (error: any) {
    console.error("CREATE ISSUE ERROR:", error);
    res.status(error.message === "Society not found" ? 404 : 500).json({
      message: error.message || "Failed to create issue",
    });
  }
};

export const getSocietyIssues = async (req: Request, res: Response) => {
  try {
    const { society } = req.user!;
    const issues = await IssueService.getSocietyIssues(society);
    res.json(issues);
  } catch (error) {
    console.error("GET ISSUES ERROR:", error);
    res.status(500).json({ message: "Failed to fetch issues" });
  }
};

export const updateIssueStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const issue = await IssueService.updateIssueStatus(req.params.id as string, req.user!.id, status);
    res.json(issue);
  } catch (error: any) {
    const statusCode = error.message === "Issue not found" ? 404 : error.message.includes("breached") ? 400 : 500;
    res.status(statusCode).json({
      message: error.message || "Failed to update issue",
    });
  }
};

export const assignIssue = async (req: Request, res: Response) => {
  try {
    const { memberId } = req.body;
    const issue = await IssueService.assignIssue(req.params.id as string, req.user!.id, memberId);
    res.json({ message: "Issue assigned successfully", issue });
  } catch (error: any) {
    console.error("ASSIGN ISSUE ERROR:", error);
    const statusCode = error.message.includes("not found") ? 404 : error.message.includes("breached") ? 400 : 500;
    res.status(statusCode).json({
      message: error.message || "Assignment failed",
    });
  }
};

export const getIssueById = async (req: Request, res: Response) => {
  try {
    const issue = await IssueService.getIssueById(req.params.id as string, req.user!);
    res.json(issue);
  } catch (error: any) {
    console.error("GET ISSUE BY ID ERROR:", error);
    if (error.message === "Issue not found") {
      return res.status(404).json({ message: error.message });
    }
    if (error.message.includes("Access denied") || error.message.includes("Not allowed") || error.message.includes("Not assigned")) {
      return res.status(403).json({ message: error.message });
    }
    res.status(500).json({ message: "Failed to fetch issue" });
  }
};

export const toggleReporter = async (req: Request, res: Response) => {
  try {
    const issue = await IssueService.toggleReporter(req.params.id as string, req.user!.id);
    res.json(issue);
  } catch (error: any) {
    const statusCode = error.message === "Issue not found" ? 404 : error.message.includes("breached") ? 400 : 500;
    res.status(statusCode).json({
      message: error.message || "Toggle failed",
    });
  }
};