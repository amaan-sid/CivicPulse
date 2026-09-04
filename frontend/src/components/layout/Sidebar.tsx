import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { AlertCircle, Building2, ShieldCheck, Users } from "lucide-react"

function Sidebar() {
  const user = useSelector((state: RootState) => state.auth.user)

  return (
    <div className="w-72 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 min-h-screen p-6 flex flex-col shadow-sm z-20 relative transition-colors">
      <div className="flex items-center gap-3 mb-12 text-slate-800 dark:text-white">
        <div className="w-10 h-10 rounded-md bg-sky-600 flex items-center justify-center font-bold text-xl text-white shadow-sm">
          C
        </div>
        <h2 className="text-2xl font-bold tracking-tight">CivicPulse</h2>
      </div>

      <nav className="flex flex-col gap-2 flex-1">
        {user?.platformRole === "SUPER_ADMIN" ? (
          <>
            <NavLink
              to="/super-admin"
              end
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <ShieldCheck size={20} className={isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-400"} />
                  Platform Overview
                </>
              )}
            </NavLink>

            <NavLink
              to="/super-admin/organizations"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Building2 size={20} className={isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-400"} />
                  Manage Organization
                </>
              )}
            </NavLink>

            <NavLink
              to="/super-admin/users"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Users size={20} className={isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-400"} />
                  All Users
                </>
              )}
            </NavLink>

            <NavLink
              to="/super-admin/issues"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-purple-500/10 text-purple-600 dark:text-purple-400 font-medium"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <AlertCircle size={20} className={isActive ? "text-purple-600 dark:text-purple-400" : "text-slate-400 dark:text-slate-400"} />
                  All Issues
                </>
              )}
            </NavLink>
          </>
        ) : (
          <>
            <NavLink
              to="/join-society"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Building2 size={20} className={isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-400 dark:text-slate-400"} />
                  Join Organization
                </>
              )}
            </NavLink>

            <NavLink
              to="/managesociety"
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3.5 rounded-md transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-sky-500/10 text-sky-600 dark:text-sky-400 font-medium"
                    : "hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Building2 size={20} className={isActive ? "text-sky-600 dark:text-sky-400" : "text-slate-400 dark:text-slate-400"} />
                  Joined Organizations
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>
    </div>
  )
}

export default Sidebar