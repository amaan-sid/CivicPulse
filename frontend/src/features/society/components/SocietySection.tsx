import { useState, useEffect } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import API from "@/services/api"
import type { Society } from "@/types"
import toast from "react-hot-toast"
import ConfirmModal from "@/components/ui/ConfirmModal"
import { Building2, MapPin, Hash, Home, GraduationCap, Edit2, Check, ShieldAlert, UserCheck } from "lucide-react"

type EditableField = keyof Society

type FieldCardProps = {
  icon: any
  label: string
  field: EditableField
  editing: EditableField | null
  value: string
  society: Society | null
  canEdit: boolean
  setValue: (val: string) => void
  startEdit: (field: EditableField, current: any) => void
  saveEdit: () => void
}

const FieldCard = ({
  icon: Icon,
  label,
  field,
  editing,
  value,
  society,
  canEdit,
  setValue,
  startEdit,
  saveEdit
}: FieldCardProps) => (
  <div className="bg-white dark:bg-slate-800 p-5 rounded-md shadow-sm flex flex-col justify-between transition-all">
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
            <Icon size={18} />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">{label}</span>
        </div>

        {canEdit && (
          editing === field ? (
            <button
              onClick={saveEdit}
              className="flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300 hover:bg-emerald-200 cursor-pointer transition-colors"
            >
              <Check size={14} /> Save
            </button>
          ) : (
            <button
              onClick={() => startEdit(field, society?.[field])}
              className="flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-md text-sky-600 dark:text-sky-400 hover:bg-sky-50 dark:hover:bg-sky-500/10 cursor-pointer transition-colors"
            >
              <Edit2 size={12} /> Edit
            </button>
          )
        )}
      </div>

      <div className="pt-1">
        {editing === field ? (
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full bg-slate-100 dark:bg-slate-900 rounded-md outline-none text-slate-900 dark:text-white px-3 py-2 text-sm font-semibold"
            autoFocus
          />
        ) : (
          <p className="text-lg font-bold text-slate-800 dark:text-white break-words">
            {society?.[field] !== undefined && society?.[field] !== null ? String(society[field]) : "-"}
          </p>
        )}
      </div>
    </div>
  </div>
)

type SocietySectionProps = {
  organizationId?: string
}

