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
    { title: "Open", dot: "bg-indigo-500", data: issues.filter((i) => i.status === "open") },
    { title: "In Progress", dot: "bg-sky-500", data: issues.filter((i) => i.status === "in-progress") },
    { title: "Resolved", dot: "bg-emerald-500", data: issues.filter((i) => i.status === "resolved") },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Issue Workflow Board</h1>
          <p className="mt-1 text-sm text-slate-500">
            Track live maintenance progress across Open, In Progress, and Resolved columns.
          </p>
        </div>
        <Link
          to="/issues"
          className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
        >
          <Icon name="list" className="size-4" />
          List View
        </Link>
      </div>

      {loading ? (
        <div className="grid gap-6 md:grid-cols-3">
          {[1, 2, 3].map((n) => (
            <div key={n} className="h-96 animate-pulse rounded-2xl border border-slate-200 bg-white p-4" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-rose-200 bg-rose-50/70">
          <p className="text-sm font-medium text-rose-700">{error}</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {columns.map((col) => (
            <section
              key={col.title}
              className="flex flex-col rounded-2xl border border-slate-200/80 bg-slate-100/70 p-4"
            >
              <div className="mb-4 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className={`size-2.5 rounded-full ${col.dot}`} />
                  <h2 className="text-sm font-bold text-slate-800">{col.title}</h2>
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold tabular-nums text-slate-600 ring-1 ring-slate-200">
                  {col.data.length}
                </span>
              </div>

              {col.data.length === 0 ? (
                <div className="flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-white/50 px-4 py-10 text-center">
                  <p className="text-xs font-medium text-slate-400">No issues in {col.title.toLowerCase()}</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {col.data.map((issue) => {
                    const sev = getIssueSeverity(issue);
                    return (
                      <Link key={issue._id} to={`/issues/${issue._id}`} className="block">
                        <Card hover className="p-4">
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-sm font-bold text-slate-900 line-clamp-2">
                              {issue.title}
                            </h3>
                            {issue.category && (
                              <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-semibold capitalize text-slate-600">
                                {issue.category}
                              </span>
                            )}
                          </div>
                          <p className="mt-1.5 text-xs leading-relaxed text-slate-600 line-clamp-2">
                            {issue.description}
                          </p>
                          <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3">
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
