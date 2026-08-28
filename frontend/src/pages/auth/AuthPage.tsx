import { useState, useEffect } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import API from "@/services/api"
import { setUser } from "@/features/auth/authSlice"
import {
  Building2,
  ArrowRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Zap,
  ShieldCheck,
  Clock,
  Sparkles,
  ArrowLeft,
  CheckCircle2
} from "lucide-react"

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
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (isSignup && password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    try {
      if (isSignup) {
        // Sign Up API call
        const res = await API.post("/auth/signup", { name, email, password })
        const user = res.data.user
        dispatch(setUser(user))

        if (user.platformRole === "SUPER_ADMIN") {
          navigate("/super-admin")
        } else {
          navigate("/managesociety")
        }
      } else {
        // Login API call
        const res = await API.post("/auth/login", { email, password })
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
      {/* Background ambient lighting */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/15 dark:bg-sky-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/2 -right-40 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
      </div>

      {/* TOP HEADER */}
      <header className="relative z-10 w-full max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-sky-500/30">
            C
          </div>
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-sky-700 dark:from-white dark:via-slate-200 dark:to-sky-400 bg-clip-text text-transparent">
            CivicPulse
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm transition-all cursor-pointer"
          >
            <ArrowLeft size={14} />
            <span>Home</span>
          </button>

          <button
            onClick={toggleDarkMode}
            className="p-2.5 rounded-xl bg-white/60 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all cursor-pointer"
            title="Toggle Theme"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 py-6 w-full flex-grow flex flex-col justify-center">
        {/* AUTH FORM CARD WITH TAB TOGGLE */}
        <div className="max-w-md mx-auto w-full bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl">
          {/* TAB SWITCHER */}
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => handleTabChange(false)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
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
              <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3 rounded-xl text-xs font-semibold border border-rose-200 dark:border-rose-500/20">
                {error}
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
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white dark:bg-slate-800 shadow-sm text-sm"
                  required
                />
              </div>
            )}

            {/* EMAIL */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Email Address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white dark:bg-slate-800 shadow-sm text-sm"
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
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-11 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white dark:bg-slate-800 shadow-sm text-sm"
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
                    className="w-full border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-11 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white dark:bg-slate-800 shadow-sm text-sm"
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
              className={`w-full font-bold py-3.5 rounded-xl transition-all shadow-lg flex items-center justify-center gap-2 group disabled:opacity-70 mt-4 cursor-pointer text-sm text-white ${
                isSignup
                  ? "bg-sky-600 hover:bg-sky-500 shadow-sky-600/25"
                  : "bg-slate-900 dark:bg-sky-600 hover:bg-slate-800 dark:hover:bg-sky-500 shadow-slate-900/20 dark:shadow-sky-600/20"
              }`}
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
      <footer className="relative z-10 py-4 px-6 text-center text-xs text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800/80">
        &copy; {new Date().getFullYear()} CivicPulse &bull; Intelligent Community Governance Platform
      </footer>
    </div>
  )
}

export default AuthPage
