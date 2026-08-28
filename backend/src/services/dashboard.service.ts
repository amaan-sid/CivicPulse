import { Issue } from "@/models/issue.model";
import mongoose from "mongoose";

export class DashboardService {
  static async getStats(societyId: string) {
    const totalIssues = await Issue.countDocuments({ society: societyId });
    const openIssues = await Issue.countDocuments({
      society: societyId,
      status: { $ne: "resolved" },
    });
    const resolvedIssues = await Issue.countDocuments({
      society: societyId,
      status: "resolved",
    });
    const breachedIssues = await Issue.countDocuments({
      society: societyId,
      isEscalated: true,
    });
    const highPriorityIssues = await Issue.countDocuments({
      society: societyId,
      priorityScore: { $gte: 20 },
    });

    const categoryStats = await Issue.aggregate([
      { $match: { society: new mongoose.Types.ObjectId(societyId) } },
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
        },
      },
    ]);

    return {
      totalIssues,
      openIssues,
      resolvedIssues,
      breachedIssues,
      highPriorityIssues,
      categoryDistribution: categoryStats,
    };
  }
}
