export type IssueStatus = "open" | "in-progress" | "resolved"

export type IssueSeverity = "low" | "medium" | "high"

export type IssueCategory =
  | "plumbing"
  | "electricity"
  | "lift"
  | "security"
  | "cleanliness"
  | "water"

export interface Issue {
  _id: string
  title: string
  description: string
  category: IssueCategory
  status: IssueStatus
  severity: IssueSeverity
  priorityScore: number
  reportCount: number
  reportedBy: string
  reporters: string[]
  assignedTo?: string
  assignedBy?: string
  assignedAt?: string
  society: string
  slaDeadline?: string
  isEscalated: boolean
  breachedAt?: string
  createdAt: string
  updatedAt: string
}

export interface CreateIssuePayload {
  title: string
  description: string
  category: IssueCategory
  severity?: IssueSeverity
}
