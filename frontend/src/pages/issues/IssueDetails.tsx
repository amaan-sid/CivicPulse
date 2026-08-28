import { useParams, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import API from "@/services/api"
import DashboardLayout from "@/components/layout/DashboardLayout"
import SLATimer from "@/features/issues/components/SLATimer"
import TimelineItem from "@/components/ui/TimeLineItem"
import toast from "react-hot-toast"
import CustomSelect from "@/components/ui/CustomSelect"
import {
  ArrowLeft,
  ShieldAlert,
  Clock,
  UserCheck,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Image as ImageIcon,
  Building2,
  Sparkles,
  Tag,
  Send,
  ThumbsUp
} from "lucide-react"

interface AuditLog {
  _id: string
  action: string
  performedBy?: {
    name: string
  }
  oldValue?: string
  newValue?: string
  createdAt: string
}

function IssueDetails() {
  const { id } = useParams()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)

  const [issue, setIssue] = useState<any | null>(null)
  const [members, setMembers] = useState<any[]>([])
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [isForbidden, setIsForbidden] = useState(false)
  const [errorMsg, setErrorMsg] = useState("")

  const [assignMemberId, setAssignMemberId] = useState<string>("")
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false)
  const [isAssigning, setIsAssigning] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      setIsForbidden(false)
      setErrorMsg("")

      try {
        const issueRes = await API.get(`/issues/${id}`)
        const data = issueRes.data
        setIssue(data)

        if (data.assignedTo?._id) {
          setAssignMemberId(data.assignedTo._id)
        } else if (typeof data.assignedTo === "string") {
          setAssignMemberId(data.assignedTo)
        }

        // Fetch logs and members in parallel if user has access
        const [logRes, memberRes] = await Promise.allSettled([
          API.get(`/issues/${id}/logs`),
          API.get("/users?role=member")
        ])

        if (logRes.status === "fulfilled") {
          setLogs(logRes.value.data)
        }
        if (memberRes.status === "fulfilled") {
          setMembers(memberRes.value.data)
        }
      } catch (err: any) {
        console.error(err)
        const status = err.response?.status
        if (status === 403 || status === 401) {
          setIsForbidden(true)
          setErrorMsg(err.response?.data?.message || "You do not have permission to view this complaint.")
        } else {
          setErrorMsg(err.response?.data?.message || "Failed to load issue details.")
        }
      } finally {
        setLoading(false)
      }
    }

    if (id) fetchData()
  }, [id])

  const updateStatus = async (status: string) => {
    if (!issue) return
    setIsUpdatingStatus(true)
    try {
      const res = await API.patch(`/issues/${id}`, { status })
      setIssue(res.data)
      toast.success(`Status updated to ${status.toUpperCase()}`)

      // Refresh logs
      const logRes = await API.get(`/issues/${id}/logs`)
      setLogs(logRes.data)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update status")
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const assignIssue = async () => {
    if (!assignMemberId) return toast.error("Please select a member to assign")
    setIsAssigning(true)
    try {
      const res = await API.patch(`/issues/${id}/assign`, {
        memberId: assignMemberId
      })
      if (res.data.issue) {
        setIssue(res.data.issue)
      }
      const logRes = await API.get(`/issues/${id}/logs`)
      setLogs(logRes.data)
      toast.success("Issue assigned successfully!")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to assign issue")
    } finally {
      setIsAssigning(false)
    }
  }

  const hasUserReported = (iss: any) => {
    if (!user || !iss) return false
    const userId = user._id || user.id
    if (typeof iss.reportedBy === "object" ? iss.reportedBy?._id === userId : iss.reportedBy === userId) {
      return true
    }
    if (Array.isArray(iss.reporters)) {
      return iss.reporters.some((r: any) => (typeof r === "string" ? r : r._id) === userId)
    }
    return false
  }

  const handleToggleReporter = async () => {
    if (!issue) return
    try {
      const res = await API.patch(`/issues/${id}/report`)
      setIssue(res.data)
      toast.success(
        hasUserReported(res.data)
          ? "You reported this issue!"
          : "Report count updated"
      )
      const logRes = await API.get(`/issues/${id}/logs`)
      setLogs(logRes.data)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update reporter count")
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
          <Clock size={32} className="animate-spin mb-3 text-sky-500" />
          <p className="text-sm font-medium">Loading issue details...</p>
        </div>
      </DashboardLayout>
    )
  }

  // RESTRICTED ACCESS / ERROR VIEW
  if (isForbidden || errorMsg) {
    return (
      <DashboardLayout>
        <div className="max-w-xl mx-auto my-12 bg-white dark:bg-slate-800 rounded-3xl border border-rose-200/80 dark:border-rose-900/40 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mx-auto shadow-inner">
            <ShieldAlert size={32} />
          </div>

          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
              {isForbidden ? "Access Restricted" : "Issue Unavailable"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed max-w-md mx-auto">
              {errorMsg || "You do not have permission to view or manage this complaint. This issue belongs to another organization."}
            </p>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => navigate(-1)}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-5 py-2.5 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors text-xs cursor-pointer"
            >
              <ArrowLeft size={16} /> Back to Previous Page
            </button>
            <button
              onClick={() => navigate("/managesociety")}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-xl hover:bg-sky-500 transition-colors text-xs cursor-pointer shadow-sm shadow-sky-600/20"
            >
              <Building2 size={16} /> Joined Organizations
            </button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!issue) return null

  const isSuperAdmin = user?.platformRole === "SUPER_ADMIN"
  const issueSocietyId = typeof issue.society === "string" ? issue.society : issue.society?._id
  const userId = user?._id || user?.id
  const isSocietyAdmin =
    (user?.role === "admin" && (user.society === issueSocietyId || user.currentSocietyId === issueSocietyId)) ||
    user?.memberships?.some(
      (m: any) =>
        (typeof m.societyId === "string" ? m.societyId : m.societyId?._id) === issueSocietyId &&
        m.role === "admin"
    )

  const isAssignee =
    (typeof issue.assignedTo === "object" ? issue.assignedTo?._id : issue.assignedTo) === userId

  const canUpdateStatus = Boolean(isSuperAdmin || isSocietyAdmin || isAssignee)
  const canAssign = Boolean(isSuperAdmin || isSocietyAdmin)
  const userReported = hasUserReported(issue)
  const count = issue.reportCount || issue.reporters?.length || 1

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30">
            <CheckCircle2 size={14} /> Resolved
          </span>
        )
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-200 dark:border-sky-800/30">
            <Clock size={14} /> In Progress
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30">
            <AlertCircle size={14} /> Open
          </span>
        )
    }
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "high":
        return (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 border border-rose-200 dark:border-rose-800/30 uppercase">
            High Priority
          </span>
        )
      case "medium":
        return (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30 uppercase">
            Medium Priority
          </span>
        )
      default:
        return (
          <span className="text-xs font-bold px-3 py-1 rounded-full bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600 uppercase">
            Low Priority
          </span>
        )
    }
  }

  return (
    <DashboardLayout>
      <div className="space-y-6 max-w-6xl mx-auto">
        {/* TOP NAVIGATION BAR WITH BACK BUTTON */}
        <div className="flex items-center justify-between gap-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200/80 dark:border-slate-700 transition-all shadow-sm cursor-pointer text-xs font-bold"
          >
            <ArrowLeft size={16} /> Back
          </button>

          <div className="flex items-center gap-2">
            {issue.society?.name && (
              <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Building2 size={14} /> {issue.society.name}
              </span>
            )}
          </div>
        </div>

        {/* HEADER HERO CARD */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 sm:p-8 shadow-sm space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-extrabold uppercase tracking-wider px-3 py-1 rounded-lg bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-200/60 dark:border-sky-500/20">
                {issue.category}
              </span>
              {getSeverityBadge(issue.severity || "low")}
              {getStatusBadge(issue.status)}
            </div>

            {issue.status !== "resolved" && (
              <SLATimer createdAt={issue.createdAt} priority={issue.severity || "medium"} />
            )}
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            {issue.title}
          </h1>

          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700/60">
            <span className="flex items-center gap-1.5">
              <Calendar size={14} /> Reported on{" "}
              {new Date(issue.createdAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit"
              })}
            </span>

            {!isSuperAdmin && (
              <button
                onClick={handleToggleReporter}
                className={`inline-flex items-center gap-2 text-xs font-bold px-3.5 py-1.5 rounded-xl transition-all cursor-pointer ${
                  userReported
                    ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40 shadow-sm"
                    : "bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-600 dark:bg-slate-700 dark:hover:bg-sky-500/10 dark:text-slate-200 border border-slate-200 dark:border-slate-600"
                }`}
                title="Click to increase reporter count / report this issue"
              >
                <ThumbsUp size={14} className={userReported ? "fill-current" : ""} />
                <span>{count} {count === 1 ? "Reporter" : "Reporters"} (+1 Me Too)</span>
              </button>
            )}
          </div>
        </div>

        {/* MAIN 2-COLUMN GRID CONTENT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN: DESCRIPTION, ATTACHMENT, TIMELINE */}
          <div className="lg:col-span-2 space-y-6">
            {/* Description Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-3 flex items-center gap-2">
                <Tag size={16} className="text-sky-500" /> Issue Description
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {issue.description}
              </p>
            </div>

            {/* Image Attachment Card */}
            {(issue.imageUrl || issue.image) && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-sm">
                <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                  <ImageIcon size={16} className="text-sky-500" /> Image Attachment
                </h3>
                <div className="overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                  <img
                    src={issue.imageUrl || issue.image}
                    alt="Issue attachment"
                    className="w-full h-auto max-h-96 object-contain hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}

            {/* Activity Timeline Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800 dark:text-white uppercase tracking-wider mb-6 flex items-center gap-2">
                <Sparkles size={16} className="text-purple-500" /> Activity & Audit Timeline
              </h3>

              {logs.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No timeline logs recorded yet.</p>
              ) : (
                <div className="relative border-l-2 border-slate-200 dark:border-slate-700 pl-6 space-y-6">
                  {logs.map((log) => (
                    <TimelineItem
                      key={log._id}
                      action={log.action}
                      performedBy={log.performedBy?.name}
                      oldValue={log.oldValue}
                      newValue={log.newValue}
                      createdAt={log.createdAt}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: REPORTERS, STATUS UPDATE & ASSIGNMENT CONTROLS */}
          <div className="space-y-6">
            {/* Reporter Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Reported By
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold flex items-center justify-center text-lg">
                  {issue.reportedBy?.name?.[0]?.toUpperCase() || "U"}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">
                    {issue.reportedBy?.name || "Anonymous Member"}
                  </p>
                  <p className="text-xs text-slate-400">{issue.reportedBy?.email || "No email available"}</p>
                </div>
              </div>
            </div>

            {/* Assignee Info Card */}
            <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-sm">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">
                Assigned Admin / Staff
              </h3>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold flex items-center justify-center text-lg">
                  {issue.assignedTo?.name?.[0]?.toUpperCase() || <UserCheck size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 dark:text-white text-sm">
                    {issue.assignedTo?.name || "Unassigned"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {issue.assignedTo?.email || "No assigned member"}
                  </p>
                </div>
              </div>
            </div>

            {/* Status Update Controls (ONLY FOR AUTHORIZED USERS) */}
            {canUpdateStatus && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Update Issue Status
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => updateStatus("open")}
                    disabled={isUpdatingStatus || issue.status === "open"}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      issue.status === "open"
                        ? "bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/30"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-amber-100 dark:hover:bg-amber-900/30"
                    }`}
                  >
                    Open
                  </button>
                  <button
                    onClick={() => updateStatus("in-progress")}
                    disabled={isUpdatingStatus || issue.status === "in-progress"}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      issue.status === "in-progress"
                        ? "bg-sky-600 text-white shadow-sm ring-2 ring-sky-600/30"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-sky-100 dark:hover:bg-sky-900/30"
                    }`}
                  >
                    In Progress
                  </button>
                  <button
                    onClick={() => updateStatus("resolved")}
                    disabled={isUpdatingStatus || issue.status === "resolved"}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      issue.status === "resolved"
                        ? "bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30"
                        : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    }`}
                  >
                    Resolved
                  </button>
                </div>
              </div>
            )}

            {/* Member Assignment Selector (For Admins & Super Admins) */}
            {canAssign && (
              <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/60 dark:border-slate-700 p-6 shadow-sm space-y-3">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Assign Staff / Member
                </h3>
                <div className="space-y-3">
                  <CustomSelect
                    value={assignMemberId}
                    onChange={(val) => setAssignMemberId(val)}
                    placeholder="Select Staff or Admin member..."
                    options={members
                      .filter((m) => m.userId != null)
                      .map((member) => ({
                        value: member.userId._id,
                        label: member.userId.name || "Unknown",
                        badge: (
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 font-medium capitalize">
                            {member.role}
                          </span>
                        ),
                      }))}
                  />

                  <button
                    onClick={assignIssue}
                    disabled={isAssigning || !assignMemberId}
                    className="w-full bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all shadow-sm disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Send size={14} />
                    {isAssigning ? "Assigning..." : "Confirm Assignment"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

export default IssueDetails