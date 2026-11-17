import { useEffect, useState } from "react"
import DashboardLayout from "@/components/layout/DashboardLayout"
import API from "@/services/api"
import type { Issue } from "@/types"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import SLATimer from "@/features/issues/components/SLATimer"
import { Link } from "react-router-dom"
import { AlertCircle, AlertTriangle, Users, Plus } from "lucide-react"
import { isIssueBreached, isIssueExpired } from "@/utils/issueHelpers"

function ResidentDashboard() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const user = useSelector((state: RootState) => state.auth.user)

  useEffect(() => {
    const fetchMyIssues = async () => {
      try {
        const res = await API.get("/issues")
        const allIssues: Issue[] = res.data
        const userId = String(user?.id || user?._id || "")
        const myIssues = allIssues
          .filter((i) => !isIssueExpired(i))
          .filter(i => {
            const reportedById = String(typeof i.reportedBy === "object" ? (i.reportedBy?._id || (i.reportedBy as any)?.id || "") : (i.reportedBy || ""))
            const isCreator = reportedById === userId
            const isCountIncreaser = Array.isArray(i.reporters) && i.reporters.some(r => String(typeof r === "object" ? (r as any)._id : r) === userId)
            return isCreator || isCountIncreaser
          })
        setIssues(myIssues)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchMyIssues()
  }, [user?.id])

  const [statusFilter, setStatusFilter] = useState("ALL")

  const filterTabs = [
    { label: "All Issues", value: "ALL" },
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in-progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Breached Issues", value: "escalated" }
  ]

  const filteredIssues = issues.filter((issue) => {
    const breached = isIssueBreached(issue)
    if (statusFilter === "escalated") return breached
    if (statusFilter === "open") return issue.status === "open" && !breached
    if (statusFilter === "in-progress") return issue.status === "in-progress" && !breached
    if (statusFilter === "resolved") return issue.status === "resolved"
    if (statusFilter === "ALL") return !breached
    return !breached
  })

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
            My Organization Issues
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Track and manage issues reported by you.</p>
        </div>
        <Link
          to="/report-issue"
          className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-md transition-all shadow-sm"
        >
          <Plus size={18} />
          Create Issue
        </Link>
      </div>

      {/* Filter Tabs with counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4">
        {filterTabs.map((tab) => {
          const count = issues.filter((issue) => {
            const breached = isIssueBreached(issue)
            if (tab.value === "escalated") return breached
            if (tab.value === "open") return issue.status === "open" && !breached
            if (tab.value === "in-progress") return issue.status === "in-progress" && !breached
            if (tab.value === "resolved") return issue.status === "resolved"
            if (tab.value === "ALL") return !breached
            return !breached
          }).length

          const isActive = statusFilter === tab.value
          const isBreachedTab = tab.value === "escalated"

          return (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                isActive
                  ? isBreachedTab
                    ? "bg-rose-600 text-white shadow-sm"
                    : "bg-sky-600 text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                }`}
              >
                {count}
              </span>
            </button>
          )
        })}
      </div>
      
      {loading ? (
        <p className="text-slate-500 dark:text-slate-400">Loading your issues...</p>
      ) : filteredIssues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-md p-12 text-center shadow-sm">
          <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-md flex items-center justify-center mx-auto mb-4 text-slate-400">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-xl font-bold text-slate-700 dark:text-white">No issues found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-2">No issues match the selected filter.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredIssues.map(issue => {
            const breached = isIssueBreached(issue);
            return (
              <Link key={issue._id} to={`/issues/${issue._id}`} className="group outline-none block h-full">
                <Card className="h-full flex flex-col transition-all cursor-pointer">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white mb-2 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                      {issue.title}
                    </h3>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-4 line-clamp-2 leading-relaxed">
                      {issue.description}
                    </p>
                  </div>

                  <div className="pt-4 mt-auto border-t border-slate-100 dark:border-slate-700">
                    {breached ? (
                      <div className="flex items-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 shadow-sm">
                          <AlertTriangle size={12} /> SLA Breached
                        </span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-4 font-medium bg-slate-100 dark:bg-slate-700/50 w-fit px-2.5 py-1.5 rounded-sm">
                          <Users size={14} className="text-slate-400 dark:text-slate-500" />
                          <span>Reported by <strong className="text-slate-700 dark:text-slate-300">{issue.reportCount}</strong> residents</span>
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Badge text={issue.severity} variant={issue.severity}/>
                            <Badge text={issue.status} variant={issue.status}/>
                          </div>
                          {issue.status !== "resolved" && (
                            <SLATimer
                              createdAt={issue.createdAt}
                              priority={issue.severity}
                              slaDeadline={issue.slaDeadline}
                              isEscalated={issue.isEscalated}
                              status={issue.status}
                            />
                          )}
                        </div>
                      </>
                    )}
                  </div>
                </Card>
              </Link>
            )
          })}
        </div>
      )}
    </DashboardLayout>
  )
}

export default ResidentDashboard