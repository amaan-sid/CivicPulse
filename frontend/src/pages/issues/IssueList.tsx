import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import type { Issue, IssueSeverity, IssueStatusType } from "../../types/issue";
import { getIssueSeverity } from "../../types/issue";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SLATimer from "../../components/SLATimer";
import { Icon } from "../../components/ui/Icon";

function IssueList() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | IssueStatusType>("all");
  const [severityFilter, setSeverityFilter] = useState<"all" | IssueSeverity>("all");

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await API.get<Issue[]>("/issues");
        setIssues(Array.isArray(res.data) ? res.data : []);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to fetch issues.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchIssues();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return issues.filter((issue) => {
      const sev = getIssueSeverity(issue);
      if (statusFilter !== "all" && issue.status !== statusFilter) return false;
      if (severityFilter !== "all" && sev !== severityFilter) return false;
      if (
        q &&
        !issue.title.toLowerCase().includes(q) &&
        !issue.description.toLowerCase().includes(q) &&
        !(issue.category || "").toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [issues, search, statusFilter, severityFilter]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Community Issues</h2>
          <p className="mt-1 text-sm text-slate-500">
            Search, filter, and inspect issues ranked by priority score and SLA urgency.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/issue-board"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <Icon name="kanban" className="size-4" />
            Board View
          </Link>
          {user?.role === "resident" && (
            <Link
              to="/create-issue"
              className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              <Icon name="plus" className="size-4" />
              Report Issue
            </Link>
          )}
        </div>
      </div>

      {/* Filters Toolbar */}
      <Card className="mb-6 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description, or category…"
              className="block w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {(["all", "open", "in-progress", "resolved"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-xl px-3 py-1.5 text-xs font-semibold capitalize transition ${
                  statusFilter === st
                    ? "bg-indigo-600 text-white shadow-2xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {st === "all" ? "All Statuses" : st.replace("-", " ")}
              </button>
            ))}

            <select
              aria-label="Filter by severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as "all" | IssueSeverity)}
              className="rounded-xl border border-slate-300 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 focus:border-indigo-600 focus:outline-none"
            >
              <option value="all">All Severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-rose-200 bg-rose-50/70">
          <div className="flex items-start gap-3 text-rose-700">
            <Icon name="alert" className="mt-0.5 size-5 shrink-0" />
            <div>
              <p className="text-sm font-semibold">Unable to load issues</p>
              <p className="mt-1 text-sm">{error}</p>
            </div>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="py-14 text-center">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Icon name={issues.length > 0 ? "search" : "inbox"} className="size-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {issues.length > 0 ? "No matching issues" : "No issues reported yet"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {issues.length > 0
              ? "Try adjusting your search query or status filters."
              : "New community issues will show up here once reported."}
          </p>
          {issues.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setSeverityFilter("all");
              }}
              className="mt-4 rounded-xl border border-slate-300 bg-white px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
            >
              Reset filters
            </button>
          )}
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((issue) => {
            const sev = getIssueSeverity(issue);
            return (
              <Link key={issue._id} to={`/issues/${issue._id}`} className="group block">
                <Card hover className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-base font-bold text-slate-900 line-clamp-2 group-hover:text-indigo-600 transition-colors">
                        {issue.title}
                      </h3>
                      {issue.category && (
                        <span className="shrink-0 rounded-lg bg-slate-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-slate-600">
                          {issue.category}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-sm leading-relaxed text-slate-600 line-clamp-2">
                      {issue.description}
                    </p>
                  </div>

                  <div className="mt-5 space-y-3 border-t border-slate-100 pt-3.5">
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span className="inline-flex items-center gap-1.5">
                        <Icon name="users" className="size-3.5 text-indigo-500" />
                        <span>
                          <strong className="font-semibold text-slate-800">{issue.reportCount}</strong>{" "}
                          {Number(issue.reportCount) === 1 ? "report" : "reports"}
                        </span>
                      </span>
                      {issue.assignedTo?.name && (
                        <span className="truncate font-medium text-slate-600">
                          Staff: {issue.assignedTo.name}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge text={sev} variant={sev} />
                        <Badge text={issue.status} variant={issue.status} />
                      </div>
                      <SLATimer
                        createdAt={issue.createdAt}
                        priority={sev}
                        slaDeadline={issue.slaDeadline}
                        status={issue.status}
                      />
                    </div>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}

export default IssueList;
