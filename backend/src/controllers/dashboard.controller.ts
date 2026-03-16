import { Request, Response } from "express";
import { Issue } from "../models/issue.model";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { society } = req.user!;

    const totalIssues = await Issue.countDocuments({ society });

    const openIssues = await Issue.countDocuments({
      society,
      status: { $ne: "resolved" }
    });

    const resolvedIssues = await Issue.countDocuments({
      society,
      status: "resolved"
    });

    const breachedIssues = await Issue.countDocuments({
      society,
      isEscalated: true
    });

    const highPriorityIssues = await Issue.countDocuments({
      society,
      priorityScore: { $gte: 20 }
    });

    const categoryStats = await Issue.aggregate([
      { $match: { society } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      totalIssues,
      openIssues,
      resolvedIssues,
      breachedIssues,
      highPriorityIssues,
      categoryDistribution: categoryStats
    });

  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};