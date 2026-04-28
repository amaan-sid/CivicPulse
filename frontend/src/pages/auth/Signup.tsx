import { useState } from "react"
import API from "../../services/api"
import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { setUser } from "../../features/auth/authSlice"

function Signup() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSignup = async (e:React.FormEvent) => {

    e.preventDefault()

    setError("")
    setLoading(true)

    try {

      const res=await API.post("/auth/signup",{
        name,
        email,
        password,
      })

      const user = res.data.user

      dispatch(setUser(user))

      navigate("/join-society")

    } catch (err:any) {

      setError(err.response?.data?.message || "Signup failed")

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      {/* option for signup using other means like google needs to be implemented */}

      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >

        <h2 className="text-2xl font-bold text-center mb-6">
          CivicsPulse Sign-up
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Name"
          onChange={(e)=>setName(e.target.value)}
        />

        <input
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Email"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Password"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <button onClick={()=>navigate("/login")} className="text-blue-800 py-2">Log in</button>

      </form>

    </div>
  )
}

export default Signup