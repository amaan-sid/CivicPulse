import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import API from "@/services/api"
import { setUser } from "@/features/auth/authSlice"
import {
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  ArrowLeft,
  Camera,
  Trash2
} from "lucide-react"
import { getDefaultAvatar } from "@/components/common/UserAvatar"

function AuthPage() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()

  // Determine initial mode from URL (default to login if /login, signup if /signup)
  const [isSignup, setIsSignup] = useState(() => location.pathname === "/signup")

  // Theme state
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return false
  })

  // Common Form States
  const [name, setName] = useState("")
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [gender, setGender] = useState<"male" | "female">("male")
  const [profilePic, setProfilePic] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Sync mode with route changes if user clicks browser back/forward
  useEffect(() => {
    if (location.pathname === "/signup") {
      setIsSignup(true)
    } else if (location.pathname === "/login") {
      setIsSignup(false)
    }
    setError("")
  }, [location.pathname])

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

  const handleTabChange = (signupMode: boolean) => {
    setIsSignup(signupMode)
    setError("")
    navigate(signupMode ? "/signup" : "/login", { replace: true })
  }

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 2 * 1024 * 1024) {
      setError("Profile picture size must be less than 2MB")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isSignup && (!username || !username.trim())) {
      setError("Username is required")
      return
    }

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      if (isSignup) {
        // Sign Up API call
        const res = await API.post("/auth/signup", { 
          name, 
          username: username.trim(), 
          email, 
          password,
          profilePic,
          gender
        })
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
        }
        const user = res.data.user
        dispatch(setUser(user))

        if (user.platformRole === "SUPER_ADMIN") {
          navigate("/super-admin")
        } else {
          navigate("/managesociety")
        }
      } else {
        // Login API call (supports email or username)
        const res = await API.post("/auth/login", { identifier: email, password })
        if (res.data.token) {
          localStorage.setItem("token", res.data.token)
        }
        const user = res.data.user
        dispatch(setUser(user))

        if (user.platformRole === "SUPER_ADMIN") {
          navigate("/super-admin")
        } else {
          navigate("/managesociety")
        }
      }
    } catch (err: any) {
      console.error(err)
      setError(err.response?.data?.message || (isSignup ? "Signup failed" : "Login failed"))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {/* TOP HEADER */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/landing")}>
          <div className="w-10 h-10 rounded-md bg-sky-600 flex items-center justify-center font-bold text-xl text-white shadow-sm">
            C
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            CivicPulse
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/landing")}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 px-3.5 py-2 rounded-md bg-slate-100 dark:bg-slate-800 transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-6 w-full flex-grow flex flex-col justify-center">
        {/* AUTH FORM CARD WITH TAB TOGGLE */}
        <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 rounded-md p-8 shadow-sm">
          {/* TAB SWITCHER */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-md mb-8">
            <button
              type="button"
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all cursor-pointer ${
                !isSignup
                  ? "bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => handleTabChange(true)}
              className={`flex-1 py-2.5 rounded-md text-sm font-bold transition-all cursor-pointer ${
                isSignup
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200"
              }`}
            >
              Create Account
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
              {isSignup ? "Create an account" : "Welcome back"}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {isSignup
                ? "Join CivicPulse in seconds to manage your community."
                : "Enter your credentials to access your dashboard."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3 rounded-md text-xs font-semibold">
                {error}
              </div>
            )}

            {/* PROFILE PHOTO & GENDER (ONLY ON SIGNUP) */}
            {isSignup && (
              <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-md border border-slate-100 dark:border-slate-800 space-y-3">
                <div className="flex items-center gap-4">
                  <div className="relative group">
                    <img
                      src={profilePic || getDefaultAvatar(gender)}
                      alt="Avatar Preview"
                      className="w-16 h-16 rounded-full object-cover border-2 border-sky-500/30 shadow-xs"
                    />
                    <label
                      htmlFor="signup-avatar-input"
                      className="absolute bottom-0 right-0 bg-sky-600 text-white p-1 rounded-full cursor-pointer hover:bg-sky-700 transition-colors shadow-sm"
                      title="Upload profile photo"
                    >
                      <Camera size={12} />
                    </label>
                    <input
                      id="signup-avatar-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="hidden"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Profile Photo <span className="text-slate-400 text-[10px] font-normal">(Optional)</span>
                      </span>
                      {profilePic && (
                        <button
                          type="button"
                          onClick={() => setProfilePic("")}
                          className="text-[11px] text-rose-500 hover:text-rose-600 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 size={11} /> Reset
                        </button>
                      )}
                    </div>
                    <label
                      htmlFor="signup-avatar-input"
                      className="mt-1 inline-block text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                    >
                      {profilePic ? "Change Photo" : "Upload Custom Photo"}
                    </label>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500">
                      Default {gender} avatar used if none uploaded. Max 2MB.
                    </p>
                  </div>
                </div>

                {/* GENDER SELECTOR */}
                <div className="pt-2 border-t border-slate-200/60 dark:border-slate-700/60">
                  <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                    Gender
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender("male")}
                      className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        gender === "male"
                          ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      👨 Male (Default)
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender("female")}
                      className={`py-2 px-3 rounded-md text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border ${
                        gender === "female"
                          ? "bg-pink-600 text-white border-pink-600 shadow-sm"
                          : "bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/50"
                      }`}
                    >
                      👩 Female
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FULL NAME (ONLY ON SIGNUP) */}
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-md px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm"
                  required
                />
              </div>
            )}

            {/* USERNAME (ONLY ON SIGNUP) */}
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Username
                </label>
                <input
                  type="text"
                  placeholder="johndoe"
                  value={username}
                  onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ""))}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-md px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm font-mono"
                  required
                />
              </div>
            )}

            {/* EMAIL OR USERNAME */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                {isSignup ? "Email Address" : "Email Address or Username"}
              </label>
              <input
                type={isSignup ? "email" : "text"}
                placeholder={isSignup ? "you@example.com" : "you@example.com or username"}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-800 rounded-md px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm"
                required
              />
            </div>

            {/* PASSWORD */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800 rounded-md pl-4 pr-11 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer focus:outline-none p-1"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD (ONLY ON SIGNUP) */}
            {isSignup && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-800 rounded-md pl-4 pr-11 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 outline-none text-sm"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 cursor-pointer focus:outline-none p-1"
                    title={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            )}

            {/* SUBMIT BUTTON */}
            <button
              type="submit"
              disabled={loading}
              className="w-full font-bold py-3.5 rounded-md transition-all shadow-sm flex items-center justify-center gap-2 group disabled:opacity-70 mt-4 cursor-pointer text-sm text-white bg-sky-600 hover:bg-sky-500"
            >
              {loading ? (
                <span>{isSignup ? "Creating account..." : "Signing in..."}</span>
              ) : (
                <>
                  <span>{isSignup ? "Create Account" : "Sign In"}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* TOGGLE FOOTER */}
          <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
            {isSignup ? (
              <p>
                Already have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabChange(false)}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  Sign in instead
                </button>
              </p>
            ) : (
              <p>
                Don't have an account?{" "}
                <button
                  type="button"
                  onClick={() => handleTabChange(true)}
                  className="font-bold text-sky-600 dark:text-sky-400 hover:underline cursor-pointer"
                >
                  Create an account
                </button>
              </p>
            )}
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400">
        &copy; {new Date().getFullYear()} CivicPulse &bull; Intelligent Community Governance Platform
      </footer>
    </div>
  )
}

export default AuthPage
