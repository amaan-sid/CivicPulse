import DashboardLayout from "../../layouts/DashboardLayout"
import DashboardStats from "../../components/DashboardStats"

function AdminDashboard(){

  return(

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <DashboardStats/>

    </DashboardLayout>

  )

}

export default AdminDashboard