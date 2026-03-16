import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import { Link } from "react-router-dom"
import type { Issue } from "../../types/issue"

import Card from "../../components/ui/Card"
import Badge from "../../components/ui/Badge"
import SLATimer from "../../components/SLATimer"


function IssueList() {

  const [issues, setIssues] = useState<Issue[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {

    const fetchIssues = async () => {

      try {

        const res = await API.get("/issues")

        setIssues(res.data)

      } catch (err: any) {

        setError(err.response?.data?.message || "Failed to fetch issues")

      } finally {
        setLoading(false)
      }

    }

    fetchIssues()

  }, [])


  if (loading) {
    return (
      <DashboardLayout>
        <p className="text-gray-500">Loading issues...</p>
      </DashboardLayout>
    )
  }

  if (error) {
    return (
      <DashboardLayout>
        <p className="text-red-500">{error}</p>
      </DashboardLayout>
    )
  }


  return (

    <DashboardLayout>

      <div className="flex justify-between items-center mb-6">

        <h2 className="text-2xl font-bold">
          Community Issues
        </h2>

      </div>


      {issues.length === 0 && (
        <p className="text-gray-500">
          No issues reported yet.
        </p>
      )}


      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {issues.map(issue => (

          <Link
            key={issue._id}
            to={`/issues/${issue._id}`}
          >

            <Card>

              <h3 className="font-semibold text-lg mb-2">
                {issue.title}
              </h3>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {issue.description}
              </p>

              <p className="text-sm text-gray-500 mb-3">
                Reported by <span className="font-semibold text-gray-800">{issue.reportCount}</span> residents
              </p>

              <div className="flex justify-between items-center">

                <div className="flex gap-2">

                  <Badge
                    text={issue.priority}
                    variant={issue.priority}
                  />

                  <Badge
                    text={issue.status}
                    variant={issue.status}
                  />

                </div>

                <SLATimer
                  createdAt={issue.createdAt}
                  priority={issue.priority}
                />

              </div>

            </Card>

          </Link>

        ))}

      </div>

    </DashboardLayout>

  )
}

export default IssueList
