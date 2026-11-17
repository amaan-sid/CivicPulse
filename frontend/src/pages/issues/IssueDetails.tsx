import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import type { Issue, IssueStatusType } from "../../types/issue";
import { getIssueSeverity } from "../../types/issue";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SLATimer from "../../components/SLATimer";
import TimelineItem from "../../components/ui/TimeLineItem";
import { Icon } from "../../components/ui/Icon";

interface Staff {
  _id: string;
  name: string;
  email?: string;
}

interface AuditLog {
  _id: string;
  action: string;
  performedBy?: {
    name: string;
  };
  oldValue?: string;
  newValue?: string;
  createdAt: string;
}

const STATUS_ACTIONS: Array<{ value: IssueStatusType; label: string; activeClass: string }> = [
  { value: "open", label: "Open", activeClass: "bg-indigo-600 text-white border-indigo-600" },
  { value: "in-progress", label: "In Progress", activeClass: "bg-sky-600 text-white border-sky-600" },
  { value: "resolved", label: "Resolved", activeClass: "bg-emerald-600 text-white border-emerald-600" },
];

function IssueDetails() {
  const { id } = useParams();
  const user = useSelector((state: RootState) => state.auth.user);
  const isAdmin = user?.role === "admin";
  const canUpdateStatus = user?.role === "admin" || user?.role === "staff";

  const [issue, setIssue] = useState<Issue | null>(null);
  const [staff, setStaff] = useState<Staff[]>([]);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const loadLogs = async () => {
    if (!canUpdateStatus || !id) return;
    try {
      const logRes = await API.get<AuditLog[]>(`/issues/${id}/logs`);
      setLogs(Array.isArray(logRes.data) ? logRes.data : []);
    } catch {
      /* ignore logs error */
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const issueRes = await API.get<Issue>(`/issues/${id}`);
        setIssue(issueRes.data);

        if (isAdmin) {
          const staffRes = await API.get<Staff[]>("/users?role=staff").catch(() => ({ data: [] }));
          setStaff(Array.isArray(staffRes.data) ? staffRes.data : []);
        }

        if (canUpdateStatus) {
          const logRes = await API.get<AuditLog[]>(`/issues/${id}/logs`).catch(() => ({ data: [] }));
          setLogs(Array.isArray(logRes.data) ? logRes.data : []);
        }
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to load issue details.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id, isAdmin, canUpdateStatus]);

  const updateStatus = async (status: IssueStatusType) => {
    if (!issue || issue.status === status) return;
    setSaving(true);
    setFeedback("");
    try {
      const res = await API.patch<Issue>(`/issues/${id}`, { status });
      setIssue(res.data);
      setFeedback(`Status updated to ${status.replace("-", " ")}.`);
      await loadLogs();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not update status.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  const assignIssue = async (staffId: string) => {
    if (!staffId) return;
    setSaving(true);
    setFeedback("");
    try {
      const res = await API.patch<{ issue?: Issue } & Issue>(`/issues/${id}/assign`, { staffId });
      setIssue(res.data.issue ?? res.data);
      setFeedback("Staff member assigned successfully.");
      await loadLogs();
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
        "Could not assign staff member.";
      setError(msg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div className="space-y-4">
          <div className="h-8 w-1/3 animate-pulse rounded-xl bg-slate-200" />
          <div className="h-64 animate-pulse rounded-2xl border border-slate-200 bg-white" />
        </div>
      </DashboardLayout>
    );
  }

  if (error && !issue) {
    return (
      <DashboardLayout>
        <Card className="border-rose-200 bg-rose-50/70">
          <p className="text-sm font-medium text-rose-700">{error}</p>
          <Link to="/issues" className="mt-4 inline-block text-xs font-semibold text-indigo-600 hover:underline">
            ← Back to issues
          </Link>
        </Card>
      </DashboardLayout>
    );
  }

  if (!issue) return null;

  const sev = getIssueSeverity(issue);

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link
          to="/issues"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"
        >
          <Icon name="chevronLeft" className="size-3.5" />
          Back to issues
        </Link>
      </div>

      {feedback && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <Icon name="check" className="size-4 shrink-0" />
          <span>{feedback}</span>
        </div>
      )}

      {error && (
        <div className="mb-5 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          <Icon name="alert" className="size-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <div className="flex flex-wrap items-center gap-2">
              <Badge text={sev} variant={sev} />
              <Badge text={issue.status} variant={issue.status} />
              {issue.category && (
                <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold capitalize text-slate-600">
                  {issue.category}
                </span>
              )}
              {issue.isEscalated && (
                <span className="rounded-full bg-rose-100 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                  Escalated
                </span>
              )}
            </div>

            <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900">
              {issue.title}
            </h1>

            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">
              {issue.description}
            </p>
          </Card>

          {canUpdateStatus && (
            <Card className="p-6">
              <h2 className="text-sm font-bold text-slate-900">Update Workflow Status</h2>
              <p className="mt-1 text-xs text-slate-500">
                Transitions are recorded automatically in the audit timeline.
              </p>
              <div className="mt-4 flex flex-wrap gap-2.5">
                {STATUS_ACTIONS.map((btn) => {
                  const active = issue.status === btn.value;
                  return (
                    <button
                      key={btn.value}
                      type="button"
                      disabled={saving || active}
                      onClick={() => updateStatus(btn.value)}
                      className={`rounded-xl border px-4 py-2 text-xs font-semibold transition disabled:cursor-default ${
                        active
                          ? btn.activeClass
                          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      {btn.label}
                    </button>
                  );
                })}
              </div>
            </Card>
          )}

          {canUpdateStatus && (
            <Card className="p-6">
              <h2 className="text-base font-bold text-slate-900">Activity Timeline</h2>
              {logs.length === 0 ? (
                <p className="mt-3 text-sm text-slate-500">No audit activity recorded yet.</p>
              ) : (
                <div className="relative mt-5 space-y-5 border-l-2 border-slate-200 pl-6">
                  {logs.map((log) => (
                    <TimelineItem
                      key={log._id}
                      action={log.action}
                      performedBy={log.performedBy?.name}
                      oldValue={log.oldValue}
                      newValue={log.newValue}
                      createdAt={log.createdAt}
                    />
                  ))}
                </div>
              )}
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="text-sm font-bold text-slate-900">Issue Metadata</h2>
            <dl className="mt-4 space-y-3.5 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-xs font-medium text-slate-500">SLA Status</dt>
                <dd>
                  <SLATimer
                    createdAt={issue.createdAt}
                    priority={sev}
                    slaDeadline={issue.slaDeadline}
                    status={issue.status}
                  />
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-medium text-slate-500">Priority Score</dt>
                <dd className="font-bold tabular-nums text-slate-900">{issue.priorityScore ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-medium text-slate-500">Reports</dt>
                <dd className="font-semibold tabular-nums text-slate-900">{issue.reportCount}</dd>
              </div>
              {issue.reportedBy?.name && (
                <div className="flex items-center justify-between">
                  <dt className="text-xs font-medium text-slate-500">Reported By</dt>
                  <dd className="font-medium text-slate-800">
                    {issue.reportedBy.name}
                    {issue.reportedBy.flatNumber ? ` (${issue.reportedBy.flatNumber})` : ""}
                  </dd>
                </div>
              )}
              <div className="flex items-center justify-between">
                <dt className="text-xs font-medium text-slate-500">Assigned Staff</dt>
                <dd className="font-medium text-slate-800">
                  {issue.assignedTo?.name || "Unassigned"}
                </dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-xs font-medium text-slate-500">Created</dt>
                <dd className="text-xs text-slate-600">
                  {new Date(issue.createdAt).toLocaleString()}
                </dd>
              </div>
            </dl>
          </Card>

          {isAdmin && (
            <Card className="p-6">
              <label htmlFor="assign-staff" className="block text-sm font-bold text-slate-900">
                Assign Staff Member
              </label>
              <p className="mt-1 text-xs text-slate-500">
                Route this issue to a maintenance staff member.
              </p>
              <select
                id="assign-staff"
                disabled={saving}
                defaultValue={issue.assignedTo?._id || ""}
                onChange={(e) => assignIssue(e.target.value)}
                className="mt-3 block w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
              >
                <option value="">Select staff member…</option>
                {staff.map((s) => (
                  <option key={s._id} value={s._id}>
                    {s.name}
                  </option>
                ))}
              </select>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default IssueDetails;
