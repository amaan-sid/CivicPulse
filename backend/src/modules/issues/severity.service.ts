import type { IssueCategory, IssueImpact, IssuePriority } from './issues.types';

/**
 * Severity is a 0–100 score combining three signals:
 *   - category risk  (up to 40): how dangerous the issue type is by default
 *   - impact scope   (up to 30): how many people the reporter says are affected
 *   - community votes (up to 30): log-scaled so early votes matter most
 *
 * The score maps to a priority bucket, which in turn sets the SLA deadline.
 */
const CATEGORY_WEIGHT: Record<IssueCategory, number> = {
  safety: 40,
  electricity: 30,
  water: 30,
  sanitation: 25,
  infrastructure: 20,
  internet: 15,
  other: 10,
};

const IMPACT_WEIGHT: Record<IssueImpact, number> = {
  individual: 0,
  group: 15,
  community: 30,
};

const SLA_HOURS: Record<IssuePriority, number> = {
  critical: 4,
  high: 24,
  medium: 72,
  low: 168,
};

export function computeSeverity(category: IssueCategory, impact: IssueImpact, upvotes: number) {
  const voteScore = Math.min(30, Math.round(Math.log2(upvotes + 1) * 6));
  return Math.min(100, CATEGORY_WEIGHT[category] + IMPACT_WEIGHT[impact] + voteScore);
}

export function priorityFor(severity: number): IssuePriority {
  if (severity >= 70) return 'critical';
  if (severity >= 50) return 'high';
  if (severity >= 30) return 'medium';
  return 'low';
}

export function slaDeadline(createdAt: Date, priority: IssuePriority): Date {
  return new Date(createdAt.getTime() + SLA_HOURS[priority] * 60 * 60 * 1000);
}

export function assess(category: IssueCategory, impact: IssueImpact, upvotes: number, createdAt: Date) {
  const severity = computeSeverity(category, impact, upvotes);
  const priority = priorityFor(severity);
  return { severity, priority, slaDueAt: slaDeadline(createdAt, priority) };
}

export const severityService = { computeSeverity, priorityFor, slaDeadline, assess };
