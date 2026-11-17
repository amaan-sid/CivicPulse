export const ISSUE_CATEGORIES = [
  'safety',
  'electricity',
  'water',
  'sanitation',
  'infrastructure',
  'internet',
  'other',
] as const;

export const ISSUE_STATUSES = ['open', 'in_progress', 'resolved', 'closed'] as const;

export const ISSUE_IMPACTS = ['individual', 'group', 'community'] as const;

export const ISSUE_PRIORITIES = ['low', 'medium', 'high', 'critical'] as const;

export type IssueCategory = (typeof ISSUE_CATEGORIES)[number];
export type IssueStatus = (typeof ISSUE_STATUSES)[number];
export type IssueImpact = (typeof ISSUE_IMPACTS)[number];
export type IssuePriority = (typeof ISSUE_PRIORITIES)[number];

export interface IssueRecord {
  title: string;
  description: string;
  category: IssueCategory;
  impact: IssueImpact;
  location: string;
  reporterName?: string;
  status: IssueStatus;
  upvotes: number;
  severity: number;
  priority: IssuePriority;
  slaDueAt: Date;
  resolvedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
