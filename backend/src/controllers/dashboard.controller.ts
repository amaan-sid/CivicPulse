import { Request, Response } from "express";
import mongoose from "mongoose";
import { Issue } from "../models/issue.model";
import { Society } from "../models/society.model";

export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    const { society } = req.user!;
    const hasSociety = Boolean(society && mongoose.Types.ObjectId.isValid(society));
    const matchFilter = hasSociety ? { society: new mongoose.Types.ObjectId(society) } : {};

    const [
      totalIssues,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      breachedIssues,
      highPriorityIssues,
      totalSocieties,
      categoryStats
    ] = await Promise.all([
      Issue.countDocuments(matchFilter),
      Issue.countDocuments({ ...matchFilter, status: "open" }),
      Issue.countDocuments({ ...matchFilter, status: "in-progress" }),
      Issue.countDocuments({ ...matchFilter, status: "resolved" }),
      Issue.countDocuments({ ...matchFilter, isEscalated: true }),
      Issue.countDocuments({ ...matchFilter, $or: [{ priorityScore: { $gte: 20 } }, { severity: "high" }] }),
      Society.countDocuments(),
      Issue.aggregate([
        ...(hasSociety ? [{ $match: matchFilter }] : []),
        {
          $group: {
            _id: "$category",
            count: { $sum: 1 }
          }
        },
        { $sort: { count: -1 } }
      ])
    ]);

    res.json({
      totalIssues,
      openIssues,
      inProgressIssues,
      resolvedIssues,
      breachedIssues,
      highPriorityIssues,
      totalSocieties,
      categoryDistribution: categoryStats
    });
  } catch (error) {
    console.error("DASHBOARD ERROR:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
