import { useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"
import { useNavigate } from "react-router-dom"

function ReportIssue() {

  const [title,setTitle] = useState("")
  const [category,setCategory] = useState("plumbing")
  const [description,setDescription] = useState("")
  const [severity,setSeverity] = useState("low")

  const navigate=useNavigate()

  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault()

    await API.post("/issues",{
      title,
      description,
      category,
      severity
    })

    alert("Issue created")
  }

  return (

    <DashboardLayout>
      <div className="flex justify-between items-center bg-white p-3 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">
            Report Issue
        </h1>
        <button
            onClick={()=>{navigate("/manageissues")}}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
            Issue board
        </button>
      </div>

      <div className="max-w-xl bg-white p-6 rounded shadow my-5">

        <form onSubmit={handleSubmit}>

          <input
            className="w-full border p-2 mb-4 rounded"
            placeholder="Issue Title"
            onChange={(e)=>setTitle(e.target.value)}
          />

          <textarea
            className="w-full border p-2 mb-4 rounded"
            placeholder="Description"
            onChange={(e)=>setDescription(e.target.value)}
          />

          <select
            className="w-full border p-2 mb-4 rounded"
            onChange={(e)=>setCategory(e.target.value)}
          >
            <option value="plumbing">Plumbing</option>
            <option value="electricity">Electricity</option>
            <option value="lift">Lift</option>
            <option value="security">Security</option>
            <option value="cleanliness">Cleanliness</option>
            <option value="water">Water</option>
          </select>

          <select
            className="w-full border p-2 mb-4 rounded"
            onChange={(e)=>setSeverity(e.target.value)}
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>

          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Submit Issue
          </button>

        </form>

      </div>

    </DashboardLayout>

  )
}

export default ReportIssue