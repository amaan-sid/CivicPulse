import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { Link } from "react-router-dom"
import type { Issue } from "@/types"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import SLATimer from "@/features/issues/components/SLATimer"
import { AlertTriangle, AlertCircle, Filter } from "lucide-react"
import { isIssueBreached, isIssueExpired } from "@/utils/issueHelpers"

function IssueList() {
  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [statusFilter, setStatusFilter] = useState("ALL")

  useEffect(() => {
    const fetchIssues = async () => {
      try {
        const res = await API.get("/issues")
        setIssues(res.data)
      } catch (err: any) {
        setError(err.response?.data?.message || "Failed to fetch issues")
      } finally {
        setLoading(false)
      }
    }

    fetchIssues()
  }, [])

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading issues...</p>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">{error}</p>
      </DashboardLayout>
    )
  }

  const unexpired = issues.filter((i) => !isIssueExpired(i))

  const filterTabs = [
    { label: "All Issues", value: "ALL" },
    { label: "Open", value: "open" },
    { label: "In Progress", value: "in-progress" },
    { label: "Resolved", value: "resolved" },
    { label: "Breached Issues", value: "escalated" }
  ]

  const filteredIssues = unexpired.filter((issue) => {
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            Community Issues
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Browse and track community issues.
          </p>
        </div>
      </div>

      {/* Filter Tabs with counts */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-4">
        <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
          <Filter size={14} /> Filter:
        </span>
        {filterTabs.map((tab) => {
          const count = unexpired.filter((issue) => {
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

      {filteredIssues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-md p-12 text-center shadow-sm">
          <AlertCircle size={36} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-white">No issues found</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
            There are no issues matching the selected filter.
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIssues.map((issue) => {
            const breached = isIssueBreached(issue)
            return (
              <Link key={issue._id} to={`/issues/${issue._id}`}>
                <Card className="h-full flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-2 text-slate-800 dark:text-white">
                      {issue.title}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 text-sm mb-4 line-clamp-2">
                      {issue.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700 mt-auto">
                    {breached ? (
                      <div className="flex justify-start items-center">
                        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 shadow-sm">
                          <AlertTriangle size={12} /> SLA Breached
                        </span>
                      </div>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500 dark:text-slate-400 mb-3">
                          Reported by <span className="font-semibold text-gray-800 dark:text-slate-200">{issue.reportCount}</span> residents
                        </p>
                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            <Badge text={issue.severity} variant={issue.severity} />
                            <Badge text={issue.status} variant={issue.status} />
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

export default IssueList