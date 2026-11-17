import { useEffect, useState } from "react";
import API from "../services/api";
import Card from "./ui/Card";
import { Icon, type IconName } from "./ui/Icon";

interface CategoryStat {
  _id: string;
  count: number;
}

interface DashboardResponse {
  totalIssues: number;
  openIssues: number;
  inProgressIssues?: number;
  resolvedIssues: number;
  breachedIssues: number;
  highPriorityIssues: number;
  totalSocieties?: number;
  categoryDistribution?: CategoryStat[];
}

const STAT_CARDS: Array<{
  key: keyof DashboardResponse;
  label: string;
  icon: IconName;
  accent: string;
  danger?: boolean;
}> = [
  { key: "totalIssues", label: "Total Issues", icon: "inbox", accent: "bg-indigo-50 text-indigo-600" },
  { key: "openIssues", label: "Open", icon: "alert", accent: "bg-amber-50 text-amber-600" },
  { key: "inProgressIssues", label: "In Progress", icon: "clock", accent: "bg-sky-50 text-sky-600" },
  { key: "resolvedIssues", label: "Resolved", icon: "check", accent: "bg-emerald-50 text-emerald-600" },
  { key: "breachedIssues", label: "SLA Breached", icon: "shield", accent: "bg-rose-50 text-rose-600", danger: true },
  { key: "totalSocieties", label: "Societies", icon: "building", accent: "bg-violet-50 text-violet-600" },
];

function DashboardStats() {
  const [stats, setStats] = useState<DashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get<DashboardResponse>("/dashboard");
        setStats(res.data);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Could not load dashboard metrics.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-slate-200 bg-white p-5" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="border-rose-200 bg-rose-50/70">
        <p className="text-sm font-medium text-rose-700">{error || "Stats unavailable."}</p>
      </Card>
    );
  }

  const categories = stats.categoryDistribution ?? [];
  const maxCategory = Math.max(1, ...categories.map((c) => c.count));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, icon, accent, danger }) => {
          const val = Number(stats[key] ?? 0);
          return (
            <Card key={key} hover>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    {label}
                  </p>
                  <p
                    className={`mt-2 text-3xl font-bold tabular-nums tracking-tight ${
                      danger && val > 0 ? "text-rose-600" : "text-slate-900"
                    }`}
                  >
                    {val}
                  </p>
                </div>
                <div className={`flex size-10 items-center justify-center rounded-xl ${accent}`}>
                  <Icon name={icon} className="size-5" />
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {categories.length > 0 && (
        <Card>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Issues by Category</h2>
              <p className="text-xs text-slate-500">Distribution across maintenance categories</p>
            </div>
            <span className="text-xs font-semibold text-slate-500">
              {stats.highPriorityIssues} high priority
            </span>
          </div>
          <div className="space-y-3">
            {categories.map((item) => {
              const pct = Math.round((item.count / maxCategory) * 100);
              return (
                <div key={item._id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium capitalize text-slate-700">{item._id}</span>
                    <span className="font-semibold tabular-nums text-slate-900">{item.count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-indigo-600 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}
    </div>
  );
}

export default DashboardStats;
