import { request } from "../../services/apiClient";
import type { CreateIssueInput, Issue, IssueFilters, IssueStats, IssueStatus, Paginated } from "./types";

type One<T> = { data: T };

export const issuesAPI = {
  list: (filters: IssueFilters, signal?: AbortSignal) =>
    request<Paginated<Issue>>("/issues", { query: { ...filters }, signal }),

  stats: (signal?: AbortSignal) =>
    request<One<IssueStats>>("/issues/stats", { signal }).then((r) => r.data),

  get: (id: string, signal?: AbortSignal) =>
    request<One<Issue>>(`/issues/${id}`, { signal }).then((r) => r.data),

  create: (input: CreateIssueInput) =>
    request<One<Issue>>("/issues", { method: "POST", body: input }).then((r) => r.data),

  upvote: (id: string) =>
    request<One<Issue>>(`/issues/${id}/upvote`, { method: "POST" }).then((r) => r.data),

  updateStatus: (id: string, status: IssueStatus) =>
    request<One<Issue>>(`/issues/${id}/status`, { method: "PATCH", body: { status } }).then((r) => r.data),

  health: (signal?: AbortSignal) =>
    request<{ status: string; database: string }>("/health", { signal }),
};
