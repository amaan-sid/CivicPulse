import { useEffect, useState } from "react"
import API from "../services/api"
import Card from "./ui/Card"

interface Stats {
  total: number
  open: number
  inProgress: number
  resolved: number
}

function DashboardStats() {

  const [stats,setStats] = useState<Stats>({
    total: 0,
    open: 0,
    inProgress: 0,
    resolved: 0
  })

  useEffect(()=>{

    const fetchStats = async ()=>{

      try{

        const res = await API.get("/society")

        const issues = res.data

        const total = issues.length
        const open = issues.filter((i:any)=>i.status==="open").length
        const inProgress = issues.filter((i:any)=>i.status==="in-progress").length
        const resolved = issues.filter((i:any)=>i.status==="resolved").length

        setStats({
          total,
          open,
          inProgress,
          resolved
        })

      }catch(err){
        console.error(err)
      }

    }

    fetchStats()

  },[])


  const StatCard = ({title,value}:{title:string,value:number}) => (
    <Card>
      <p className="text-sm text-gray-500 mb-1">
        {title}
      </p>
      <p className="text-2xl font-bold">
        {value}
      </p>
    </Card>
  )


  return (

    <div className="grid md:grid-cols-4 gap-5 mb-8">

      <StatCard title="Total Issues" value={stats.total}/>
      <StatCard title="Open Issues" value={stats.open}/>
      <StatCard title="In Progress" value={stats.inProgress}/>
      <StatCard title="Resolved Issues" value={stats.resolved}/>

    </div>

  )

}

export default DashboardStats