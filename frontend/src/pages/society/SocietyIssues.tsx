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
          className="inline-flex items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900"
        >
          <Icon name="chevronLeft" className="size-3.5" />
          Back to societies
        </Link>
        <div className="mt-2 flex flex-wrap items-center gap-2.5">
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">
            {society?.name || "Society Issues"}
          </h1>
          {society?.code && (
            <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs font-medium text-zinc-700 ring-1 ring-zinc-200">
              {society.code}
            </span>
          )}
        </div>
        {society && (
          <p className="mt-1 text-sm text-zinc-500">
            {society.city}, {society.state} · {society.totalFlats} flats
          </p>
        )}
      </div>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl border border-zinc-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      ) : issues.length === 0 ? (
        <Card className="py-14 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <Icon name="inbox" className="size-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">No issues in this society</h3>
          <p className="mt-1 text-xs text-zinc-500">
            Issues submitted by residents of this community will appear here.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {issues.map((issue) => {
            const sev = getIssueSeverity(issue);
            return (
              <Link key={issue._id} to={`/issues/${issue._id}`} className="group block">
                <Card hover className="flex h-full flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-semibold text-zinc-900 group-hover:underline group-hover:underline-offset-2">
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

                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-zinc-100 pt-3">
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
