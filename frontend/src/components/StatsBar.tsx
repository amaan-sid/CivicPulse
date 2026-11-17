import type { IssueStats } from "../features/issues/types";
import { Skeleton } from "./ui/Feedback";

const ITEMS: { key: keyof IssueStats; label: string; danger?: boolean }[] = [
  { key: "open", label: "Open" },
  { key: "in_progress", label: "In progress" },
  { key: "resolved", label: "Resolved" },
  { key: "overdue", label: "Past SLA", danger: true },
];

export default function StatsBar({ stats, unavailable }: { stats?: IssueStats; unavailable?: boolean }) {
  return (
    <dl className="grid grid-cols-2 overflow-hidden rounded-lg border border-zinc-200 bg-white lg:grid-cols-4">
      {ITEMS.map(({ key, label, danger }, i) => {
        const value = stats?.[key];
        return (
          <div
            key={key}
            className={`px-5 py-4 ${i % 2 === 1 ? "border-l border-zinc-200" : ""} ${i >= 2 ? "border-t border-zinc-200 lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="text-xs font-medium text-zinc-500">{label}</dt>
            <dd className={`mt-1 text-2xl font-semibold tabular-nums tracking-tight ${danger && value ? "text-red-600" : "text-zinc-900"}`}>
              {value !== undefined ? value : unavailable ? <span className="text-zinc-300">—</span> : <Skeleton className="mt-1 h-7 w-10" />}
            </dd>
          </div>
        );
      })}
    </dl>
  );
}
