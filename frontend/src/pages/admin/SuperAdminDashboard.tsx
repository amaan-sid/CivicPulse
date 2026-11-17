import { useEffect, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate } from "react-router-dom"
import { logoutUser } from "@/features/auth/authSlice"
import DashboardLayout from "@/components/layout/DashboardLayout"
import API from "@/services/api"
import Card from "@/components/ui/Card"
import toast from "react-hot-toast"
import ConfirmModal from "@/components/ui/ConfirmModal"
import CustomSelect, { type SelectOption } from "@/components/ui/CustomSelect"
import SLATimer from "@/features/issues/components/SLATimer"
import { isIssueBreached, isIssueExpired } from "@/utils/issueHelpers"

const SUPERADMIN_ORG_TYPE_OPTIONS: SelectOption[] = [
  { value: "SOCIETY", label: "Housing Society" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "CAMPUS", label: "Campus" },
];
import {
  Building2,
  Users,
  AlertTriangle,
  CheckCircle2,
  Plus,
  ShieldCheck,
  Power,
  Search,
  Home,
  GraduationCap,
  X,
  Trash2,
  Filter,
  UserCheck,
  User,
  Eye,
  ChevronRight
} from "lucide-react"
import OrganizationDetailModal from "./components/OrganizationDetailModal"
import UserDetailModal from "./components/UserDetailModal"
import IssueDetailModal from "./components/IssueDetailModal"
import UserAvatar from "@/components/common/UserAvatar"

interface PlatformStats {
  totalOrganizations: number
  activeOrganizations: number
  totalUsers: number
  totalIssues: number
  resolvedIssues: number
  breachedIssues: number
  orgTypeDistribution: { _id: string; count: number }[]
}

interface Organization {
  _id: string
  name: string
  type: "SOCIETY" | "HOSTEL" | "CAMPUS"
  address: string
  city: string
  state: string
  totalFlats: number
  code: string
  isActive: boolean
  memberCount: number
  issueCount: number
  admin?: { _id: string; name: string; email: string; profilePic?: string; gender?: "male" | "female" }
  createdAt: string
}

interface PlatformUser {
  _id: string
  name: string
  username?: string
  email: string
  profilePic?: string
  gender?: "male" | "female"
  platformRole: "SUPER_ADMIN" | "USER"
  primaryRole: string
  isActive: boolean
  societies: {
    societyId?: string
    societyName: string
    societyCode: string
    societyType: string
    role: string
  }[]
  createdAt: string
}

