import { useState, type ReactNode } from "react";
import { Link, useLocation, useParams } from "react-router";
import { issuesAPI } from "../features/issues/issuesAPI";
import type { Issue, IssueStatus } from "../features/issues/types";
import { useQuery } from "../hooks/useQuery";
import { ApiError } from "../services/apiClient";
import { CATEGORY_LABELS, IMPACT_OPTIONS, STATUS_LABELS } from "../utils/constants";
import { formatDate, formatRelative, pluralize } from "../utils/formatters";
import { PRIORITY_STYLES } from "../utils/severity";
import SLAClock from "../components/SLAClock";
import { PriorityBadge, StatusBadge } from "../components/ui/Badge";
import { Button, ButtonLink } from "../components/ui/Button";
import { Alert, Card, EmptyState, ErrorState, Skeleton } from "../components/ui/Feedback";
import { Select } from "../components/ui/Field";
import { Icon } from "../components/ui/Icon";

const voteKey = (id: string) => `civicpulse:voted:${id}`;

function hasVoted(id: string) {
  try {
    return localStorage.getItem(voteKey(id)) === "1";
  } catch {
    return false;
  }
}

function rememberVote(id: string) {
  try {
    localStorage.setItem(voteKey(id), "1");
  } catch {
    /* storage unavailable: ignore */
  }
}

export default function IssueDetail() {
  const { id = "" } = useParams();
  const location = useLocation();
  const query = useQuery(`issue:${id}`, (signal) => issuesAPI.get(id, signal));
  const [showCreated, setShowCreated] = useState(Boolean((location.state as { created?: boolean } | null)?.created));

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/" className="mb-6 inline-flex items-center gap-1 text-sm font-medium text-zinc-500 hover:text-zinc-900">
        <Icon name="chevronLeft" />
        All issues
      </Link>

      {showCreated && (
        <div className="mb-6">
          <Alert tone="success" onDismiss={() => setShowCreated(false)}>
            Your issue has been submitted. Share this page so others can upvote it.
          </Alert>
        </div>
      )}

      {query.error ? (
        <Card>
          {query.error instanceof ApiError && (query.error.status === 404 || query.error.status === 400) ? (
            <EmptyState
              icon="search"
              title="Issue not found"
              description="It may have been removed, or the link is incorrect."
              action={<ButtonLink to="/" variant="secondary" size="sm">Back to issues</ButtonLink>}
            />
          ) : (
            <ErrorState message={query.error.message} onRetry={query.reload} />
          )}
        </Card>
      ) : !query.data || query.data.id !== id ? (
        <DetailSkeleton />
      ) : (
        <IssueView issue={query.data} onChange={query.setData} />
      )}
    </div>
  );
}

function IssueView({ issue, onChange }: { issue: Issue; onChange: (issue: Issue) => void }) {
  const [voted, setVoted] = useState(() => hasVoted(issue.id));
  const [voting, setVoting] = useState(false);
  const [savingStatus, setSavingStatus] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const upvote = async () => {
    setVoting(true);
    setError(null);
    try {
      onChange(await issuesAPI.upvote(issue.id));
      rememberVote(issue.id);
      setVoted(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setVoting(false);
    }
  };

  const changeStatus = async (status: IssueStatus) => {
    setSavingStatus(true);
    setError(null);
    try {
      onChange(await issuesAPI.updateStatus(issue.id, status));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSavingStatus(false);
    }
  };

  const impact = IMPACT_OPTIONS.find((o) => o.value === issue.impact);

  return (
    <>
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <StatusBadge status={issue.status} />
            <PriorityBadge priority={issue.priority} />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 break-words">{issue.title}</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Reported {formatRelative(issue.createdAt)} by {issue.reporterName ?? "Anonymous"}
          </p>
        </div>
        <Button
          variant={voted ? "secondary" : "primary"}
          onClick={upvote}
          loading={voting}
          disabled={voted}
          aria-pressed={voted}
          className="shrink-0"
        >
          {!voting && <Icon name={voted ? "check" : "arrowUp"} />}
          {voted ? "Upvoted" : "Upvote"}
          <span className="tabular-nums opacity-70">· {issue.upvotes}</span>
        </Button>
      </div>

      {error && (
        <div className="mb-6">
          <Alert onDismiss={() => setError(null)}>{error}</Alert>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Card className="p-6">
            <h2 className="text-sm font-semibold text-zinc-900">Description</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-zinc-700">{issue.description}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-baseline justify-between">
              <h2 className="text-sm font-semibold text-zinc-900">Severity</h2>
              <span className="text-sm tabular-nums text-zinc-500">
                <span className="text-lg font-semibold text-zinc-900">{issue.severity}</span> / 100
              </span>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-zinc-100"
              role="meter"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={issue.severity}
              aria-label="Severity score"
            >
              <div className={`h-full rounded-full ${PRIORITY_STYLES[issue.priority].bar}`} style={{ width: `${issue.severity}%` }} />
            </div>
            <p className="mt-3 text-xs text-zinc-500">
              Based on the {CATEGORY_LABELS[issue.category].toLowerCase()} category, {impact?.label.toLowerCase()} affected, and{" "}
              {pluralize(issue.upvotes, "upvote")}.
            </p>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <label htmlFor="status" className="text-sm font-semibold text-zinc-900">
              Status
            </label>
            <div className="mt-3 flex items-center gap-2">
              <Select
                id="status"
                value={issue.status}
                disabled={savingStatus}
                onChange={(e) => changeStatus(e.target.value as IssueStatus)}
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>
            <div className="mt-3">
              <SLAClock issue={issue} />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-sm font-semibold text-zinc-900">Details</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <Detail icon="tag" label="Category">{CATEGORY_LABELS[issue.category]}</Detail>
              <Detail icon="pin" label="Location">{issue.location}</Detail>
              <Detail icon="user" label="Affected">{impact?.description}</Detail>
              <Detail icon="calendar" label="Reported">{formatDate(issue.createdAt)}</Detail>
              <Detail icon="clock" label="SLA deadline">{formatDate(issue.slaDueAt)}</Detail>
              {issue.resolvedAt && <Detail icon="check" label="Resolved">{formatDate(issue.resolvedAt)}</Detail>}
            </dl>
          </Card>
        </div>
      </div>
    </>
  );
}

function Detail({ icon, label, children }: { icon: Parameters<typeof Icon>[0]["name"]; label: string; children: ReactNode }) {
  return (
    <div className="flex gap-3">
      <Icon name={icon} className="mt-0.5 size-4 shrink-0 text-zinc-400" />
      <div className="min-w-0">
        <dt className="text-xs text-zinc-500">{label}</dt>
        <dd className="break-words text-zinc-900">{children}</dd>
      </div>
    </div>
  );
}

function DetailSkeleton() {
  return (
    <div aria-busy="true" aria-label="Loading issue">
      <Skeleton className="mb-3 h-5 w-32" />
      <Skeleton className="mb-2 h-8 w-2/3" />
      <Skeleton className="mb-8 h-4 w-48" />
      <div className="grid gap-6 lg:grid-cols-3">
        <Skeleton className="h-48 lg:col-span-2" />
        <Skeleton className="h-48" />
      </div>
    </div>
  );
}
