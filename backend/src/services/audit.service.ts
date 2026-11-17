import { AuditLog } from "@/models/audit.model";

export class AuditService {
  static async getIssueLogs(issueId: string) {
    return AuditLog.find({ issue: issueId })
      .populate("performedBy", "name role profilePic")
      .populate("assignedTo", "name role profilePic")
      .sort({ createdAt: -1 });
  }
}
