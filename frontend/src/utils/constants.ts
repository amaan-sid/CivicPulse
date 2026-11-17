import type { IssueCategory, IssueImpact, IssuePriority, IssueSort, IssueStatus } from "../features/issues/types";

export const APP_NAME = "CivicPulse";

export const CATEGORY_LABELS: Record<IssueCategory, string> = {
  safety: "Safety",
  electricity: "Electricity",
  water: "Water",
  sanitation: "Sanitation",
  infrastructure: "Infrastructure",
  internet: "Internet",
  other: "Other",
};

export const STATUS_LABELS: Record<IssueStatus, string> = {
  open: "Open",
  in_progress: "In progress",
  resolved: "Resolved",
  closed: "Closed",
};

export const PRIORITY_LABELS: Record<IssuePriority, string> = {
  critical: "Critical",
  high: "High",
  medium: "Medium",
  low: "Low",
};

export const SORT_LABELS: Record<IssueSort, string> = {
  severity: "Severity",
  newest: "Newest",
  upvotes: "Upvotes",
  due: "Due date",
};

export const IMPACT_OPTIONS: { value: IssueImpact; label: string; description: string }[] = [
  { value: "individual", label: "Just me", description: "Affects one person or room" },
  { value: "group", label: "A group", description: "A floor, wing, or team" },
  { value: "community", label: "Everyone", description: "A building or the whole site" },
];

export const PAGE_SIZE = 10;