function SocietySection({ organizationId }: SocietySectionProps) {
  const user = useSelector((state: RootState) => state.auth.user)
  const [society, setSociety] = useState<Society | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<EditableField | null>(null)
  const [value, setValue] = useState("")
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const fetchSociety = async () => {
      try {
        const endpoint = organizationId ? `/society/${organizationId}` : "/society/current"
        const res = await API.get(endpoint)
        setSociety(res.data)
      } catch (err: any) {
        console.error(err)
        toast.error(err.response?.data?.message || "Failed to fetch organization details")
      } finally {
        setLoading(false)
      }
    }
    fetchSociety()
  }, [organizationId])

  const startEdit = (field: EditableField, current: any) => {
    setEditing(field)
    setValue(current !== undefined && current !== null ? String(current) : "")
  }

  const saveEdit = async () => {
    if (!editing || !society) return

    const updatedValue = editing === "totalFlats" ? Number(value) : value

    try {
      await API.patch("/society/update", { [editing]: updatedValue, societyId: organizationId || society._id })

      setSociety((prev) => (prev ? { ...prev, [editing]: updatedValue } : prev))

      toast.success("Organization updated!")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to update organization")
    }

    setEditing(null)
  }

  const handleDeleteSociety = async () => {
    setIsDeleting(true)
    try {
      await API.delete("/society", { data: { societyId: organizationId || society?._id } })
      toast.success("Organization deleted successfully")
      window.location.href = organizationId ? "/managesociety" : "/join-society"
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to delete organization")
      setIsDeleting(false)
      setIsDeleteModalOpen(false)
    }
  }

  if (loading) return <p className="text-slate-500 dark:text-slate-400 p-4">Loading organization details...</p>

  if (!society) return <p className="text-slate-500 dark:text-slate-400 p-4">No organization found.</p>

  // Authorization check for Edit/Delete privileges
  const isSuperAdmin = user?.platformRole === "SUPER_ADMIN"
  const targetId = organizationId || society._id
  const userMembership = user?.memberships?.find(
    (m: any) => (typeof m.societyId === "string" ? m.societyId : m.societyId._id) === targetId
  )
  const userId = user?._id || user?.id
  const isSocietyAdmin =
    user?.role === "admin" ||
    userMembership?.role === "admin" ||
    (society.admin && (typeof society.admin === "string" ? society.admin === userId : society.admin._id === userId))

  const canEdit = Boolean(isSuperAdmin || isSocietyAdmin)

  const fieldProps = { editing, value, society, canEdit, setValue, startEdit, saveEdit }
  const orgTypeLabel = society.type
    ? society.type === "HOSTEL"
      ? "Hostel"
      : society.type === "CAMPUS"
      ? "Campus"
      : "Society"
    : "Organization"
  const flatsLabel =
    society.type === "HOSTEL" ? "Total Rooms" : society.type === "CAMPUS" ? "Total Units" : "Total Flats"

  const getTypeIcon = (type?: string) => {
    switch (type) {
      case "HOSTEL":
        return <Home size={18} />
      case "CAMPUS":
        return <GraduationCap size={18} />
      default:
        return <Building2 size={18} />
    }
  }

  const adminName =
    typeof society.admin === "object" && society.admin?.name
      ? society.admin.name
      : "Unassigned"
  const adminEmail =
    typeof society.admin === "object" && society.admin?.email
      ? society.admin.email
      : null

  return (
    <div className="space-y-6">
      {/* Grid of Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <FieldCard icon={Building2} label="Organization Name" field="name" {...fieldProps} />

        {/* Read-Only Type Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              {getTypeIcon(society.type)}
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Organization Type
            </span>
          </div>
          <p className="text-lg font-bold text-slate-800 dark:text-white capitalize">
            {orgTypeLabel}
          </p>
        </div>

        {/* Admin Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-md bg-sky-50 dark:bg-sky-500/10 text-sky-600 dark:text-sky-400 flex items-center justify-center">
              <UserCheck size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Organization Admin
            </span>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800 dark:text-white">{adminName}</p>
            {adminEmail && <p className="text-xs text-slate-400 mt-0.5">{adminEmail}</p>}
          </div>
        </div>

        {/* Code Card */}
        <div className="bg-white dark:bg-slate-800 p-5 rounded-md shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-2.5 mb-3">
            <div className="w-9 h-9 rounded-md bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <Hash size={18} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Invite Code
            </span>
          </div>
          <p className="text-lg font-mono font-bold text-slate-800 dark:text-white">
            {society.code}
          </p>
        </div>

        <FieldCard icon={MapPin} label="Address" field="address" {...fieldProps} />
        <FieldCard icon={MapPin} label="City" field="city" {...fieldProps} />
        <FieldCard icon={MapPin} label="State" field="state" {...fieldProps} />
        <FieldCard icon={Home} label={flatsLabel} field="totalFlats" {...fieldProps} />
      </div>

      {/* Danger Zone (ONLY SHOWN TO AUTHORIZED ADMINS & SUPER ADMINS) */}
      {canEdit && (
        <div className="p-6 rounded-md bg-red-50/50 dark:bg-red-500/5 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-red-700 dark:text-red-400 font-bold mb-1">
              <ShieldAlert size={18} />
              <span>Danger Zone</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Deleting this {orgTypeLabel.toLowerCase()} will permanently erase all associated data, issues, and member records.
            </p>
          </div>

          <button
            className="bg-red-600 hover:bg-red-700 text-white font-semibold text-xs px-5 py-2.5 rounded-md transition-all shadow-sm cursor-pointer shrink-0"
            onClick={() => setIsDeleteModalOpen(true)}
          >
            Delete {orgTypeLabel}
          </button>
        </div>
      )}

      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title={`Delete ${orgTypeLabel}?`}
        message={`Are you sure you want to delete "${society.name}"? This action cannot be undone.`}
        confirmText={`Delete ${orgTypeLabel}`}
        variant="danger"
        isLoading={isDeleting}
        onConfirm={handleDeleteSociety}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  )
}

export default SocietySection