import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import API from "@/services/api"
import type { RootState } from "@/app/store"
import { setUser } from "@/features/auth/authSlice"
import { Building, Plus, LogIn } from "lucide-react"
import CustomSelect, { type SelectOption } from "@/components/ui/CustomSelect"

function SocietySwitcher() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const memberships = user?.memberships || []
  const [triedFetchingNames,setTriedFetchingNames] = useState(false)

  useEffect(() => {
    const hasMissingSocietyNames = memberships.some((membership) => {
      return typeof membership.societyId === "string" || !membership.societyId.name
    })

    if (!hasMissingSocietyNames || triedFetchingNames) return

    API.get("/auth/me")
      .then((res) => {
        dispatch(setUser(res.data.user))
      })
      .finally(() => setTriedFetchingNames(true))
  }, [dispatch, memberships, triedFetchingNames])

  const getSocietyId = (societyId: typeof memberships[number]["societyId"]) => {
    return typeof societyId === "string" ? societyId : societyId._id
  }

  const getSocietyLabel = (societyId: typeof memberships[number]["societyId"]) => {
    if (typeof societyId !== "string") {
      return societyId.name || "Unnamed society"
    }

    return triedFetchingNames ? "Society name unavailable" : "Loading society..."
  }

  const handleChange = async (societyId: string) => {
    if (!societyId || societyId === user?.currentSocietyId) return

    await API.post("/society/current", { societyId })
    const res = await API.get("/auth/me")

    dispatch(setUser(res.data.user))
  }

  const societyOptions: SelectOption[] = memberships.length === 0 
    ? [{ value: "", label: "No society joined", disabled: true }]
    : memberships.map((m) => ({
        value: getSocietyId(m.societyId),
        label: getSocietyLabel(m.societyId),
        badge: (
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700/80 text-slate-600 dark:text-slate-300 font-medium capitalize">
            {m.role}
          </span>
        ),
      }));

  return (
    <div className="mb-8 flex flex-wrap items-center justify-between gap-4 bg-white dark:bg-slate-800 p-5 rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-md bg-sky-50 dark:bg-sky-500/10 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
          <Building size={24} />
        </div>
        <div>
          <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Current Society</p>
          <div className="min-w-[220px]">
            <CustomSelect
              value={user?.currentSocietyId || ""}
              options={societyOptions}
              onChange={(val) => handleChange(val)}
              placeholder="Select society..."
              buttonClassName="bg-transparent hover:bg-slate-100/50 dark:hover:bg-slate-700/40 p-1 font-semibold text-lg text-slate-800 dark:text-white"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        {user?.platformRole !== "SUPER_ADMIN" && (
          <Link
            to="/join-society"
            className="flex items-center gap-2 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium px-4 py-2.5 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-all shadow-sm cursor-pointer"
          >
            <LogIn size={18} />
            Join Society
          </Link>
        )}

        {user?.platformRole === "SUPER_ADMIN" && (
          <Link
            to="/super-admin/organizations"
            className="flex items-center gap-2 bg-slate-900 dark:bg-purple-600 text-white font-medium px-4 py-2.5 rounded-md hover:bg-slate-800 dark:hover:bg-purple-500 transition-all shadow-sm cursor-pointer"
          >
            <Plus size={18} />
            Create Organization
          </Link>
        )}
      </div>
    </div>
  )
}

export default SocietySwitcher