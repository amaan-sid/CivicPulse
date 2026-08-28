import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "@/components/layout/DashboardLayout"
import API from "@/services/api"
import { useDispatch, useSelector } from "react-redux"
import { setUser } from "@/features/auth/authSlice"
import type { RootState } from "@/app/store"
import toast from "react-hot-toast"
import { ShieldCheck, ArrowLeft } from "lucide-react"

export default function JoinSociety() {
  const user = useSelector((state: RootState) => state.auth.user)
  const [societyCode, setsocietyCode] = useState("")
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()

  if (user?.platformRole === "SUPER_ADMIN") {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700 max-w-2xl mx-auto my-12 text-center">
          <div className="w-16 h-16 rounded-2xl bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Super Admin Account</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            As a Super Admin, your account manages global platform organizations and metrics. Society membership is reserved for residents and members.
          </p>
          <button
            onClick={() => navigate("/super-admin")}
            className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-xl hover:bg-purple-700 transition-colors shadow-sm shadow-purple-600/20 cursor-pointer"
          >
            <ArrowLeft size={18} />
            Go to Super Admin Portal
          </button>
        </div>
      </DashboardLayout>
    )
  }


  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault()
    const trimmedCode = societyCode.trim()
    if (!trimmedCode) return toast.error("Please enter an organization code")

    const isAlreadyMember = user?.memberships?.some(
      (m: any) =>
        typeof m.societyId === "object" &&
        m.societyId?.code?.toLowerCase() === trimmedCode.toLowerCase()
    )

    if (isAlreadyMember) {
      return toast.error("You are already joined in this organization")
    }

    try {
      setLoading(true)
      await API.post("/society/join", { societyCode: trimmedCode })
      const res = await API.get("/auth/me")

      dispatch(setUser(res.data.user))

      toast.success("Organization joined successfully!")
      setsocietyCode("")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to join organization")
    } finally {
      setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Join an Organization</h1>

      <form
        onSubmit={handleJoin}
        className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm border border-slate-200/60 dark:border-slate-700 max-w-md space-y-4"
      >
        
        <input
          placeholder="Enter Organization Code"
          value={societyCode}
          onChange={(e) => setsocietyCode(e.target.value)}
          className="w-full border border-slate-300 dark:border-slate-600 bg-transparent text-slate-800 dark:text-slate-200 p-3 rounded-xl outline-none focus:border-sky-500"
        />

        <button 
          className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold px-4 py-2.5 rounded-xl transition-colors cursor-pointer"
          disabled={loading}
        >
          {loading===true?"Joining...":"Join Organization"}
        </button>

      </form>
    </DashboardLayout>
  )
}