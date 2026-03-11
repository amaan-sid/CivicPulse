import { useState } from "react"
import API from "../../services/api"
import DashboardLayout from "../../layouts/DashboardLayout"

function CreateIssue() {

  const [title,setTitle] = useState("")
  const [description,setDescription] = useState("")
  const [priority,setPriority] = useState("medium")

  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault()

    await API.post("/issues",{
      title,
      description,
      priority
    })

    alert("Issue created")
  }

  return (

    <DashboardLayout>

      <div className="max-w-xl bg-white p-6 rounded shadow">

        <h2 className="text-xl font-bold mb-4">
          Report Issue
        </h2>

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
            onChange={(e)=>setPriority(e.target.value)}
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

export default CreateIssue