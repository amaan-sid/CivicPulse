import type { Issue } from "../features/issues/types";
import { useNow } from "../hooks/useNow";
import { formatDuration } from "../utils/formatters";
import { isActive } from "../utils/severity";
import { Icon } from "./ui/Icon";

type Props = { issue: Pick<Issue, "status" | "slaDueAt" | "resolvedAt">; compact?: boolean };

function slaState(issue: Props["issue"], now: number) {
  const due = new Date(issue.slaDueAt).getTime();
  if (!isActive(issue.status)) {
    const doneAt = issue.resolvedAt ? new Date(issue.resolvedAt).getTime() : now;
    return doneAt <= due
      ? { tone: "met" as const, label: "Resolved within SLA" }
      : { tone: "missed" as const, label: `SLA missed by ${formatDuration(doneAt - due)}` };
  }
  const remaining = due - now;
  if (remaining < 0) return { tone: "overdue" as const, label: `Overdue by ${formatDuration(remaining)}` };
  if (remaining < 2 * 60 * 60 * 1000) return { tone: "soon" as const, label: `Due in ${formatDuration(remaining)}` };
  return { tone: "ok" as const, label: `Due in ${formatDuration(remaining)}` };
}

const TONES = {
  ok: "text-zinc-500",
  soon: "text-amber-700",
  overdue: "text-red-600 font-medium",
  met: "text-emerald-700",
  missed: "text-zinc-500",
};

export default function SLAClock({ issue, compact }: Props) {
  const now = useNow();
  const { tone, label } = slaState(issue, now);
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${TONES[tone]}`} title={`SLA deadline: ${new Date(issue.slaDueAt).toLocaleString()}`}>
      <Icon name={tone === "met" ? "check" : "clock"} className="size-3.5 shrink-0" />
      {compact ? label.replace("Resolved within SLA", "Within SLA") : label}
    </span>
  );
}
