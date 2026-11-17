import { Link } from "react-router-dom";
import { Icon, Logo } from "../components/ui/Icon";
import Badge from "../components/ui/Badge";

const FEATURES = [
  {
    icon: "list" as const,
    title: "Automatic prioritization",
    description:
      "Duplicate reports merge automatically and elevate severity so critical community problems surface first.",
  },
  {
    icon: "clock" as const,
    title: "SLA accountability",
    description:
      "Category-level response deadlines track every open ticket with live countdowns and breach escalation.",
  },
  {
    icon: "shield" as const,
    title: "Role-based workflows",
    description:
      "Focused views for residents, staff, and society administrators backed by a complete audit timeline.",
  },
];

const PREVIEW_ROWS = [
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
    severity: "low" as const,
    status: "resolved" as const,
    sla: "Resolved",
  },
];

function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-zinc-50 text-zinc-900">
      <header className="sticky top-0 z-30 border-b border-zinc-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <Logo className="size-7" />
            <span className="text-sm font-semibold tracking-tight text-zinc-900">CivicPulse</span>
          </Link>

          <div className="flex items-center gap-2">
            <Link
              to="/login"
              className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-zinc-600 transition hover:bg-zinc-100 hover:text-zinc-900"
            >
              Sign in
            </Link>
            <Link
              to="/signup"
              className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-medium text-white transition hover:bg-zinc-800"
            >
              Get started
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Society Issue Management
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:leading-[1.08]">
              Community issues, tracked and resolved on time.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-600">
              A structured workspace for residents to report maintenance problems, staff to manage
              assignments, and society administrators to track SLA compliance.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link
                to="/signup"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Create account
                <Icon name="arrowRight" className="size-4" />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-medium text-zinc-800 transition hover:bg-zinc-50"
              >
                Sign in
              </Link>
            </div>

            <dl className="mt-10 grid max-w-sm grid-cols-3 gap-6 border-t border-zinc-200 pt-6">
              <div>
                <dt className="text-xs text-zinc-500">Roles</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-900">3</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">SLA Tracking</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-900">Live</dd>
              </div>
              <div>
                <dt className="text-xs text-zinc-500">Audit Trail</dt>
                <dd className="mt-1 text-lg font-semibold text-zinc-900">100%</dd>
              </div>
            </dl>
          </div>

          <div className="lg:col-span-6">
            <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
              <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3.5">
                <div>
                  <p className="text-sm font-semibold text-zinc-900">Priority Queue</p>
                  <p className="text-xs text-zinc-500">Sorted by severity and SLA deadline</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500">
                  <span className="size-1.5 rounded-full bg-emerald-600" />
                  Active
                </span>
              </div>

              <div className="divide-y divide-zinc-200">
                {PREVIEW_ROWS.map((row) => (
                  <div key={row.title} className="px-5 py-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-sm font-medium text-zinc-900">{row.title}</p>
                      <span className="shrink-0 text-xs text-zinc-500">{row.category}</span>
                    </div>
                    <div className="mt-2.5 flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge text={row.severity} variant={row.severity} />
                        <Badge text={row.status} variant={row.status} />
                      </div>
                      <div className="flex items-center gap-3 text-xs text-zinc-500 tabular-nums">
                        <span>{row.reports} reports</span>
                        <span>{row.sla}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="border-t border-zinc-200 bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {FEATURES.map((item) => (
                <div key={item.title} className="space-y-2.5">
                  <div className="flex size-9 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-800">
                    <Icon name={item.icon} className="size-4" />
                  </div>
                  <h2 className="text-sm font-semibold text-zinc-900">{item.title}</h2>
                  <p className="text-sm leading-6 text-zinc-600">{item.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} CivicPulse. Society issue management.</span>
          <div className="flex items-center gap-4">
            <Link to="/login" className="hover:text-zinc-900">
              Sign in
            </Link>
            <Link to="/signup" className="hover:text-zinc-900">
              Create account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
