import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import type { Society } from "../../types/society";
import Card from "../../components/ui/Card";
import { Icon } from "../../components/ui/Icon";

function SocietyList() {
  const [societies, setSocieties] = useState<Society[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSocieties = async () => {
      try {
        const res = await API.get<Society[]>("/society");
        setSocieties(Array.isArray(res.data) ? res.data : []);
      } catch (err: unknown) {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to fetch societies.";
        setError(msg);
      } finally {
        setLoading(false);
      }
    };

    void fetchSocieties();
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return societies;
    return societies.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        (s.code || "").toLowerCase().includes(q) ||
        s.city.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q)
    );
  }, [societies, search]);

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Societies</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage registered residential communities and inspect each society&apos;s issue queue.
          </p>
        </div>

        <Link
          to="/create-society"
          className="inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs transition hover:bg-indigo-700"
        >
          <Icon name="plus" className="size-4" />
          Create Society
        </Link>
      </div>

      <Card className="mb-6 p-4">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search societies by name, code, city, or state…"
            className="block w-full rounded-xl border border-slate-300 bg-white py-2 pl-10 pr-3.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
          />
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-40 animate-pulse rounded-2xl border border-slate-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-rose-200 bg-rose-50/70">
          <p className="text-sm font-medium text-rose-700">{error}</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="py-14 text-center">
          <div className="mx-auto mb-3 flex size-11 items-center justify-center rounded-full bg-indigo-50 text-indigo-600">
            <Icon name="building" className="size-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">
            {societies.length > 0 ? "No matching societies" : "No societies created yet"}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {societies.length > 0
              ? "Try a different search keyword."
              : "Create your first society so residents and staff can join and report issues."}
          </p>
          {societies.length === 0 && (
            <Link
              to="/create-society"
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
            >
              <Icon name="plus" className="size-4" />
              Create Society
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((society) => (
            <Link key={society._id} to={`/society/${society._id}`} className="group block">
              <Card hover className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                      <Icon name="building" className="size-5" />
                    </div>
                    {society.code && (
                      <span className="rounded-lg bg-slate-100 px-2.5 py-1 font-mono text-xs font-semibold text-slate-700">
                        {society.code}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                    {society.name}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-slate-500">
                    <Icon name="pin" className="size-3.5" />
                    {society.city}, {society.state}
                  </p>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3.5 text-xs">
                  <span className="font-semibold text-slate-700">
                    {society.totalFlats ?? "—"} flats
                  </span>
                  <span className="inline-flex items-center gap-1 font-semibold text-indigo-600">
                    View issues
                    <Icon name="arrowRight" className="size-3.5" />
                  </span>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </DashboardLayout>
  );
}

export default SocietyList;
