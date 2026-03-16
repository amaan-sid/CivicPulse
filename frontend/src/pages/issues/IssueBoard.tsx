import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import type { Issue } from "../../types/issue"
import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import SLATimer from "../../components/SLATimer"

function IssueBoard() {

  const [issues,setIssues] = useState<Issue[]>([])
  const [loading,setLoading] = useState(true)

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

        {data.map(issue=>(
          <Card key={issue._id}>

            <h3 className="font-medium mb-2">
              {issue.title}
            </h3>

            <p className="text-sm text-gray-500 mb-3 line-clamp-2">
              {issue.description}
            </p>

            <div className="flex justify-between items-center">

              <div className="flex gap-2">
                <Badge text={issue.priority} variant={issue.priority}/>
                <Badge text={issue.status} variant={issue.status}/>
              </div>

              <SLATimer
                createdAt={issue.createdAt}
                priority={issue.priority}
              />

            </div>

          </Card>
        ))}

      </div>

    </div>

  )

  return (

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Issue Workflow Board
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

        <Column title="Open" data={open}/>
        <Column title="In Progress" data={progress}/>
        <Column title="Resolved" data={resolved}/>

      </div>

    </DashboardLayout>
  )
}

export default IssueBoard