import { useEffect, useState, useMemo } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "@/app/store";
import API from "@/services/api";
import type { Resident } from "@/types";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect, { type SelectOption } from "@/components/ui/CustomSelect";
import { User, UserCheck, Wrench, Shield, Trash2, Search, X, Users, Mail, AtSign } from "lucide-react";
import UserAvatar from "@/components/common/UserAvatar";

type ResidentsSectionProps = {
  organizationId?: string;
};

const ROLE_OPTIONS: SelectOption[] = [
  { value: "resident", label: "Resident", icon: <User size={14} className="text-emerald-500" /> },
  { value: "member", label: "Member", icon: <UserCheck size={14} className="text-blue-500" /> },
  { value: "staff", label: "Staff", icon: <Wrench size={14} className="text-amber-500" /> },
  { value: "admin", label: "Admin", icon: <Shield size={14} className="text-purple-500" /> },
];

function ResidentsSection({ organizationId }: ResidentsSectionProps) {
  const currentUser = useSelector((state: RootState) => state.auth.user);
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<string>("all");
  const [residentToRemove, setResidentToRemove] = useState<Resident | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  // Check if current logged-in user has admin privileges to edit roles or remove members
  const canManage =
    currentUser?.platformRole === "SUPER_ADMIN" ||
    currentUser?.role === "admin" ||
    currentUser?.memberships?.some(
      (m) =>
        (typeof m.societyId === "string" ? m.societyId : m.societyId?._id) === organizationId &&
        m.role === "admin"
    );

  useEffect(() => {
    const endpoint = organizationId
      ? `/society/residents?societyId=${organizationId}`
      : "/society/residents";

    setLoading(true);
    API.get(endpoint)
      .then((res) => setResidents(Array.isArray(res.data) ? res.data : []))
      .catch((err) => console.error("Failed to fetch residents", err))
      .finally(() => setLoading(false));
  }, [organizationId]);

  const handleUpdate = async (id: string, newValue: Resident["role"]) => {
    const original = residents.find((r) => r._id === id);

    if (original && original.role !== newValue) {
      try {
        await API.put(`/society/residents/${id}`, { role: newValue, societyId: organizationId });
        setResidents((prev) =>
          prev.map((r) => (r._id === id ? { ...r, role: newValue } : r))
        );
        toast.success(`${original.name}'s role updated to ${newValue}`);
      } catch (err: any) {
        console.error("Failed to update resident", err);
        toast.error(err.response?.data?.message || "Failed to update resident role");
      }
    }
  };

  const handleConfirmRemove = async () => {
    if (!residentToRemove) return;

    setIsRemoving(true);
    try {
      const endpoint = organizationId
        ? `/society/residents/${residentToRemove._id}?societyId=${organizationId}`
        : `/society/residents/${residentToRemove._id}`;
      await API.delete(endpoint, { data: { societyId: organizationId } });
      setResidents((prev) => prev.filter((r) => r._id !== residentToRemove._id));
      toast.success(`${residentToRemove.name} removed from organization`);
      setResidentToRemove(null);
    } catch (err: any) {
      console.error("Failed to remove resident", err);
      toast.error(err.response?.data?.message || "Failed to remove resident");
    } finally {
      setIsRemoving(false);
    }
  };

  // Role count stats
  const roleCounts = useMemo(() => {
    return {
      all: residents.length,
      admin: residents.filter((r) => r.role === "admin").length,
      staff: residents.filter((r) => r.role === "staff").length,
      member: residents.filter((r) => r.role === "member").length,
      resident: residents.filter((r) => r.role === "resident").length,
    };
  }, [residents]);

  // Filtered residents based on search and role filter
  const filteredResidents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    return residents.filter((r) => {
      const matchesRole =
        selectedRoleFilter === "all" || r.role === selectedRoleFilter;
      const matchesSearch =
        !q ||
        r.name.toLowerCase().includes(q) ||
        (r.username && r.username.toLowerCase().includes(q)) ||
        (r.email && r.email.toLowerCase().includes(q)) ||
        (r.flatNumber && r.flatNumber.toLowerCase().includes(q));

      return matchesRole && matchesSearch;
    });
  }, [residents, searchQuery, selectedRoleFilter]);

  const getRoleBadge = (role: Resident["role"]) => {
    switch (role) {
      case "admin":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300">
            <Shield size={11} /> Admin
          </span>
        );
      case "staff":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300">
            <Wrench size={11} /> Staff
          </span>
        );
      case "member":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300">
            <UserCheck size={11} /> Member
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
            <User size={11} /> Resident
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center space-y-3">
        <div className="w-8 h-8 border-3 border-sky-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Loading residents & members...</p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* DIRECTORY HEADER */}
      <div className="bg-white dark:bg-slate-800 p-5 rounded-md shadow-sm border border-slate-100 dark:border-slate-700/60 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                Residents & Members Directory
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold bg-sky-100 text-sky-700 dark:bg-sky-500/20 dark:text-sky-300">
                {residents.length} Total
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Full directory of all residents, members, staff, and administrators in this organization.
            </p>
          </div>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-700/60">
          {/* SEARCH INPUT */}
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, @username, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 text-xs rounded-md bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5"
                title="Clear search"
              >
                <X size={13} />
              </button>
            )}
          </div>

          {/* ROLE FILTER TABS */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
            {[
              { id: "all", label: "All", count: roleCounts.all },
              { id: "resident", label: "Residents", count: roleCounts.resident },
              { id: "member", label: "Members", count: roleCounts.member },
              { id: "staff", label: "Staff", count: roleCounts.staff },
              { id: "admin", label: "Admins", count: roleCounts.admin },
            ].map((tab) => {
              const active = selectedRoleFilter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedRoleFilter(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                    active
                      ? "bg-sky-600 text-white shadow-xs"
                      : "bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <span>{tab.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-extrabold ${
                      active
                        ? "bg-white/20 text-white"
                        : "bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200"
                    }`}
                  >
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* RESIDENTS FULL LIST */}
      {residents.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-md text-center border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-2">
          <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center mx-auto text-slate-400">
            <Users size={22} />
          </div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No members or residents yet</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">Share your organization code to allow people to join.</p>
        </div>
      ) : filteredResidents.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 p-10 rounded-md text-center border border-slate-100 dark:border-slate-700/60 shadow-sm space-y-2">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">No members found</p>
          <p className="text-xs text-slate-400 dark:text-slate-500">No people matched &quot;{searchQuery}&quot; with current filter.</p>
          <button
            onClick={() => {
              setSearchQuery("");
              setSelectedRoleFilter("all");
            }}
            className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline pt-2 cursor-pointer inline-block"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-2.5">
          {filteredResidents.map((r) => {
            const isSelf = currentUser?._id === r._id || currentUser?.id === r._id;

            return (
              <div
                key={r._id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-800 p-4 rounded-md shadow-sm border border-slate-100 dark:border-slate-700/60 hover:border-slate-300 dark:hover:border-slate-600 transition-all duration-150"
              >
                {/* USER PROFILE INFO */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                  <UserAvatar
                    src={r.profilePic}
                    gender={r.gender}
                    name={r.name}
                    className="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-700 shrink-0 shadow-xs"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate">
                        {r.name}
                      </h4>
                      {isSelf && (
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          You
                        </span>
                      )}
                      {getRoleBadge(r.role)}
                    </div>

                    <div className="flex items-center gap-2 flex-wrap mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {r.username && (
                        <span className="font-semibold text-sky-600 dark:text-sky-400 flex items-center gap-0.5">
                          <AtSign size={11} className="inline opacity-70" />
                          {r.username}
                        </span>
                      )}
                      {r.email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail size={11} className="shrink-0 opacity-60" />
                          <span className="truncate">{r.email}</span>
                        </span>
                      )}
                      {r.flatNumber && (
                        <span className="text-[10px] font-medium px-1.5 py-0.2 rounded bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300">
                          Flat: {r.flatNumber}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* ROLE ACTIONS */}
                <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-center pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-700/60 w-full sm:w-auto justify-end">
                  {canManage ? (
                    <>
                      <div className="w-36">
                        <CustomSelect
                          value={r.role}
                          options={ROLE_OPTIONS}
                          size="sm"
                          align="right"
                          disabled={isSelf && currentUser?.role === "admin"}
                          onChange={(val) => handleUpdate(r._id, val as any)}
                        />
                      </div>

                      {!isSelf && (
                        <button
                          onClick={() => setResidentToRemove(r)}
                          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 rounded-md transition-all duration-150 cursor-pointer shadow-xs shrink-0"
                          title={`Remove ${r.name}`}
                        >
                          <Trash2 size={13} className="shrink-0" />
                          <span className="hidden sm:inline">Remove</span>
                        </button>
                      )}
                    </>
                  ) : (
                    <div>{getRoleBadge(r.role)}</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CONFIRM REMOVE MODAL */}
      <ConfirmModal
        isOpen={Boolean(residentToRemove)}
        title="Remove Member?"
        message={`Are you sure you want to remove "${residentToRemove?.name}" from this organization? Their membership will be revoked.`}
        confirmText="Remove Member"
        variant="danger"
        isLoading={isRemoving}
        onConfirm={handleConfirmRemove}
        onClose={() => setResidentToRemove(null)}
      />
    </div>
  );
}

export default ResidentsSection;