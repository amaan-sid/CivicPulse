import { useSelector } from "react-redux"
import type { RootState } from "../../app/store"

import ResidentDashboard from "./ResidentDashboard"
import StaffDashboard from "./StaffDashboard"
import AdminDashboard from "./AdminDashboard"

function Dashboard(){

  const user = useSelector((state:RootState)=>state.auth.user)

  if(user?.role === "admin"){
    return <AdminDashboard/>
  }

  if(user?.role === "staff"){
    return <StaffDashboard/>
  }

  return <ResidentDashboard/>

}

export default Dashboard