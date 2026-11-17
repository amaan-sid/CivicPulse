import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import API from "../../services/api";
import type { Issue } from "../../types/issue";
import { getIssueSeverity } from "../../types/issue";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SLATimer from "../../components/SLATimer";
import { Icon } from "../../components/ui/Icon";

function StaffDashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    API.get<Issue[]>("/issues")
      .then((res) => setIssues(Array.isArray(res.data) ? res.data : []))
      .catch((err: unknown) => {
        const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
        if (msg) setNotice(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const openCount = issues.filter((i) => i.status === "open").length;
  const activeCount = issues.filter((i) => i.status === "in-progress").length;
  const resolvedCount = issues.filter((i) => i.status === "resolved").length;
  const escalatedCount = issues.filter((i) => i.isEscalated && i.status !== "resolved").length;

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
            Staff Operations
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
            My Assigned Queue
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Welcome, {user?.name || "Staff"}. Prioritize escalated and high-severity tasks first.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <Link
            to="/issue-board"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-2xs transition hover:bg-slate-50"
          >
            <Icon name="kanban" className="size-4" />
            Workflow Board
          </Link>
          <Link
            to="/issues"
            className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
          >
            <Icon name="list" className="size-4" />
            All Assigned Issues
          </Link>
        </div>
      </div>

      {notice && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3.5 text-sm text-amber-800">
          <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Open Tasks", value: openCount, tone: "text-indigo-600" },
          { label: "In Progress", value: activeCount, tone: "text-sky-600" },
          { label: "Resolved", value: resolvedCount, tone: "text-emerald-600" },
          { label: "SLA Escalated", value: escalatedCount, tone: escalatedCount > 0 ? "text-rose-600" : "text-slate-900" },
        ].map((stat) => (
          <Card key={stat.label}>
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">{stat.label}</p>
            <p className={`mt-2 text-3xl font-bold tabular-nums ${stat.tone}`}>{stat.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">Active Assignments</h2>
          <Link to="/issues" className="text-xs font-semibold text-indigo-600 hover:underline">
            View full list →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 animate-pulse rounded-2xl border border-slate-200 bg-white" />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <Card className="py-12 text-center">
            <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
              <Icon name="check" className="size-5" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">All caught up!</h3>
            <p className="mt-1 text-sm text-slate-500">
              No issues are currently assigned to you. New assignments from admins will appear here.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {issues.slice(0, 6).map((issue) => {
              const sev = getIssueSeverity(issue);
              return (
                <Link key={issue._id} to={`/issues/${issue._id}`}>
                  <Card hover className="h-full">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="font-semibold text-slate-900 line-clamp-1">{issue.title}</h3>
                      {issue.category && (
                        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-medium capitalize text-slate-600">
                          {issue.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-sm text-slate-600 line-clamp-2">{issue.description}</p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
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
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default StaffDashboard;
