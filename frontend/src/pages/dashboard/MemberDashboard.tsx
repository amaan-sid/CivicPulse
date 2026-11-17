import DashboardLayout from "@/components/layout/DashboardLayout"
import { Link } from "react-router-dom"

function MemberDashboard(){

  return(

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        My Assigned Issues
      </h1>

      <Link
        to="/issues"
        className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2.5 rounded-md shadow-sm"
      >
        View Assigned Issues
      </Link>

    </DashboardLayout>

  )

}

export default MemberDashboard
