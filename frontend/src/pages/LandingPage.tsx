import { Link } from "react-router-dom";
import { Icon, Logo } from "../components/ui/Icon";
import Badge from "../components/ui/Badge";

const HIGHLIGHTS = [
  {
    icon: "sparkles" as const,
    title: "Smart Priority & Deduplication",
    description:
      "Multiple reports for the same issue automatically merge, boosting priority scores so urgent community problems surface first.",
  },
  {
    icon: "clock" as const,
    title: "Live SLA Monitoring",
    description:
      "Every category carries a response deadline with live countdowns and automatic escalation when an issue approaches breach.",
  },
  {
    icon: "shield" as const,
    title: "Role-Based Accountability",
    description:
      "Dedicated workspaces for Residents, Maintenance Staff, and Society Admins with full audit trails on every status change.",
  },
];

const SAMPLE_ISSUES = [
  {
    title: "Main water pump pressure drop — Block B",
    category: "Water",
    reports: 9,
    severity: "high" as const,
    status: "in-progress" as const,
    sla: "3h 20m left",
  },
  {
    title: "Basement parking sensor light flickering",
    category: "Electricity",
    reports: 4,
    severity: "medium" as const,
    status: "open" as const,
    sla: "14h 10m left",
  },
  {
    title: "Tower A passenger elevator inspection",
    category: "Lift",
    reports: 6,
    severity: "high" as const,
    status: "resolved" as const,
    sla: "Resolved on SLA",
  },
];

function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Subtle radial background glow */}
      <div
        className="pointer-events-none fixed inset-x-0 top-0 -z-0 h-[540px] bg-[radial-gradient(ellipse_at_top,_rgba(79,70,229,0.12),_transparent_65%)]"
        aria-hidden="true"
      />

      {/* Sticky Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200/70 bg-white/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="size-8" />
            <div>
              <p className="text-sm font-bold tracking-tight text-slate-900">CivicPulse</p>
              <p className="text-[11px] text-slate-500">Society Issue Resolution</p>
            </div>
          </Link>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#features" className="transition hover:text-indigo-600">
              Features
            </a>
            <a href="#workflow" className="transition hover:text-indigo-600">
              How it works
            </a>
          </nav>

          <div className="flex items-center gap-2.5">
            <Link
              to="/login"
              className="rounded-xl px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 hover:text-slate-900"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
            >
              Get Started
              <Icon name="arrowRight" className="size-3.5" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10">
        <section className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:px-8 lg:py-24">
          <div className="lg:col-span-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50/80 px-3.5 py-1 text-xs font-semibold text-indigo-700">
              <span className="size-1.5 rounded-full bg-indigo-600" />
              Priority-aware community operations
            </div>

            <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl lg:leading-[1.06]">
              Society issues,{" "}
              <span className="bg-gradient-to-r from-indigo-600 to-violet-600 bg-clip-text text-transparent">
                resolved on time.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">
              One unified platform for residents to report maintenance issues, staff to track
              deadlines, and society admins to oversee SLA compliance with complete transparency.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-indigo-600/20 transition hover:bg-indigo-700"
              >
                Create free account
                <Icon name="arrowRight" className="size-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 shadow-2xs transition hover:border-slate-400 hover:bg-slate-50"
              >
                Sign in to workspace
              </Link>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-6 border-t border-slate-200 pt-6">
              <div>
                <p className="text-2xl font-bold text-slate-900">3 Roles</p>
                <p className="text-xs text-slate-500">Resident · Staff · Admin</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">Auto SLA</p>
                <p className="text-xs text-slate-500">Live breach alerts</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">100%</p>
                <p className="text-xs text-slate-500">Audited timeline</p>
              </div>
            </div>
          </div>

          {/* Live Triage Preview Mockup */}
          <div className="lg:col-span-6">
            <div className="rounded-3xl border border-slate-200/90 bg-white p-6 shadow-xl shadow-slate-900/5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <p className="text-sm font-bold text-slate-900">Live Triage Queue</p>
                  <p className="text-xs text-slate-500">Ranked automatically by priority & SLA</p>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-600/20">
                  <span className="size-1.5 animate-pulse rounded-full bg-emerald-500" />
                  SLA Engine Active
                </span>
              </div>

              <div className="mt-4 space-y-3">
                {SAMPLE_ISSUES.map((item) => (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 transition hover:border-indigo-200 hover:bg-white"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-900">{item.title}</p>
                      <span className="shrink-0 rounded-md bg-white px-2 py-0.5 text-[11px] font-medium text-slate-600 ring-1 ring-slate-200">
                        {item.category}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Badge text={item.severity} variant={item.severity} />
                        <Badge text={item.status} variant={item.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="inline-flex items-center gap-1 font-medium text-slate-700">
                          <Icon name="users" className="size-3.5 text-indigo-500" />
                          {item.reports} reports
                        </span>
                        <span className="tabular-nums font-medium">{item.sla}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="border-t border-slate-200/80 bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl">
              <p className="text-xs font-bold uppercase tracking-widest text-indigo-600">
                Built for communities
              </p>
              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Everything your society needs to stay responsive
              </h2>
            </div>

            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {HIGHLIGHTS.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/50 p-6 transition hover:border-indigo-200 hover:bg-white hover:shadow-md"
                >
                  <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
                    <Icon name={item.icon} className="size-5" />
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Workflow Banner */}
        <section id="workflow" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl bg-slate-900 px-8 py-10 text-white shadow-lg sm:flex-row sm:items-center sm:px-12">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Ready to streamline society maintenance?
              </h2>
              <p className="mt-2 max-w-xl text-sm text-slate-300">
                Register as a Resident, Staff member, or Society Admin and start tracking issues in seconds.
              </p>
            </div>
            <Link
              to="/signup"
              className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-indigo-500 px-6 py-3 text-sm font-semibold text-white transition hover:bg-indigo-400"
            >
              Get started now
              <Icon name="arrowRight" className="size-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-slate-200/80 bg-white">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-slate-500 sm:flex-row sm:px-6 lg:px-8">
          <span>© {new Date().getFullYear()} CivicPulse. Society issue management & SLA tracking.</span>
          <div className="flex items-center gap-5">
            <Link to="/login" className="hover:text-slate-900">
              Sign in
            </Link>
            <Link to="/signup" className="hover:text-slate-900">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
