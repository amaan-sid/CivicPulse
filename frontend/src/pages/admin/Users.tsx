import { useEffect, useMemo, useState } from "react";
import API from "../../services/api";
import DashboardLayout from "../../layouts/DashboardLayout";
import Card from "../../components/ui/Card";
import Badge from "../../components/ui/Badge";
import { Icon } from "../../components/ui/Icon";
import type { UserRole } from "../../types/user";

interface DirectoryUser {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  flatNumber?: string;
  societyLabel?: string;
  society?: { _id: string; name: string; code?: string };
  isActive?: boolean;
  createdAt?: string;
}

function Users() {
  const [users, setUsers] = useState<DirectoryUser[]>([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState<"all" | UserRole>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    API.get<DirectoryUser[]>("/users")
      .then((res) => setUsers(Array.isArray(res.data) ? res.data : []))
      .catch((err: unknown) => {
        const msg =
          (err as { response?: { data?: { message?: string } } })?.response?.data?.message ||
          "Failed to load users.";
        setError(msg);
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (roleFilter !== "all" && u.role !== roleFilter) return false;
      if (
        q &&
        !u.name.toLowerCase().includes(q) &&
        !u.email.toLowerCase().includes(q) &&
        !(u.society?.name || u.societyLabel || "").toLowerCase().includes(q)
      ) {
        return false;
      }
      return true;
    });
  }, [users, search, roleFilter]);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Users & Staff</h1>
        <p className="mt-1 text-sm text-zinc-500">
          Directory of residents, maintenance staff, and administrators across registered societies.
        </p>
      </div>

      <Card className="mb-6 p-3.5">
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Icon
              name="search"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-zinc-400"
            />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, or society…"
              className="block w-full rounded-lg border border-zinc-300 bg-white py-1.5 pl-9 pr-3 text-sm text-zinc-900 placeholder:text-zinc-400 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900"
            />
          </div>
          <div className="flex items-center gap-1.5">
            {(["all", "admin", "staff", "resident"] as const).map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRoleFilter(r)}
                className={`rounded-lg px-2.5 py-1.5 text-xs font-medium capitalize transition ${
                  roleFilter === r
                    ? "bg-zinc-900 text-white"
                    : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900"
                }`}
              >
                {r === "all" ? "All" : r}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {loading ? (
        <div className="h-48 animate-pulse rounded-xl border border-zinc-200 bg-white" />
      ) : error ? (
        <Card className="border-red-200 bg-red-50/50">
          <p className="text-sm text-red-700">{error}</p>
        </Card>
      ) : filtered.length === 0 ? (
        <Card className="py-12 text-center">
          <p className="text-sm font-medium text-zinc-700">No users match your filter.</p>
        </Card>
      ) : (
        <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-zinc-200 bg-zinc-50 text-xs font-medium text-zinc-500">
                <tr>
                  <th className="px-5 py-3">User</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Society</th>
                  <th className="px-5 py-3">Unit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200">
                {filtered.map((u) => (
                  <tr key={u._id} className="hover:bg-zinc-50/60">
                    <td className="px-5 py-3.5">
                      <p className="font-medium text-zinc-900">{u.name}</p>
                      <p className="text-xs text-zinc-500">{u.email}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge text={u.role} variant={u.role} dot={false} />
                    </td>
                    <td className="px-5 py-3.5 text-xs text-zinc-700">
                      {u.society?.name || u.societyLabel || "—"}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-zinc-500">
                      {u.flatNumber || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default Users;

