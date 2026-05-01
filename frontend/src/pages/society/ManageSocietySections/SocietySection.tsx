import { useState, useEffect } from "react"
import API from "../../../services/api"
import type { Society } from "../../../types/society"

type EditableField = keyof Society

function SocietySection() {
  const [society, setSociety] = useState<Society | null>(null)
  const [editing, setEditing] = useState<EditableField | null>(null)
  const [value, setValue] = useState("")

  useEffect(() => {
    API.get("/society/current").then(res => setSociety(res.data))
  }, [])

  const startEdit = (field: EditableField, current: any) => {
    setEditing(field)
    setValue(current !== undefined && current !== null ? String(current) : "")
  }


  const saveEdit = async () => {
    if (!editing || !society) return

    const updatedValue =
      editing === "totalFlats" ? Number(value) : value

    await API.patch("/society/update", { [editing]: updatedValue })

    setSociety(prev =>
      prev ? { ...prev, [editing]: updatedValue } : prev
    )

    setEditing(null)
  }


  type FieldProps = {
    label: string
    field: EditableField
  }

  const Field = ({ label, field }: FieldProps) => (
    <div className="flex justify-between items-center bg-white p-3 rounded shadow">
      <div>
        <strong>{label}:</strong>{" "}
        {editing === field ? (
          <input
            value={value}
            onChange={e => setValue(e.target.value)}
            className="border px-2"
          />
        ) : (
          society?.[field] ?? "-"
        )}
      </div>

      {editing === field ? (
        <button onClick={saveEdit}>Save</button>
      ) : (
        <button onClick={() =>
          startEdit(field, society?.[field])
        }>
          Edit
        </button>
      )}
    </div>
  )

  if (!society) return <p>Loading...</p>

  return (
    <div className="space-y-3">
      <Field label="Name" field="name" />
      <Field label="Address" field="address" />
      <Field label="City" field="city" />
      <Field label="State" field="state" />
      <Field label="Flats" field="totalFlats" />

      {/* Danger Zone */}
      <div className="mt-6 p-4 border rounded bg-red-50">
        <button
          className="bg-red-600 text-white px-4 py-2 rounded"
          onClick={async () => {
            if (!confirm("Delete society?")) return
            await API.delete("/society")
          }}
        >
          Delete Society
        </button>
      </div>
    </div>
  )
}

export default SocietySection