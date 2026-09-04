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
  UserPlus,
  Search,
  GraduationCap,
  ChevronDown,
  Activity,
  HelpCircle,
  Menu,
  X
} from "lucide-react"

interface DemoMember {
  id: string
  name: string
  username: string
  role: "admin" | "staff" | "resident" | "member"
  flat: string
  avatar: string
  status: string
}

const DEMO_MEMBERS: DemoMember[] = [
  {
    id: "1",
    name: "Amaan Siddiqui",
    username: "amaan",
    role: "admin",
    flat: "Tower A • 1002",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    status: "Online"
  },
  {
    id: "2",
    name: "Vikram Malhotra",
    username: "vikram_m",
    role: "staff",
    flat: "Facility Services",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    status: "On-Duty"
  },
  {
    id: "3",
    name: "Priya Sharma",
    username: "priya_s",
    role: "resident",
    flat: "Block B • 402",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    status: "Active"
  },
  {
    id: "4",
    name: "Arjun Verma",
    username: "arjun_v",
    role: "resident",
    flat: "Block C • 205",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80",
    status: "Active"
  }
]

const ORG_CATEGORIES = [
  {
    id: "society",
    title: "Housing Societies",
    icon: Building2,
    badge: "Residential",
    color: "from-sky-500 to-blue-600",
    desc: "Gated residential complexes, apartment towers, and resident welfare associations (RWAs).",
    features: ["Flat-level issue routing", "Resident directory & roster", "Maintenance SLA timers"]
  },
  {
    id: "hostel",
    title: "Student Hostels",
    icon: Building2,
    badge: "Student Living",
    color: "from-amber-500 to-orange-600",
    desc: "University hostels and student residences with room-level tracking and warden oversight.",
    features: ["Room & wing-based tracking", "Warden & emergency tickets", "Fast priority escalations"]
  },
  {
    id: "campus",
    title: "University Campuses",
    icon: GraduationCap,
    badge: "Academic Institutions",
    color: "from-purple-500 to-indigo-600",
    desc: "Colleges and universities managing campus facilities, lab infrastructure, and grounds.",
    features: ["Department & lab categorisation", "Staff & student reporting", "Multi-block dispatching"]
  }
]

