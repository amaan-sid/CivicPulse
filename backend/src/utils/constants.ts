export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMIN: "admin",
  MEMBER: "member",
  STAFF: "staff",
  RESIDENT: "resident",
} as const;

export const ISSUE_STATUS = {
  OPEN: "open",
  IN_PROGRESS: "in-progress",
  RESOLVED: "resolved",
} as const;

export const ISSUE_SEVERITY = {
  LOW: "low",
  MEDIUM: "medium",
  HIGH: "high",
} as const;
