import { useEffect, useState } from "react"
import {
  Clock,
  CheckCircle2,
  Building2,
  Home,
  GraduationCap,
  X,
  ExternalLink,
  ZoomIn,
  FileText,
  ShieldAlert,
  Tag
} from "lucide-react"
import SLATimer from "@/features/issues/components/SLATimer"
import { isIssueBreached } from "@/utils/issueHelpers"
import UserAvatar from "@/components/common/UserAvatar"

export interface PlatformIssueDetail {
  _id: string
  title: string
  description: string
  category: string
  status: "open" | "in-progress" | "resolved"
  severity: "low" | "medium" | "high"
  priorityScore?: number
  reportCount?: number
  isEscalated: boolean
  society?: { _id: string; name: string; code: string; type: string }
  reportedBy?: { _id: string; name: string; email: string; profilePic?: string; gender?: "male" | "female" }
  assignedTo?: { _id: string; name: string; email: string; profilePic?: string; gender?: "male" | "female" }
  slaDeadline?: string
  imageUrl?: string
  createdAt: string
}

interface IssueDetailModalProps {
  issue: PlatformIssueDetail | null
  isOpen: boolean
  onClose: () => void
  onOpenFullPage?: (issueId: string) => void
}

export default function IssueDetailModal({
  issue,
  isOpen,
  onClose,
  onOpenFullPage
}: IssueDetailModalProps) {
  const [isZoomedImageOpen, setIsZoomedImageOpen] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (isZoomedImageOpen) {
          setIsZoomedImageOpen(false)
        } else if (isOpen) {
          onClose()
        }
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, isZoomedImageOpen, onClose])

  if (!isOpen || !issue) return null

  const breached = isIssueBreached(issue)

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "HOSTEL":
        return <Home size={15} className="text-amber-500" />
      case "CAMPUS":
        return <GraduationCap size={15} className="text-purple-500" />
      default:
        return <Building2 size={15} className="text-sky-500" />
    }
  }

  const getStatusBadge = () => {
    switch (issue.status) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-sm bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
            <CheckCircle2 size={13} /> Resolved
          </span>
        )
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-sm bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
            <Clock size={13} /> In Progress
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-sm bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
            <Clock size={13} /> Open
          </span>
        )
    }
  }

  return (
    <>
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <div
          className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
            title="Close"
          >
            <X size={20} />
          </button>

          {/* Modal Header */}
          <div className="mb-5 pr-8">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-sm bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300 flex items-center gap-1">
                <Tag size={12} /> {issue.category}
              </span>

              <span
                className={`text-xs font-bold px-2.5 py-1 rounded-sm uppercase ${
                  issue.severity === "high"
                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                    : issue.severity === "medium"
                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                }`}
              >
                {issue.severity} Priority
              </span>

              {getStatusBadge()}
            </div>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-white leading-snug">
              {issue.title}
            </h3>
          </div>

          {/* SLA / Escalation Banner */}
          {breached ? (
            <div className="mb-5 p-3.5 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-lg flex items-center gap-3 text-rose-800 dark:text-rose-300">
              <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-500/20 shrink-0">
                <ShieldAlert size={20} className="text-rose-600 dark:text-rose-400" />
              </div>
              <div>
                <p className="font-bold text-xs uppercase tracking-wider">SLA Deadline Breached</p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                  This issue exceeded its resolution time window and was automatically escalated to Super Admin.
                </p>
              </div>
            </div>
          ) : issue.status !== "resolved" && issue.slaDeadline ? (
            <div className="mb-5 p-3.5 bg-sky-50 dark:bg-sky-500/10 border border-sky-100 dark:border-sky-500/20 rounded-lg flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <Clock size={18} className="text-sky-600 dark:text-sky-400" />
                <div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Active SLA Timer</p>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Time remaining until escalation</p>
                </div>
              </div>
              <SLATimer
                createdAt={issue.createdAt}
                priority={issue.severity || "medium"}
                slaDeadline={issue.slaDeadline}
                isEscalated={issue.isEscalated}
                status={issue.status}
              />
            </div>
          ) : null}

          {/* Description */}
          <div className="mb-5 p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <FileText size={14} /> Description
            </p>
            <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
              {issue.description}
            </p>
          </div>

          {/* Image Preview if available */}
          {issue.imageUrl && (
            <div className="mb-5">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
                Attached Photo Evidence
              </p>
              <div
                onClick={() => setIsZoomedImageOpen(true)}
                className="relative group rounded-lg overflow-hidden border border-slate-200 dark:border-slate-700 cursor-pointer max-h-52 bg-slate-100 dark:bg-slate-900 flex items-center justify-center"
              >
                <img
                  src={issue.imageUrl}
                  alt="Issue attachment"
                  className="w-full h-52 object-cover transition-transform group-hover:scale-102 duration-200"
                />
                <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 text-white font-semibold text-xs">
                  <ZoomIn size={18} />
                  <span>Click to expand image</span>
                </div>
              </div>
            </div>
          )}

          {/* Meta Details Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {/* Organization */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Organization / Society
              </p>
              {issue.society ? (
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-md bg-white dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700 shrink-0">
                    {getTypeIcon(issue.society.type)}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                      {issue.society.name}
                    </p>
                    <p className="text-[11px] font-mono text-slate-400">
                      Code: {issue.society.code}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Unknown</p>
              )}
            </div>

            {/* Reported By */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Reported By
              </p>
              {issue.reportedBy ? (
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    src={issue.reportedBy.profilePic}
                    gender={issue.reportedBy.gender}
                    name={issue.reportedBy.name}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {issue.reportedBy.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {issue.reportedBy.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Unknown reporter</p>
              )}
            </div>

            {/* Assigned Admin / Staff */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Assigned Staff / Admin
              </p>
              {issue.assignedTo ? (
                <div className="flex items-center gap-2.5">
                  <UserAvatar
                    src={issue.assignedTo.profilePic}
                    gender={issue.assignedTo.gender}
                    name={issue.assignedTo.name}
                    className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {issue.assignedTo.name}
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      {issue.assignedTo.email}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Unassigned</p>
              )}
            </div>

            {/* Timestamps */}
            <div className="p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1.5">
                Timeline
              </p>
              <div className="space-y-1 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                  <span>Reported:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">
                    {new Date(issue.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                {issue.slaDeadline && (
                  <div className="flex items-center justify-between text-slate-600 dark:text-slate-400">
                    <span>SLA Target:</span>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">
                      {new Date(issue.slaDeadline).toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-slate-400">
              Issue ID: <span className="font-mono">{issue._id}</span>
            </div>

            <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
              {onOpenFullPage && (
                <button
                  onClick={() => {
                    onClose()
                    onOpenFullPage(issue._id)
                  }}
                  className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-md shadow-sm transition-all cursor-pointer w-full sm:w-auto justify-center"
                >
                  <ExternalLink size={14} />
                  <span>Open Full Issue Details</span>
                </button>
              )}

              <button
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer w-full sm:w-auto justify-center"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Zoomed Image Lightbox */}
      {isZoomedImageOpen && issue.imageUrl && (
        <div
          className="fixed inset-0 bg-black/90 z-60 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsZoomedImageOpen(false)}
        >
          <button
            onClick={() => setIsZoomedImageOpen(false)}
            className="absolute top-5 right-5 text-white/80 hover:text-white p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors cursor-pointer"
          >
            <X size={24} />
          </button>
          <img
            src={issue.imageUrl}
            alt="Expanded attachment"
            className="max-w-[95vw] max-h-[90vh] object-contain rounded-md shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
}
