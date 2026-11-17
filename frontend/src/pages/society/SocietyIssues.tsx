import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import type { Issue } from "../../types/issue";
import { getIssueSeverity } from "../../types/issue";
import type { Society } from "../../types/society";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import SLATimer from "../../components/SLATimer";
import { Icon } from "../../components/ui/Icon";

function SocietyIssues() {
  const { id } = useParams();
  const [society, setSociety] = useState<Society | null>(null);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [issuesRes, societyRes] = await Promise.all([
          API.get<Issue[]>(`/society/${id}/issues`),
          API.get<Society>(`/society/${id}`).catch(() => ({ data: null })),
        ]);
        setIssues(Array.isArray(issuesRes.data) ? issuesRes.data : []);
        setSociety(societyRes.data);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to load society issues.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchData();
  }, [id]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <Link
          to="/societies"
          className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"
        >
          <Icon name="chevronLeft" className="size-3.5" />
          Back to societies
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            {society?.name || "Society Issues"}
          </h1>
          {society?.code && (
            <span className="rounded-lg bg-indigo-50 px-2.5 py-1 font-mono text-xs font-semibold text-indigo-700 ring-1 ring-indigo-200">
              {society.code}
            </span>
          )}
        </div>
        {society && (
          <p className="mt-1 text-sm text-slate-500">
            {society.city}, {society.state} · {society.totalFlats} flats
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-rose-200 bg-rose-50/70">
          <p className="text-sm font-medium text-rose-700">{error}</p>
        </Card>
      ) : issues.length === 0 ? (
        <Card className="py-14 text-center">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-slate-100 text-slate-500">
            <Icon name="inbox" className="size-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">No issues reported in this society</h3>
          <p className="mt-1 text-sm text-slate-500">
            Issues submitted by residents of this community will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => {
            const sev = getIssueSeverity(issue);
            return (
              <Link key={issue._id} to={`/issues/${issue._id}`} className="group block">
                <Card hover className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                        {issue.title}
                      </h3>
                      {issue.category && (
                        <span className="shrink-0 rounded-md bg-slate-100 px-2 py-0.5 text-[11px] font-semibold capitalize text-slate-600">
                          {issue.category}
                        </span>
                      )}
                    </div>
                    <p className="mt-2 text-sm text-slate-600 line-clamp-2">{issue.description}</p>
                  </div>

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-3.5">
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
    </DashboardLayout>
  );
}

export default SocietyIssues;
