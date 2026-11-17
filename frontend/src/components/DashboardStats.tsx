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
  danger?: boolean;
}> = [
  { key: "totalIssues", label: "Total Issues", icon: "inbox" },
  { key: "openIssues", label: "Open", icon: "alert" },
  { key: "inProgressIssues", label: "In Progress", icon: "clock" },
  { key: "resolvedIssues", label: "Resolved", icon: "check" },
  { key: "breachedIssues", label: "SLA Breached", icon: "shield", danger: true },
  { key: "totalSocieties", label: "Societies", icon: "building" },
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
          <div key={i} className="h-24 animate-pulse rounded-xl border border-zinc-200 bg-white" />
        ))}
      </div>
    );
  }

  if (error || !stats) {
    return (
      <Card className="border-red-200 bg-red-50/50">
        <p className="text-sm text-red-700">{error || "Stats unavailable."}</p>
      </Card>
    );
  }

  const categories = stats.categoryDistribution ?? [];
  const maxCategory = Math.max(1, ...categories.map((c) => c.count));

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {STAT_CARDS.map(({ key, label, icon, danger }) => {
          const val = Number(stats[key] ?? 0);
          return (
            <Card key={key}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500">{label}</p>
                  <p
                    className={`mt-1.5 text-2xl font-semibold tabular-nums tracking-tight ${
                      danger && val > 0 ? "text-red-600" : "text-zinc-900"
                    }`}
                  >
                    {val}
                  </p>
                </div>
                <div className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-600">
                  <Icon name={icon} className="size-4" />
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
              <h2 className="text-sm font-semibold text-zinc-900">Issues by category</h2>
              <p className="text-xs text-zinc-500">Breakdown across reported categories</p>
            </div>
            <span className="text-xs font-medium text-zinc-500 tabular-nums">
              {stats.highPriorityIssues} high priority
            </span>
          </div>
          <div className="space-y-3">
            {categories.map((item) => {
              const pct = Math.round((item.count / maxCategory) * 100);
              return (
                <div key={item._id}>
                  <div className="mb-1 flex items-center justify-between text-xs">
                    <span className="font-medium capitalize text-zinc-700">{item._id}</span>
                    <span className="font-medium tabular-nums text-zinc-900">{item.count}</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-zinc-100">
                    <div
                      className="h-full rounded-full bg-zinc-900 transition-all"
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
