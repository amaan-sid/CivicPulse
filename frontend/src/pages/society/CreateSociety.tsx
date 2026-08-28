import { useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useDispatch } from "react-redux"
import { setUser } from "@/features/auth/authSlice"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import CustomSelect, { type SelectOption } from "@/components/ui/CustomSelect"

const ORG_TYPE_OPTIONS: SelectOption[] = [
  { value: "SOCIETY", label: "Housing Society" },
  { value: "HOSTEL", label: "Hostel" },
  { value: "CAMPUS", label: "Campus" },
];

function CreateSociety(){

  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [name,setName] = useState("")
  const [type,setType] = useState<"SOCIETY" | "HOSTEL" | "CAMPUS">("SOCIETY")
  const [address,setAddress] = useState("")
  const [city,setCity] = useState("")
  const [state,setState] = useState("")
  const [totalFlats,setTotalFlats] = useState("")

  const handleSubmit = async (e:React.FormEvent)=>{
    e.preventDefault()

    try {
      await API.post("/society/create",{ name, type, address, city, state, totalFlats })
      const res = await API.get("/auth/me")

      dispatch(setUser(res.data.user))

      toast.success("Organization created successfully!")
      navigate("/dashboard")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to create organization")
    }
  }

  return(

    <DashboardLayout>

      <h1 className="text-2xl font-bold mb-6">
        Create Organization
      </h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/60 dark:border-slate-700 max-w-md space-y-4 shadow-sm"
      >

        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
            Organization Type
          </label>
          <CustomSelect
            value={type}
            options={ORG_TYPE_OPTIONS}
            onChange={(val) => setType(val as any)}
          />
        </div>

        <input
          placeholder="Organization Name"
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
          placeholder="Total Flats / Rooms"
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