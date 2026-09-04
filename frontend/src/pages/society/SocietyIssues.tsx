import { useParams, useNavigate } from "react-router-dom"
import DashboardLayout from "@/components/layout/DashboardLayout"
import SocietyIssuesSection from "@/features/society/components/SocietyIssuesSection"
import { ArrowLeft } from "lucide-react"

function SocietyIssues() {
  const { id } = useParams()
  const navigate = useNavigate()

  if (!id) {
    return (
      <DashboardLayout>
        <p className="text-slate-500 p-4">No organization specified.</p>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => navigate("/managesociety")}
          className="p-2.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:text-sky-600 dark:hover:text-sky-400 transition-all shadow-sm cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white tracking-tight">
          Organization Issues
        </h1>
      </div>

      <SocietyIssuesSection organizationId={id} />
    </DashboardLayout>
  )
}

export default SocietyIssues
