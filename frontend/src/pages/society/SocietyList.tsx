import { useEffect, useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import { Link } from "react-router-dom"

function SocietyList(){

  const [societies,setSocieties] = useState<any[]>([])

  useEffect(()=>{

    const fetchSocieties = async ()=>{
      const res = await API.get("/society")
      setSocieties(res.data)
    }

    fetchSocieties()

  },[])

  return(

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Societies
      </h1>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">

        {societies.map(society=>(
          <Link
            key={society._id}
            to={`/society/${society._id}`}
            className="bg-white p-5 rounded shadow hover:shadow-lg"
          >

            <h3 className="font-semibold text-lg">
              {society.name}
            </h3>

            <p className="text-gray-500 text-sm">
              {society.city}, {society.state}
            </p>

            <p className="text-gray-500 text-sm mt-2">
              Flats: {society.totalFlats}
            </p>

          </Link>
        ))}

      </div>

    </DashboardLayout>

  )

}

export default SocietyList
