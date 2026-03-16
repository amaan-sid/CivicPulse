import DashboardLayout from "../../layouts/DashboardLayout"
import { Link } from "react-router-dom"

function StaffDashboard(){

  return(

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        My Assigned Issues
      </h1>

      <Link
        to="/issues"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Assigned Issues
      </Link>

    </DashboardLayout>

  )

}

export default StaffDashboard