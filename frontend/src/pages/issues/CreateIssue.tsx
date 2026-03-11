import { useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { ChevronLeft, Send, Loader2, AlertCircle } from "lucide-react"
import type { AppDispatch, RootState } from "../../app/store"
import { createIssue } from "../../features/issues/issueSlice"
import type { IssueCategory, IssueSeverity } from "../../features/issues/issueTypes"
import DashboardLayout from "../../layouts/DashboardLayout"

// Constants

const CATEGORIES: { value: IssueCategory; label: string }[] = [
  { value: "plumbing",     label: "Plumbing"     },
  { value: "electricity",  label: "Electricity"  },
  { value: "lift",         label: "Lift"          },
  { value: "security",     label: "Security"     },
  { value: "cleanliness",  label: "Cleanliness"  },
  { value: "water",        label: "Water"         }
]

const SEVERITIES: { value: IssueSeverity; label: string; color: string }[] = [
  { value: "low",    label: "Low",    color: "text-gray-600"   },
  { value: "medium", label: "Medium", color: "text-orange-600" },
  { value: "high",   label: "High",   color: "text-red-600"    }
]

// Form State

interface FormState {
  title:       string
  description: string
  category:    IssueCategory
  severity:    IssueSeverity
}

const DEFAULT_FORM: FormState = {
  title:       "",
  description: "",
  category:    "plumbing",
  severity:    "low"
}

// Component

export default function CreateIssue() {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { loading, error } = useSelector((state: RootState) => state.issues)

  const [form, setForm] = useState<FormState>(DEFAULT_FORM)

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm((prev) => ({ ...prev, [key]: value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const result = await dispatch(createIssue(form))
    if (createIssue.fulfilled.match(result)) {
      navigate("/issues")
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">

        {/* Back + title */}
        <div className="flex items-center gap-2 mb-6">
          <button
            type="button"
            onClick={() => navigate("/issues")}
            className="flex items-center gap-1 text-sm text-gray-400 hover:text-gray-700 transition-colors"
          >
            <ChevronLeft size={16} />
            Back
          </button>
          <span className="text-gray-300">/</span>
          <h1 className="text-xl font-bold text-gray-800">Report an Issue</h1>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-5"
        >
          {/* Error banner */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 text-red-600 text-sm rounded-xl p-3 border border-red-100">
              <AlertCircle size={15} className="shrink-0" />
              {error}
            </div>
          )}

          {/* Title */}
          <div className="space-y-1">
            <label htmlFor="title" className="block text-sm font-medium text-gray-700">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              id="title"
              type="text"
              required
              value={form.title}
              onChange={(e) => setField("title", e.target.value)}
              placeholder="e.g. Water leaking from pipe in Block B corridor"
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
            />
          </div>

          {/* Description */}
          <div className="space-y-1">
            <label htmlFor="description" className="block text-sm font-medium text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="description"
              required
              rows={4}
              value={form.description}
              onChange={(e) => setField("description", e.target.value)}
              placeholder="Describe the issue clearly — location, when it started, how it affects you..."
              className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
            />
          </div>

          {/* Category + Severity */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                id="category"
                value={form.category}
                onChange={(e) => setField("category", e.target.value as IssueCategory)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {CATEGORIES.map(({ value, label }) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label htmlFor="severity" className="block text-sm font-medium text-gray-700">
                Severity
              </label>
              <select
                id="severity"
                value={form.severity}
                onChange={(e) => setField("severity", e.target.value as IssueSeverity)}
                className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
              >
                {SEVERITIES.map(({ value, label, color }) => (
                  <option key={value} value={value} className={color}>{label}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 flex-1 justify-center bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-medium py-2.5 rounded-xl transition text-sm shadow-sm"
            >
              {loading
                ? <><Loader2 size={15} className="animate-spin" /> Submitting...</>
                : <><Send size={15} /> Submit Issue</>
              }
            </button>
            <button
              type="button"
              onClick={() => navigate("/issues")}
              className="px-4 py-2.5 text-sm text-gray-500 border border-gray-200 rounded-xl hover:bg-gray-50 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  )
}
