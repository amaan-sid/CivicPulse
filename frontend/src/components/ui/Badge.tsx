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
  critical: { pill: "bg-red-50 text-red-700 ring-red-200/80", dot: "bg-red-600" },
  high: { pill: "bg-red-50 text-red-700 ring-red-200/80", dot: "bg-red-500" },
  medium: { pill: "bg-amber-50 text-amber-800 ring-amber-200/80", dot: "bg-amber-500" },
  low: { pill: "bg-zinc-100 text-zinc-700 ring-zinc-200", dot: "bg-zinc-400" },
  open: { pill: "bg-zinc-100 text-zinc-800 ring-zinc-200", dot: "bg-zinc-900" },
  "in-progress": { pill: "bg-zinc-100 text-zinc-800 ring-zinc-200", dot: "bg-amber-500" },
  in_progress: { pill: "bg-zinc-100 text-zinc-800 ring-zinc-200", dot: "bg-amber-500" },
  resolved: { pill: "bg-emerald-50 text-emerald-700 ring-emerald-200/80", dot: "bg-emerald-600" },
  closed: { pill: "bg-zinc-100 text-zinc-500 ring-zinc-200", dot: "bg-zinc-400" },
  admin: { pill: "bg-zinc-100 text-zinc-800 ring-zinc-200", dot: "bg-zinc-900" },
  staff: { pill: "bg-zinc-100 text-zinc-700 ring-zinc-200", dot: "bg-zinc-600" },
  resident: { pill: "bg-zinc-100 text-zinc-700 ring-zinc-200", dot: "bg-zinc-400" },
};

const badgeBase =
  "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium capitalize ring-1 ring-inset whitespace-nowrap";

function Badge({ text, variant, dot = true }: Props) {
  const style = variant
    ? VARIANT_CLASSES[variant]
    : { pill: "bg-zinc-100 text-zinc-700 ring-zinc-200", dot: "bg-zinc-400" };
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
