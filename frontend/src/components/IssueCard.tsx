import { Link } from "react-router";
import type { Issue } from "../features/issues/types";
import { CATEGORY_LABELS } from "../utils/constants";
import { formatRelative } from "../utils/formatters";
import { PRIORITY_STYLES } from "../utils/severity";
import { PriorityBadge, StatusBadge } from "./ui/Badge";
import { Icon } from "./ui/Icon";
import SLAClock from "./SLAClock";

export default function IssueCard({ issue }: { issue: Issue }) {
  return (
    <li className="group relative flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-zinc-50 sm:flex-row sm:items-center sm:gap-6">
      <span className={`absolute inset-y-0 left-0 w-0.5 ${PRIORITY_STYLES[issue.priority].bar}`} aria-hidden="true" />

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <Link
            to={`/issues/${issue.id}`}
            className="truncate text-sm font-semibold text-zinc-900 after:absolute after:inset-0 group-hover:underline group-hover:underline-offset-2"
          >
            {issue.title}
          </Link>
        </div>
        <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-500">
          <span className="inline-flex items-center gap-1">
            <Icon name="tag" className="size-3.5" />
            {CATEGORY_LABELS[issue.category]}
          </span>
          <span className="inline-flex items-center gap-1">
            <Icon name="pin" className="size-3.5" />
            {issue.location}
          </span>
          <span>{formatRelative(issue.createdAt)}</span>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:flex-nowrap sm:justify-end">
        <SLAClock issue={issue} compact />
        <span className="inline-flex items-center gap-1 text-xs tabular-nums text-zinc-500" title="Upvotes">
          <Icon name="arrowUp" className="size-3.5" />
          {issue.upvotes}
        </span>
        <PriorityBadge priority={issue.priority} />
        <StatusBadge status={issue.status} />
      </div>
    </li>
  );
}
