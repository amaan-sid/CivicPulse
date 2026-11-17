import type { Issue } from "../features/issues/types";
import IssueCard from "./IssueCard";
import { Skeleton } from "./ui/Feedback";

export default function IssueList({ issues }: { issues: Issue[] }) {
  return (
    <ul role="list" className="divide-y divide-zinc-200">
      {issues.map((issue) => (
        <IssueCard key={issue.id} issue={issue} />
      ))}
    </ul>
  );
}

export function IssueListSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="divide-y divide-zinc-200" aria-busy="true" aria-label="Loading issues">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="flex items-center gap-6 px-5 py-4">
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-2/5" />
            <Skeleton className="h-3 w-1/4" />
          </div>
          <Skeleton className="hidden h-5 w-16 sm:block" />
          <Skeleton className="hidden h-5 w-16 sm:block" />
        </li>
      ))}
    </ul>
  );
}