interface PlatformIssue {
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

interface SuperAdminDashboardProps {
  initialTab?: "overview" | "orgs" | "users" | "issues"
}

function SuperAdminDashboard({ initialTab = "overview" }: SuperAdminDashboardProps) {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState<"overview" | "orgs" | "users" | "issues">(initialTab)

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab)
    }
  }, [initialTab])

  const [stats, setStats] = useState<PlatformStats | null>(null)
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [usersList, setUsersList] = useState<PlatformUser[]>([])
  const [issuesList, setIssuesList] = useState<PlatformIssue[]>([])

  const [loading, setLoading] = useState(true)
  const [usersLoading, setUsersLoading] = useState(false)
  const [issuesLoading, setIssuesLoading] = useState(false)

  // Filters & Searches
  const [search, setSearch] = useState("")
  const [orgCategoryFilter, setOrgCategoryFilter] = useState<string>("ALL")
  const [userSearch, setUserSearch] = useState("")
  const [userRoleFilter, setUserRoleFilter] = useState<string>("ALL")
  const [issueSearch, setIssueSearch] = useState("")
  const [issueStatusFilter, setIssueStatusFilter] = useState<string>("ALL")

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [isPromoteModalOpen, setIsPromoteModalOpen] = useState(false)
  const [deleteOrgTarget, setDeleteOrgTarget] = useState<{ id: string; name: string } | null>(null)
  const [isDeletingOrg, setIsDeletingOrg] = useState(false)
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null)
  const [selectedUser, setSelectedUser] = useState<PlatformUser | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<PlatformIssue | null>(null)

  // Form States
  const [name, setName] = useState("")
  const [type, setType] = useState<"SOCIETY" | "HOSTEL" | "CAMPUS">("SOCIETY")
  const [address, setAddress] = useState("")
  const [city, setCity] = useState("")
  const [state, setState] = useState("")
  const [totalFlats, setTotalFlats] = useState("50")
  const [adminName, setAdminName] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [promoteEmail, setPromoteEmail] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchData = async () => {
    try {
      const [statsRes, orgsRes] = await Promise.all([
        API.get("/super-admin/stats"),
        API.get("/super-admin/organizations")
      ])
      setStats(statsRes.data)
      setOrganizations(orgsRes.data)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to load platform dashboard")
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    setUsersLoading(true)
    try {
      const res = await API.get("/super-admin/users")
      setUsersList(res.data)
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to load users list")
    } finally {
      setUsersLoading(false)
    }
  }

  const fetchIssues = async () => {
    setIssuesLoading(true)
    try {
      const res = await API.get("/super-admin/issues")
      setIssuesList(res.data)
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to load issues list")
    } finally {
      setIssuesLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (activeTab === "users" && usersList.length === 0) {
      fetchUsers()
    } else if (activeTab === "issues" && issuesList.length === 0) {
      fetchIssues()
    }
  }, [activeTab])

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await API.post("/super-admin/organizations", {
        name,
        type,
        address,
        city,
        state,
        totalFlats: Number(totalFlats),
        adminName,
        adminEmail,
        adminPassword
      })
      toast.success("Organization & Admin created successfully!")
      setIsCreateModalOpen(false)
      setName("")
      setAddress("")
      setCity("")
      setState("")
      setAdminName("")
      setAdminEmail("")
      setAdminPassword("")
      fetchData()
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to create organization")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleToggleStatus = async (orgId: string, currentStatus: boolean) => {
    try {
      await API.patch(`/super-admin/organizations/${orgId}/status`)
      toast.success(`Organization ${currentStatus ? "suspended" : "activated"} successfully`)
      setOrganizations((prev) =>
        prev.map((org) => (org._id === orgId ? { ...org, isActive: !org.isActive } : org))
      )
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to change organization status")
    }
  }

  const handleConfirmDeleteOrg = async () => {
    if (!deleteOrgTarget) return
    setIsDeletingOrg(true)
    try {
      await API.delete(`/super-admin/organizations/${deleteOrgTarget.id}`)
      toast.success("Organization deleted successfully")
      setOrganizations((prev) => prev.filter((org) => org._id !== deleteOrgTarget.id))
      setDeleteOrgTarget(null)
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to delete organization")
    } finally {
      setIsDeletingOrg(false)
    }
  }

  const handleToggleStatusFromModal = async (orgId: string, currentStatus: boolean) => {
    await handleToggleStatus(orgId, currentStatus)
    setSelectedOrg((prev) => (prev && prev._id === orgId ? { ...prev, isActive: !prev.isActive } : prev))
  }

  const handleViewOrgIssues = (org: Organization) => {
    setSelectedOrg(null)
    setActiveTab("issues")
    setIssueSearch(org.name)
  }

  const handleOpenIssueFullPage = (issueId: string) => {
    navigate(`/issues/${issueId}`)
  }

  const handlePromoteSuperAdmin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    try {
      await API.post("/super-admin/promote", { email: promoteEmail })
      toast.success("Super Admin privileges transferred successfully! Redirecting to login...")
      setIsPromoteModalOpen(false)
      setPromoteEmail("")

      try {
        await API.post("/auth/logout")
      } catch (logoutErr) {
        console.error("Logout request error:", logoutErr)
      }

      dispatch(logoutUser())
      navigate("/login")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to promote user")
    } finally {
      setIsSubmitting(false)
    }
  }

  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.city.toLowerCase().includes(search.toLowerCase()) ||
      org.code?.toLowerCase().includes(search.toLowerCase())

    const matchesCategory =
      orgCategoryFilter === "ALL" ||
      (org.type || "SOCIETY").toUpperCase() === orgCategoryFilter.toUpperCase()

    return matchesSearch && matchesCategory
  })

  const filteredUsers = usersList.filter((usr) => {
    const matchesSearch =
      usr.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      usr.email.toLowerCase().includes(userSearch.toLowerCase()) ||
      usr.societies.some((s) => s.societyName.toLowerCase().includes(userSearch.toLowerCase()))

    let matchesRole = true
    if (userRoleFilter === "SUPER_ADMIN") {
      matchesRole = usr.platformRole === "SUPER_ADMIN"
    } else if (userRoleFilter !== "ALL") {
      matchesRole = usr.primaryRole.toLowerCase() === userRoleFilter.toLowerCase()
    }

    return matchesSearch && matchesRole
  })

  const filteredIssues = issuesList.filter((iss) => {
    // Remove resolved and breached issues older than 1 day
    if (isIssueExpired(iss)) {
      return false
    }

    const matchesSearch =
      iss.title.toLowerCase().includes(issueSearch.toLowerCase()) ||
      iss.category.toLowerCase().includes(issueSearch.toLowerCase()) ||
      (iss.society?.name && iss.society.name.toLowerCase().includes(issueSearch.toLowerCase())) ||
      (iss.reportedBy?.name && iss.reportedBy.name.toLowerCase().includes(issueSearch.toLowerCase()))

    const breached = isIssueBreached(iss)

    let matchesStatus = true
    if (issueStatusFilter === "escalated") {
      matchesStatus = breached
    } else if (issueStatusFilter === "open") {
      matchesStatus = iss.status === "open" && !breached
    } else if (issueStatusFilter === "in-progress") {
      matchesStatus = iss.status === "in-progress" && !breached
    } else if (issueStatusFilter === "resolved") {
      matchesStatus = iss.status === "resolved"
    } else if (issueStatusFilter === "ALL") {
      matchesStatus = !breached
    } else {
      matchesStatus = iss.status === issueStatusFilter && !breached
    }

    return matchesSearch && matchesStatus
  })

  const getTypeIcon = (orgType: string) => {
    switch (orgType) {
      case "HOSTEL":
        return <Home size={16} className="text-amber-500" />
      case "CAMPUS":
        return <GraduationCap size={16} className="text-purple-500" />
      default:
        return <Building2 size={16} className="text-sky-500" />
    }
  }

  const getRoleBadge = (role: string, platformRole?: string) => {
    if (platformRole === "SUPER_ADMIN") {
      return (
        <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
          <ShieldCheck size={12} /> Super Admin
        </span>
      )
    }

    switch (role.toLowerCase()) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300">
            <UserCheck size={12} /> Society Admin
          </span>
        )
      case "staff":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <User size={12} /> Staff / Tech
          </span>
        )
      case "member":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            <User size={12} /> Member
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <User size={12} /> Resident
          </span>
        )
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-slate-500 dark:text-slate-400">Loading Super Admin Dashboard...</p>
      </DashboardLayout>
    )
  }

  const getHeaderTitle = () => {
    switch (activeTab) {
      case "orgs":
        return "Manage Organizations"
      case "users":
        return "Platform Users Directory"
      case "issues":
        return "Global Platform Issues"
      default:
        return "Platform Overview"
    }
  }

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              {getHeaderTitle()}
            </h1>
            <span className="bg-purple-100 dark:bg-purple-500/10 text-purple-700 dark:text-purple-400 text-xs font-bold px-3 py-1 rounded-sm flex items-center gap-1">
              <ShieldCheck size={14} /> SUPER ADMIN
            </span>
          </div>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Global management of organizations, users, issues, and platform metrics.
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={() => setIsPromoteModalOpen(true)}
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-700 transition-all shadow-sm cursor-pointer"
          >
            <ShieldCheck size={18} className="text-purple-500" />
            Transfer Super Admin
          </button>

          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-sky-700 transition-colors shadow-sm cursor-pointer"
          >
            <Plus size={18} />
            New Organization
          </button>
        </div>
      </div>

      {/* VIEW 1: PLATFORM OVERVIEW (ONLY SHOWS THE 4 METRIC CARDS) */}
      {activeTab === "overview" && stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="flex items-center gap-5 cursor-pointer transition-all" onClick={() => navigate("/super-admin/organizations")}>
            <div className="w-14 h-14 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <Building2 size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Organizations
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats.totalOrganizations}
              </p>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-medium mt-0.5">
                {stats.activeOrganizations} Active
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-5 cursor-pointer transition-all" onClick={() => navigate("/super-admin/users")}>
            <div className="w-14 h-14 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Users size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Total Users
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats.totalUsers}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Across all organizations</p>
            </div>
          </Card>

          <Card className="flex items-center gap-5 cursor-pointer transition-all" onClick={() => navigate("/super-admin/issues")}>
            <div className="w-14 h-14 rounded-md bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <CheckCircle2 size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                Resolved Issues
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {stats.resolvedIssues}
              </p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                Out of {stats.totalIssues} total
              </p>
            </div>
          </Card>

          <Card className="flex items-center gap-5 cursor-pointer transition-all" onClick={() => navigate("/super-admin/issues")}>
            <div className="w-14 h-14 rounded-md bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center">
              <AlertTriangle size={26} />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-1">
                SLA Breaches
              </p>
              <p className="text-3xl font-bold text-slate-800 dark:text-white">
                {issuesList.length > 0
                  ? issuesList.filter((iss) => !isIssueExpired(iss) && isIssueBreached(iss)).length
                  : (stats.breachedIssues || 0)}
              </p>
              <p className="text-xs text-rose-600 dark:text-rose-400 font-medium mt-0.5">
                Escalated issues
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* VIEW 2: ORGANIZATIONS DIRECTORY */}
      {activeTab === "orgs" && (
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-sm overflow-hidden">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Organizations Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Manage all registered societies, hostels, and university campuses.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search by name, code, city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="px-6 flex items-center gap-2 overflow-x-auto pb-4">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-2">
              <Filter size={14} /> Category:
            </span>
            {[
              { label: "All Organizations", value: "ALL", icon: Building2 },
              { label: "Housing Society", value: "SOCIETY", icon: Building2 },
              { label: "Hostel", value: "HOSTEL", icon: Home },
              { label: "Campus", value: "CAMPUS", icon: GraduationCap }
            ].map((cat) => {
              const Icon = cat.icon
              const count =
                cat.value === "ALL"
                  ? organizations.length
                  : organizations.filter(
                      (org) => (org.type || "SOCIETY").toUpperCase() === cat.value.toUpperCase()
                    ).length

              return (
                <button
                  key={cat.value}
                  onClick={() => setOrgCategoryFilter(cat.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    orgCategoryFilter === cat.value
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <Icon size={13} className={orgCategoryFilter === cat.value ? "text-white" : "text-slate-400"} />
                  <span>{cat.label}</span>
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      orgCategoryFilter === cat.value
                        ? "bg-purple-700/70 text-white"
                        : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <th className="p-4 pl-6">Organization</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Location</th>
                  <th className="p-4">Code</th>
                  <th className="p-4">Admin</th>
                  <th className="p-4 text-center">Members</th>
                  <th className="p-4 text-center">Issues</th>
                  <th className="p-4 text-center">Status</th>
                  <th className="p-4 text-right pr-6">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                {filteredOrgs.length === 0 ? (
                  <tr>
                    <td colSpan={9} className="p-8 text-center text-slate-400">
                      No organizations found matching your search or filter.
                    </td>
                  </tr>
                ) : (
                  filteredOrgs.map((org) => (
                    <tr
                      key={org._id}
                      onClick={() => setSelectedOrg(org)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 pl-6">
                        <p className="font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                          {org.name}
                        </p>
                        <p className="text-xs text-slate-400">{org.totalFlats} Units/Flats</p>
                      </td>

                      <td className="p-4">
                        <div className="flex items-center gap-1.5 font-semibold text-xs text-slate-700 dark:text-slate-300">
                          {getTypeIcon(org.type)}
                          <span className="capitalize">{org.type?.toLowerCase()}</span>
                        </div>
                      </td>

                      <td className="p-4 text-slate-600 dark:text-slate-300 text-xs">
                        {org.city}, {org.state}
                      </td>

                      <td className="p-4">
                        <span className="font-mono font-bold text-xs bg-slate-100 dark:bg-slate-900 px-2 py-1 rounded-sm text-slate-700 dark:text-slate-300">
                          {org.code}
                        </span>
                      </td>

                      <td className="p-4">
                        {org.admin ? (
                          <div className="flex items-center gap-2.5">
                            <UserAvatar
                              src={org.admin.profilePic}
                              gender={org.admin.gender}
                              name={org.admin.name}
                              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs"
                            />
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{org.admin.name}</p>
                              <p className="text-[11px] text-slate-400">{org.admin.email}</p>
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">Unassigned</span>
                        )}
                      </td>

                      <td className="p-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {org.memberCount}
                      </td>

                      <td className="p-4 text-center font-semibold text-slate-700 dark:text-slate-300">
                        {org.issueCount}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-sm text-xs font-bold ${
                            org.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {org.isActive ? "Active" : "Suspended"}
                        </span>
                      </td>

                      <td className="p-4 text-right pr-6" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedOrg(org)
                            }}
                            className="p-2 text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-lg transition-colors cursor-pointer"
                            title="View Organization Details"
                          >
                            <Eye size={16} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleToggleStatus(org._id, org.isActive)
                            }}
                            className={`p-2 rounded-lg transition-colors cursor-pointer ${
                              org.isActive
                                ? "text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-500/10"
                                : "text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-500/10"
                            }`}
                            title={org.isActive ? "Suspend Organization" : "Activate Organization"}
                          >
                            <Power size={16} />
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setDeleteOrgTarget({ id: org._id, name: org.name })
                            }}
                            className="p-2 text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete Organization"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: ALL USERS BY CATEGORY & SOCIETY */}
      {activeTab === "users" && (
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-sm overflow-hidden space-y-4">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Platform Users Directory
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                View all registered users categorized by role and organization membership.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search user, email, society..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Category Filter Buttons */}
          <div className="px-6 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-2">
              <Filter size={14} /> Category:
            </span>
            {[
              { label: "All Users", value: "ALL" },
              { label: "Admins", value: "ADMIN" },
              { label: "Residents", value: "RESIDENT" },
              { label: "Staff", value: "STAFF" },
              { label: "Members", value: "MEMBER" },
              { label: "Super Admins", value: "SUPER_ADMIN" }
            ].map((cat) => {
              const count =
                cat.value === "ALL"
                  ? usersList.length
                  : cat.value === "SUPER_ADMIN"
                  ? usersList.filter((u) => u.platformRole === "SUPER_ADMIN").length
                  : usersList.filter((u) => u.primaryRole?.toLowerCase() === cat.value.toLowerCase()).length

              return (
                <button
                  key={cat.value}
                  onClick={() => setUserRoleFilter(cat.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    userRoleFilter === cat.value
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <span>{cat.label}</span>
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      userRoleFilter === cat.value
                        ? "bg-purple-700/70 text-white"
                        : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Users Table / Vertical Columns */}
          <div className="overflow-x-auto">
            {usersLoading ? (
              <p className="p-8 text-center text-slate-500 dark:text-slate-400">Loading users...</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">User Profile</th>
                    <th className="p-4">Category / Role</th>
                    <th className="p-4">Associated Organization / Society</th>
                    <th className="p-4 text-center">Account Status</th>
                    <th className="p-4 text-right pr-6">Joined Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                  {filteredUsers.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-400">
                        No users found matching your filters.
                      </td>
                    </tr>
                  ) : (
                    filteredUsers.map((usr) => (
                    <tr
                      key={usr._id}
                      onClick={() => setSelectedUser(usr)}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group"
                    >
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <UserAvatar
                            src={usr.profilePic}
                            gender={usr.gender}
                            name={usr.name}
                            className="w-10 h-10 rounded-md border border-slate-200 dark:border-slate-700 shadow-sm group-hover:scale-105 transition-transform shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <p className="font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                                {usr.name}
                              </p>
                              {usr.username && (
                                <span className="text-xs text-purple-600 dark:text-purple-400 font-mono font-medium">
                                  @{usr.username}
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400">{usr.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {getRoleBadge(usr.primaryRole, usr.platformRole)}
                      </td>

                      <td className="p-4">
                        {usr.societies && usr.societies.length > 0 ? (
                          <div className="space-y-1">
                            {usr.societies.map((soc, idx) => (
                              <div key={idx} className="flex items-center gap-2">
                                {getTypeIcon(soc.societyType)}
                                <div>
                                  <span className="font-medium text-slate-800 dark:text-slate-200 text-xs">
                                    {soc.societyName}
                                  </span>
                                  <span className="text-[10px] font-mono text-slate-400 ml-1.5">
                                    ({soc.societyCode})
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400 italic">No Society Joined</span>
                        )}
                      </td>

                      <td className="p-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-full text-xs font-bold ${
                            usr.isActive
                              ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                              : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400"
                          }`}
                        >
                          {usr.isActive ? "Active" : "Suspended"}
                        </span>
                      </td>

                      <td className="p-4 text-right pr-6">
                        <div className="flex items-center justify-end gap-2">
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(usr.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric"
                            })}
                          </span>
                          <span className="text-slate-300 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            <ChevronRight size={16} />
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* VIEW 4: ALL ISSUES DIRECTORY */}
      {activeTab === "issues" && (
        <div className="bg-white dark:bg-slate-800 rounded-md shadow-sm overflow-hidden space-y-4">
          <div className="p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-xl font-bold text-slate-800 dark:text-white">
                Global Platform Issues
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Overview of all community complaints, SLA timers, and breach escalations.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search issue, category, society..."
                value={issueSearch}
                onChange={(e) => setIssueSearch(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Status Filter Buttons */}
          <div className="px-6 flex items-center gap-2 overflow-x-auto pb-2">
            <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-2">
              <Filter size={14} /> Status:
            </span>
            {[
              { label: "All Issues", value: "ALL" },
              { label: "Open", value: "open" },
              { label: "In Progress", value: "in-progress" },
              { label: "Resolved", value: "resolved" },
              { label: "Breached Issues", value: "escalated" }
            ].map((st) => {
              const count = issuesList.filter((iss) => {
                if (isIssueExpired(iss)) return false
                const breached = isIssueBreached(iss)
                if (st.value === "ALL") return !breached
                if (st.value === "escalated") return breached
                if (st.value === "open") return iss.status === "open" && !breached
                if (st.value === "in-progress") return iss.status === "in-progress" && !breached
                if (st.value === "resolved") return iss.status === "resolved"
                return iss.status === st.value && !breached
              }).length

              return (
                <button
                  key={st.value}
                  onClick={() => setIssueStatusFilter(st.value)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer ${
                    issueStatusFilter === st.value
                      ? "bg-purple-600 text-white shadow-sm"
                      : "bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                  }`}
                >
                  <span>{st.label}</span>
                  <span
                    className={`ml-0.5 text-[10px] px-1.5 py-0.5 rounded-full font-medium ${
                      issueStatusFilter === st.value
                        ? "bg-purple-700/70 text-white"
                        : "bg-slate-200 dark:bg-slate-600 text-slate-600 dark:text-slate-300"
                    }`}
                  >
                    {count}
                  </span>
                </button>
              )
            })}
          </div>

          {/* Issues Table */}
          <div className="overflow-x-auto">
            {issuesLoading ? (
              <p className="p-8 text-center text-slate-500 dark:text-slate-400">Loading issues...</p>
            ) : (
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-900/50 text-xs font-bold text-slate-400 uppercase tracking-wider">
                    <th className="p-4 pl-6">Issue Title & Category</th>
                    <th className="p-4">Organization / Society</th>
                    <th className="p-4">Reported By</th>
                    <th className="p-4">Assigned Admin</th>
                    <th className="p-4 text-center">Status & SLA</th>
                    <th className="p-4 pr-6 text-right"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700 text-sm">
                  {filteredIssues.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-slate-400">
                        No issues found matching your query.
                      </td>
                    </tr>
                  ) : (
                    filteredIssues.map((iss) => (
                      <tr
                        key={iss._id}
                        onClick={() => setSelectedIssue(iss)}
                        className="hover:bg-slate-50/80 dark:hover:bg-slate-700/40 transition-colors cursor-pointer group"
                      >
                        <td className="p-4 pl-6">
                          <p className="font-bold text-slate-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                            {iss.title}
                          </p>
                          {!isIssueBreached(iss) && (
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                                {iss.category}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-2 py-0.5 rounded-sm uppercase ${
                                  iss.severity === "high"
                                    ? "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300"
                                    : iss.severity === "medium"
                                    ? "bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
                                    : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300"
                                }`}
                              >
                                {iss.severity} Priority
                              </span>
                            </div>
                          )}
                        </td>

                        <td className="p-4">
                          {iss.society ? (
                            <div>
                              <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{iss.society.name}</p>
                              <span className="text-[10px] font-mono text-slate-400">Code: {iss.society.code}</span>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Unknown</span>
                          )}
                        </td>

                        <td className="p-4">
                          {iss.reportedBy ? (
                            <div className="flex items-center gap-2.5">
                              <UserAvatar
                                src={iss.reportedBy.profilePic}
                                gender={iss.reportedBy.gender}
                                name={iss.reportedBy.name}
                                className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs"
                              />
                              <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{iss.reportedBy.name}</p>
                                <p className="text-[11px] text-slate-400">{iss.reportedBy.email}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Unknown User</span>
                          )}
                        </td>

                        <td className="p-4">
                          {iss.assignedTo ? (
                            <div className="flex items-center gap-2.5">
                              <UserAvatar
                                src={iss.assignedTo.profilePic}
                                gender={iss.assignedTo.gender}
                                name={iss.assignedTo.name}
                                className="w-7 h-7 rounded-full border border-slate-200 dark:border-slate-700 shadow-xs"
                              />
                              <div>
                                <p className="font-medium text-slate-800 dark:text-slate-200 text-xs">{iss.assignedTo.name}</p>
                                <p className="text-[11px] text-slate-400">{iss.assignedTo.email}</p>
                              </div>
                            </div>
                          ) : (
                            <span className="text-xs text-slate-400 italic">Unassigned</span>
                          )}
                        </td>

                        <td className="p-4 text-center">
                          <div className="flex flex-col items-center gap-1">
                            {isIssueBreached(iss) ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 shadow-sm">
                                <AlertTriangle size={12} /> SLA Breached
                              </span>
                            ) : (
                              <>
                                <span
                                  className={`px-2.5 py-1 rounded-sm text-xs font-bold ${
                                    iss.status === "resolved"
                                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400"
                                      : iss.status === "in-progress"
                                      ? "bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400"
                                      : "bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400"
                                  }`}
                                >
                                  {iss.status}
                                </span>
                                {iss.status !== "resolved" && iss.slaDeadline && (
                                  <SLATimer
                                    createdAt={iss.createdAt}
                                    priority={iss.severity || "medium"}
                                    slaDeadline={iss.slaDeadline}
                                    isEscalated={iss.isEscalated}
                                    status={iss.status}
                                  />
                                )}
                              </>
                            )}
                          </div>
                        </td>

                        <td className="p-4 text-right pr-6">
                          <span className="text-slate-300 dark:text-slate-600 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors inline-block">
                            <ChevronRight size={16} />
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* CREATE ORG MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-md p-8 max-w-xl w-full shadow-sm relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            >
              <X size={20} />
            </button>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">New Organization</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Create a new housing society, hostel, or campus and assign its primary admin.
            </p>

            <form onSubmit={handleCreateOrg} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Organization Name</label>
                <input
                  type="text"
                  placeholder="Greenfield Heights"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Type</label>
                  <CustomSelect
                    value={type}
                    options={SUPERADMIN_ORG_TYPE_OPTIONS}
                    onChange={(val) => setType(val as any)}
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Total Units/Flats</label>
                  <input
                    type="number"
                    value={totalFlats}
                    onChange={(e) => setTotalFlats(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Address</label>
                <input
                  type="text"
                  placeholder="123 Park Avenue"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    placeholder="Mumbai"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">State</label>
                  <input
                    type="text"
                    placeholder="Maharashtra"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
              </div>

              <div className="pt-4 space-y-4">
                <h4 className="font-bold text-slate-800 dark:text-white text-sm">Assign Organization Admin</h4>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Name</label>
                  <input
                    type="text"
                    placeholder="Alex Smith"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Email</label>
                    <input
                      type="email"
                      placeholder="admin@org.com"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Admin Password</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                      className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-sky-600 hover:bg-sky-500 text-white rounded-md text-sm font-bold shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? "Creating..." : "Create Organization"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TRANSFER SUPER ADMIN MODAL */}
      {isPromoteModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-800 rounded-md p-8 max-w-md w-full shadow-sm relative">
            <button
              onClick={() => setIsPromoteModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-md"
            >
              <X size={20} />
            </button>

            <div className="w-12 h-12 rounded-md bg-purple-100 dark:bg-purple-500/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4">
              <ShieldCheck size={26} />
            </div>

            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">Transfer Super Admin</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-6">
              Enter the target user's email to transfer sole Super Admin control of the platform.
            </p>

            <form onSubmit={handlePromoteSuperAdmin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">User Email</label>
                <input
                  type="email"
                  placeholder="newadmin@example.com"
                  value={promoteEmail}
                  onChange={(e) => setPromoteEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-900 rounded-md text-sm outline-none text-slate-800 dark:text-slate-200"
                  required
                />
              </div>

              <div className="p-3 bg-purple-50 dark:bg-purple-500/10 rounded-md text-xs text-purple-700 dark:text-purple-300">
                ⚠️ <strong>Single Super Admin Policy:</strong> Transferring privileges will grant sole control to the specified user and log out your current session.
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsPromoteModalOpen(false)}
                  className="px-5 py-2.5 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 text-sm font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-md text-sm font-bold shadow-sm cursor-pointer disabled:opacity-70"
                >
                  {isSubmitting ? "Transferring..." : "Transfer Privileges"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM DELETE ORG MODAL */}
      <ConfirmModal
        isOpen={Boolean(deleteOrgTarget)}
        title="Delete Organization"
        message={`Are you sure you want to delete "${deleteOrgTarget?.name}"? All associated data will be permanently removed.`}
        confirmText={isDeletingOrg ? "Deleting..." : "Delete Organization"}
        confirmVariant="danger"
        onConfirm={handleConfirmDeleteOrg}
        onCancel={() => setDeleteOrgTarget(null)}
      />

      {/* ORGANIZATION DETAIL MODAL */}
      <OrganizationDetailModal
        org={selectedOrg}
        isOpen={Boolean(selectedOrg)}
        onClose={() => setSelectedOrg(null)}
        onToggleStatus={handleToggleStatusFromModal}
        onViewIssues={handleViewOrgIssues}
      />

      {/* USER DETAIL MODAL */}
      <UserDetailModal
        user={selectedUser}
        isOpen={Boolean(selectedUser)}
        onClose={() => setSelectedUser(null)}
      />

      {/* ISSUE DETAIL MODAL */}
      <IssueDetailModal
        issue={selectedIssue}
        isOpen={Boolean(selectedIssue)}
        onClose={() => setSelectedIssue(null)}
        onOpenFullPage={handleOpenIssueFullPage}
      />
    </DashboardLayout>
  )
}

export default SuperAdminDashboard
