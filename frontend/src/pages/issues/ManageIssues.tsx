import { useEffect, useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/layout/DashboardLayout"
import type { Issue } from "@/types"
import Card from "@/components/ui/Card"
import Badge from "@/components/ui/Badge"
import SLATimer from "@/features/issues/components/SLATimer"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import { Plus, ChevronRight, Users, AlertTriangle } from "lucide-react"
import { isIssueBreached, isIssueExpired } from "@/utils/issueHelpers"

function ManageIssues() {
  const [issues,setIssues] = useState<Issue[]>([])
  const [loading,setLoading] = useState(true)
  const navigate=useNavigate()
  const user = useSelector((state:RootState)=>state.auth.user)

  useEffect(()=>{
    const fetchIssues = async () => {
      try{
        const res = await API.get("/issues")
        setIssues(res.data)
      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
    }
    fetchIssues()
  },[])

  const unexpired = issues.filter((i) => !isIssueExpired(i))
  const breached = unexpired.filter((i) => isIssueBreached(i))
  const open = unexpired.filter((i) => i.status === "open" && !isIssueBreached(i))
  const progress = unexpired.filter((i) => i.status === "in-progress" && !isIssueBreached(i))
  const resolved = unexpired.filter((i) => i.status === "resolved")

  if(loading){
    return (
      <DashboardLayout>
        <p className="text-slate-500 dark:text-slate-400">Loading board...</p>
      </DashboardLayout>
    )
  }

  const toggleReport = async (issueid:string) =>{
    const target = issues.find((i) => i._id === issueid)
    if (target && isIssueBreached(target)) {
      return
    }
    try {
        const response=await API.patch(`/issues/${issueid}/report`)
        const updatedIssue=response.data
        setIssues((prevIssues)=>prevIssues.map((issue)=>(issue._id===updatedIssue._id?updatedIssue:issue)))
    } catch (error) {
        console.error(error)
    }
  }

  const Column = ({title, data, isBreachedColumn}: {title: string, data: Issue[], isBreachedColumn?: boolean}) => (
    <div className={`p-5 rounded-md ${isBreachedColumn ? 'bg-rose-50/50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30' : 'bg-slate-100/50 dark:bg-slate-800/50'}`}>
      <div className="flex items-center justify-between mb-5">
        <h2 className={`font-bold tracking-tight flex items-center gap-1.5 ${isBreachedColumn ? 'text-rose-700 dark:text-rose-400' : 'text-slate-700 dark:text-slate-200'}`}>
          {isBreachedColumn && <AlertTriangle size={16} />}
          {title}
        </h2>
        <span className={`${isBreachedColumn ? 'bg-rose-100 dark:bg-rose-900/50 text-rose-700 dark:text-rose-300' : 'bg-white dark:bg-slate-700 text-slate-500 dark:text-slate-300'} text-xs font-bold px-2.5 py-1 rounded-sm shadow-sm`}>
          {data.length}
        </span>
      </div>

      {data.length === 0 && (
        <div className="text-center p-6 bg-slate-50 dark:bg-slate-900/50 rounded-md text-slate-400 dark:text-slate-500 text-sm font-medium">
          No issues in this column
        </div>
      )}

      <div className="space-y-4">
        {data.map(issue=>{
            const voted = issue.reporters.includes(user?.id || "");
            const isBreached = isIssueBreached(issue);
            return (
            <Card key={issue._id} className="p-5">
                <h3 className="font-bold text-slate-800 dark:text-white mb-2 leading-tight">
                  {issue.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2 leading-relaxed">
                  {issue.description}
                </p>

                <div className="flex flex-col gap-4">
                  <div className="flex justify-between items-center">
                    {isBreached ? (
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-sm bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300 shadow-sm">
                        <AlertTriangle size={12} /> SLA Breached
                      </span>
                    ) : (
                      <>
                        <div className="flex gap-2">
                          <Badge text={issue.severity} variant={issue.severity}/>
                        </div>
                        {issue.status !== "resolved" && (
                          <SLATimer
                            createdAt={issue.createdAt}
                            priority={issue.severity}
                            slaDeadline={issue.slaDeadline}
                            isEscalated={issue.isEscalated}
                            status={issue.status}
                          />
                        )}
                      </>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-900 rounded-md p-1">
                        <div className="flex items-center gap-1.5 px-2 text-xs font-semibold text-slate-600 dark:text-slate-400">
                          <Users size={14} className="text-slate-400 dark:text-slate-500" />
                          {issue.reportCount}
                        </div>
                        {!isBreached && issue.status !== "resolved" && (
                          <button
                            onClick={() => toggleReport(issue._id)}
                            className={`flex items-center justify-center w-7 h-7 rounded-md text-lg font-bold transition-all shadow-sm cursor-pointer ${
                                voted 
                                ? "bg-sky-600 text-white" 
                                : "bg-white dark:bg-slate-800 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700"
                            }`}
                          >
                            {voted ? "−" : "+"}
                          </button>
                        )}
                    </div>

                    {user?.role === "admin" && (
                        <button onClick={()=>navigate(`/issues/${issue._id}`)} className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:text-sky-700 dark:hover:text-sky-300 flex items-center gap-0.5 cursor-pointer">
                            Details <ChevronRight size={14} />
                        </button>
                    )}
                  </div>
                </div>
            </Card>
            )
        })}
      </div>
    </div>
  )

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 dark:text-white tracking-tight">
              Issue Board
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Manage and track the progress of community issues.</p>
        </div>
        {user?.platformRole !== "SUPER_ADMIN" && (
          <button
              onClick={()=>{navigate("/report-issue")}}
              className="flex items-center gap-2 bg-sky-600 text-white font-semibold px-5 py-2.5 rounded-md hover:bg-sky-500 transition-colors shadow-sm cursor-pointer"
          >
              <Plus size={18} />
              Report Issue
          </button>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 my-5">
        <Column title="SLA Breached" data={breached} isBreachedColumn={true} />
        <Column title="Open" data={open}/>
        <Column title="In Progress" data={progress}/>
        <Column title="Resolved" data={resolved}/>
      </div>
    </DashboardLayout>
  )
}

export default ManageIssues