import { useParams } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"

function IssueDetails() {

  const { id } = useParams()

  const [issue,setIssue] = useState<any>(null)

  useEffect(()=>{

    const fetchIssue = async () => {

      const res = await API.get(`/issues/${id}`)

      setIssue(res.data)

    }

    fetchIssue()

  },[id])

  if(!issue) return <p>Loading...</p>

  return (

    <DashboardLayout>

      <div className="bg-white p-6 rounded shadow max-w-2xl">

        <h2 className="text-2xl font-bold mb-3">
          {issue.title}
        </h2>

        <p className="text-gray-600 mb-4">
          {issue.description}
        </p>

        <div className="flex gap-3">

          <span className="bg-yellow-100 text-yellow-600 px-2 py-1 rounded text-sm">
            Priority: {issue.priority}
          </span>

          <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">
            Status: {issue.status}
          </span>

        </div>

      </div>

    </DashboardLayout>

  )
}

export default IssueDetails