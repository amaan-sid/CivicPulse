import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import type { Issue } from "../../types/issue";
import { getIssueSeverity } from "../../types/issue";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SLATimer from "../../components/SLATimer";
import { Icon } from "../../components/ui/Icon";

function IssueBoard() {
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await API.get<Issue[]>("/issues");
        setIssues(Array.isArray(res.data) ? res.data : []);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to load workflow board.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchIssues();
  }, []);

  const columns: Array<{ title: string; dot: string; data: Issue[] }> = [
    { title: "Open", dot: "bg-zinc-900", data: issues.filter((i) => i.status === "open") },
    { title: "In Progress", dot: "bg-amber-500", data: issues.filter((i) => i.status === "in-progress") },
    { title: "Resolved", dot: "bg-emerald-600", data: issues.filter((i) => i.status === "resolved") },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Issue Board</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Track maintenance progress across Open, In Progress, and Resolved columns.
          </p>
        </div>
        <Link
          to="/issues"
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
        >
          <Icon name="list" className="size-4" />
          List view
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-80 animate-pulse rounded-xl border border-zinc-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
          {columns.map((col) => (
            <section
              key={col.title}
              className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-100/60 p-3.5"
            >
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`size-2 rounded-full ${col.dot}`} />
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-700">
                    {col.title}
                  </h2>
                </div>
                <span className="text-xs font-medium tabular-nums text-zinc-500">
                  {col.data.length}
                </span>
              </div>

              {col.data.length === 0 ? (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed border-zinc-300 bg-white/60 px-4 py-10 text-center">
                  <p className="text-xs text-zinc-400">No issues</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {col.data.map((issue) => {
                    const sev = getIssueSeverity(issue);
                    return (
                      <Link key={issue._id} to={`/issues/${issue._id}`} className="block">
                        <Card hover className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-medium text-zinc-900 line-clamp-2">
                              {issue.title}
                            </h3>
                            {issue.category && (
                              <span className="shrink-0 text-[11px] capitalize text-zinc-400">
                                {issue.category}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs leading-5 text-zinc-500 line-clamp-2">
                            {issue.description}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-2.5">
                            <Badge text={sev} variant={sev} />
                            <SLATimer
                              createdAt={issue.createdAt}
                              priority={sev}
                              slaDeadline={issue.slaDeadline}
                              status={issue.status}
                            />
                          </div>
                        </Card>
                      </Link>
                    );
                  })}
                </div>
              )}
            </section>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default IssueBoard;
