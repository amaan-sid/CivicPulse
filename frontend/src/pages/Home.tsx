import { useRef, useState } from "react";
import { useSearchParams } from "react-router";
import { issuesAPI } from "../features/issues/issuesAPI";
import type { IssueFilters as Filters, IssueSort } from "../features/issues/types";
import { useQuery } from "../hooks/useQuery";
import { CATEGORY_LABELS, PAGE_SIZE, PRIORITY_LABELS, SORT_LABELS, STATUS_LABELS } from "../utils/constants";
import PageHeader from "../components/PageHeader";
import StatsBar from "../components/StatsBar";
import IssueFilters from "../components/IssueFilters";
import IssueList, { IssueListSkeleton } from "../components/IssueList";
import Pagination from "../components/Pagination";
import { ButtonLink, Button } from "../components/ui/Button";
import { Card, EmptyState, ErrorState } from "../components/ui/Feedback";
import { Icon } from "../components/ui/Icon";

/** Only accept URL values the API understands. */
function pick<T extends string>(value: string | null, allowed: Record<T, string>): T | undefined {
  return value && value in allowed ? (value as T) : undefined;
}

export default function Home() {
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("q") ?? "");
  const searchTimer = useRef<number | undefined>(undefined);

  const filters: Filters = {
    status: pick(params.get("status"), STATUS_LABELS),
    category: pick(params.get("category"), CATEGORY_LABELS),
    priority: pick(params.get("priority"), PRIORITY_LABELS),
    sort: pick<IssueSort>(params.get("sort"), SORT_LABELS) ?? "severity",
    q: params.get("q") ?? undefined,
    page: Math.max(1, Number(params.get("page")) || 1),
    limit: PAGE_SIZE,
  };

  const list = useQuery(`issues:${JSON.stringify(filters)}`, (signal) => issuesAPI.list(filters, signal));
  const stats = useQuery("issues:stats", (signal) => issuesAPI.stats(signal));

  const update = (changes: Record<string, string | undefined>) => {
    setParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, value] of Object.entries(changes)) {
          if (value) next.set(key, value);
          else next.delete(key);
        }
        return next;
      },
      { replace: true },
    );
  };

  const onSearch = (value: string) => {
    setSearch(value);
    window.clearTimeout(searchTimer.current);
    searchTimer.current = window.setTimeout(() => update({ q: value.trim() || undefined, page: undefined }), 300);
  };

  const onFilter = (key: keyof Filters, value: string) =>
    update({ [key]: key === "sort" && value === "severity" ? undefined : value || undefined, page: undefined });

  const reset = () => {
    setSearch("");
    window.clearTimeout(searchTimer.current);
    setParams({}, { replace: true });
  };

  const filtered = Boolean(filters.q || filters.status || filters.category || filters.priority);
  const result = list.data;

  return (
    <>
      <PageHeader
        title="Issues"
        description="Reported problems across your community, ranked by severity and SLA."
        actions={
          <ButtonLink to="/report">
            <Icon name="plus" />
            Report an issue
          </ButtonLink>
        }
      />

      <StatsBar stats={stats.data} unavailable={!!stats.error} />

      <Card className="mt-6 overflow-hidden">
        <IssueFilters search={search} onSearch={onSearch} filters={filters} onChange={onFilter} onReset={reset} />

        {list.error ? (
          <ErrorState
            message={list.error.message}
            onRetry={() => {
              list.reload();
              stats.reload();
            }}
          />
        ) : !result ? (
          <IssueListSkeleton />
        ) : result.data.length === 0 ? (
          filtered ? (
            <EmptyState
              icon="search"
              title="No matching issues"
              description="Try a different search term or remove some filters."
              action={
                <Button variant="secondary" size="sm" onClick={reset}>
                  Clear filters
                </Button>
              }
            />
          ) : (
            <EmptyState
              title="No issues reported yet"
              description="When someone reports a problem it will appear here, ranked by severity."
              action={
                <ButtonLink to="/report" size="sm">
                  <Icon name="plus" />
                  Report the first issue
                </ButtonLink>
              }
            />
          )
        ) : (
          <>
            <div className={`transition-opacity ${list.loading ? "opacity-50" : ""}`} aria-busy={list.loading}>
              <IssueList issues={result.data} />
            </div>
            <Pagination
              page={result.meta.page}
              totalPages={result.meta.totalPages}
              total={result.meta.total}
              limit={result.meta.limit}
              onPage={(page) => update({ page: page > 1 ? String(page) : undefined })}
            />
          </>
        )}
      </Card>
    </>
  );
}
