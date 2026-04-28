import { useState } from "react"
import API from "../../services/api"
import { useDispatch } from "react-redux"
import { setUser } from "../../features/auth/authSlice"
import { useNavigate } from "react-router-dom"

function Login() {

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const handleLogin = async (e:React.FormEvent) => {

    e.preventDefault()
    setError("")
    setLoading(true)

    try {

      const res = await API.post("/auth/login",{
        email,
        password
      })
      
      const user = res.data.user

      dispatch(setUser(user))

      if (!user.memberships || user.memberships.length === 0) {
        navigate("/join-society")
      } else {
        navigate("/dashboard")
      }

    } catch (err:any) {

      setError(err.response?.data?.message || "Login failed")

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleLogin}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >

        <h2 className="text-2xl font-bold text-center mb-6">
          CivicPulse Login
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-4">{error}</p>
        )}

        <input
          type="email"
          placeholder="Email"
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>setEmail(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full border rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
          onChange={(e)=>setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        <button onClick={()=>navigate("/signup")} className="text-blue-800 py-2">Sign up</button>

      </form>

    </div>
  )
}

export default Login