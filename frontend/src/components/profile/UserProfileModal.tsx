import { useEffect, useState, useRef } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "@/features/auth/authSlice"
import API from "@/services/api"
import toast from "react-hot-toast"
import {
  X,
  User as UserIcon,
  Mail,
  AtSign,
  Camera,
  Lock,
  Eye,
  EyeOff,
  Check,
  KeyRound,
  Trash2,
  Upload
} from "lucide-react"
import type { User } from "@/types/user"
import type { RootState } from "@/app/store"
import { getDefaultAvatar } from "@/components/common/UserAvatar"

interface UserProfileModalProps {
  isOpen: boolean
  onClose: () => void
  currentUser?: User | null
}

export default function UserProfileModal({ isOpen, onClose, currentUser: propUser }: UserProfileModalProps) {
  const dispatch = useDispatch()
  const reduxUser = useSelector((state: RootState) => state.auth.user)
  const currentUser = propUser || reduxUser
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Profile fields
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [profilePic, setProfilePic] = useState("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [isSavingProfile, setIsSavingProfile] = useState(false)

  // Password fields
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)

  // Initialize fields when modal opens or user changes
  useEffect(() => {
    if (currentUser) {
      setName(currentUser.name || "")
      setUsername(currentUser.username || "")
      setEmail(currentUser.email || "")
      setProfilePic(currentUser.profilePic || "")
      setGender(currentUser.gender || "male")
    }
  }, [currentUser, isOpen])

  // Escape key handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        onClose()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen, onClose])

  if (!isOpen || !currentUser) return null

  // Handle image upload from disk
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      toast.error("Image size must be less than 2MB")
      return
    }

    const reader = new FileReader()
    reader.onloadend = () => {
      if (typeof reader.result === "string") {
        setProfilePic(reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  // Save profile information
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error("Name cannot be empty")
      return
    }

    const cleanedUsername = username.trim().toLowerCase().replace(/[^a-z0-9_]/g, "")
    if (!cleanedUsername) {
      toast.error("Username cannot be empty")
      return
    }

    setIsSavingProfile(true)
    try {
      const res = await API.put("/users/profile", {
        name: name.trim(),
        username: cleanedUsername,
        profilePic,
        gender
      })

      if (res.data.user) {
        dispatch(setUser(res.data.user))
      }
      toast.success("Profile updated successfully")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update profile")
    } finally {
      setIsSavingProfile(false)
    }
  }

  // Change password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentPassword) {
      toast.error("Please enter your current password")
      return
    }

    if (!newPassword || newPassword.length < 6) {
      toast.error("New password must be at least 6 characters long")
      return
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    setIsChangingPassword(true)
    try {
      await API.put("/users/change-password", {
        currentPassword,
        newPassword
      })

      toast.success("Password changed successfully")
      setCurrentPassword("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to change password")
    } finally {
      setIsChangingPassword(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-800 rounded-2xl p-6 sm:p-8 max-w-xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto border border-slate-100 dark:border-slate-700 animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
          title="Close Modal"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white">
            User Profile
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage your personal profile details, avatar, and security credentials.
          </p>
        </div>

        {/* Profile Picture Section */}
        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 mb-6 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700/60">
          <div className="relative group">
            <div className="w-20 h-20 rounded-full overflow-hidden flex items-center justify-center shadow-md border-2 border-white dark:border-slate-800">
              <img
                src={profilePic || getDefaultAvatar(gender)}
                alt={name || "User Avatar"}
                className="w-full h-full object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 p-1.5 rounded-full bg-purple-600 hover:bg-purple-700 text-white shadow-md transition-transform group-hover:scale-110 cursor-pointer"
              title="Upload Profile Picture"
            >
              <Camera size={14} />
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageFileChange}
            />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <p className="text-sm font-bold text-slate-800 dark:text-white">
              Profile Photo
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              JPG, PNG or GIF. Max size 2MB.
            </p>
            <div className="flex items-center justify-center sm:justify-start gap-2 mt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-semibold bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/80 transition-colors cursor-pointer"
              >
                <Upload size={13} />
                <span>Upload</span>
              </button>
              {profilePic && (
                <button
                  type="button"
                  onClick={() => setProfilePic("")}
                  className="flex items-center gap-1 px-3 py-1 rounded-md text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-500/10 transition-colors cursor-pointer"
                >
                  <Trash2 size={13} />
                  <span>Remove</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Profile Info Form */}
        <form onSubmit={handleSaveProfile} className="space-y-4 mb-8">
          <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-700">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              Basic Information
            </h3>
            {currentUser.platformRole === "SUPER_ADMIN" ? (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-500/20 text-purple-700 dark:text-purple-300">
                Super Admin
              </span>
            ) : (
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-500/20 text-sky-700 dark:text-sky-300 capitalize">
                {currentUser.role || "Resident"}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <UserIcon
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your Name"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 outline-none text-slate-800 dark:text-slate-200 transition-colors"
                  required
                />
              </div>
            </div>

            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Username <span className="text-purple-500 font-normal">(Unique)</span>
              </label>
              <div className="relative">
                <AtSign
                  size={16}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500"
                />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  placeholder="username"
                  className="w-full pl-9 pr-3 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 outline-none text-slate-800 dark:text-slate-200 transition-colors font-mono"
                  required
                />
              </div>
            </div>
          </div>

          {/* Email (Read-only) */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Email Address <span className="text-slate-400 font-normal">(Primary Account Identifier)</span>
            </label>
            <div className="relative">
              <Mail
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="email"
                value={email}
                disabled
                className="w-full pl-9 pr-3 py-2 bg-slate-100 dark:bg-slate-900/90 rounded-lg text-sm border border-slate-200/80 dark:border-slate-700 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
          </div>

          {/* Gender Selector */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Gender <span className="text-slate-400 font-normal">(Used for default avatar)</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setGender("male")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  gender === "male"
                    ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
                Male
              </button>
              <button
                type="button"
                onClick={() => setGender("female")}
                className={`py-2 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                  gender === "female"
                    ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                    : "bg-slate-50 dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                }`}
              >
              Female
              </button>
            </div>
          </div>

          <div className="flex justify-end pt-1">
            <button
              type="submit"
              disabled={isSavingProfile}
              className="flex items-center gap-1.5 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-xs font-bold shadow-sm transition-colors cursor-pointer disabled:opacity-70"
            >
              <Check size={14} />
              <span>{isSavingProfile ? "Saving..." : "Save Profile Changes"}</span>
            </button>
          </div>
        </form>

        {/* Change Password Section */}
        <div className="pt-4 border-t border-slate-100 dark:border-slate-700">
          <div className="flex items-center gap-2 mb-4">
            <div className="p-1 rounded-md bg-amber-100 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400">
              <KeyRound size={16} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 dark:text-white">
              Change Password
            </h3>
          </div>

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            {/* Current Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Current Password
              </label>
              <div className="relative">
                <Lock
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type={showCurrentPassword ? "text" : "password"}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 outline-none text-slate-800 dark:text-slate-200 transition-colors"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  {showCurrentPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showNewPassword ? "text" : "password"}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Min 6 characters"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 outline-none text-slate-800 dark:text-slate-200 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <Lock
                    size={15}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                    className="w-full pl-9 pr-10 py-2 bg-slate-50 dark:bg-slate-900/60 rounded-lg text-sm border border-slate-200 dark:border-slate-700 focus:border-purple-500 dark:focus:border-purple-500 outline-none text-slate-800 dark:text-slate-200 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                disabled={isChangingPassword}
                className="flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer disabled:opacity-70"
              >
                <KeyRound size={14} />
                <span>{isChangingPassword ? "Updating..." : "Update Password"}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
