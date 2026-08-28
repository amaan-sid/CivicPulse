import { useState } from "react"
import API from "@/services/api"
import { useDispatch } from "react-redux"
import { setUser } from "@/features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import { Building2, ArrowRight, Eye, EyeOff } from "lucide-react"

function Login() {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [showPassword,setShowPassword] = useState(false)
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const handleLogin = async (e:React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await API.post("/auth/login",{ email, password })
      const user = res.data.user
      dispatch(setUser(user))

      if (user.platformRole === "SUPER_ADMIN") {
        navigate("/super-admin")
      } else if (!user.memberships || user.memberships.length === 0) {
        navigate("/join-society")
      } else {
        navigate("/dashboard")
      }
    } catch (err:any) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-slate-50 dark:bg-slate-950 font-sans">
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 sm:p-12">
        <div className="w-full max-w-md">
          <div className="flex items-center gap-3 mb-10 text-slate-800 dark:text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-sky-500/30">
              C
            </div>
            <h2 className="text-2xl font-bold tracking-tight">CivicPulse</h2>
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">Welcome back</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">Enter your details to access your community dashboard.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            {error && (
              <div className="bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 p-3 rounded-lg text-sm font-medium border border-rose-200 dark:border-rose-500/20">
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Email</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white dark:bg-slate-800 shadow-sm"
                onChange={(e)=>setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full border border-slate-300 dark:border-slate-700 rounded-xl pl-4 pr-11 py-3 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/50 focus:border-sky-500 transition-colors bg-white dark:bg-slate-800 shadow-sm"
                  onChange={(e)=>setPassword(e.target.value)}
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

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-slate-900 dark:bg-sky-600 text-white font-medium py-3 rounded-xl hover:bg-slate-800 dark:hover:bg-sky-500 transition-all shadow-lg shadow-slate-900/20 dark:shadow-sky-600/20 flex items-center justify-center gap-2 group disabled:opacity-70 mt-2 cursor-pointer"
            >
              {loading ? "Signing in..." : (
                <>Sign in <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" /></>
              )}
            </button>
          </form>

          <p className="text-center mt-8 text-sm text-slate-500 dark:text-slate-400">
            Don't have an account?{" "}
            <button onClick={()=>navigate("/signup")} className="text-sky-600 dark:text-sky-400 font-semibold hover:text-sky-700 dark:hover:text-sky-300 transition-colors cursor-pointer">
              Sign up
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-slate-900 p-12 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-gradient-to-br from-sky-600/20 to-blue-900/40 z-0"></div>
        <div className="absolute -top-[20%] -right-[10%] w-[70%] h-[70%] rounded-full bg-sky-500/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[100px]"></div>
        
        <div className="relative z-10 max-w-lg text-center">
          <div className="w-20 h-20 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-2xl">
            <Building2 size={40} className="text-sky-400" />
          </div>
          <h2 className="text-4xl font-bold text-white mb-6 leading-tight">Elevate your community living experience.</h2>
          <p className="text-lg text-slate-300 leading-relaxed">
            CivicPulse helps modern residential societies seamlessly manage issues, track SLAs, and build a more connected community.
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login