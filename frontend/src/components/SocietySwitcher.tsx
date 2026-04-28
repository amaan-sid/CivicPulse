import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import API from "../services/api"
import type { RootState } from "../app/store"
import { setUser } from "../features/auth/authSlice"

function SocietySwitcher() {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const memberships = user?.memberships || []
  const [triedFetchingNames,setTriedFetchingNames] = useState(false)

  useEffect(() => {
    const hasMissingSocietyNames = memberships.some((membership) => {
      return typeof membership.societyId === "string" || !membership.societyId.name
    })

    if (!hasMissingSocietyNames || triedFetchingNames) return

    API.get("/auth/me")
      .then((res) => {
        dispatch(setUser(res.data.user))
      })
      .finally(() => setTriedFetchingNames(true))
  }, [dispatch, memberships, triedFetchingNames])

  const getSocietyId = (societyId: typeof memberships[number]["societyId"]) => {
    return typeof societyId === "string" ? societyId : societyId._id
  }

  const getSocietyLabel = (societyId: typeof memberships[number]["societyId"]) => {
    if (typeof societyId !== "string") {
      return societyId.name || "Unnamed society"
    }

    return triedFetchingNames ? "Society name unavailable" : "Loading society..."
  }

  const handleChange = async (societyId: string) => {
    if (!societyId || societyId === user?.currentSocietyId) return

    await API.post("/society/current", { societyId })
    const res = await API.get("/auth/me")

    dispatch(setUser(res.data.user))
  }

  return (
    <div className="mb-6 flex flex-wrap items-center justify-between gap-3 bg-white p-4 rounded shadow">
      <div>
        <p className="text-sm text-gray-500">Current society</p>
        <select
          value={user?.currentSocietyId || ""}
          onChange={(e) => handleChange(e.target.value)}
          className="mt-1 border rounded px-3 py-2 min-w-64"
        >
          {memberships.length === 0 && (
            <option value="">No society joined</option>
          )}

          {memberships.map((membership) => (
            <option key={getSocietyId(membership.societyId)} value={getSocietyId(membership.societyId)}>
              {getSocietyLabel(membership.societyId)} ({membership.role})
            </option>
          ))}
        </select>
      </div>

      <div className="flex gap-2">
        <Link
          to="/join-society"
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          Join Society
        </Link>

        <Link
          to="/create-society"
          className="bg-gray-900 text-white px-4 py-2 rounded"
        >
          Create Society
        </Link>
      </div>
    </div>
  )
}

export default SocietySwitcher