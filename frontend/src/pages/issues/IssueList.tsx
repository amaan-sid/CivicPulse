import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import {
  Plus,
  Search,
  SlidersHorizontal,
  X,
  Loader2,
  AlertCircle,
  InboxIcon
} from "lucide-react"
import type { AppDispatch, RootState } from "../../app/store"
import { fetchIssues } from "../../features/issues/issueSlice"
import IssueCard from "../../components/IssueCard"
import DashboardLayout from "../../layouts/DashboardLayout"
import type { IssueCategory, IssueSeverity, IssueStatus } from "../../features/issues/issueTypes"

// Constants

const CATEGORIES: IssueCategory[] = [
  "plumbing", "electricity", "lift", "security", "cleanliness", "water"
]
const STATUSES: IssueStatus[]   = ["open", "in-progress", "resolved"]
const SEVERITIES: IssueSeverity[] = ["low", "medium", "high"]

// Types

interface Filters {
  search:   string
  status:   IssueStatus | ""
  severity: IssueSeverity | ""
  category: IssueCategory | ""
}

const DEFAULT_FILTERS: Filters = { search: "", status: "", severity: "", category: "" }

// Component

export default function IssueList() {
  const dispatch  = useDispatch<AppDispatch>()
  const navigate  = useNavigate()
  const { issues, loading, error } = useSelector((state: RootState) => state.issues)

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const hasFilters = Object.values(filters).some(Boolean)

  useEffect(() => { dispatch(fetchIssues()) }, [dispatch])

  const setFilter = <K extends keyof Filters>(key: K, value: Filters[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value }))

  const filtered = issues.filter(({ title, description, status, severity, category }) => {
    const q = filters.search.toLowerCase()
    return (
      (!q || title.toLowerCase().includes(q) || description.toLowerCase().includes(q)) &&
      (!filters.status   || status   === filters.status) &&
      (!filters.severity || severity === filters.severity) &&
      (!filters.category || category === filters.category)
    )
  })

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Issues</h1>
          <p className="text-sm text-gray-400 mt-0.5">
            {issues.length} total · {filtered.length} shown
          </p>
        </div>
        <button
          onClick={() => navigate("/issues/create")}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors shadow-sm"
        >
          <Plus size={16} />
          Report Issue
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2.5 mb-6 p-3 bg-gray-50 rounded-xl border border-gray-100">
        <SlidersHorizontal size={15} className="text-gray-400 shrink-0" />

        {/* Search */}
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilter("search", e.target.value)}
            className="pl-7 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 w-44"
          />
        </div>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => setFilter("status", e.target.value as IssueStatus | "")}
          className="py-1.5 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Severity */}
        <select
          value={filters.severity}
          onChange={(e) => setFilter("severity", e.target.value as IssueSeverity | "")}
          className="py-1.5 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Severities</option>
          {SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>

        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) => setFilter("category", e.target.value as IssueCategory | "")}
          className="py-1.5 px-3 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>

        {hasFilters && (
          <button
            onClick={() => setFilters(DEFAULT_FILTERS)}
            className="flex items-center gap-1 text-xs text-gray-400 hover:text-red-500 transition-colors ml-auto"
          >
            <X size={13} />
            Clear
          </button>
        )}
      </div>

      {/* States */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm">Loading issues...</span>
        </div>
      )}

      {!loading && error && (
        <div className="flex items-center gap-2 bg-red-50 text-red-600 rounded-xl p-4 text-sm border border-red-100">
          <AlertCircle size={16} className="shrink-0" />
          {error}
        </div>
      )}

      {!loading && !error && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-3">
          <InboxIcon size={32} strokeWidth={1.2} />
          <p className="text-sm">
            {hasFilters ? "No issues match your filters." : "No issues yet. Be the first to report one!"}
          </p>
          {!hasFilters && (
            <button
              onClick={() => navigate("/issues/create")}
              className="text-sm text-blue-600 hover:underline"
            >
              Report an issue
            </button>
          )}
        </div>
      )}

      {/* Grid */}
      {!loading && !error && filtered.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((issue) => (
            <IssueCard
              key={issue._id}
              issue={issue}
              onClick={() => navigate(`/issues/${issue._id}`)}
            />
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
