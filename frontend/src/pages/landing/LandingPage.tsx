import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  ShieldCheck,
  Zap,
  Users,
  Clock,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  BarChart3,
  Moon,
  Sun,
  Sparkles,
  LogIn,
  UserPlus
} from "lucide-react"

function LandingPage() {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState<"residents" | "admins" | "superadmin">("residents")
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return false
  })

  // Simulated countdown for live interactive SLA hero card demo
  const [timeLeft, setTimeLeft] = useState(14320) // 03h 58m 40s in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 14400))
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600)
    const mins = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    return `${hrs.toString().padStart(2, "0")}h ${mins.toString().padStart(2, "0")}m ${secs.toString().padStart(2, "0")}s`
  }

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

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-sky-500 selection:text-white">
      {/* Dynamic Background Glow Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-sky-500/15 dark:bg-sky-500/20 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute top-1/3 -right-40 w-96 h-96 bg-purple-500/15 dark:bg-purple-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "2s" }} />
        <div className="absolute -bottom-40 left-1/3 w-96 h-96 bg-blue-500/15 dark:bg-blue-500/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "4s" }} />
      </div>

      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/75 dark:bg-slate-900/80 border-b border-slate-200/80 dark:border-slate-800 transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center font-bold text-xl text-white shadow-lg shadow-sky-500/30">
              C
            </div>
            <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-sky-700 dark:from-white dark:via-slate-200 dark:to-sky-400 bg-clip-text text-transparent">
              CivicPulse
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a href="#features" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Features
            </a>
            <a href="#how-it-works" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              How it Works
            </a>
            <a href="#roles" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Roles & Support
            </a>
            <a href="#stats" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">
              Impact
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all cursor-pointer"
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer bg-white/50 dark:bg-slate-800/50"
            >
              <LogIn size={16} />
              Sign in
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 px-5 py-2.5 rounded-xl shadow-lg shadow-sky-600/25 transition-all cursor-pointer hover:shadow-sky-600/40"
            >
              <UserPlus size={16} />
              Sign up
            </button>
          </div>
        </div>
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-16 pb-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-sky-100/80 dark:bg-sky-500/10 border border-sky-200 dark:border-sky-500/20 text-sky-700 dark:text-sky-400 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles size={14} className="text-sky-500 animate-spin-slow" />
                <span>Next-Gen Community Governance & SLA Tracking</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.15] text-slate-900 dark:text-white">
                Resolve Community Issues{" "}
                <span className="bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Before They Escalate.
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                CivicPulse empowers residential societies, hostels, and university campuses with automated SLA enforcement, real-time ticket tracking, and multi-tier admin workflows.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-3 text-base font-bold text-white bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-500 hover:to-blue-500 px-7 py-4 rounded-2xl shadow-xl shadow-sky-600/30 hover:shadow-sky-600/50 transition-all cursor-pointer group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 px-6 py-4 rounded-2xl shadow-sm hover:shadow transition-all cursor-pointer"
                >
                  <LogIn size={18} className="text-sky-500" />
                  <span>Existing User Login</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 flex flex-wrap items-center gap-6 text-xs font-semibold text-slate-500 dark:text-slate-400 border-t border-slate-200/60 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Automatic SLA Breach Detection</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Super Admin Single-Owner Security</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Societies, Hostels & Campuses</span>
                </div>
              </div>
            </div>

            {/* Right Side Live Interactive Ticket Mockup */}
            <div className="lg:col-span-5 relative">
              <div className="absolute -inset-1 rounded-3xl bg-gradient-to-r from-sky-500 via-blue-600 to-purple-600 opacity-30 blur-xl animate-pulse-glow" />

              <div className="relative bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-6 shadow-2xl space-y-5 animate-float">
                {/* Header of Mock Card */}
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold">
                      <Zap size={20} />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Ticket #CP-8921</p>
                      <h4 className="text-sm font-bold text-slate-800 dark:text-white">Main Water Line Pressure Drop</h4>
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-500/10 text-sky-600 dark:text-sky-400 border border-sky-500/20">
                    IN PROGRESS
                  </span>
                </div>

                {/* SLA Clock Box */}
                <div className="bg-slate-900 text-white rounded-2xl p-4 flex items-center justify-between shadow-inner">
                  <div className="flex items-center gap-3">
                    <Clock className="text-sky-400 animate-spin-slow" size={24} />
                    <div>
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">SLA Target Remaining</p>
                      <p className="text-lg font-mono font-bold text-sky-400">{formatTime(timeLeft)}</p>
                    </div>
                  </div>
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    On Schedule
                  </span>
                </div>

                {/* Info Fields */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 mb-0.5">Assigned To</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">Maintenance Admin</p>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                    <p className="text-slate-400 mb-0.5">Location</p>
                    <p className="font-bold text-slate-700 dark:text-slate-200">Block B &bull; Flat 402</p>
                  </div>
                </div>

                {/* Progress Steps */}
                <div className="space-y-2 pt-2">
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Issue Logged by Resident</span>
                    <span className="ml-auto text-slate-400 text-[10px]">10:15 AM</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                    <span className="text-slate-600 dark:text-slate-300 font-medium">Assigned to Plumber Team</span>
                    <span className="ml-auto text-slate-400 text-[10px]">10:22 AM</span>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <div className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-500 border border-amber-500 flex items-center justify-center text-[10px] font-bold">●</div>
                    <span className="text-slate-800 dark:text-white font-bold">Technician On-Site Inspection</span>
                    <span className="ml-auto text-amber-500 text-[10px] font-bold">Just Now</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & IMPACT BAR */}
        <section id="stats" className="py-12 bg-white/60 dark:bg-slate-900/60 border-y border-slate-200/80 dark:border-slate-800 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-sky-600 dark:text-sky-400 tracking-tight">99.4%</p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">SLA Resolution Rate</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">100+</p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">Issues Resolved</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">10+</p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">Communities Managed</p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">&lt; 24 hrs</p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">Avg Resolution Speed</p>
            </div>
          </div>
        </section>

        {/* PLATFORM FEATURES */}
        <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Comprehensive Platform Capabilities
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Everything Needed for Seamless Community Governance
            </h3>
            <p className="text-slate-600 dark:text-slate-300">
              Designed to end forgotten complaints, delayed maintenance, and uncoordinated management.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 hover:border-sky-500/50 transition-all shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Clock size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Automated SLA Engine</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Set custom resolution timers per issue priority. Automatic warning triggers before deadlines breach.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 hover:border-blue-500/50 transition-all shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <AlertTriangle size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Instant Escalations</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                If an issue breaches its SLA, it automatically flags to high-tier admins and Super Admins for intervention.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 hover:border-purple-500/50 transition-all shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Building2 size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Multi-Organization Support</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Tailored workflows for Housing Societies, Student Hostels, and Educational Campuses.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 hover:border-emerald-500/50 transition-all shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Single Super Admin Security</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Platform-wide control governed by strict single Super Admin policy with seamless transfer capabilities.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 hover:border-amber-500/50 transition-all shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Real-Time Analytics</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Visual dashboard metrics detailing open issues, breach distribution, and active organization counts.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 hover:border-rose-500/50 transition-all shadow-sm hover:shadow-xl group">
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Users size={28} />
              </div>
              <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Resident Transparency</h4>
              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                Residents track live progress, view flat assignments, and receive resolution updates in real time.
              </p>
            </div>
          </div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <section id="how-it-works" className="py-20 px-6 bg-slate-100/60 dark:bg-slate-900/40 border-y border-slate-200/80 dark:border-slate-800">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                Simple & Transparent Workflow
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                How CivicPulse Resolves Issues
              </h3>
            </div>

            <div className="grid md:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 relative">
                <span className="w-9 h-9 rounded-xl bg-sky-500 text-white font-bold flex items-center justify-center text-sm mb-4">1</span>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Log Issue</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Residents report issues with category, priority level, and detailed descriptions.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 relative">
                <span className="w-9 h-9 rounded-xl bg-blue-500 text-white font-bold flex items-center justify-center text-sm mb-4">2</span>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Auto SLA Assignment</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  System calculates SLA deadline and notifies responsible community admins.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 relative">
                <span className="w-9 h-9 rounded-xl bg-purple-500 text-white font-bold flex items-center justify-center text-sm mb-4">3</span>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Live Progress</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Technicians update status with timestamped logs and resolution steps.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800 relative">
                <span className="w-9 h-9 rounded-xl bg-emerald-500 text-white font-bold flex items-center justify-center text-sm mb-4">4</span>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2">Resolved & Verified</h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Resident confirms fix and issue closes cleanly with SLA audit log preserved.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ROLE SHOWCASE INTERACTIVE TABS */}
        <section id="roles" className="py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Tailored Experiences
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for Every Stakeholder
            </h3>
          </div>

          <div className="flex justify-center gap-3 mb-10">
            <button
              onClick={() => setActiveTab("residents")}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "residents"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Residents & Members
            </button>
            <button
              onClick={() => setActiveTab("admins")}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "admins"
                  ? "bg-sky-600 text-white shadow-lg shadow-sky-600/30"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Society & Campus Admins
            </button>
            <button
              onClick={() => setActiveTab("superadmin")}
              className={`px-5 py-3 rounded-xl font-bold text-sm transition-all cursor-pointer ${
                activeTab === "superadmin"
                  ? "bg-purple-600 text-white shadow-lg shadow-purple-600/30"
                  : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
              }`}
            >
              Super Admin Control
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-xl">
            {activeTab === "residents" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-400">
                    For Residents
                  </span>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Seamless Complaint Logging & Live Tracking</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    No more endless WhatsApp groups or unrecorded phone calls. Residents easily join their society code, report maintenance problems, and monitor SLA status transparently.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-sky-500" /> Fast society joining via unique invite code</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-sky-500" /> Live SLA countdown timer on every ticket</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-sky-500" /> Flat-level tracking & resident notifications</li>
                  </ul>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">Resident Dashboard View</span>
                    <span className="text-xs text-sky-600 font-semibold">Active Member</span>
                  </div>
                  <div className="space-y-3">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">Elevator 2 Noise</p>
                        <p className="text-slate-400">Flat 304 &bull; High Priority</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold">In Progress</span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">Clubhouse Gate Lamp</p>
                        <p className="text-slate-400">Common Area &bull; Low Priority</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold">Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "admins" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400">
                    For Society Admins
                  </span>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Centralized Management & Resident Roster</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    Admins get a dedicated management portal to view society issues, manage resident membership requests, update statuses, and monitor breach warnings.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Filter issues by priority, status, and SLA</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Manage society details & member lists</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-blue-500" /> Export metrics & issue resolution logs</li>
                  </ul>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">Admin Control Center</span>
                    <span className="text-xs text-blue-600 font-semibold">Society Admin</span>
                  </div>
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs">
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-400">Total Members</p>
                      <p className="text-lg font-bold text-slate-800 dark:text-white">128</p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                      <p className="text-slate-400">Pending Issues</p>
                      <p className="text-lg font-bold text-amber-500">4</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "superadmin" && (
              <div className="grid md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-400">
                    Platform Super Admin
                  </span>
                  <h4 className="text-2xl font-bold text-slate-900 dark:text-white">Global Control & Organization Creation</h4>
                  <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                    Super Admins oversee all registered societies, hostels, and campuses on CivicPulse, create new organizations, assign admins, and manage global platform health.
                  </p>
                  <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-500" /> Create & activate new societies/hostels</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-500" /> Platform-wide breach & ticket overview</li>
                    <li className="flex items-center gap-2"><CheckCircle2 size={16} className="text-purple-500" /> Super Admin transfer with automatic logout</li>
                  </ul>
                </div>
                <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700">
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-bold text-slate-800 dark:text-white text-sm">Super Admin Overview</span>
                    <span className="text-xs text-purple-600 font-semibold">Global Platform</span>
                  </div>
                  <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Organizations:</span>
                      <span className="font-bold text-slate-800 dark:text-white">42</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Platform Users:</span>
                      <span className="font-bold text-slate-800 dark:text-white">3,850</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Global SLA Breaches:</span>
                      <span className="font-bold text-emerald-500">0.6%</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="relative rounded-3xl bg-gradient-to-br from-slate-900 via-slate-800 to-sky-950 text-white p-12 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-sky-500/10 rounded-full blur-3xl" />
            <div className="relative z-10 max-w-3xl space-y-6 text-left">
              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Ready to transform issue management in your society?
              </h2>
              <p className="text-slate-300 text-lg">
                Join hundreds of societies and campuses using CivicPulse to ensure prompt, transparent issue resolution.
              </p>

              <div className="flex flex-wrap gap-4 pt-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-3 text-base font-bold text-slate-900 bg-white hover:bg-slate-100 px-7 py-4 rounded-2xl shadow-lg transition-all cursor-pointer"
                >
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-base font-semibold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-7 py-4 rounded-2xl backdrop-blur-md transition-all cursor-pointer"
                >
                  <LogIn size={18} />
                  <span>Sign In</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-sky-500 text-white font-bold flex items-center justify-center text-sm">
              C
            </div>
            <span className="font-bold text-slate-800 dark:text-white text-sm">CivicPulse</span>
            <span>&bull; Smart Community Governance Platform</span>
          </div>

          <div className="flex gap-6">
            <button onClick={() => navigate("/login")} className="hover:text-sky-500 transition-colors">
              Login
            </button>
            <button onClick={() => navigate("/signup")} className="hover:text-sky-500 transition-colors">
              Signup
            </button>
            <a href="#features" className="hover:text-sky-500 transition-colors">
              Features
            </a>
          </div>

          <p>&copy; {new Date().getFullYear()} CivicPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
