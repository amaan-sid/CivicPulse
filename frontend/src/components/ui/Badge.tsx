import type { IssuePriority, IssueStatus } from "../../features/issues/types";
import { PRIORITY_LABELS, STATUS_LABELS } from "../../utils/constants";
import { PRIORITY_STYLES, STATUS_STYLES } from "../../utils/severity";

const badge = "inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-xs font-medium ring-1 ring-inset";

export function StatusBadge({ status }: { status: IssueStatus }) {
  return <span className={`${badge} ${STATUS_STYLES[status]}`}>{STATUS_LABELS[status]}</span>;
}

export function PriorityBadge({ priority }: { priority: IssuePriority }) {
  return (
    <span className={`${badge} ${PRIORITY_STYLES[priority].badge}`}>
      <span className={`size-1.5 rounded-full ${PRIORITY_STYLES[priority].dot}`} />
      {PRIORITY_LABELS[priority]}
    </span>
  );
}
