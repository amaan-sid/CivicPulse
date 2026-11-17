import type { IssuePriority, IssueStatus } from "../features/issues/types";

/** Solid, flat colour tokens per priority (no gradients). */
export const PRIORITY_STYLES: Record<IssuePriority, { dot: string; badge: string; bar: string }> = {
  critical: { dot: "bg-red-600", badge: "bg-red-50 text-red-700 ring-red-600/20", bar: "bg-red-600" },
  high: { dot: "bg-orange-500", badge: "bg-orange-50 text-orange-700 ring-orange-600/20", bar: "bg-orange-500" },
  medium: { dot: "bg-amber-400", badge: "bg-amber-50 text-amber-800 ring-amber-600/20", bar: "bg-amber-400" },
  low: { dot: "bg-zinc-400", badge: "bg-zinc-100 text-zinc-700 ring-zinc-500/20", bar: "bg-zinc-400" },
};

export const STATUS_STYLES: Record<IssueStatus, string> = {
  open: "bg-blue-50 text-blue-700 ring-blue-600/20",
  in_progress: "bg-violet-50 text-violet-700 ring-violet-600/20",
  resolved: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  closed: "bg-zinc-100 text-zinc-600 ring-zinc-500/20",
};

export const isActive = (status: IssueStatus) => status === "open" || status === "in_progress";

export function calculateSeverityLabel(severity: number): string {
  if (severity >= 70) return "Critical";
  if (severity >= 50) return "High";
  if (severity >= 30) return "Medium";
  return "Low";
}
