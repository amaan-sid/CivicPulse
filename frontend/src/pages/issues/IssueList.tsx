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
          <h2 className="text-2xl font-semibold tracking-tight text-zinc-900">Issues</h2>
          <p className="mt-1 text-sm text-zinc-500">
            Search, filter, and inspect issues ranked by priority and SLA deadline.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/issue-board"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <Icon name="kanban" className="size-4" />
            Board
          </Link>
          {user?.role === "resident" && (
            <Link
              to="/create-issue"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              <Icon name="plus" className="size-4" />
              Report Issue
            </Link>
          )}
        </div>
      </div>

      <Card className="mb-6 p-3.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, description, or category…"
              className="block w-full rounded-lg border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {(["all", "open", "in-progress", "resolved"] as const).map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                  statusFilter === st
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {st === "all" ? "All" : st.replace("-", " ")}
              </button>
            ))}

            <select
              aria-label="Filter by severity"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value as "all" | IssueSeverity)}
              className="ml-1 rounded-lg border border-zinc-300 bg-white px-2.5 py-1.5 text-xs font-medium text-zinc-700 focus:border-zinc-900 focus:outline-none"
            >
              <option value="all">All severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-40 animate-pulse rounded-xl border border-zinc-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50/50">
          <div className="flex items-start gap-2.5 text-red-700">
            <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="py-14 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <Icon name={issues.length > 0 ? "search" : "inbox"} className="size-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {issues.length > 0 ? "No matching issues" : "No issues reported yet"}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            {issues.length > 0
              ? "Try adjusting your search query or filters."
              : "New community issues will appear here once reported."}
          </p>
          {issues.length > 0 && (
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setStatusFilter("all");
                setSeverityFilter("all");
              }}
              className="mt-4 rounded-lg border border-zinc-300 bg-white px-3.5 py-1.5 text-xs font-medium text-zinc-700 hover:bg-zinc-50"
            >
              Clear filters
            </button>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((issue) => {
            const sev = getIssueSeverity(issue);
            return (
              <Link key={issue._id} to={`/issues/${issue._id}`} className="group block">
                <Card hover className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900 line-clamp-2 group-hover:underline group-hover:underline-offset-2">
                        {issue.title}
                      </h3>
                      {issue.category && (
                        <span className="shrink-0 text-xs capitalize text-zinc-400">
                          {issue.category}
                        </span>
                      )}
                    </div>

                    <p className="mt-2 text-xs leading-5 text-zinc-600 line-clamp-2">
                      {issue.description}
                    </p>
                  </div>

                  <div className="mt-4 space-y-3 border-t border-zinc-100 pt-3">
                    <div className="flex items-center justify-between text-xs text-zinc-500">
                      <span className="tabular-nums">
                        {issue.reportCount}{" "}
                        {Number(issue.reportCount) === 1 ? "report" : "reports"}
                      </span>
                      {issue.assignedTo?.name && (
                        <span className="truncate text-zinc-600">{issue.assignedTo.name}</span>
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
