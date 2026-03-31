import { useState } from "react"
import API from "../../services/api"
import { useNavigate } from "react-router-dom"

function Signup() {

  const navigate = useNavigate()

  const [name,setName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")
  const [role,setRole] = useState("resident")
  const [flatNumber,setFlatNumber] = useState("")
  const [society,setSociety] = useState("")
  const [error,setError] = useState("")
  const [loading,setLoading] = useState(false)

  const handleSignup = async (e:React.FormEvent) => {

    e.preventDefault()

    setError("")

    if ((role === "resident" || role === "staff") && !society) {
      setError("Please enter a society name or ID.")
      return
    }

    setLoading(true)

    try {

      await API.post("/auth/signup",{
        name,
        email,
        password,
        role,
        flatNumber,
        society
      })

      alert("Signup successful")

      navigate("/login")

    } catch (err:any) {

      setError(err.response?.data?.message || "Signup failed")

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">

      <form
        onSubmit={handleSignup}
        className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md"
      >

        <h2 className="text-2xl font-bold text-center mb-6">
          Create Account
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

        <select
          className="w-full border rounded-lg p-2 mb-4"
          onChange={(e)=>setRole(e.target.value)}
        >
          <option value="resident">Resident</option>
          <option value="staff">Staff</option>
          <option value="admin">Admin</option>
        </select>

        {(role === "resident" || role === "staff") && (
          <>
            <input
              className="w-full border rounded-lg p-2 mb-4"
              placeholder="Flat Number"
              onChange={(e) => setFlatNumber(e.target.value)}
            />

            <input
              className="w-full border rounded-lg p-2 mb-2"
              placeholder="Society name, code, or ID"
              value={society}
              onChange={(e) => setSociety(e.target.value)}
            />

            <p className="text-xs text-gray-500 mb-6">
              You can enter any society ID, code, name, or number. The account will still be created even if it is not linked yet.
            </p>
          </>
        )}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? "Creating..." : "Signup"}
        </button>

        <p className="text-center mt-4 text-gray-600 text-sm">
          Already have an account?{" "}
          <button 
            type="button" 
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline"
          >
            Login
          </button>
        </p>

      </form>

    </div>
  )
}

export default Signup
