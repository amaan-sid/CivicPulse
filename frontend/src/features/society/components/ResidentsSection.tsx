import { useEffect, useState } from "react";
import API from "@/services/api";
import type { Resident } from "@/types";
import toast from "react-hot-toast";
import ConfirmModal from "@/components/ui/ConfirmModal";
import CustomSelect, { type SelectOption } from "@/components/ui/CustomSelect";
import { User, UserCheck, Wrench, Shield, Trash2 } from "lucide-react";

type ResidentsSectionProps = {
  organizationId?: string
}

const ROLE_OPTIONS: SelectOption[] = [
  { value: "resident", label: "Resident", icon: <User size={14} className="text-slate-500" /> },
  { value: "member", label: "Member", icon: <UserCheck size={14} className="text-blue-500" /> },
  { value: "staff", label: "Staff", icon: <Wrench size={14} className="text-amber-500" /> },
  { value: "admin", label: "Admin", icon: <Shield size={14} className="text-purple-500" /> },
];

function ResidentsSection({ organizationId }: ResidentsSectionProps) {
  const [residents, setResidents] = useState<Resident[]>([]);
  const [loading, setLoading] = useState(true);
  const [residentToRemove, setResidentToRemove] = useState<Resident | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  useEffect(() => {
    const endpoint = organizationId ? `/society/residents?societyId=${organizationId}` : "/society/residents"
    API.get(endpoint)
      .then((res) => setResidents(res.data))
      .catch((err) => console.error("Failed to fetch residents", err))
      .finally(() => setLoading(false));
  }, [organizationId]);

  const handleUpdate = async (id: string, newValue: Resident['role']) => {
    const original = residents.find((r) => r._id === id);
    
    if (original && original.role !== newValue) {
      try {
        await API.put(`/society/residents/${id}`, { role: newValue, societyId: organizationId });
        setResidents((prev) =>
          prev.map((r) => (r._id === id ? { ...r, role: newValue } : r))
        );
        toast.success("Resident role updated");
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
        : `/society/residents/${residentToRemove._id}`
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

  if (loading) return <p className="text-slate-500 dark:text-slate-400">Loading residents...</p>;

  if (residents.length === 0) return <p className="text-slate-500 dark:text-slate-400">No residents found in this society.</p>;

  return (
    <div className="space-y-3">
      {residents.map((r) => {
        const initial = r.name ? r.name.charAt(0).toUpperCase() : "U";
        return (
          <div
            key={r._id}
            className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-slate-800/90 p-4 rounded-2xl shadow-xs hover:shadow-md border border-slate-200/70 dark:border-slate-700/80 transition-all duration-200"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400/20 to-blue-600/20 dark:from-sky-500/20 dark:to-blue-500/20 text-sky-700 dark:text-sky-300 font-bold flex items-center justify-center shrink-0 border border-sky-200/50 dark:border-sky-500/30 text-sm shadow-2xs">
                {initial}
              </div>
              <div>
                <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                  {r.name}
                </h4>
                <p className="text-[11px] text-slate-400 dark:text-slate-500 capitalize">
                  {r.role || "Resident"}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-36">
                <CustomSelect
                  value={r.role}
                  options={ROLE_OPTIONS}
                  size="sm"
                  align="right"
                  onChange={(val) => handleUpdate(r._id, val as any)}
                />
              </div>

              <button 
                onClick={() => setResidentToRemove(r)} 
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 hover:bg-rose-100 dark:hover:bg-rose-500/20 border border-rose-200/80 dark:border-rose-500/30 rounded-xl transition-all duration-150 cursor-pointer active:scale-95 shadow-2xs hover:shadow-xs shrink-0"
                title={`Remove ${r.name}`}
              >
                <Trash2 size={13} className="shrink-0" />
                <span>Remove</span>
              </button>
            </div>
          </div>
        );
      })}

      <ConfirmModal
        isOpen={Boolean(residentToRemove)}
        title="Remove Resident?"
        message={`Are you sure you want to remove "${residentToRemove?.name}" from this society? Their membership will be revoked.`}
        confirmText="Remove Resident"
        variant="danger"
        isLoading={isRemoving}
        onConfirm={handleConfirmRemove}
        onClose={() => setResidentToRemove(null)}
      />
    </div>
  );
}

export default ResidentsSection;