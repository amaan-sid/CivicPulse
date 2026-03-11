import {
  Wrench,
  Zap,
  ArrowUpDown,
  ShieldCheck,
  Sparkles,
  Droplets,
  ClipboardList,
  Clock,
  AlertTriangle,
  Users
} from "lucide-react"
import type { Issue, IssueCategory, IssueStatus, IssueSeverity } from "../features/issues/issueTypes"

// Map
const CATEGORY_ICONS: Record<IssueCategory, React.ReactNode> = {
  plumbing:     <Wrench      size={15} />,
  electricity:  <Zap         size={15} />,
  lift:         <ArrowUpDown size={15} />,
  security:     <ShieldCheck size={15} />,
  cleanliness:  <Sparkles    size={15} />,
  water:        <Droplets    size={15} />
}

const STATUS_STYLES: Record<IssueStatus, string> = {
  open:         "bg-blue-50   text-blue-700   ring-1 ring-blue-200",
  "in-progress":"bg-amber-50  text-amber-700  ring-1 ring-amber-200",
  resolved:     "bg-green-50  text-green-700  ring-1 ring-green-200"
}

const SEVERITY_STYLES: Record<IssueSeverity, string> = {
  low:    "bg-gray-50  text-gray-500  ring-1 ring-gray-200",
  medium: "bg-orange-50 text-orange-600 ring-1 ring-orange-200",
  high:   "bg-red-50   text-red-600   ring-1 ring-red-200"
}

// Helpers

function getSlaInfo(slaDeadline: string | undefined, status: IssueStatus) {
  if (!slaDeadline) return { breached: false, hoursLeft: null }
  const deadline = new Date(slaDeadline)
  const now = new Date()
  const hoursLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 60 * 60))
  const breached = now > deadline && status !== "resolved"
  return { breached, hoursLeft }
}

// Component

interface IssueCardProps {
  issue: Issue
  onClick?: () => void
}

export default function IssueCard({ issue, onClick }: IssueCardProps) {
  const { breached, hoursLeft } = getSlaInfo(issue.slaDeadline, issue.status)

  return (
    <article
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick?.()}
      aria-label={`Issue: ${issue.title}`}
      className={[
        "group bg-white rounded-2xl border p-4 shadow-sm",
        "hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 cursor-pointer",
        "focus:outline-none focus:ring-2 focus:ring-blue-400",
        breached ? "border-red-300" : "border-gray-100"
      ].join(" ")}
    >
      {/* Top row: category icon + title + SLA breach badge */}
      <div className="flex items-start gap-2.5 mb-2">
        <span className="mt-0.5 shrink-0 text-gray-400 group-hover:text-blue-500 transition-colors">
          {CATEGORY_ICONS[issue.category] ?? <ClipboardList size={15} />}
        </span>
        <h3 className="flex-1 text-sm font-semibold text-gray-800 leading-snug line-clamp-2">
          {issue.title}
        </h3>
        {breached && (
          <span className="shrink-0 flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full ring-1 ring-red-200">
            <AlertTriangle size={11} />
            SLA Breached
          </span>
        )}
      </div>

      {/* Description */}
      <p className="text-xs text-gray-400 line-clamp-2 mb-3 pl-6">
        {issue.description}
      </p>

      {/* Badge row */}
      <div className="flex flex-wrap items-center gap-1.5 mb-3 pl-6">
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${STATUS_STYLES[issue.status]}`}>
          {issue.status}
        </span>
        <span className={`text-xs font-medium px-2.5 py-0.5 rounded-full ${SEVERITY_STYLES[issue.severity]}`}>
          {issue.severity}
        </span>
        <span className="text-xs text-gray-400 capitalize">
          {issue.category}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between text-xs text-gray-400 pl-6">
        <span className="flex items-center gap-1">
          <Users size={11} />
          {issue.reportCount} report{issue.reportCount !== 1 ? "s" : ""}
        </span>

        {hoursLeft !== null && issue.status !== "resolved" && (
          <span className={`flex items-center gap-1 ${hoursLeft <= 0 ? "text-red-500 font-semibold" : ""}`}>
            <Clock size={11} />
            {hoursLeft <= 0 ? "Expired" : `${hoursLeft}h left`}
          </span>
        )}

        <time dateTime={issue.createdAt}>
          {new Date(issue.createdAt).toLocaleDateString()}
        </time>
      </div>
    </article>
  )
}
