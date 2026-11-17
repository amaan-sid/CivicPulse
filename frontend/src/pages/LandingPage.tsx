import { Link } from "react-router-dom";
import { Icon, Logo, type IconName } from "../components/ui/Icon";
import Badge from "../components/ui/Badge";

const CORE_FEATURES: Array<{ icon: IconName; title: string; description: string }> = [
  {
    icon: "list",
    title: "Automatic prioritization",
    description:
      "Duplicate reports merge automatically and elevate severity so critical community problems surface first.",
  },
  {
    icon: "clock",
    title: "SLA accountability",
    description:
      "Category-level response deadlines track every open ticket with live countdowns and breach escalation.",
  },
  {
    icon: "shield",
    title: "Role-based workflows",
    description:
      "Focused views for residents, staff, and society administrators backed by a complete audit timeline.",
  },
];

const CAPABILITY_MATRIX: Array<{
  icon: IconName;
  title: string;
  description: string;
  status: "Available" | "In Progress" | "Planned";
}> = [
  {
    icon: "dashboard",
    title: "Government & Admin Dashboard",
    description:
      "Restricted portals displaying resource allocations, SLA telemetry, and staff or officer assignees.",
    status: "Available",
  },
  {
    icon: "camera",
    title: "Smart Issue Reporting",
    description:
      "Capture coordinate pins, upload field imagery, and submit reports using speech-to-text voice input.",
    status: "Planned",
  },
  {
    icon: "cpu",
    title: "AI Civic Intelligence",
    description:
      "Dedicated Gemini models triaging taxonomy, parsing duplicates, and estimating resolution windows.",
    status: "Planned",
  },
  {
    icon: "radio",
    title: "Real-Time Issue Tracking",
    description:
      "Live WebSocket and collection streams keeping status transitions and escalations synchronized instantly.",
    status: "In Progress",
  },
  {
    icon: "users",
    title: "Community Engagement",
    description:
      "Public discussions, neighborhood verifications, and community confirmation workflows.",
    status: "Planned",
  },
  {
    icon: "barChart",
    title: "Geospatial Analytics",
    description:
      "Dynamic indicators outlining city telemetry categories, hot-zone density, and dispatch loads.",
    status: "Planned",
  },
  {
    icon: "map",
    title: "Digital Twin Mapping",
    description:
      "Obsidian-styled interactive map centerpiece integrating heatmaps and emergency response layers.",
    status: "Planned",
  },
  {
    icon: "award",
    title: "Leaderboard & Reputation",
    description:
      "Citizen identity scoring tracking trust levels, verified checks, and community guardian statuses.",
    status: "Planned",
  },
];

