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
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Societies</h1>
          <p className="mt-1 text-sm text-zinc-500">
            Manage registered communities and inspect society-level issues.
          </p>
        </div>

        <Link
          to="/create-society"
          className="inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-zinc-800"
        >
          <Icon name="plus" className="size-4" />
          Create Society
        </Link>
      </div>

      <Card className="mb-6 p-3.5">
        <div className="relative">
          <Icon
            name="search"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
          />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search societies by name, code, city, or state…"
            className="block w-full rounded-lg border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
          />
        </div>
      </Card>

      {loading ? (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-36 animate-pulse rounded-xl border border-zinc-200 bg-white" />
          ))}
        </div>
      ) : error ? (
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="py-14 text-center">
          <div className="mx-auto mb-3 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-500">
            <Icon name="building" className="size-5" />
          </div>
          <h3 className="text-sm font-semibold text-zinc-900">
            {societies.length > 0 ? "No matching societies" : "No societies created yet"}
          </h3>
          <p className="mt-1 text-xs text-zinc-500">
            {societies.length > 0
              ? "Try a different search keyword."
              : "Create your first society so residents and staff can join."}
          </p>
          {societies.length === 0 && (
            <Link
              to="/create-society"
              className="mt-4 inline-flex items-center gap-1.5 rounded-lg bg-zinc-900 px-3.5 py-2 text-xs font-medium text-white hover:bg-zinc-800"
            >
              <Icon name="plus" className="size-3.5" />
              Create Society
            </Link>
          )}
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((society) => (
            <Link key={society._id} to={`/society/${society._id}`} className="group block">
              <Card hover className="flex h-full flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex size-8 items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 text-zinc-700">
                      <Icon name="building" className="size-4" />
                    </div>
                    {society.code && (
                      <span className="rounded bg-zinc-100 px-2 py-0.5 font-mono text-xs font-medium text-zinc-700">
                        {society.code}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-3.5 text-sm font-semibold text-zinc-900 group-hover:underline group-hover:underline-offset-2">
                    {society.name}
                  </h3>
                  <p className="mt-1 inline-flex items-center gap-1 text-xs text-zinc-500">
                    <Icon name="pin" className="size-3.5" />
                    {society.city}, {society.state}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs">
                  <span className="text-zinc-600 tabular-nums">{society.totalFlats ?? "—"} flats</span>
                  <span className="inline-flex items-center gap-1 font-medium text-zinc-900">
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
