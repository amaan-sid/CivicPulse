export type IssueSeverity = "low" | "medium" | "high";
export type IssueStatusType = "open" | "in-progress" | "resolved";

export interface Issue {
  _id: string;
  title: string;
  description: string;
  category?: string;
  reportCount: number | string;
  severity?: IssueSeverity;
  priority?: IssueSeverity;
  priorityScore?: number;
  status: IssueStatusType;
  slaDeadline?: string;
  isEscalated?: boolean;
  reportedBy?: {
    _id?: string;
    name: string;
    flatNumber?: string;
  };
  assignedTo?: {
    _id?: string;
    name: string;
    role?: string;
  };
  society?:
    | string
    | {
        _id: string;
        name: string;
        code?: string;
      };
  createdAt: string;
  updatedAt?: string;
}

export function getIssueSeverity(issue: Pick<Issue, "severity" | "priority">): IssueSeverity {
  return issue.severity ?? issue.priority ?? "low";
}
