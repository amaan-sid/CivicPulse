import DashboardLayout from "../../layouts/DashboardLayout"
import { Link } from "react-router-dom"

function ResidentDashboard(){

  return(

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        My Society Issues
      </h1>

      <Link
        to="/issue-board"
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        View Issues
      </Link>

    </DashboardLayout>

  )

}

export default ResidentDashboard