import { useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"

function CreateSociety(){

  const [name,setName] = useState("")
  const [address,setAddress] = useState("")
  const [city,setCity] = useState("")
  const [state,setState] = useState("")
  const [totalFlats,setTotalFlats] = useState("")

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault()

    await API.post("/society",{ name,address, city, state, totalFlats })

    alert("Society created successfully")
  }

  return(

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Create Society
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow max-w-md space-y-4"
      >

        <input
          placeholder="Society Name"
          className="border p-2 w-full"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          placeholder="Address"
          className="border p-2 w-full"
          onChange={(e)=>setAddress(e.target.value)}
        />

        <input
          placeholder="City"
          className="border p-2 w-full"
          onChange={(e)=>setCity(e.target.value)}
        />

        <input
          placeholder="State"
          className="border p-2 w-full"
          onChange={(e)=>setState(e.target.value)}
        />

        <input
          placeholder="Total Flats"
          className="border p-2 w-full"
          onChange={(e)=>setTotalFlats(e.target.value)}
        />

        <button
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create
        </button>

      </form>

    </DashboardLayout>

  )

}

export default CreateSociety
