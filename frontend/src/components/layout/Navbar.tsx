import { useDispatch, useSelector } from "react-redux"
import { logoutUser, setUser } from "@/features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import API from "@/services/api"
import { Moon, Sun, ChevronDown, User as UserIcon } from "lucide-react"
import type { RootState } from "@/app/store"
import { useEffect, useState, useRef } from "react"
import UserProfileModal from "@/components/profile/UserProfileModal"
import UserAvatar from "@/components/common/UserAvatar"

function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const user = useSelector((state: RootState) => state.auth.user)

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return false
  })

  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    setIsDark(document.documentElement.classList.contains("dark"))
  }, [])

  // Auto-fetch fresh user info if username is not in state yet
  useEffect(() => {
    if (user && !user.username) {
      API.get("/auth/me")
        .then((res) => {
          if (res.data?.user) {
            dispatch(setUser(res.data.user))
          }
        })
        .catch(() => {})
    }
  }, [user, dispatch])

  // Close dropdown on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const toggleDarkMode = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark")
      localStorage.setItem("theme", "light")
      setIsDark(false)
    } else {
      document.documentElement.classList.add("dark")
      localStorage.setItem("theme", "dark")
      setIsDark(true)
    }
  }

  const handleLogout = () => {
    API.post("/auth/logout")
    localStorage.removeItem("token")
    dispatch(logoutUser())
    navigate("/login")
  }

  return (
    <>
      <div className="sticky top-0 z-30 flex justify-between items-center bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-sm px-8 py-5 transition-colors">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
            Welcome back, {user?.name?.split(" ")[0] || "User"}{" "}
            <span className="text-2xl">👋</span>
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Here's what's happening in your community today.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Theme Toggle */}
          <button
            onClick={toggleDarkMode}
            className="p-2.5 text-slate-400 hover:text-sky-600 dark:hover:text-sky-400 hover:bg-sky-50 dark:hover:bg-slate-800 rounded-md transition-all cursor-pointer"
            title={isDark ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          {/* Vertical Divider */}
          <div className="w-px h-8 bg-slate-200 dark:bg-slate-700"></div>

          {/* User Profile Dropdown Trigger */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer group"
              title="User menu"
            >
              <UserAvatar
                src={user?.profilePic}
                gender={user?.gender}
                name={user?.name}
                className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700 group-hover:border-purple-500 transition-colors shadow-xs"
              />
              <ChevronDown
                size={14}
                className={`text-slate-400 group-hover:text-slate-600 dark:group-hover:text-slate-200 transition-transform duration-200 ${
                  isDropdownOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Dropdown Menu matching reference screenshot */}
            {isDropdownOpen && (
              <div className="absolute right-0 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-slate-200 dark:border-slate-700 py-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                {/* Username Header matching reference image */}
                <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700/60 flex items-center gap-2">
                  <span className="inline-flex items-center justify-center bg-blue-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-sm shadow-2xs">
                    ★
                  </span>
                  <span className="font-bold text-sm text-slate-800 dark:text-white truncate">
                    {user?.username || user?.email?.split("@")[0] || "user"}
                  </span>
                </div>

                {/* Dropdown Actions */}
                <div className="py-1">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      setIsProfileModalOpen(true)
                    }}
                    className="w-full px-4 py-2 text-left text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-colors flex items-center gap-2.5 cursor-pointer"
                  >
                    <UserIcon size={16} className="text-slate-400" />
                    <span>My Profile</span>
                  </button>
                </div>

                {/* Divider Line */}
                <div className="my-1 border-t border-slate-100 dark:border-slate-700/60"></div>

                {/* Centered LOGOUT Button matching screenshot */}
                <div className="p-3 pt-2">
                  <button
                    onClick={() => {
                      setIsDropdownOpen(false)
                      handleLogout()
                    }}
                    className="w-full py-2 px-4 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-700 dark:text-slate-200 font-bold text-xs uppercase tracking-wider rounded-sm transition-colors cursor-pointer text-center shadow-2xs"
                  >
                    LOGOUT
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Profile Modal */}
      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        currentUser={user}
      />
    </>
  )
}

export default Navbar