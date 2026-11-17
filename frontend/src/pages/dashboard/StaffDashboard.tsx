import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import API from "../../services/api";
import type { Issue } from "../../types/issue";
import { getIssueSeverity } from "../../types/issue";
import DashboardLayout from "../../layouts/DashboardLayout";
import SocietyLinkBanner from "../../components/SocietyLinkBanner";
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
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Assigned Queue</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Welcome, {user?.name || "Staff"}. Focus on escalated and high-severity tasks first.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            to="/issue-board"
            className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
          >
            <Icon name="kanban" className="size-4" />
            Workflow Board
          </Link>
          <Link
            to="/issues"
            className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
          >
            <Icon name="list" className="size-4" />
            All Assigned
          </Link>
        </div>
      </div>

      <SocietyLinkBanner
        onLinked={() => {
          setNotice("");
          API.get<Issue[]>("/issues")
            .then((res) => setIssues(Array.isArray(res.data) ? res.data : []))
            .catch(() => {});
        }}
      />

      {notice && (
        <div className="mb-6 flex items-start gap-2.5 rounded-lg border border-amber-200 bg-amber-50/70 px-4 py-3 text-sm text-amber-900">
          <Icon name="alert" className="mt-0.5 size-4 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      <dl className="grid grid-cols-2 overflow-hidden rounded-xl border border-zinc-200 bg-white lg:grid-cols-4">
        {[
          { label: "Open", value: openCount },
          { label: "In Progress", value: activeCount },
          { label: "Resolved", value: resolvedCount },
          { label: "SLA Escalated", value: escalatedCount, danger: true },
        ].map((stat, i) => (
          <div
            key={stat.label}
            className={`px-5 py-4 ${i % 2 === 1 ? "border-l border-zinc-200" : ""} ${
              i >= 2 ? "border-t border-zinc-200 lg:border-t-0" : ""
            } ${i === 2 ? "lg:border-l" : ""}`}
          >
            <dt className="text-xs font-medium text-zinc-500">{stat.label}</dt>
            <dd
              className={`mt-1 text-2xl font-semibold tabular-nums ${
                stat.danger && stat.value > 0 ? "text-red-600" : "text-zinc-900"
              }`}
            >
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>

      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-zinc-900">Active assignments</h2>
          <Link to="/issues" className="text-xs font-medium text-zinc-600 hover:text-zinc-900">
            View all →
          </Link>
        </div>

        {loading ? (
          <div className="grid gap-4 md:grid-cols-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-28 animate-pulse rounded-xl border border-zinc-200 bg-white" />
            ))}
          </div>
        ) : issues.length === 0 ? (
          <Card className="py-12 text-center">
            <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-600">
              <Icon name="check" className="size-5" />
            </div>
            <h3 className="text-sm font-semibold text-zinc-900">No assigned issues</h3>
            <p className="mt-1 text-xs text-zinc-500">
              New issues assigned to you by an administrator will appear here.
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
                      <h3 className="text-sm font-semibold text-zinc-900 line-clamp-1">
                        {issue.title}
                      </h3>
                      {issue.category && (
                        <span className="shrink-0 text-xs capitalize text-zinc-500">
                          {issue.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-1.5 text-xs leading-5 text-zinc-600 line-clamp-2">
                      {issue.description}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
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
