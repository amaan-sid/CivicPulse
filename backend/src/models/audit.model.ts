import mongoose, { Document } from "mongoose";

export interface IAuditLog extends Document {
  issue: mongoose.Types.ObjectId;
  action: "status_change" | "assignment" | "escalation";
  performedBy: mongoose.Types.ObjectId;
  oldValue?: string;
  newValue?: string;
  createdAt: Date;
}

const auditLogSchema = new mongoose.Schema<IAuditLog>(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true
    },

    action: {
      type: String,
      enum: ["status_change", "assignment", "escalation"],
      required: true
    },

    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    oldValue: String,
    newValue: String
  },
  { timestamps: true }
);

export const AuditLog = mongoose.model<IAuditLog>(
  "AuditLog",
  auditLogSchema
);