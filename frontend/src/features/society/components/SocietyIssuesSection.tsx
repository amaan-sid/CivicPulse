import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import API from "@/services/api"
import SLATimer from "@/features/issues/components/SLATimer"
import toast from "react-hot-toast"
import CustomSelect, { type SelectOption } from "@/components/ui/CustomSelect"
import {
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  CheckCircle2,
  Clock,
  Plus,
  X,
  ThumbsUp,
  Users
} from "lucide-react"

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electricity", label: "Electricity" },
  { value: "lift", label: "Lift" },
  { value: "security", label: "Security" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "water", label: "Water" },
];

const SEVERITY_OPTIONS: SelectOption[] = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

interface Props {
  organizationId: string
}

interface IssueItem {
  _id: string
  title: string
  description: string
  category: string
  status: "open" | "in-progress" | "resolved"
  severity: "low" | "medium" | "high"
  reportCount?: number
  reporters?: any[]
  isEscalated?: boolean
  reportedBy?: { _id: string; name: string; email: string }
  assignedTo?: { _id: string; name: string; email: string }
  createdAt: string
}

function SocietyIssuesSection({ organizationId }: Props) {
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)
  const isSuperAdmin = user?.platformRole === "SUPER_ADMIN"

  const [issues, setIssues] = useState<IssueItem[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("ALL")

  // Modal States for Create Issue
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("plumbing")
  const [severity, setSeverity] = useState("low")
  const [description, setDescription] = useState("")
  const [imageBase64, setImageBase64] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchIssues = async () => {
    setLoading(true)
    try {
      const res = await API.get(`/society/${organizationId}/issues`)
      setIssues(res.data)
    } catch (err) {
      console.error("Failed to fetch society issues:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchIssues()
  }, [organizationId])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleCreateIssue = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !description) {
      return toast.error("Please fill in all required fields")
    }

    setIsSubmitting(true)
    try {
      await API.post("/issues", {
        title,
        description,
        category,
        severity,
        image: imageBase64,
        societyId: organizationId
      })

      toast.success("Issue reported successfully!")
      setIsCreateModalOpen(false)
      setTitle("")
      setDescription("")
      setCategory("plumbing")
      setSeverity("low")
      setImageBase64("")
      fetchIssues()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to create issue")
    } finally {
      setIsSubmitting(false)
    }
  }

  const hasUserReported = (iss: IssueItem) => {
    if (!user) return false
    if (typeof iss.reportedBy === "object" ? iss.reportedBy?._id === user._id : iss.reportedBy === user._id) {
      return true
    }
    if (Array.isArray(iss.reporters)) {
      return iss.reporters.some((r: any) => (typeof r === "string" ? r : r._id) === user._id)
    }
    return false
  }

  const handleToggleReporter = async (e: React.MouseEvent, issueId: string) => {
    e.stopPropagation()
    try {
      const res = await API.patch(`/issues/${issueId}/report`)
      const updatedIssue = res.data
      setIssues((prev) =>
        prev.map((iss) =>
          iss._id === issueId
            ? {
                ...iss,
                reportCount: updatedIssue.reportCount,
                reporters: updatedIssue.reporters
              }
            : iss
        )
      )
      toast.success(
        hasUserReported(updatedIssue)
          ? "You reported this issue!"
          : "Report count updated"
      )
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update reporter count")
    }
  }

  const filteredIssues = issues.filter((iss) => {
    const matchesSearch =
      iss.title.toLowerCase().includes(search.toLowerCase()) ||
      iss.category.toLowerCase().includes(search.toLowerCase()) ||
      (iss.reportedBy?.name && iss.reportedBy.name.toLowerCase().includes(search.toLowerCase()))

    let matchesStatus = true
    if (statusFilter === "escalated") {
      matchesStatus = Boolean(iss.isEscalated)
    } else if (statusFilter !== "ALL") {
      matchesStatus = iss.status === statusFilter
    }

    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "resolved":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30">
            <CheckCircle2 size={12} /> Resolved
          </span>
        )
      case "in-progress":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/30">
            <Clock size={12} /> In Progress
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30">
            <AlertCircle size={12} /> Open
          </span>
        )
    }
  }

  if (loading) {
    return (
      <div className="p-8 text-center text-slate-500 dark:text-slate-400">
        Loading organization issues...
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Search Bar, Status Filters & Create Issue Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Search issues by title, category..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-sm outline-none focus:border-sky-500"
          />
        </div>

        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
              <Filter size={14} /> Status:
            </span>
            {[
              { label: "All Issues", value: "ALL" },
              { label: "Open", value: "open" },
              { label: "In Progress", value: "in-progress" },
              { label: "Resolved", value: "resolved" }
            ].map((st) => (
              <button
                key={st.value}
                onClick={() => setStatusFilter(st.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  statusFilter === st.value
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>

          {!isSuperAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-sm shadow-sky-600/20 cursor-pointer shrink-0"
            >
              <Plus size={16} />
              Report Issue
            </button>
          )}
        </div>
      </div>

      {/* Issues Grid */}
      {filteredIssues.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 p-12 text-center shadow-sm">
          <AlertCircle size={36} className="mx-auto text-slate-400 mb-3" />
          <h3 className="text-lg font-bold text-slate-700 dark:text-white">No issues reported</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
            There are no issues reported in this organization matching your filter.
          </p>
          {!isSuperAdmin && (
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Plus size={16} /> Report an Issue Now
            </button>
          )}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredIssues.map((issue) => {
            const reported = hasUserReported(issue)
            const currentReportersCount = issue.reportCount || issue.reporters?.length || 1

            return (
              <div
                key={issue._id}
                onClick={() => navigate(`/issues/${issue._id}`)}
                className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 p-5 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-sky-500/40 transition-all cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <h3 className="font-bold text-base text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                      {issue.title}
                    </h3>
                    {getStatusBadge(issue.status)}
                  </div>

                  <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">
                    {issue.description}
                  </p>

                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                        {issue.category}
                      </span>
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          issue.severity === "high"
                            ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                            : issue.severity === "medium"
                            ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                        }`}
                      >
                        {issue.severity}
                      </span>
                    </div>

                    {/* INCREASE REPORTERS / ME TOO UPVOTE BUTTON */}
                    {!isSuperAdmin && (
                      <button
                        onClick={(e) => handleToggleReporter(e, issue._id)}
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-xl transition-all cursor-pointer ${
                          reported
                            ? "bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300 border border-sky-300 dark:border-sky-500/40"
                            : "bg-slate-100 hover:bg-sky-50 text-slate-600 hover:text-sky-600 dark:bg-slate-700 dark:hover:bg-sky-500/10 dark:text-slate-300 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-600"
                        }`}
                        title={reported ? "Click to unreport" : "Click to increase reporter count / upvote"}
                      >
                        <ThumbsUp size={13} className={reported ? "fill-current" : ""} />
                        <span>{currentReportersCount} {currentReportersCount === 1 ? "Reporter" : "Reporters"}</span>
                      </button>
                    )}
                  </div>

                  {issue.status !== "resolved" && (
                    <div className="mb-3">
                      <SLATimer createdAt={issue.createdAt} priority={issue.severity || "medium"} />
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs text-slate-500 dark:text-slate-400">
                  <span>By: {issue.reportedBy?.name || "Member"}</span>
                  <span className="flex items-center text-sky-600 dark:text-sky-400 font-semibold group-hover:translate-x-1 transition-transform">
                    Details <ChevronRight size={14} />
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* CREATE ISSUE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg cursor-pointer"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Report New Issue</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Submit a complaint or maintenance request for this organization.
            </p>

            <form onSubmit={handleCreateIssue} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Issue Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Water leak in 3rd floor hallway"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-sky-500 text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Category
                  </label>
                  <CustomSelect
                    value={category}
                    options={CATEGORY_OPTIONS}
                    onChange={(val) => setCategory(val)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Priority / Severity
                  </label>
                  <CustomSelect
                    value={severity}
                    options={SEVERITY_OPTIONS}
                    onChange={(val) => setSeverity(val)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  placeholder="Describe the issue details and location..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:border-sky-500 text-slate-800 dark:text-slate-200 resize-y"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Attach Photo (Optional)
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full text-xs text-slate-500 border border-slate-200 dark:border-slate-700 rounded-xl p-2 bg-slate-50 dark:bg-slate-900 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-sky-50 file:text-sky-700 dark:file:bg-sky-900/30 dark:file:text-sky-300 hover:file:bg-sky-100 transition-all cursor-pointer"
                />
                {imageBase64 && (
                  <img
                    src={imageBase64}
                    alt="Preview"
                    className="mt-3 h-28 object-cover rounded-xl border border-slate-200 dark:border-slate-700"
                  />
                )}
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? "Submitting..." : "Submit Issue"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default SocietyIssuesSection
