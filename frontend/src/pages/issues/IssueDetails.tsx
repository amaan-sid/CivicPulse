import { useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import {
  ChevronLeft,
  Clock,
  AlertTriangle,
  BarChart2,
  Users,
  UserCheck,
  CalendarDays,
  TrendingUp,
  Loader2
} from "lucide-react"
import type { AppDispatch, RootState } from "../../app/store"
import { fetchIssues, setSelectedIssue } from "../../features/issues/issueSlice"
import type { IssueStatus, IssueSeverity } from "../../features/issues/issueTypes"
import DashboardLayout from "../../layouts/DashboardLayout"

// Maps

const STATUS_STYLES: Record<IssueStatus, string> = {
  open:          "bg-blue-50   text-blue-700   ring-1 ring-blue-200",
  "in-progress": "bg-amber-50  text-amber-700  ring-1 ring-amber-200",
  resolved:      "bg-green-50  text-green-700  ring-1 ring-green-200"
}

const SEVERITY_STYLES: Record<IssueSeverity, string> = {
  low:    "bg-gray-50   text-gray-500   ring-1 ring-gray-200",
  medium: "bg-orange-50 text-orange-600 ring-1 ring-orange-200",
  high:   "bg-red-50    text-red-600    ring-1 ring-red-200"
}

// Sub-components

function MetaRow({
  icon,
  label,
  children
}: {
  icon: React.ReactNode
  label: string
  children: React.ReactNode
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-gray-400 shrink-0">{icon}</span>
      <div>
        <p className="text-xs text-gray-400 mb-0.5">{label}</p>
        <div className="text-sm font-medium text-gray-700">{children}</div>
      </div>
    </div>
  )
}

// Component

export default function IssueDetails() {
  const { id }    = useParams<{ id: string }>()
  const navigate  = useNavigate()
  const dispatch  = useDispatch<AppDispatch>()
  const { issues, loading, selectedIssue } = useSelector((state: RootState) => state.issues)

  // Fetch if store is empty
  useEffect(() => {
    if (issues.length === 0) dispatch(fetchIssues())
  }, [dispatch, issues.length])

  // Sync selectedIssue from store
  useEffect(() => {
    const found = issues.find((i) => i._id === id)
    if (found) dispatch(setSelectedIssue(found))
  }, [issues, id, dispatch])

  // Loading state
  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
          <Loader2 size={24} className="animate-spin" />
          <span className="text-sm">Loading issue...</span>
        </div>
      </DashboardLayout>
    )
  }

  if (!selectedIssue) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
          <p className="text-sm">Issue not found.</p>
          <button
            onClick={() => navigate("/issues")}
            className="text-sm text-blue-600 hover:underline"
          >
            Back to Issues
          </button>
        </div>
      </DashboardLayout>
    )
  }

  // SLA helpers
  const slaDeadline = selectedIssue.slaDeadline ? new Date(selectedIssue.slaDeadline) : null
  const now         = new Date()
  const isBreached  = slaDeadline ? now > slaDeadline && selectedIssue.status !== "resolved" : false
  const hoursLeft   = slaDeadline
    ? Math.ceil((slaDeadline.getTime() - now.getTime()) / (1000 * 60 * 60))
    : null

  // Render
  return (
    <DashboardLayout>
      {/* Back */}
      <button
        onClick={() => navigate("/issues")}
        className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 mb-5 transition-colors"
      >
        <ChevronLeft size={16} />
        Back to Issues
      </button>

      <div className="max-w-3xl space-y-4">

        {/* Main card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

          {/* Title + SLA breach */}
          <div className="flex items-start justify-between gap-4 mb-4">
            <h1 className="text-xl font-bold text-gray-800 leading-snug">
              {selectedIssue.title}
            </h1>
            {isBreached && (
              <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-red-600 bg-red-50 px-3 py-1 rounded-full ring-1 ring-red-200">
                <AlertTriangle size={12} />
                SLA Breached
              </span>
            )}
            {selectedIssue.isEscalated && !isBreached && (
              <span className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-orange-600 bg-orange-50 px-3 py-1 rounded-full ring-1 ring-orange-200">
                <TrendingUp size={12} />
                Escalated
              </span>
            )}
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-2 mb-5">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${STATUS_STYLES[selectedIssue.status]}`}>
              {selectedIssue.status}
            </span>
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${SEVERITY_STYLES[selectedIssue.severity]}`}>
              {selectedIssue.severity} severity
            </span>
            <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-50 text-gray-500 ring-1 ring-gray-200 capitalize">
              {selectedIssue.category}
            </span>
          </div>

          {/* Description */}
          <p className="text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
            {selectedIssue.description}
          </p>
        </div>

        {/* Meta card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 grid grid-cols-2 gap-5">
          <MetaRow icon={<Users size={15} />} label="Reports">
            {selectedIssue.reportCount} report{selectedIssue.reportCount !== 1 ? "s" : ""}
          </MetaRow>

          <MetaRow icon={<BarChart2 size={15} />} label="Priority Score">
            {selectedIssue.priorityScore}
          </MetaRow>

          <MetaRow icon={<CalendarDays size={15} />} label="Created">
            {new Date(selectedIssue.createdAt).toLocaleString()}
          </MetaRow>

          {slaDeadline && (
            <MetaRow icon={<Clock size={15} />} label="SLA Deadline">
              <span className={isBreached ? "text-red-600" : undefined}>
                {slaDeadline.toLocaleString()}
              </span>
              {hoursLeft !== null && selectedIssue.status !== "resolved" && (
                <span className="ml-2 text-xs text-gray-400">
                  {hoursLeft <= 0 ? "(expired)" : `(${hoursLeft}h left)`}
                </span>
              )}
            </MetaRow>
          )}

          {selectedIssue.assignedTo && (
            <MetaRow icon={<UserCheck size={15} />} label="Assigned To">
              {selectedIssue.assignedTo}
            </MetaRow>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
