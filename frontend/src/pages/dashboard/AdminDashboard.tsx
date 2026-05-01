import DashboardLayout from "../../layouts/DashboardLayout"
import DashboardStats from "../../components/DashboardStats"
import API from "../../services/api"
import { useEffect, useState } from "react"

function AdminDashboard(){
  const [societyCode,setsocietyCode] = useState<string>("")
  useEffect(()=>{
    const fetchsociety=async ()=>{
      try {
        const res=await API.get("/society/current")
        console.log(res.data)
        console.log("hi")
        setsocietyCode(res.data.code)
        
      } catch (error) {
        console.error(error)
      }
    }
    fetchsociety()
  },[])
  

  return(

    <DashboardLayout>
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-6">
          Admin Dashboard
        </h1>

        {societyCode!="" && (<p className="text-2xl font-bold mb-6">{societyCode}</p>)}
      </div>
      
      <DashboardStats/>//these stats are also available at manage issues tab so are they even required here?

    </DashboardLayout>

  )

}

export default AdminDashboard