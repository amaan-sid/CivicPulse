import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import { Link } from "react-router-dom"
import type { Issue } from "../../types/issue"
import SLATimer from "../../components/SLATimer"

function IssueList() {

  const [issues,setIssues] = useState<Issue[]>([])
  const [loading,setLoading] = useState(true)
  const [error,setError] = useState("")

  useEffect(()=>{

    const fetchIssues = async () => {

      try{

        const res = await API.get("/issues")

        setIssues(res.data)

      }catch(err:any){

        setError(err.response?.data?.message || "Failed to fetch issues")

      }finally{
        setLoading(false)
      }

    }

    fetchIssues()

  },[])

  const getPriorityColor = (priority:string) => {

    if(priority === "high") return "bg-red-100 text-red-600"
    if(priority === "medium") return "bg-yellow-100 text-yellow-600"
    return "bg-green-100 text-green-600"

  }

  const getStatusColor = (status:string) => {

    if(status === "resolved") return "bg-green-100 text-green-600"
    if(status === "in-progress") return "bg-blue-100 text-blue-600"
    return "bg-gray-100 text-gray-600"

  }

  if(loading){
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading issues...</p>
      </DashboardLayout>
    )
  }

  if(error){
    return (
      <DashboardLayout>
        <p className="text-red-500">{error}</p>
      </DashboardLayout>
    )
  }

  return (

    <DashboardLayout>

      <h2 className="text-2xl font-bold mb-6">
        Community Issues
      </h2>

      {issues.length === 0 && (
        <p className="text-gray-500">No issues reported yet.</p>
      )}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {issues.map(issue => (

          <Link
            key={issue._id}
            to={`/issues/${issue._id}`}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition"
          >

            <h3 className="font-semibold text-lg mb-2">
              {issue.title}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-2">
              {issue.description}
            </p>

            <div className="flex justify-between items-center">

              <div className="flex gap-2">

                <span className={`text-xs px-2 py-1 rounded ${getPriorityColor(issue.priority)}`}>
                  {issue.priority}
                </span>

                <span className={`text-xs px-2 py-1 rounded ${getStatusColor(issue.status)}`}>
                  {issue.status}
                </span>

              </div>

              <SLATimer
                createdAt={issue.createdAt}
                priority={issue.priority}
              />

            </div>

          </Link>

        ))}

      </div>

    </DashboardLayout>

  )
}

export default IssueList