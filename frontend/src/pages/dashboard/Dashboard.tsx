import { useSelector } from "react-redux"
import { Navigate } from "react-router-dom"
import type { RootState } from "@/app/store"

import ResidentDashboard from "./ResidentDashboard"
import MemberDashboard from "./MemberDashboard"
import AdminDashboard from "./AdminDashboard"

function Dashboard(){

  const user = useSelector((state:RootState)=>state.auth.user)

  if(user?.platformRole === "SUPER_ADMIN"){
    return <Navigate to="/super-admin" replace />
  }

  if(user?.role === "admin"){
    return <AdminDashboard/>
  }

  if(!user?.currentSocietyId){
    return <Navigate to="/join-society" replace />
  }

  if(user?.role === "member"){
    return <MemberDashboard/>
  }

  return <ResidentDashboard/>

}

export default Dashboard