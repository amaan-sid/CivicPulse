import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import type { Issue } from "../../types/issue"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import SLATimer from "../../components/SLATimer"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"

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

  const open = issues.filter(i => i.status === "open")
  const progress = issues.filter(i => i.status === "in-progress")
  const resolved = issues.filter(i => i.status === "resolved")

  if(loading){
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading board...</p>
      </DashboardLayout>
    )
  }

  const toggleReport = async (issueid:string) =>{
    try {
        const response=await API.patch(`/issues/${issueid}/report`)
        const updatedIssue=response.data

        setIssues(
            (prevIssues)=>
                prevIssues.map(
                    (issue)=>(issue._id===updatedIssue._id?updatedIssue:issue)
                )
        )

    } catch (error) {
        console.error(error)
    }
  }

  const Column = ({title,data}:{title:string,data:Issue[]}) => (

    <div className="bg-gray-50 p-4 rounded-xl">

      <h2 className="font-semibold mb-4 text-gray-700">
        {title} ({data.length})
      </h2>

      {data.length === 0 && (
        <p className="text-sm text-gray-400">
          No issues
        </p>
      )}

      <div className="space-y-3">

        {data.map(issue=>{
            const voted = issue.reporters.includes(user?.id || "");
            return (

            <Card key={issue._id}>

                <h3 className="font-medium mb-2">
                {issue.title}
                </h3>

                <p className="text-sm text-gray-500 mb-3 line-clamp-2">
                {issue.description}
                </p>

                <div className="flex justify-between items-center">

                <div className="flex gap-2">
                    <Badge text={issue.severity} variant={issue.severity}/>
                    <Badge text={issue.status} variant={issue.status}/>
                    <div className="flex gap-2 bg-gray-100">
                        <p>{issue.reportCount}</p>
                        <button
                        onClick={() => toggleReport(issue._id)}
                        className={`ml-1 px-2 rounded font-bold transition-colors ${
                            voted 
                            ? "bg-blue-500 text-white" 
                            : "bg-gray-200 text-gray-600 hover:bg-gray-300"
                        }`}
                        >
                        {voted ? "−" : "+"}
                        </button>


                        {user?.role === "admin" && (
                            <button onClick={()=>navigate(`/issuedetails/${issue._id}`)}>
                                Details
                            </button>
                        )}
                        
                    </div>
                </div>

                <SLATimer
                    createdAt={issue.createdAt}
                    priority={issue.severity}
                />

                </div>

            </Card>
            )
        })}

      </div>

    </div>

  )

  return (

    <DashboardLayout>
      <div className="flex justify-between items-center bg-white p-3 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">
            Issue Board
        </h1>
        <button
            onClick={()=>{navigate("/report-issue")}}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Report issues
        </button>
      </div>
      

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-5">

        <Column title="Open" data={open}/>
        <Column title="In Progress" data={progress}/>
        <Column title="Resolved" data={resolved}/>

      </div>

    </DashboardLayout>
  )
}

export default ManageIssues