const ROADMAP_PHASES = [
  {
    phase: "Phase 01",
    label: "Live Today",
    title: "Core Civic Operations & SLA Engine",
    items: [
      "Role-based workspaces for Residents, Maintenance Staff, and Administrators",
      "Automated priority scoring, duplicate report merging, and SLA breach escalation",
      "Kanban workflow board, staff assignment, and full audit activity timeline",
    ],
  },
  {
    phase: "Phase 02",
    label: "Next Up",
    title: "AI Triage, Media & Live Streams",
    items: [
      "Gemini-powered AI Civic Intelligence for automatic taxonomy classification and ETA drafting",
      "Photo attachments, GPS coordinate pins, and speech-to-text voice reporting",
      "Real-time WebSocket updates and push alerts for status transitions and escalations",
    ],
  },
  {
    phase: "Phase 03",
    label: "Future Vision",
    title: "Geospatial Twin & Citizen Ecosystem",
    items: [
      "Obsidian-styled Digital Twin map with live heatmaps and emergency dispatch layers",
      "Geospatial analytics dashboards for municipal resource allocation and ward telemetry",
      "Public discussions, verified citizen checks, and community guardian leaderboards",
    ],
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

          <nav className="hidden items-center gap-6 text-xs font-medium text-zinc-600 md:flex">
            <a href="#capabilities" className="transition hover:text-zinc-900">
              Capability Matrix
            </a>
            <a href="#roadmap" className="transition hover:text-zinc-900">
              Future Plans
            </a>
          </nav>

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
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-12 lg:py-24">
          <div className="lg:col-span-6">
            <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
              Society & Civic Issue Management
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-zinc-900 sm:text-5xl lg:leading-[1.08]">
              Community issues, tracked and resolved on time.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-600">
              A structured workspace for residents to report maintenance problems, staff to manage
              assignments, and administrators to oversee SLA compliance with full auditability.
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
                      <div className="flex items-center gap-3 text-xs tabular-nums text-zinc-500">
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

        {/* Core Platform Highlights */}
        <section className="border-t border-zinc-200 bg-white py-14">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="grid gap-8 md:grid-cols-3">
              {CORE_FEATURES.map((item) => (
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

        {/* Capability Matrix */}
        <section id="capabilities" className="border-t border-zinc-200 bg-zinc-50 py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="max-w-2xl">
              <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                Capability Matrix
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                Comprehensive Government Technology
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-600">
                Features engineered for national-level innovation standards and secure municipal
                dispatch integration — combining today&apos;s live operations with our next-generation
                civic roadmap.
              </p>
            </div>

            <div className="mt-10 grid overflow-hidden rounded-xl border border-zinc-200 bg-zinc-200 gap-px sm:grid-cols-2 lg:grid-cols-4">
              {CAPABILITY_MATRIX.map((cap) => (
                <div key={cap.title} className="flex flex-col justify-between bg-white p-6">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                        <Icon name={cap.icon} className="size-4" />
                      </div>
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                          cap.status === "Available"
                            ? "bg-emerald-50 text-emerald-700 ring-emerald-200/80"
                            : cap.status === "In Progress"
                              ? "bg-amber-50 text-amber-800 ring-amber-200/80"
                              : "bg-zinc-100 text-zinc-600 ring-zinc-200"
                        }`}
                      >
                        <span
                          className={`size-1.5 rounded-full ${
                            cap.status === "Available"
                              ? "bg-emerald-600"
                              : cap.status === "In Progress"
                                ? "bg-amber-500"
                                : "bg-zinc-400"
                          }`}
                        />
                        {cap.status}
                      </span>
                    </div>

                    <h3 className="mt-4 text-sm font-semibold text-zinc-900">{cap.title}</h3>
                    <p className="mt-1.5 text-xs leading-5 text-zinc-600">{cap.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Future Plans & Roadmap */}
        <section id="roadmap" className="border-t border-zinc-200 bg-white py-20">
          <div className="mx-auto max-w-6xl px-4 sm:px-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
              <div className="max-w-2xl">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500">
                  Future Plans & Improvements
                </p>
                <h2 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl">
                  Built to scale from societies to smart cities
                </h2>
                <p className="mt-2 text-sm text-zinc-600">
                  Our phased engineering roadmap expands CivicPulse from core SLA triage into
                  AI-assisted dispatch, geospatial twins, and verified citizen participation.
                </p>
              </div>
              <Link
                to="/signup"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-zinc-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
              >
                Start using Phase 01
                <Icon name="arrowRight" className="size-3.5" />
              </Link>
            </div>

            <div className="mt-10 grid gap-6 lg:grid-cols-3">
              {ROADMAP_PHASES.map((step, index) => (
                <div
                  key={step.phase}
                  className="flex flex-col rounded-xl border border-zinc-200 bg-zinc-50/50 p-6"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-semibold text-zinc-500">
                      {step.phase}
                    </span>
                    <span
                      className={`rounded-md px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ${
                        index === 0
                          ? "bg-zinc-900 text-white ring-zinc-900"
                          : "bg-white text-zinc-600 ring-zinc-200"
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-zinc-900">{step.title}</h3>

                  <ul className="mt-4 space-y-2.5 text-xs leading-5 text-zinc-600">
                    {step.items.map((point) => (
                      <li key={point} className="flex items-start gap-2">
                        <Icon
                          name={index === 0 ? "check" : "chevronRight"}
                          className="mt-0.5 size-3.5 shrink-0 text-zinc-500"
                        />
                        <span>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-200 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-zinc-500 sm:flex-row sm:px-6">
          <span>© {new Date().getFullYear()} CivicPulse. Civic & society issue resolution.</span>
          <div className="flex items-center gap-4">
            <a href="#capabilities" className="hover:text-zinc-900">
              Capabilities
            </a>
            <a href="#roadmap" className="hover:text-zinc-900">
              Roadmap
            </a>
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
