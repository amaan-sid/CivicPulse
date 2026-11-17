import { Schema, model, type HydratedDocument } from 'mongoose';
import {
  ISSUE_CATEGORIES,
  ISSUE_IMPACTS,
  ISSUE_PRIORITIES,
  ISSUE_STATUSES,
  type IssueRecord,
} from './issues.types';

const issueSchema = new Schema<IssueRecord>(
  {
    title: { type: String, required: true, trim: true, minlength: 5, maxlength: 120 },
    description: { type: String, required: true, trim: true, minlength: 10, maxlength: 2000 },
    category: { type: String, enum: ISSUE_CATEGORIES, required: true },
    impact: { type: String, enum: ISSUE_IMPACTS, default: 'individual' },
    location: { type: String, required: true, trim: true, maxlength: 120 },
    reporterName: { type: String, trim: true, maxlength: 60 },
    status: { type: String, enum: ISSUE_STATUSES, default: 'open' },
    upvotes: { type: Number, default: 0, min: 0 },
    severity: { type: Number, required: true, min: 0, max: 100 },
    priority: { type: String, enum: ISSUE_PRIORITIES, required: true },
    slaDueAt: { type: Date, required: true },
    resolvedAt: { type: Date, default: null },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = String(ret._id);
        delete ret._id;
        return ret;
      },
    },
  },
);

issueSchema.index({ status: 1, severity: -1 });
issueSchema.index({ category: 1, status: 1 });
issueSchema.index({ createdAt: -1 });

export type IssueDocument = HydratedDocument<IssueRecord>;

export const Issue = model<IssueRecord>('Issue', issueSchema);

/** Plain JSON shape returned by the API (`_id` is exposed as `id`). */
export type IssueJSON = IssueRecord & { id: string };

export const serializeIssue = (doc: IssueDocument): IssueJSON => doc.toJSON() as unknown as IssueJSON;
