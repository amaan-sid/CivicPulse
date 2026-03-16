import { useParams, Link } from "react-router-dom"
import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"

function SocietyIssues(){

  const { id } = useParams()

  const [issues,setIssues] = useState<any[]>([])

  useEffect(()=>{

    const fetchIssues = async ()=>{
      const res = await API.get(`/society/${id}/issues`)
      setIssues(res.data)
    }

    fetchIssues()

  },[id])

  return(

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Society Issues
      </h1>

      {issues.length === 0 && (
        <p className="text-gray-500">
          No issues reported in this society.
        </p>
      )}

      {/* GRID LAYOUT */}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {issues.map(issue => (

          <Link
            key={issue._id}
            to={`/issues/${issue._id}`}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg hover:-translate-y-1 transition"
          >

            <h3 className="font-semibold text-lg mb-2">
              {issue.title}
            </h3>

            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
              {issue.description}
            </p>

            <div className="text-xs text-gray-500">
              Status: {issue.status}
            </div>

          </Link>

        ))}

      </div>

    </DashboardLayout>

  )

}

export default SocietyIssues
