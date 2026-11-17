import { useEffect, useState } from "react"
import {
  User,
  ShieldCheck,
  UserCheck,
  Building2,
  Home,
  GraduationCap,
  Mail,
  Copy,
  Check,
  Calendar,
  X,
  Hash
} from "lucide-react"
import UserAvatar from "@/components/common/UserAvatar"

export interface UserSocietyInfo {
  societyId?: string
  societyName: string
  societyCode: string
  societyType: string
  role: string
}

export interface PlatformUserDetail {
  _id: string
  name: string
  username?: string
  email: string
  profilePic?: string
  gender?: "male" | "female"
  platformRole: "SUPER_ADMIN" | "USER"
  primaryRole: string
  isActive: boolean
  societies: UserSocietyInfo[]
  createdAt: string
}

interface UserDetailModalProps {
  user: PlatformUserDetail | null
  isOpen: boolean
  onClose: () => void
}

export default function UserDetailModal({
  user,
  isOpen,
  onClose
}: UserDetailModalProps) {
  const [copiedId, setCopiedId] = useState(false)
  const [copiedEmail, setCopiedEmail] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !user) return null

  const handleCopyId = () => {
    navigator.clipboard.writeText(user._id)
    setCopiedId(true)
    setTimeout(() => setCopiedId(false), 2000)
  }

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(user.email)
    setCopiedEmail(true)
    setTimeout(() => setCopiedEmail(false), 2000)
  }

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

  const getRoleBadge = (role: string, platformRole?: string) => {
    if (platformRole === "SUPER_ADMIN") {
      return (
        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
          <ShieldCheck size={13} /> Super Admin
        </span>
      )
    }

    switch (role?.toLowerCase()) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300">
            <UserCheck size={13} /> Society Admin
          </span>
        )
      case "staff":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-300">
            <User size={13} /> Staff / Tech
          </span>
        )
      case "member":
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
            <User size={13} /> Member
          </span>
        )
      default:
        return (
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300">
            <User size={13} /> Resident
          </span>
        )
    }
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150"
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

        {/* User Profile Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <UserAvatar
            src={user.profilePic}
            gender={user.gender}
            name={user.name}
            className="w-14 h-14 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-md shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">
                {user.name}
              </h3>
              {user.username && (
                <span className="text-sm font-mono text-purple-600 dark:text-purple-400 font-semibold">
                  @{user.username}
                </span>
              )}
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  user.isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                }`}
              >
                {user.isActive ? "Active" : "Suspended"}
              </span>
            </div>

            <div className="flex items-center gap-2 mt-2 flex-wrap">
              {getRoleBadge(user.primaryRole, user.platformRole)}
              {user.platformRole !== "SUPER_ADMIN" && (
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Platform User
                </span>
              )}
            </div>
          </div>
        </div>

        {/* User Details Grid */}
        <div className="space-y-4 mb-6">
          {/* Email Info Card */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Email Address
              </p>
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 mt-0.5 truncate">
                {user.email}
              </p>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={`mailto:${user.email}`}
                className="p-1.5 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700"
                title="Send Email"
              >
                <Mail size={15} />
              </a>
              <button
                onClick={handleCopyEmail}
                className="p-1.5 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-white dark:hover:bg-slate-800 rounded-md transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 cursor-pointer"
                title="Copy Email"
              >
                {copiedEmail ? <Check size={15} className="text-emerald-500" /> : <Copy size={15} />}
              </button>
            </div>
          </div>

          {/* User ID Card */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <div className="min-w-0 pr-2">
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <Hash size={12} /> User Identifier
              </p>
              <p className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300 mt-0.5 truncate">
                {user._id}
              </p>
            </div>
            <button
              onClick={handleCopyId}
              className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-600 dark:text-slate-300 bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors border border-slate-200 dark:border-slate-700 cursor-pointer"
            >
              {copiedId ? (
                <>
                  <Check size={13} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={13} />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>

          {/* Joined Date */}
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 px-1">
            <Calendar size={14} />
            <span>
              Member since {new Date(user.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
            </span>
          </div>

          {/* Associated Organizations */}
          <div className="pt-2">
            <div className="flex items-center justify-between mb-2.5">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Affiliated Organizations ({user.societies?.length || 0})
              </h4>
            </div>

            {!user.societies || user.societies.length === 0 ? (
              <div className="p-4 bg-slate-50 dark:bg-slate-900/30 rounded-lg text-center border border-slate-100 dark:border-slate-800">
                <p className="text-xs text-slate-400">This user is not currently affiliated with any organization.</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {user.societies.map((soc, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg border border-slate-100 dark:border-slate-700/50 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-white dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700">
                        {getTypeIcon(soc.societyType)}
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                          {soc.societyName}
                        </p>
                        <p className="text-[11px] font-mono text-slate-400">
                          Code: {soc.societyCode}
                        </p>
                      </div>
                    </div>

                    <div className="shrink-0 text-right">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-sm bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
                        {soc.role || "Member"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-bold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-md transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
