import { AuditLog } from "@/models/audit.model";

export class AuditService {
  static async getIssueLogs(issueId: string) {
    return AuditLog.find({ issue: issueId })
      .populate("performedBy", "name role")
      .populate("assignedTo", "name role")
      .sort({ createdAt: -1 });
  }
}
