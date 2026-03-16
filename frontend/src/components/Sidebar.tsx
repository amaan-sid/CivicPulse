import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../app/store"

function Sidebar() {

  const user = useSelector((state: RootState) => state.auth.user)

  const menuItems = [
    { label: "Dashboard", path: "/dashboard" },
    // { label: "Issues", path: "/issues" },
    // { label: "Issue Board", path: "/issue-board" }
  ]

  return (
    <div className="w-60 bg-gray-900 text-white min-h-screen p-6">

      <h2 className="text-xl font-bold mb-8">
        CivicPulse
      </h2>

      <nav className="flex flex-col gap-2">

        {/* Common menu */}
        <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>

        {/* Admin Only */}
        {user?.role === "admin" && (
          <NavLink
            to="/societies"
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`
            }
          >
            Societies
          </NavLink>
        )}

        {/* Admin Only */}
        {user?.role === "admin" && (
          <NavLink
            to="/create-society"
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`
            }
          >
            Create Society
          </NavLink>
        )}

        {/* Resident Only */}
        {user?.role === "resident" && (
          <NavLink
            to="/issue-board"
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`
            }
          >
            Issue Board
          </NavLink>
        )}

        {user?.role === "resident" && (
          <NavLink
            to="/create-issue"
            className={({ isActive }) =>
              `px-3 py-2 rounded transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-700 text-gray-200"
              }`
            }
          >
            Report Issue
          </NavLink>
        )}

      
      </nav>

    </div>
  )
}

export default Sidebar
