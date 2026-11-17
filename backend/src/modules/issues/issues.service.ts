import type { QueryFilter, SortOrder } from 'mongoose';
import { HttpError } from '../../middlewares/error.middleware';
import { Issue, serializeIssue, type IssueDocument } from './issues.model';
import { assess } from './severity.service';
import type { IssueRecord, IssueStatus } from './issues.types';
import type { CreateIssueInput, ListIssuesQuery } from './issues.validation';

const SORTS: Record<ListIssuesQuery['sort'], Record<string, SortOrder>> = {
  severity: { severity: -1, createdAt: -1 },
  newest: { createdAt: -1 },
  upvotes: { upvotes: -1, createdAt: -1 },
  due: { slaDueAt: 1 },
};

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

async function findOrThrow(id: string): Promise<IssueDocument> {
  const issue = await Issue.findById(id);
  if (!issue) throw new HttpError(404, 'Issue not found');
  return issue;
}

export async function listIssues(query: ListIssuesQuery) {
  const filter: QueryFilter<IssueRecord> = {};
  if (query.status) filter.status = query.status;
  if (query.category) filter.category = query.category;
  if (query.priority) filter.priority = query.priority;
  if (query.q) {
    const pattern = new RegExp(escapeRegex(query.q), 'i');
    filter.$or = [{ title: pattern }, { description: pattern }, { location: pattern }];
  }

  const [items, total] = await Promise.all([
    Issue.find(filter)
      .sort(SORTS[query.sort])
      .skip((query.page - 1) * query.limit)
      .limit(query.limit),
    Issue.countDocuments(filter),
  ]);

  return {
    data: items.map(serializeIssue),
    meta: {
      page: query.page,
      limit: query.limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / query.limit)),
    },
  };
}

export async function getIssue(id: string) {
  return serializeIssue(await findOrThrow(id));
}

export async function createIssue(input: CreateIssueInput) {
  const createdAt = new Date();
  const issue = await Issue.create({
    ...input,
    ...assess(input.category, input.impact, 0, createdAt),
    createdAt,
  });
  return serializeIssue(issue);
}

export async function upvoteIssue(id: string) {
  const issue = await Issue.findByIdAndUpdate(id, { $inc: { upvotes: 1 } }, { returnDocument: 'after' });
  if (!issue) throw new HttpError(404, 'Issue not found');

  // Votes raise severity; the SLA can only tighten while the issue is unresolved.
  const next = assess(issue.category, issue.impact, issue.upvotes, issue.createdAt);
  issue.severity = next.severity;
  if (next.slaDueAt < issue.slaDueAt) {
    issue.priority = next.priority;
    issue.slaDueAt = next.slaDueAt;
  }
  await issue.save();
  return serializeIssue(issue);
}

export async function updateStatus(id: string, status: IssueStatus) {
  const issue = await findOrThrow(id);
  issue.status = status;
  issue.resolvedAt = status === 'resolved' || status === 'closed' ? (issue.resolvedAt ?? new Date()) : null;
  await issue.save();
  return serializeIssue(issue);
}

export async function getStats() {
  const [byStatus, overdue] = await Promise.all([
    Issue.aggregate<{ _id: IssueStatus; count: number }>([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]),
    Issue.countDocuments({ status: { $in: ['open', 'in_progress'] }, slaDueAt: { $lt: new Date() } }),
  ]);

  const counts = { open: 0, in_progress: 0, resolved: 0, closed: 0 };
  for (const row of byStatus) counts[row._id] = row.count;

  return {
    total: Object.values(counts).reduce((a, b) => a + b, 0),
    ...counts,
    overdue,
  };
}

export const issuesService = {
  listIssues,
  getIssue,
  createIssue,
  upvoteIssue,
  updateStatus,
  getStats,
};
