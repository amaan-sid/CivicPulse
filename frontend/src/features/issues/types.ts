export type IssueCategory =
  | "safety"
  | "electricity"
  | "water"
  | "sanitation"
  | "infrastructure"
  | "internet"
  | "other";

export type IssueStatus = "open" | "in_progress" | "resolved" | "closed";
export type IssuePriority = "low" | "medium" | "high" | "critical";
export type IssueImpact = "individual" | "group" | "community";
export type IssueSort = "severity" | "newest" | "upvotes" | "due";

export interface Issue {
  id: string;
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
  slaDueAt: string;
  resolvedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IssueFilters {
  status?: IssueStatus;
  category?: IssueCategory;
  priority?: IssuePriority;
  q?: string;
  sort?: IssueSort;
  page?: number;
  limit?: number;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  category: IssueCategory;
  impact: IssueImpact;
  location: string;
  reporterName?: string;
}

export interface IssueStats {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  closed: number;
  overdue: number;
}

export interface Paginated<T> {
  data: T[];
  meta: { page: number; limit: number; total: number; totalPages: number };
}
