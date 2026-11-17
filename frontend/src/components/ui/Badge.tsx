import type { IssuePriority, IssueStatus } from "../../features/issues/types";
import { PRIORITY_LABELS, STATUS_LABELS } from "../../utils/constants";
import { PRIORITY_STYLES, STATUS_STYLES } from "../../utils/severity";

type BadgeVariant =
  | "low"
  | "medium"
  | "high"
  | "critical"
  | "open"
  | "in-progress"
  | "in_progress"
  | "resolved"
  | "closed"
  | "admin"
  | "staff"
  | "resident";

interface Props {
  text: string;
  variant?: BadgeVariant;
  dot?: boolean;
}

const VARIANT_CLASSES: Record<BadgeVariant, { pill: string; dot: string }> = {
  critical: { pill: "bg-rose-50 text-rose-700 ring-rose-600/20", dot: "bg-rose-600" },
  high: { pill: "bg-red-50 text-red-700 ring-red-600/20", dot: "bg-red-500" },
  medium: { pill: "bg-amber-50 text-amber-800 ring-amber-600/20", dot: "bg-amber-500" },
  low: { pill: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  open: { pill: "bg-indigo-50 text-indigo-700 ring-indigo-600/20", dot: "bg-indigo-500" },
  "in-progress": { pill: "bg-sky-50 text-sky-700 ring-sky-600/20", dot: "bg-sky-500" },
  in_progress: { pill: "bg-sky-50 text-sky-700 ring-sky-600/20", dot: "bg-sky-500" },
  resolved: { pill: "bg-emerald-50 text-emerald-700 ring-emerald-600/20", dot: "bg-emerald-500" },
  closed: { pill: "bg-slate-100 text-slate-600 ring-slate-500/20", dot: "bg-slate-400" },
  admin: { pill: "bg-violet-50 text-violet-700 ring-violet-600/20", dot: "bg-violet-500" },
  staff: { pill: "bg-sky-50 text-sky-700 ring-sky-600/20", dot: "bg-sky-500" },
  resident: { pill: "bg-teal-50 text-teal-700 ring-teal-600/20", dot: "bg-teal-500" },
};

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ring-1 ring-inset whitespace-nowrap";

function Badge({ text, variant, dot = true }: Props) {
  const style = variant ? VARIANT_CLASSES[variant] : { pill: "bg-slate-100 text-slate-700 ring-slate-500/20", dot: "bg-slate-400" };
  return (
    <span className={`${badgeBase} ${style.pill}`}>
      {dot && <span className={`size-1.5 rounded-full ${style.dot}`} aria-hidden="true" />}
      {text.replace("-", " ")}
    </span>
  );
}

export function StatusBadge({ status }: { status: IssueStatus }) {
  return <span className={`${badgeBase} ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  return (
    <span className={`${badgeBase} ${PRIORITY_STYLES[priority].badge}`}>
      <span className={`size-1.5 rounded-full ${PRIORITY_STYLES[priority].dot}`} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}

export default Badge;
