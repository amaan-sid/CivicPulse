import { useEffect, useState } from "react"
import {
  Building2,
  Home,
  GraduationCap,
  MapPin,
  Power,
  X,
  Copy,
  Check,
  Calendar,
  Shield,
  ArrowRight,
  Mail
} from "lucide-react"
import UserAvatar from "@/components/common/UserAvatar"

export interface OrganizationDetail {
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

interface OrganizationDetailModalProps {
  org: OrganizationDetail | null
  isOpen: boolean
  onClose: () => void
  onToggleStatus?: (id: string, currentStatus: boolean) => Promise<void> | void
  onViewIssues?: (org: OrganizationDetail) => void
}

export default function OrganizationDetailModal({
  org,
  isOpen,
  onClose,
  onToggleStatus,
  onViewIssues
}: OrganizationDetailModalProps) {
  const [copiedCode, setCopiedCode] = useState(false)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !org) return null

  const handleCopyCode = () => {
    navigator.clipboard.writeText(org.code)
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  const handleToggle = async () => {
    if (!onToggleStatus) return
    setIsToggling(true)
    try {
      await onToggleStatus(org._id, org.isActive)
    } finally {
      setIsToggling(false)
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "HOSTEL":
        return <Home size={18} className="text-amber-500" />
      case "CAMPUS":
        return <GraduationCap size={18} className="text-purple-500" />
      default:
        return <Building2 size={18} className="text-sky-500" />
    }
  }

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "HOSTEL":
        return "Hostel"
      case "CAMPUS":
        return "Campus"
      default:
        return "Housing Society"
    }
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-lg p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150"
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

        {/* Modal Header */}
        <div className="flex items-start gap-4 mb-6 pr-8">
          <div className="w-13 h-13 rounded-xl bg-slate-100 dark:bg-slate-700/60 flex items-center justify-center shrink-0 border border-slate-200/60 dark:border-slate-600/40">
            {getTypeIcon(org.type)}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white truncate">
                {org.name}
              </h3>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  org.isActive
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-400"
                    : "bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400"
                }`}
              >
                {org.isActive ? "Active" : "Suspended"}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1.5 text-xs text-slate-500 dark:text-slate-400">
              <span className="capitalize font-semibold text-slate-700 dark:text-slate-300">
                {getTypeLabel(org.type)}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin size={13} className="text-slate-400" />
                {org.city}, {org.state}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3.5 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
              Units / Flats
            </p>
            <p className="text-xl font-bold text-slate-800 dark:text-white">
              {org.totalFlats}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3.5 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
              Total Members
            </p>
            <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
              {org.memberCount}
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900/60 rounded-lg p-3.5 border border-slate-100 dark:border-slate-800 text-center">
            <p className="text-xs text-slate-400 dark:text-slate-500 font-medium uppercase tracking-wider mb-1">
              Reported Issues
            </p>
            <p className="text-xl font-bold text-amber-600 dark:text-amber-400">
              {org.issueCount}
            </p>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="space-y-4 mb-6">
          {/* Organization Code */}
          <div className="flex items-center justify-between p-3.5 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <div>
              <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                Registration / Invite Code
              </p>
              <p className="font-mono text-sm font-bold text-slate-800 dark:text-slate-200 mt-0.5">
                {org.code}
              </p>
            </div>
            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-2xs"
            >
              {copiedCode ? (
                <>
                  <Check size={14} className="text-emerald-500" />
                  <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy Code</span>
                </>
              )}
            </button>
          </div>

          {/* Location Details */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <MapPin size={14} className="text-sky-500" /> Full Address
            </p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {org.address || "No address provided"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {org.city}, {org.state}
            </p>
          </div>

          {/* Primary Admin */}
          <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-lg border border-slate-100 dark:border-slate-700/50">
            <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Shield size={14} className="text-purple-500" /> Primary Admin
            </p>
            {org.admin ? (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <UserAvatar
                    src={org.admin.profilePic}
                    gender={org.admin.gender}
                    name={org.admin.name}
                    className="w-10 h-10 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm"
                  />
                  <div>
                    <p className="font-bold text-sm text-slate-800 dark:text-slate-200">
                      {org.admin.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {org.admin.email}
                    </p>
                  </div>
                </div>
                <a
                  href={`mailto:${org.admin.email}`}
                  className="p-2 text-slate-500 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-500/10 rounded-md transition-colors"
                  title="Send Email"
                >
                  <Mail size={16} />
                </a>
              </div>
            ) : (
              <p className="text-xs text-slate-400 italic">No admin assigned yet</p>
            )}
          </div>

          {/* Created Date */}
          <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-slate-500 px-1">
            <Calendar size={14} />
            <span>Registered on {new Date(org.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-3">
          {onToggleStatus && (
            <button
              onClick={handleToggle}
              disabled={isToggling}
              className={`flex items-center gap-2 px-4 py-2 rounded-md text-xs font-bold transition-all cursor-pointer w-full sm:w-auto justify-center ${
                org.isActive
                  ? "bg-amber-50 text-amber-700 hover:bg-amber-100 dark:bg-amber-500/10 dark:text-amber-400 dark:hover:bg-amber-500/20 border border-amber-200/60 dark:border-amber-500/20"
                  : "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-400 dark:hover:bg-emerald-500/20 border border-emerald-200/60 dark:border-emerald-500/20"
              }`}
            >
              <Power size={15} />
              {isToggling
                ? "Updating..."
                : org.isActive
                ? "Suspend Organization"
                : "Activate Organization"}
            </button>
          )}

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {onViewIssues && (
              <button
                onClick={() => {
                  onClose()
                  onViewIssues(org)
                }}
                className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold px-4 py-2 rounded-md shadow-sm transition-all cursor-pointer w-full sm:w-auto justify-center"
              >
                <span>View Issues</span>
                <ArrowRight size={14} />
              </button>
            )}

            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-md transition-colors cursor-pointer w-full sm:w-auto justify-center"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
