import { useState } from "react"
import { useNavigate } from "react-router-dom"
import DashboardLayout from "../../layouts/DashboardLayout"
import API from "../../services/api"
import { useDispatch } from "react-redux"
import { setUser } from "../../features/auth/authSlice"

export default function JoinSociety() {
  const [societyCode, setsocietyCode] = useState("")
  const [loading,setLoading]=useState(false)
  const navigate = useNavigate()
  const dispatch = useDispatch()


  const handleJoin = async (e:React.FormEvent)=>{
    e.preventDefault()
    if (!societyCode) return alert("Enter society Code")

    try {
        setLoading(true)
        await API.post("/society/join",{ societyCode })
        const res=await API.get("/auth/me")

        dispatch(setUser(res.data.user))
        
        alert("Society Joined")
    } catch (err) {
        console.error(err)
        alert("Failed to join society")
    }finally{
        setLoading(false)
    }
  }

  return (
    <DashboardLayout>
      <h1 className="text-2xl font-bold mb-6">Join a Society</h1>

      <form
        onSubmit={handleJoin}
        className="bg-white p-6 rounded shadow max-w-md space-y-4"
      >
        
        <input
          placeholder="Enter Society Code"
          value={societyCode}
          onChange={(e) => setsocietyCode(e.target.value)}
          className="border p-2 w-full"
        />

        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading===true?"Joining...":"Join"}
        </button>

        <h3>Or create a new society</h3>

        <button 
          type="button"
          onClick={() => navigate("/create-society")}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Create Society
        </button>
      </form>
    </DashboardLayout>
  )
}