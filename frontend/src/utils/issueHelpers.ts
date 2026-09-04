const ONE_DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Checks whether an issue is currently breached.
 * If an issue is resolved, it is not considered an active breach.
 */
export const isIssueBreached = (issue: {
  isEscalated?: boolean;
  status: string;
  slaDeadline?: string | Date;
}): boolean => {
  if (issue.status === "resolved") return false;
  if (issue.isEscalated) return true;
  if (issue.slaDeadline && new Date(issue.slaDeadline).getTime() <= Date.now()) {
    return true;
  }
  return false;
};

/**
 * Checks whether an issue is expired (removes resolved and breached issues after 1 day).
 */
export const isIssueExpired = (issue: {
  status: string;
  isEscalated?: boolean;
  slaDeadline?: string | Date;
  breachedAt?: string | Date;
  updatedAt?: string | Date;
  createdAt: string | Date;
}): boolean => {
  const now = Date.now();

  // 1. If resolved: remove after 1 day (24 hours) from resolution
  if (issue.status === "resolved") {
    const resolvedTime = new Date(issue.updatedAt || issue.createdAt).getTime();
    return now - resolvedTime > ONE_DAY_MS;
  }

  // 2. If breached: remove after 1 day (24 hours) from breach
  if (isIssueBreached(issue)) {
    const breachTime = issue.breachedAt
      ? new Date(issue.breachedAt).getTime()
      : issue.slaDeadline
      ? new Date(issue.slaDeadline).getTime()
      : new Date(issue.updatedAt || issue.createdAt).getTime();

    return now - breachTime > ONE_DAY_MS;
  }

  return false;
};

/**
 * Filters out expired issues (removes resolved > 1 day and breached > 1 day).
 */
export const filterUnexpiredIssues = <
  T extends {
    status: string;
    isEscalated?: boolean;
    slaDeadline?: string | Date;
    breachedAt?: string | Date;
    updatedAt?: string | Date;
    createdAt: string | Date;
  }
>(
  issues: T[]
): T[] => {
  return issues.filter((iss) => !isIssueExpired(iss));
};
