import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Link } from "react-router-dom"
import type { RootState } from "@/app/store"
import { setUser } from "@/features/auth/authSlice"
import DashboardLayout from "@/components/layout/DashboardLayout"
import ResidentsSection from "@/features/society/components/ResidentsSection"
import SocietySection from "@/features/society/components/SocietySection"
import SocietyIssuesSection from "@/features/society/components/SocietyIssuesSection"
import API from "@/services/api"
import {
  Building2,
  ArrowLeft,
  Search,
  Home,
  GraduationCap,
  ChevronRight,
  UserCheck,
  User,
  Filter,
  CheckCircle2,
  AlertCircle,
  Users,
  Settings
} from "lucide-react"

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
  myRole?: string
  admin?: { _id: string; name: string; email: string }
}

function ManageSociety() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const isSuperAdmin = user?.platformRole === "SUPER_ADMIN"

  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedOrgId, setSelectedOrgId] = useState<string | null>(null)
  const [selectedDetailView, setSelectedDetailView] = useState<"info" | "issues" | "residents" | null>(null)
  const [search, setSearch] = useState("")

  // Filter States
  const [roleFilter, setRoleFilter] = useState<"ALL" | "ADMIN" | "RESIDENT" | "STAFF" | "MEMBER">("ALL")
  const [typeFilter, setTypeFilter] = useState<"ALL" | "SOCIETY" | "HOSTEL" | "CAMPUS">("ALL")

  useEffect(() => {
    const fetchOrgs = async () => {
      setLoading(true)
      try {
        const endpoint = isSuperAdmin ? "/super-admin/organizations" : "/society/my-joined-societies"
        const res = await API.get(endpoint)
        setOrganizations(res.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    fetchOrgs()
  }, [isSuperAdmin])

  const handleSelectOrg = async (orgId: string) => {
    setSelectedOrgId(orgId)
    setSelectedDetailView(null) // Show the 3-option grid initially!
    if (!isSuperAdmin && orgId !== user?.currentSocietyId) {
      try {
        await API.post("/society/current", { societyId: orgId })
        const res = await API.get("/auth/me")
        dispatch(setUser(res.data.user))
      } catch (err) {
        console.error(err)
      }
    }
  }

  const selectedOrg = organizations.find((o) => o._id === selectedOrgId)

  // Filter organizations for grid view
  const filteredOrgs = organizations.filter((org) => {
    const matchesSearch =
      org.name.toLowerCase().includes(search.toLowerCase()) ||
      org.city.toLowerCase().includes(search.toLowerCase()) ||
      org.code.toLowerCase().includes(search.toLowerCase())

    const matchesType = typeFilter === "ALL" || org.type === typeFilter
    const matchesRole =
      roleFilter === "ALL" || (org.myRole && org.myRole.toUpperCase() === roleFilter)

    return matchesSearch && matchesType && matchesRole
  })

  const getOrgTypeBadge = (type: string) => {
    switch (type) {
      case "HOSTEL":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 border border-amber-200/60 dark:border-amber-500/20">
            <Home size={12} /> Hostel
          </span>
        )
      case "CAMPUS":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-200/60 dark:border-purple-500/20">
            <GraduationCap size={12} /> Campus
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-50 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400 border border-sky-200/60 dark:border-sky-500/20">
            <Building2 size={12} /> Society
          </span>
        )
    }
  }

  const getMyRoleBadge = (role?: string) => {
    if (!role) return null
    switch (role.toLowerCase()) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 border border-sky-200 dark:border-sky-800/30">
            <UserCheck size={12} /> Admin
          </span>
        )
      case "staff":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800/30">
            <User size={12} /> Staff
          </span>
        )
      case "member":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
            <User size={12} /> Member
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/30">
            <User size={12} /> Resident
          </span>
        )
    }
  }

  return (
    <DashboardLayout>
      {selectedOrgId ? (
        <div className="space-y-6">
          {/* Header for Selected Organization */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  if (selectedDetailView) {
                    setSelectedDetailView(null) // Return to 3-option grid menu
                  } else {
                    setSelectedOrgId(null) // Return to joined orgs list
                  }
                }}
                className="p-2.5 rounded-xl bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 border border-slate-200 dark:border-slate-700 transition-all shadow-sm cursor-pointer"
                title={selectedDetailView ? "Back to Organization Menu" : "Back to Joined Organizations"}
              >
                <ArrowLeft size={18} />
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
                    {selectedOrg?.name || "Organization Details"}
                  </h1>
                  {selectedOrg && getOrgTypeBadge(selectedOrg.type)}
                  {selectedOrg?.myRole && getMyRoleBadge(selectedOrg.myRole)}
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedOrg?.city}, {selectedOrg?.state} &bull; Code:{" "}
                  <span className="font-mono font-semibold">{selectedOrg?.code}</span>
                </p>
              </div>
            </div>

            {selectedDetailView && (
              <button
                onClick={() => setSelectedDetailView(null)}
                className="text-xs font-bold px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors cursor-pointer self-start sm:self-auto"
              >
                ← Back to Options
              </button>
            )}
          </div>

          {/* VIEW LEVEL 1: THE 3-OPTION GRID MENU */}
          {selectedDetailView === null ? (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                Select what you would like to view or manage for <strong className="text-slate-800 dark:text-white">{selectedOrg?.name}</strong>:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Option 1: Organization Info Card */}
                <div
                  onClick={() => setSelectedDetailView("info")}
                  className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-sky-500 dark:hover:border-sky-400 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/5 rounded-full blur-2xl group-hover:bg-sky-500/15 transition-all"></div>

                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Building2 size={28} />
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors mb-2">
                      Organization Info
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      View and edit organization details, location, invite codes, unit count, and settings.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-xs font-bold text-sky-600 dark:text-sky-400">
                    <span>View Info Grid</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>

                {/* Option 2: Issues & Complaints Card */}
                <div
                  onClick={() => setSelectedDetailView("issues")}
                  className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-amber-500 dark:hover:border-amber-400 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 rounded-full blur-2xl group-hover:bg-amber-500/15 transition-all"></div>

                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <AlertCircle size={28} />
                      </div>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
                        {selectedOrg?.issueCount || 0} Issues
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors mb-2">
                      Issues & Complaints
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      View all reported community complaints, active SLA timers, priorities, and status updates.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-xs font-bold text-amber-600 dark:text-amber-400">
                    <span>View Issues Board</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>

                {/* Option 3: Residents & Members Card */}
                <div
                  onClick={() => setSelectedDetailView("residents")}
                  className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-emerald-500 dark:hover:border-emerald-400 transition-all cursor-pointer flex flex-col justify-between group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 rounded-full blur-2xl group-hover:bg-emerald-500/15 transition-all"></div>

                  <div>
                    <div className="flex justify-between items-start mb-5">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Users size={28} />
                      </div>
                      <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
                        {selectedOrg?.memberCount || 0} Members
                      </span>
                    </div>

                    <h3 className="text-xl font-bold text-slate-800 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors mb-2">
                      Residents & Members
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
                      View full member directory, flat assignments, staff roles, and resident contact info.
                    </p>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    <span>View Directory</span>
                    <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {selectedDetailView === "info" && <SocietySection organizationId={selectedOrgId} />}
              {selectedDetailView === "issues" && <SocietyIssuesSection organizationId={selectedOrgId} />}
              {selectedDetailView === "residents" && <ResidentsSection organizationId={selectedOrgId} />}
            </div>
          )}
        </div>
      ) : (
        /* Organizations Grid View (Showing all joined societies) */
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
                {isSuperAdmin ? "Manage All Organizations" : "My Joined Organizations"}
              </h1>
              <p className="text-slate-500 dark:text-slate-400 mt-1">
                {isSuperAdmin
                  ? "View and manage all registered societies, hostels, and campuses on the platform."
                  : "Organizations you belong to as an Admin, Resident, Staff, or Member."}
              </p>
            </div>
          </div>

          {/* Search & Role/Type Filter Bar */}
          <div className="space-y-3 bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200/60 dark:border-slate-700 shadow-sm">
            <div className="relative w-full">
              <Search size={18} className="absolute left-3.5 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Search by organization name, code, or city..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-800 dark:text-slate-200 placeholder:text-slate-400 text-sm outline-none focus:border-sky-500"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-slate-100 dark:border-slate-700/60">
              {/* Role Filters (For Non-Super Admins) */}
              {!isSuperAdmin && (
                <div className="flex items-center gap-2 overflow-x-auto">
                  <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                    <Filter size={14} /> My Role:
                  </span>
                  {[
                    { label: "All Roles", value: "ALL" },
                    { label: "Admin", value: "ADMIN" },
                    { label: "Resident", value: "RESIDENT" },
                    { label: "Staff", value: "STAFF" },
                    { label: "Member", value: "MEMBER" }
                  ].map((role) => (
                    <button
                      key={role.value}
                      onClick={() => setRoleFilter(role.value as any)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        roleFilter === role.value
                          ? "bg-sky-600 text-white shadow-sm"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                      }`}
                    >
                      {role.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Type Filters */}
              <div className="flex items-center gap-2 overflow-x-auto">
                <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 mr-1">
                  Type:
                </span>
                {(["ALL", "SOCIETY", "HOSTEL", "CAMPUS"] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => setTypeFilter(type)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      typeFilter === type
                        ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-sm"
                        : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                    }`}
                  >
                    {type === "ALL" ? "All Types" : type.charAt(0) + type.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Organizations Grid */}
          {loading ? (
            <p className="text-slate-500 dark:text-slate-400">Loading your organizations...</p>
          ) : filteredOrgs.length === 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200/60 dark:border-slate-700 p-12 text-center shadow-sm">
              <Building2 size={36} className="mx-auto text-slate-400 mb-3" />
              <h3 className="text-lg font-bold text-slate-700 dark:text-white">No organizations found</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">
                {isSuperAdmin
                  ? "Try adjusting your search query or filters."
                  : "You have not joined any organization matching your filters."}
              </p>
              {!isSuperAdmin && (
                <Link
                  to="/join-society"
                  className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all shadow-sm"
                >
                  <Building2 size={16} /> Join an Organization
                </Link>
              )}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredOrgs.map((org) => {
                const isActiveContext = org._id === user?.currentSocietyId
                return (
                  <div
                    key={org._id}
                    onClick={() => handleSelectOrg(org._id)}
                    className={`bg-white dark:bg-slate-800 rounded-2xl border p-5 shadow-sm hover:shadow-md transition-all cursor-pointer flex flex-col justify-between group ${
                      isActiveContext
                        ? "border-sky-500 dark:border-sky-400 ring-2 ring-sky-500/20"
                        : "border-slate-200/60 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-500/40"
                    }`}
                  >
                    <div>
                      <div className="flex justify-between items-start mb-3 gap-2">
                        <div>
                          <h3 className="font-bold text-lg text-slate-800 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors line-clamp-1">
                            {org.name}
                          </h3>
                          {org.myRole && <div className="mt-1">{getMyRoleBadge(org.myRole)}</div>}
                        </div>

                        <div className="flex flex-col items-end gap-1.5 shrink-0">
                          {isActiveContext && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300">
                              <CheckCircle2 size={10} /> Active Context
                            </span>
                          )}
                          {getOrgTypeBadge(org.type)}
                        </div>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                        {org.address ? `${org.address}, ${org.city}` : `${org.city}, ${org.state}`}
                      </p>

                      <div className="space-y-2 mb-4 text-xs">
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400">Code:</span>
                          <span className="font-mono font-bold">{org.code}</span>
                        </div>
                        {isSuperAdmin && (
                          <div className="flex justify-between text-slate-600 dark:text-slate-300">
                            <span className="text-slate-400">Admin:</span>
                            <span className="font-medium">{org.admin?.name || "Unassigned"}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400">Members:</span>
                          <span className="font-semibold">{org.memberCount || 0}</span>
                        </div>
                        <div className="flex justify-between text-slate-600 dark:text-slate-300">
                          <span className="text-slate-400">Total Issues:</span>
                          <span className="font-semibold">{org.issueCount || 0}</span>
                        </div>
                      </div>
                    </div>

                    <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center text-xs font-semibold text-sky-600 dark:text-sky-400">
                      <span>Select Organization</span>
                      <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </DashboardLayout>
  )
}

export default ManageSociety
