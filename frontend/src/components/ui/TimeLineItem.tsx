import {
  Clock,
  UserCheck,
  RefreshCw,
  PlusCircle,
  ArrowRight,
  ShieldAlert,
  Activity
} from "lucide-react"

interface Props {
  action: string
  performedBy?: string
  oldValue?: string
  newValue?: string
  createdAt: string
}

function TimelineItem({
  action,
  performedBy,
  oldValue,
  newValue,
  createdAt
}: Props) {
  // Format action text into human readable title
  const formatActionTitle = (act: string) => {
    const lower = act.toLowerCase()
    if (lower === "status_change" || lower === "status_changed") return "Status Updated"
    if (lower === "escalation") return "SLA Escalated"
    if (lower === "assignment" || lower === "assigned") return "Issue Assigned"
    if (lower === "report_count_increased" || lower === "reported") return "Report Count Increased"
    if (lower === "created" || lower === "created_issue") return "Issue Created"
    return act
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase())
  }

  // Determine icon & theme style based on action type
  const getActionTheme = (act: string) => {
    const lower = act.toLowerCase()
    if (lower.includes("escalat") || lower.includes("breach")) {
      return {
        icon: <ShieldAlert size={14} />,
        bg: "bg-rose-500 text-white",
        badge: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border-rose-200 dark:border-rose-800/30",
        ring: "ring-rose-100 dark:ring-rose-950/40"
      }
    }
    if (lower.includes("assign")) {
      return {
        icon: <UserCheck size={14} />,
        bg: "bg-indigo-600 text-white",
        badge: "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800/30",
        ring: "ring-indigo-100 dark:ring-indigo-950/40"
      }
    }
    if (lower.includes("status")) {
      return {
        icon: <RefreshCw size={14} />,
        bg: "bg-sky-600 text-white",
        badge: "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border-sky-200 dark:border-sky-800/30",
        ring: "ring-sky-100 dark:ring-sky-950/40"
      }
    }
    if (lower.includes("report")) {
      return {
        icon: <PlusCircle size={14} />,
        bg: "bg-amber-500 text-white",
        badge: "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border-amber-200 dark:border-amber-800/30",
        ring: "ring-amber-100 dark:ring-amber-950/40"
      }
    }
    return {
      icon: <Activity size={14} />,
      bg: "bg-emerald-600 text-white",
      badge: "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/30",
      ring: "ring-emerald-100 dark:ring-emerald-950/40"
    }
  }

  const theme = getActionTheme(action)
  const formattedTitle = formatActionTitle(action)

  // Format timestamp nicely
  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr)
      return d.toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    } catch {
      return dateStr
    }
  }

  // Format value badges nicely (e.g. status pills)
  const renderValueBadge = (val: string) => {
    const v = val.toLowerCase()
    if (v === "open") {
      return (
        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200/60 dark:border-amber-800/30">
          Open
        </span>
      )
    }
    if (v === "in-progress" || v === "in progress") {
      return (
        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200/60 dark:border-sky-800/30">
          In Progress
        </span>
      )
    }
    if (v === "resolved") {
      return (
        <span className="px-2.5 py-0.5 rounded-lg text-xs font-bold bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/30">
          Resolved
        </span>
      )
    }
    return (
      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-600">
        {val}
      </span>
    )
  }

  return (
    <div className="relative group">
      {/* Node icon dot centered on parent border-l line */}
      <div className={`absolute -left-[39px] top-1.5 w-7 h-7 rounded-full ${theme.bg} ring-4 ${theme.ring} shadow-md flex items-center justify-center transition-transform group-hover:scale-110`}>
        {theme.icon}
      </div>

      {/* Log Details Card */}
      <div className="bg-slate-50/80 dark:bg-slate-900/60 border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${theme.badge}`}>
              {formattedTitle}
            </span>
            {performedBy && (
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                by <strong className="text-slate-700 dark:text-slate-200 font-semibold">{performedBy}</strong>
              </span>
            )}
          </div>

          <span className="text-[11px] text-slate-400 dark:text-slate-400 flex items-center gap-1 font-medium ml-auto">
            <Clock size={12} />
            {formatDate(createdAt)}
          </span>
        </div>

        {/* Diffs (Old ➔ New) */}
        {(oldValue || newValue) && (
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            {oldValue && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-medium">From:</span>
                {renderValueBadge(oldValue)}
              </div>
            )}

            {oldValue && newValue && (
              <ArrowRight size={14} className="text-slate-400 shrink-0 mx-0.5" />
            )}

            {newValue && (
              <div className="flex items-center gap-1.5">
                <span className="text-slate-400 text-[11px] font-medium">{oldValue ? "To:" : "New:"}</span>
                {renderValueBadge(newValue)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default TimelineItem