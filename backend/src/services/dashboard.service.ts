import { Issue } from "@/models/issue.model";
import { IssueService } from "@/services/issue.service";
import mongoose from "mongoose";

export class DashboardService {
  static async getStats(societyId: string) {
    await IssueService.checkAndEscalateOverdueIssues(societyId);

    const ONE_DAY_AGO = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const unexpiredFilter = {
      society: societyId,
      $nor: [
        { status: "resolved", updatedAt: { $lt: ONE_DAY_AGO } },
        { isEscalated: true, breachedAt: { $lt: ONE_DAY_AGO } },
        { isEscalated: true, breachedAt: { $exists: false }, slaDeadline: { $lt: ONE_DAY_AGO } }
      ]
    };

    const totalIssues = await Issue.countDocuments(unexpiredFilter);
    const openIssues = await Issue.countDocuments({
      society: societyId,
      status: { $ne: "resolved" },
      isEscalated: false,
    });
    const resolvedIssues = await Issue.countDocuments({
      society: societyId,
      status: "resolved",
      updatedAt: { $gte: ONE_DAY_AGO },
    });
    const breachedIssues = await Issue.countDocuments({
      society: societyId,
      isEscalated: true,
      $or: [
        { breachedAt: { $gte: ONE_DAY_AGO } },
        { breachedAt: { $exists: false }, slaDeadline: { $gte: ONE_DAY_AGO } }
      ]
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