function LandingPage() {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeHeroTab, setActiveHeroTab] = useState<"sla" | "directory" | "categories">("sla")
  const [activeRoleTab, setActiveRoleTab] = useState<"residents" | "staff" | "admins" | "superadmin">("residents")
  const [directoryFilter, setDirectoryFilter] = useState<"all" | "admin" | "staff" | "resident">("all")
  const [directorySearch, setDirectorySearch] = useState("")
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0)

  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== "undefined") {
      return document.documentElement.classList.contains("dark")
    }
    return false
  })

  // Simulated countdown for live interactive SLA hero card demo
  const [timeLeft, setTimeLeft] = useState(14320) // ~03h 58m 40s in seconds

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

  const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    setMobileMenuOpen(false)
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
    }
  }

  const filteredMembers = DEMO_MEMBERS.filter((m) => {
    const matchesFilter = directoryFilter === "all" || m.role === directoryFilter
    const matchesSearch =
      m.name.toLowerCase().includes(directorySearch.toLowerCase()) ||
      m.username.toLowerCase().includes(directorySearch.toLowerCase()) ||
      m.flat.toLowerCase().includes(directorySearch.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const faqs = [
    {
      q: "How does the automated SLA breach tracking work?",
      a: "Every ticket created in CivicPulse is assigned a target resolution duration based on category and priority level (Critical, High, Medium, Low). The live countdown timer tracks progress in real time. If the deadline approaches or expires without resolution, the system automatically triggers escalation alerts to society administrators and platform super admins."
    },
    {
      q: "What types of organizations does CivicPulse support?",
      a: "CivicPulse natively supports Housing Societies, Student Hostels, and University Campuses. Each category features customized nomenclature (e.g. Flats vs Rooms vs Departments), dedicated routing rules, and multi-tier role permissions."
    },
    {
      q: "What is the Community Directory and who can view it?",
      a: "The Community Directory gives members, staff, and administrators a clear, searchable view of the organization roster. Members can view peer profiles, flat numbers, and verified role badges (Admin, Staff, Resident), eliminating unorganized chat groups."
    },
    {
      q: "How is platform-wide governance and security handled?",
      a: "CivicPulse employs a single-owner Super Admin architecture alongside scoped Organization Administrators. Super Admins oversee platform health, review detail modals for all issues and users, filter organizations by category, and can securely transfer global ownership."
    },
    {
      q: "Can residents track live technician activity?",
      a: "Yes! CivicPulse features a transparent audit timeline for each ticket. Residents can see when an issue is acknowledged, assigned to maintenance staff, inspected on-site, and resolved with photographic or log proof."
    }
  ]

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300 font-sans selection:bg-sky-500 selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 shadow-sm transition-all">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => navigate("/landing")}
          >
            <div className="w-10 h-10 rounded-md bg-sky-600 flex items-center justify-center font-bold text-xl text-white shadow-sm group-hover:bg-sky-500 transition-colors">
              C
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
                CivicPulse
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links - Monotonic Directional Order */}
          <nav className="hidden lg:flex items-center gap-8 text-sm font-semibold text-slate-600 dark:text-slate-300">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#categories"
              onClick={(e) => scrollToSection(e, "categories")}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              Communities
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              Workflow
            </a>
            <a
              href="#roles"
              onClick={(e) => scrollToSection(e, "roles")}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              Roles
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
            >
              FAQ
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <button
              onClick={toggleDarkMode}
              className="p-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all cursor-pointer"
              title="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            <button
              onClick={() => navigate("/login")}
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 hover:text-sky-600 dark:hover:text-sky-400 px-4 py-2.5 rounded-md transition-all cursor-pointer bg-slate-100 dark:bg-slate-800"
            >
              <LogIn size={16} />
              Sign in
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-sky-600 hover:bg-sky-500 px-5 py-2.5 rounded-md shadow-sm transition-all cursor-pointer"
            >
              <UserPlus size={16} />
              Get Started
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden px-6 py-4 bg-white dark:bg-slate-900 shadow-md space-y-3">
            <div className="flex flex-col space-y-2 text-sm font-medium text-slate-600 dark:text-slate-300">
              <a
                href="#features"
                onClick={(e) => scrollToSection(e, "features")}
                className="py-2 hover:text-sky-600 dark:hover:text-sky-400"
              >
                Features
              </a>
              <a
                href="#categories"
                onClick={(e) => scrollToSection(e, "categories")}
                className="py-2 hover:text-sky-600 dark:hover:text-sky-400"
              >
                Communities
              </a>
              <a
                href="#how-it-works"
                onClick={(e) => scrollToSection(e, "how-it-works")}
                className="py-2 hover:text-sky-600 dark:hover:text-sky-400"
              >
                Workflow
              </a>
              <a
                href="#roles"
                onClick={(e) => scrollToSection(e, "roles")}
                className="py-2 hover:text-sky-600 dark:hover:text-sky-400"
              >
                Roles
              </a>
              <a
                href="#faq"
                onClick={(e) => scrollToSection(e, "faq")}
                className="py-2 hover:text-sky-600 dark:hover:text-sky-400"
              >
                FAQ
              </a>
            </div>
            <div className="pt-3 flex gap-2">
              <button
                onClick={() => navigate("/login")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200"
              >
                <LogIn size={16} /> Sign In
              </button>
              <button
                onClick={() => navigate("/signup")}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold rounded-md bg-sky-600 text-white"
              >
                <UserPlus size={16} /> Sign Up
              </button>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* HERO SECTION */}
        <section className="pt-16 pb-24 px-6 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-12 gap-12 items-center">
            {/* Left Hero Content */}
            <div className="lg:col-span-6 space-y-6 text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-md bg-sky-100 dark:bg-sky-500/10 text-sky-700 dark:text-sky-400 text-xs font-bold tracking-wide uppercase shadow-sm">
                <Sparkles size={14} className="text-sky-500" />
                <span>Next-Gen Community Governance & SLA Tracking</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.12] text-slate-900 dark:text-white">
                Resolve Community Issues{" "}
                <span className="text-sky-600 dark:text-sky-400">
                  Before They Escalate.
                </span>
              </h1>

              <p className="text-lg text-slate-600 dark:text-slate-300 leading-relaxed max-w-2xl">
                CivicPulse unifies residential societies, student hostels, and university campuses with automated SLA breach detection, live ticket progress, interactive resident directories, and multi-tier role governance.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-3 text-base font-bold text-white bg-sky-600 hover:bg-sky-500 px-7 py-4 rounded-md shadow-sm transition-all cursor-pointer group"
                >
                  <span>Get Started Free</span>
                  <ArrowRight size={20} className="group-hover:translate-x-1.5 transition-transform" />
                </button>

                <button
                  onClick={() => navigate("/login")}
                  className="flex items-center gap-2 text-base font-semibold text-slate-700 dark:text-slate-200 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800 px-6 py-4 rounded-md shadow-sm transition-all cursor-pointer"
                >
                  <LogIn size={18} className="text-sky-500" />
                  <span>Existing User Login</span>
                </button>
              </div>

              {/* Trust Badges */}
              <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-600 dark:text-slate-400">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Automated SLA Warning Engine</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Full Community Roster & Profiles</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />
                  <span>Societies, Hostels & Campuses</span>
                </div>
              </div>
            </div>

            {/* Right Side Interactive Live Sandbox Preview */}
            <div className="lg:col-span-6">
              <div className="relative rounded-md bg-white dark:bg-slate-900 shadow-md p-6">
                {/* Sandbox Header / Tab Selector */}
                <div className="flex items-center justify-between pb-4">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" />
                    <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" />
                    <span className="ml-2 text-xs font-mono font-medium text-slate-400">
                      civicpulse.live/preview
                    </span>
                  </div>

                  <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-md text-xs font-semibold">
                    <button
                      onClick={() => setActiveHeroTab("sla")}
                      className={`px-3 py-1.5 rounded-md transition-all ${
                        activeHeroTab === "sla"
                          ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      SLA Ticket
                    </button>
                    <button
                      onClick={() => setActiveHeroTab("directory")}
                      className={`px-3 py-1.5 rounded-md transition-all ${
                        activeHeroTab === "directory"
                          ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      Member Directory
                    </button>
                    <button
                      onClick={() => setActiveHeroTab("categories")}
                      className={`px-3 py-1.5 rounded-md transition-all ${
                        activeHeroTab === "categories"
                          ? "bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-sm font-bold"
                          : "text-slate-500 dark:text-slate-400 hover:text-slate-800"
                      }`}
                    >
                      Categories
                    </button>
                  </div>
                </div>

                {/* TAB 1: Live SLA Ticket Mockup */}
                {activeHeroTab === "sla" && (
                  <div className="pt-2 space-y-4">
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center font-bold">
                          <Zap size={20} />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                              Ticket #CP-8921
                            </span>
                            <span className="px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase bg-amber-500/15 text-amber-600 dark:text-amber-400">
                              High Priority
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                            Main Water Line Pressure Drop
                          </h4>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-sm text-xs font-bold bg-sky-500/15 text-sky-600 dark:text-sky-400">
                        IN PROGRESS
                      </span>
                    </div>

                    {/* SLA Clock Box */}
                    <div className="bg-slate-900 text-white rounded-md p-4 flex items-center justify-between shadow-sm">
                      <div className="flex items-center gap-3">
                        <Clock size={22} className="text-sky-400" />
                        <div>
                          <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                            SLA Target Remaining
                          </p>
                          <p className="text-lg font-mono font-bold text-sky-400">
                            {formatTime(timeLeft)}
                          </p>
                        </div>
                      </div>
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-sm bg-emerald-500/20 text-emerald-300 flex items-center gap-1.5">
                        <span className="w-2 h-2 rounded-sm bg-emerald-400" />
                        On Schedule
                      </span>
                    </div>

                    {/* Metadata Grid */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                        <p className="text-slate-400 mb-0.5">Assigned Staff</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">
                          Vikram Malhotra (Plumbing Lead)
                        </p>
                      </div>
                      <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-md">
                        <p className="text-slate-400 mb-0.5">Location</p>
                        <p className="font-bold text-slate-700 dark:text-slate-200">
                          Emerald Heights &bull; Flat 402
                        </p>
                      </div>
                    </div>

                    {/* Audit Timeline Steps */}
                    <div className="space-y-2 pt-1">
                      <div className="flex items-center gap-3 text-xs">
                        <div className="w-5 h-5 rounded-md bg-emerald-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Issue Logged by Resident Priya Sharma
                        </span>
                        <span className="ml-auto text-slate-400 text-[10px]">10:15 AM</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="w-5 h-5 rounded-md bg-sky-500 text-white flex items-center justify-center text-[10px] font-bold">
                          ✓
                        </div>
                        <span className="text-slate-600 dark:text-slate-300 font-medium">
                          Auto-assigned to Plumbing Staff
                        </span>
                        <span className="ml-auto text-slate-400 text-[10px]">10:20 AM</span>
                      </div>
                      <div className="flex items-center gap-3 text-xs">
                        <div className="w-5 h-5 rounded-md bg-amber-500/20 text-amber-500 flex items-center justify-center text-[10px] font-bold">
                          ●
                        </div>
                        <span className="text-slate-800 dark:text-white font-bold">
                          Technician On-Site Pressure Valve Testing
                        </span>
                        <span className="ml-auto text-amber-500 text-[10px] font-bold">Just Now</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* TAB 2: Live Interactive Community Directory Mockup */}
                {activeHeroTab === "directory" && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          Community Directory & Roster
                        </h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Searchable member profiles, verified handles & roles
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-sm text-xs font-bold bg-sky-100 dark:bg-sky-950 text-sky-700 dark:text-sky-300">
                        {filteredMembers.length} Members
                      </span>
                    </div>

                    {/* Search Bar & Role Filter Pills */}
                    <div className="space-y-2">
                      <div className="relative">
                        <Search
                          size={14}
                          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                        />
                        <input
                          type="text"
                          value={directorySearch}
                          onChange={(e) => setDirectorySearch(e.target.value)}
                          placeholder="Search by name, @username, or flat..."
                          className="w-full pl-9 pr-3 py-2 text-xs rounded-md bg-slate-100 dark:bg-slate-800 focus:outline-none focus:ring-1 focus:ring-sky-500 text-slate-800 dark:text-slate-200 placeholder-slate-400"
                        />
                      </div>

                      <div className="flex gap-1.5 overflow-x-auto text-[11px] font-semibold pb-1">
                        {(["all", "resident", "staff", "admin"] as const).map((filter) => (
                          <button
                            key={filter}
                            onClick={() => setDirectoryFilter(filter)}
                            className={`px-2.5 py-1 rounded-md capitalize transition-colors ${
                              directoryFilter === filter
                                ? "bg-sky-600 text-white shadow-sm"
                                : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900"
                            }`}
                          >
                            {filter}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Member Cards List */}
                    <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                      {filteredMembers.map((member) => (
                        <div
                          key={member.id}
                          className="p-2.5 rounded-md bg-slate-50 dark:bg-slate-800 flex items-center justify-between text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <img
                              src={member.avatar}
                              alt={member.name}
                              className="w-8 h-8 rounded-md object-cover"
                            />
                            <div>
                              <div className="flex items-center gap-1.5">
                                <span className="font-bold text-slate-800 dark:text-slate-100">
                                  {member.name}
                                </span>
                                <span className="text-[10px] text-slate-400">@{member.username}</span>
                              </div>
                              <p className="text-[10px] text-slate-500 dark:text-slate-400">
                                {member.flat}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-0.5 rounded-sm text-[10px] font-bold uppercase ${
                                member.role === "admin"
                                  ? "bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300"
                                  : member.role === "staff"
                                  ? "bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300"
                                  : "bg-sky-100 dark:bg-sky-950/60 text-sky-700 dark:text-sky-300"
                              }`}
                            >
                              {member.role}
                            </span>
                            <span className="w-2 h-2 rounded-sm bg-emerald-500" title={member.status} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* TAB 3: Multi-Category Ecosystem Mockup (3 Types) */}
                {activeHeroTab === "categories" && (
                  <div className="pt-2 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                        Multi-Category Architecture
                      </h4>
                      <span className="text-[11px] text-sky-600 dark:text-sky-400 font-semibold">
                        3 Community Types Supported
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                      <div className="p-3 rounded-md bg-sky-50 dark:bg-sky-950/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-300 font-bold text-xs">
                          <Building2 size={16} /> Housing Society
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Flat & block assignments, resident portals
                        </p>
                        <p className="text-[10px] font-bold text-sky-600">42 Societies</p>
                      </div>

                      <div className="p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-300 font-bold text-xs">
                          <Building2 size={16} /> Student Hostel
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Room & wing tracking, warden escalation
                        </p>
                        <p className="text-[10px] font-bold text-amber-600">18 Hostels</p>
                      </div>

                      <div className="p-3 rounded-md bg-purple-50 dark:bg-purple-950/30 space-y-1">
                        <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300 font-bold text-xs">
                          <GraduationCap size={16} /> University Campus
                        </div>
                        <p className="text-[10px] text-slate-500 dark:text-slate-400">
                          Departmental routing & lab issues
                        </p>
                        <p className="text-[10px] font-bold text-purple-600">12 Campuses</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* METRICS & IMPACT BAR (Directly below Hero) */}
        <section className="py-12 bg-white dark:bg-slate-900 shadow-sm">
          <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-extrabold text-sky-600 dark:text-sky-400 tracking-tight">
                99.4%
              </p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                SLA Compliance Rate
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-blue-600 dark:text-blue-400 tracking-tight">
                &lt; 24 hrs
              </p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Average Resolution Speed
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-purple-600 dark:text-purple-400 tracking-tight">
                3 Categories
              </p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Societies, Hostels & Campuses
              </p>
            </div>
            <div>
              <p className="text-4xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
                100%
              </p>
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 mt-1">
                Audit Trail Transparency
              </p>
            </div>
          </div>
        </section>

        {/* 1. FEATURES SECTION (#features) */}
        <section id="features" className="scroll-mt-24 py-24 px-6 bg-slate-100 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                End-To-End Capabilities
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Everything Needed to Run Communities With Zero Friction
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                Eliminate unorganized chats, forgotten repairs, and unmonitored maintenance delays forever.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Feature 1 */}
              <div className="bg-white dark:bg-slate-900 rounded-md p-7 shadow-sm group">
                <div className="w-12 h-12 rounded-md bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center mb-5">
                  <Clock size={26} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Automated SLA Countdown Engine
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Dynamic resolution timers calculated by priority level. Transparent clocks keep maintenance teams accountable and eliminate endless delays.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="bg-white dark:bg-slate-900 rounded-md p-7 shadow-sm group">
                <div className="w-12 h-12 rounded-md bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-5">
                  <Users size={26} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Full Community Directory & Avatars
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Complete directory of residents, members, staff, and admins. Live filters by role, search by name/handle, and custom profile avatars.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="bg-white dark:bg-slate-900 rounded-md p-7 shadow-sm group">
                <div className="w-12 h-12 rounded-md bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5">
                  <AlertTriangle size={26} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Instant Escalations & Breach Flags
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  When a ticket breaches its deadline, it triggers immediate warning flags to community administrators and platform super admins for intervention.
                </p>
              </div>

              {/* Feature 4 */}
              <div className="bg-white dark:bg-slate-900 rounded-md p-7 shadow-sm group">
                <div className="w-12 h-12 rounded-md bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-5">
                  <ShieldCheck size={26} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Super Admin Single-Owner Security
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Ecosystem-wide control with strict single Super Admin policy, full detail inspection modals, category filtering, and safe ownership handover.
                </p>
              </div>

              {/* Feature 5 */}
              <div className="bg-white dark:bg-slate-900 rounded-md p-7 shadow-sm group">
                <div className="w-12 h-12 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-5">
                  <Activity size={26} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Audit Timelines & Proof of Fix
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Timestamped action logs record every transition from initial report to staff dispatch, on-site testing, and resident verification.
                </p>
              </div>

              {/* Feature 6 */}
              <div className="bg-white dark:bg-slate-900 rounded-md p-7 shadow-sm group">
                <div className="w-12 h-12 rounded-md bg-rose-500/10 text-rose-600 dark:text-rose-400 flex items-center justify-center mb-5">
                  <BarChart3 size={26} />
                </div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Real-Time Analytics & Health
                </h4>
                <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
                  Visual dashboards breakdown open issues, breach ratios, active organization metrics, and resolution turnaround times.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. COMMUNITIES SECTION (#categories) */}
        <section id="categories" className="scroll-mt-24 py-24 px-6 max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Community Architecture
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Built for Every Type of Living & Learning Community
            </h3>
            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
              CivicPulse adapts to the unique workflows, room structures, and administrative hierarchies of each community type.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {ORG_CATEGORIES.map((cat) => {
              const Icon = cat.icon
              return (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-slate-900 rounded-md p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div
                        className={`w-12 h-12 rounded-md bg-gradient-to-br ${cat.color} text-white flex items-center justify-center shadow-sm`}
                      >
                        <Icon size={24} />
                      </div>
                      <span className="px-2.5 py-1 rounded-sm text-[11px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {cat.badge}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-1 group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                        {cat.title}
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                        {cat.desc}
                      </p>
                    </div>

                    <ul className="space-y-2 pt-2 text-xs text-slate-700 dark:text-slate-300 font-medium">
                      {cat.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6">
                    <button
                      onClick={() => navigate("/signup")}
                      className="w-full py-2 text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <span>Explore Workflows</span>
                      <ArrowRight size={14} />
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* 3. HOW IT WORKS WORKFLOW (#how-it-works) */}
        <section id="how-it-works" className="scroll-mt-24 py-24 px-6 bg-slate-100 dark:bg-slate-900/50">
          <div className="max-w-7xl mx-auto">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                Clear 4-Step Resolution Cycle
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                How CivicPulse Resolves Issues Seamlessly
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                From the moment a resident logs a fault to the final verification stamp.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white dark:bg-slate-900 p-6 rounded-md shadow-sm relative">
                <span className="w-9 h-9 rounded-md bg-sky-500 text-white font-bold flex items-center justify-center text-sm mb-4">
                  1
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-base">
                  Report & Tag
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Resident selects category (Plumbing, Electrical, Security), location (flat, block, common area), and urgency priority.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-md shadow-sm relative">
                <span className="w-9 h-9 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                  2
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-base">
                  Auto SLA & Dispatch
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  SLA target timer starts automatically. Admins or automated rules dispatch the ticket directly to verified maintenance staff.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-md shadow-sm relative">
                <span className="w-9 h-9 rounded-md bg-purple-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                  3
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-base">
                  Audit Timeline Progress
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Staff log on-site arrival and progress notes. Both resident and admin see real-time updates and SLA countdown.
                </p>
              </div>

              <div className="bg-white dark:bg-slate-900 p-6 rounded-md shadow-sm relative">
                <span className="w-9 h-9 rounded-md bg-emerald-600 text-white font-bold flex items-center justify-center text-sm mb-4">
                  4
                </span>
                <h4 className="font-bold text-slate-900 dark:text-white mb-2 text-base">
                  Verification & Audit Log
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Resident confirms the fix is complete. Issue closes cleanly and resolution audit metrics are saved permanently.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. ROLE SHOWCASE (#roles) */}
        <section id="roles" className="scroll-mt-24 py-24 px-6 max-w-7xl mx-auto">
          <div>
            <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
              <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
                Tailored Stakeholder Portals
              </h2>
              <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
                Purpose-Built for Every Community Role
              </h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Custom dashboard views and workflows designed specifically for residents, staff, society leaders, and platform executives.
              </p>
            </div>

            {/* Role Tab Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
              <button
                onClick={() => setActiveRoleTab("residents")}
                className={`px-5 py-3 rounded-md font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeRoleTab === "residents"
                    ? "bg-sky-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                Residents & Students
              </button>
              <button
                onClick={() => setActiveRoleTab("staff")}
                className={`px-5 py-3 rounded-md font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeRoleTab === "staff"
                    ? "bg-amber-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                Staff & Technicians
              </button>
              <button
                onClick={() => setActiveRoleTab("admins")}
                className={`px-5 py-3 rounded-md font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeRoleTab === "admins"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                Society & Campus Admins
              </button>
              <button
                onClick={() => setActiveRoleTab("superadmin")}
                className={`px-5 py-3 rounded-md font-bold text-xs sm:text-sm transition-all cursor-pointer ${
                  activeRoleTab === "superadmin"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50"
                }`}
              >
                Super Admin Ecosystem
              </button>
            </div>

            {/* Interactive Role Card Display */}
            <div className="bg-white dark:bg-slate-900 rounded-md p-8 shadow-sm">
              {activeRoleTab === "residents" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="px-3 py-1 rounded-sm text-xs font-bold bg-sky-100 text-sky-700 dark:bg-sky-500/10 dark:text-sky-300">
                      Resident & Student Experience
                    </span>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Fast Issue Reporting, Live Timers & Member Roster
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      Residents join via simple invite code, report repairs with category and priority tags, follow ticket milestones in real time, and access the verified community directory.
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-sky-500 shrink-0" />
                        <span>Instant society joining via unique invite code</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-sky-500 shrink-0" />
                        <span>Live countdown SLA timer on every ticket</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-sky-500 shrink-0" />
                        <span>Searchable community directory with resident avatars</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-sky-500 shrink-0" />
                        <span>User profile management with custom picture and @handles</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-slate-800 dark:text-white text-sm">
                        Resident Dashboard
                      </span>
                      <span className="text-xs text-sky-600 dark:text-sky-400 font-bold bg-sky-500/10 px-2.5 py-0.5 rounded-sm">
                        Active Resident
                      </span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-md flex justify-between items-center shadow-sm">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">
                            Elevator #2 Floor Sensor Malfunction
                          </p>
                          <p className="text-slate-400 text-[11px]">Tower B • High Priority</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-sm bg-sky-500/15 text-sky-600 dark:text-sky-400 font-bold text-[10px]">
                          In Progress
                        </span>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-md flex justify-between items-center shadow-sm">
                        <div>
                          <p className="font-bold text-slate-800 dark:text-white">
                            Courtyard Garden Light Replacement
                          </p>
                          <p className="text-slate-400 text-[11px]">Common Area • Low Priority</p>
                        </div>
                        <span className="px-2.5 py-1 rounded-sm bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                          Resolved
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === "staff" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="px-3 py-1 rounded-sm text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/10 dark:text-amber-300">
                      Staff & Maintenance Operations
                    </span>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Field Dispatch, Status Updates & Work Logs
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      Maintenance crew and technicians receive assigned tickets with precise location details, log on-site arrival, and mark work complete with transparent audit comments.
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                        <span>Focused ticket queues sorted by urgency & SLA target</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                        <span>One-click status transitions (Dispatched &rarr; In Progress &rarr; Resolved)</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-amber-500 shrink-0" />
                        <span>Detailed location tags (Flat / Room / Wing / Lab)</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-slate-800 dark:text-white text-sm">
                        Technician Work Queue
                      </span>
                      <span className="text-xs text-amber-600 dark:text-amber-400 font-bold bg-amber-500/10 px-2.5 py-0.5 rounded-sm">
                        Plumbing & HVAC
                      </span>
                    </div>
                    <div className="space-y-3 text-xs">
                      <div className="bg-white dark:bg-slate-900 p-3.5 rounded-md space-y-2 shadow-sm">
                        <div className="flex justify-between">
                          <span className="font-bold text-slate-800 dark:text-white">
                            Water Pressure Regulator Repair
                          </span>
                          <span className="text-amber-500 font-bold">1h 45m left</span>
                        </div>
                        <p className="text-slate-400 text-[11px]">Assigned to: Vikram Malhotra</p>
                        <div className="flex gap-2 pt-1">
                          <button className="px-2.5 py-1 rounded-md bg-amber-500 text-white font-bold text-[10px]">
                            Update Status
                          </button>
                          <button className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-[10px]">
                            View Location
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === "admins" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="px-3 py-1 rounded-sm text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-300">
                      For Society & Campus Admins
                    </span>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Full Community Control, Member Management & SLA Defense
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      Admins enjoy a centralized command center to oversee community issues, assign tickets, manage resident & member roles, view the member roster, and handle breach alerts.
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                        <span>Filter issues by priority, status, category, and SLA urgency</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                        <span>Manage member roster & assign Staff or Admin roles</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-blue-500 shrink-0" />
                        <span>Pre-breach warning notifications to prevent SLA violations</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-slate-800 dark:text-white text-sm">
                        Admin Overview
                      </span>
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold bg-blue-500/10 px-2.5 py-0.5 rounded-sm">
                        Greenwood RWA
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 mb-3 text-xs">
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-md shadow-sm">
                        <p className="text-slate-400">Total Members</p>
                        <p className="text-xl font-bold text-slate-800 dark:text-white">142</p>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-3 rounded-md shadow-sm">
                        <p className="text-slate-400">SLA Health</p>
                        <p className="text-xl font-bold text-emerald-500">99.1%</p>
                      </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-3 rounded-md text-xs flex justify-between items-center shadow-sm">
                      <div>
                        <p className="font-bold text-slate-800 dark:text-white">Active Tickets</p>
                        <p className="text-[11px] text-slate-400">3 In Progress &bull; 0 Breached</p>
                      </div>
                      <span className="px-2 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold text-[10px]">
                        All Clear
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {activeRoleTab === "superadmin" && (
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-4">
                    <span className="px-3 py-1 rounded-sm text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-500/10 dark:text-purple-300">
                      Platform Super Admin
                    </span>
                    <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                      Global Governance, Category Filters & Single-Owner Transfer
                    </h4>
                    <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      Oversee all registered societies, hostels, and campuses. Inspect full detail modals for any issue, user, or organization, and perform secure ownership transitions.
                    </p>
                    <ul className="space-y-2.5 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                        <span>Category filtering across Societies, Hostels & Campuses</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                        <span>Interactive detail inspection modals for Issues, Orgs & Users</span>
                      </li>
                      <li className="flex items-center gap-2.5">
                        <CheckCircle2 size={16} className="text-purple-500 shrink-0" />
                        <span>Single Super Admin ownership protocol with transfer security</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-md">
                    <div className="flex items-center justify-between mb-4">
                      <span className="font-bold text-slate-800 dark:text-white text-sm">
                        Global Command Center
                      </span>
                      <span className="text-xs text-purple-600 dark:text-purple-400 font-bold bg-purple-500/10 px-2.5 py-0.5 rounded-sm">
                        Platform Single Owner
                      </span>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-4 rounded-md space-y-2 text-xs shadow-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Total Organizations:</span>
                        <span className="font-bold text-slate-800 dark:text-white">48 Active</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Registered Platform Users:</span>
                        <span className="font-bold text-slate-800 dark:text-white">4,280</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Platform-Wide SLA Breach:</span>
                        <span className="font-bold text-emerald-500">0.58%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Detail Modals Inspected:</span>
                        <span className="font-bold text-purple-500">All Live</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 5. FAQ SECTION */}
        <section id="faq" className="scroll-mt-24 py-24 px-6 max-w-4xl mx-auto">
          <div className="text-center mb-16 space-y-3">
            <h2 className="text-xs font-bold uppercase tracking-widest text-sky-600 dark:text-sky-400">
              Frequently Asked Questions
            </h2>
            <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-900 dark:text-white">
              Everything You Need to Know About CivicPulse
            </h3>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className="bg-white dark:bg-slate-900 rounded-md overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left font-bold text-slate-800 dark:text-white text-sm sm:text-base hover:text-sky-600 dark:hover:text-sky-400 transition-colors cursor-pointer"
                >
                  <span className="flex items-center gap-3">
                    <HelpCircle size={18} className="text-sky-500 shrink-0" />
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                      expandedFaq === index ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {expandedFaq === index && (
                  <div className="px-6 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
                    {faq.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* BOTTOM CTA BANNER */}
        <section className="py-20 px-6 max-w-7xl mx-auto">
          <div className="relative rounded-md bg-slate-900 text-white p-10 sm:p-14 overflow-hidden shadow-md">
            <div className="relative z-10 max-w-3xl space-y-6 text-left">
              <span className="px-3.5 py-1 rounded-sm text-xs font-bold bg-sky-500/20 text-sky-300">
                Start Today
              </span>

              <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">
                Ready to elevate maintenance & transparency in your community?
              </h2>

              <p className="text-slate-300 text-base sm:text-lg leading-relaxed">
                Join residential societies, student hostels, and campuses using CivicPulse to track SLAs, manage member directories, and guarantee prompt resolutions.
              </p>

              <div className="pt-4">
                <button
                  onClick={() => navigate("/signup")}
                  className="flex items-center gap-3 text-base font-bold text-slate-900 bg-white hover:bg-slate-100 px-7 py-4 rounded-md shadow-sm transition-all cursor-pointer"
                >
                  <UserPlus size={18} />
                  <span>Create Account</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-900 py-12 px-6 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-md bg-sky-600 text-white font-bold flex items-center justify-center text-sm shadow-sm">
              C
            </div>
            <div>
              <span className="font-bold text-slate-800 dark:text-white text-sm">CivicPulse</span>
              <span className="block sm:inline sm:ml-2 text-slate-400">
                &bull; Smart SLA Governance for Societies, Hostels & Campuses
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6 font-medium">
            <a
              href="#features"
              onClick={(e) => scrollToSection(e, "features")}
              className="hover:text-sky-500 transition-colors cursor-pointer"
            >
              Features
            </a>
            <a
              href="#categories"
              onClick={(e) => scrollToSection(e, "categories")}
              className="hover:text-sky-500 transition-colors cursor-pointer"
            >
              Communities
            </a>
            <a
              href="#how-it-works"
              onClick={(e) => scrollToSection(e, "how-it-works")}
              className="hover:text-sky-500 transition-colors cursor-pointer"
            >
              Workflow
            </a>
            <a
              href="#roles"
              onClick={(e) => scrollToSection(e, "roles")}
              className="hover:text-sky-500 transition-colors cursor-pointer"
            >
              Roles
            </a>
            <a
              href="#faq"
              onClick={(e) => scrollToSection(e, "faq")}
              className="hover:text-sky-500 transition-colors cursor-pointer"
            >
              FAQ
            </a>
            <button
              onClick={() => navigate("/signup")}
              className="hover:text-sky-500 transition-colors cursor-pointer"
            >
              Sign Up
            </button>
          </div>

          <p>&copy; {new Date().getFullYear()} CivicPulse. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
