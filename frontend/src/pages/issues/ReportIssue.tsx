import { useState } from "react"
import API from "@/services/api"
import DashboardLayout from "@/components/layout/DashboardLayout"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import type { RootState } from "@/app/store"
import toast from "react-hot-toast"
import { ShieldCheck, ArrowLeft } from "lucide-react"
import CustomSelect, { type SelectOption } from "@/components/ui/CustomSelect"

const CATEGORY_OPTIONS: SelectOption[] = [
  { value: "plumbing", label: "Plumbing" },
  { value: "electricity", label: "Electricity" },
  { value: "lift", label: "Lift" },
  { value: "security", label: "Security" },
  { value: "cleanliness", label: "Cleanliness" },
  { value: "water", label: "Water" },
];

const SEVERITY_OPTIONS: SelectOption[] = [
  { value: "low", label: "Low Priority" },
  { value: "medium", label: "Medium Priority" },
  { value: "high", label: "High Priority" },
];

function ReportIssue() {
  const user = useSelector((state: RootState) => state.auth.user)
  const [title,setTitle] = useState("")
  const [category,setCategory] = useState("plumbing")
  const [description,setDescription] = useState("")
  const [severity,setSeverity] = useState("low")
  const [imageBase64, setImageBase64] = useState<string>("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const navigate=useNavigate()

  if (user?.platformRole === "SUPER_ADMIN") {
    return (
      <DashboardLayout>
        <div className="bg-white dark:bg-slate-800 p-8 rounded-md shadow-sm max-w-2xl mx-auto my-12 text-center">
          <div className="w-16 h-16 rounded-md bg-purple-50 dark:bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">Super Admin Access</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            As a Super Admin, your account manages global platform organizations and metrics. Complaint creation is reserved for organization residents and members.
          </p>
          <button
            onClick={() => navigate("/super-admin")}
            className="inline-flex items-center gap-2 bg-purple-600 text-white font-semibold px-6 py-3 rounded-md hover:bg-purple-700 transition-colors shadow-sm cursor-pointer"
          >
            <ArrowLeft size={18} />
            Go to Super Admin Portal
          </button>
        </div>
      </DashboardLayout>
    )
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setImageBase64(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e:React.FormEvent) => {

    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      await API.post("/issues",{
        title,
        description,
        category,
        severity,
        image: imageBase64
      })

      toast.success("Issue created successfully!")
      navigate("/manageissues")
    } catch (err: any) {
      console.error(err)
      toast.error(err.response?.data?.message || "Failed to create issue")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (

    <DashboardLayout>
      <div className="flex justify-between items-center bg-white dark:bg-slate-800 p-4 rounded-md shadow-sm">
        <h1 className="text-2xl font-bold mb-0 text-slate-800 dark:text-white tracking-tight">
            Report Issue
        </h1>
        <button
            onClick={()=>{navigate("/manageissues")}}
            className="bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold px-4 py-2 rounded-md hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors cursor-pointer"
        >
            Issue Board
        </button>
      </div>

      <div className="w-full bg-white dark:bg-slate-800 p-8 rounded-md shadow-sm my-6">

        <form onSubmit={handleSubmit}>

          <input
            className="w-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3 mb-5 rounded-md outline-none placeholder:text-slate-400"
            placeholder="Issue Title"
            onChange={(e)=>setTitle(e.target.value)}
          />

          <textarea
            className="w-full bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200 p-3 mb-5 rounded-md outline-none placeholder:text-slate-400 h-32 resize-y"
            placeholder="Description"
            onChange={(e)=>setDescription(e.target.value)}
          />

          <div className="mb-5 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Category
              </label>
              <CustomSelect
                value={category}
                options={CATEGORY_OPTIONS}
                onChange={(val) => setCategory(val)}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                Priority / Severity
              </label>
              <CustomSelect
                value={severity}
                options={SEVERITY_OPTIONS}
                onChange={(val) => setSeverity(val)}
              />
            </div>
          </div>
          
          <div className="mb-6">
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Attach Image (Optional)</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-3 rounded-md bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-sm file:border-0 file:text-sm file:font-semibold file:bg-sky-100 file:text-sky-700 hover:file:bg-sky-200 dark:file:bg-sky-950 dark:file:text-sky-300 transition-all cursor-pointer outline-none"
              onChange={handleImageChange}
            />
            {imageBase64 && (
              <img src={imageBase64} alt="Preview" className="mt-4 h-40 object-cover rounded-md shadow-sm" />
            )}
          </div>

          <button
            disabled={isSubmitting}
            className="w-full bg-sky-600 text-white px-6 py-3 rounded-md hover:bg-sky-500 disabled:opacity-70 transition-colors font-semibold shadow-sm mt-2 cursor-pointer"
          >
            {isSubmitting ? "Submitting..." : "Submit Issue"}
          </button>

        </form>

      </div>

    </DashboardLayout>

  )
}

export default ReportIssue