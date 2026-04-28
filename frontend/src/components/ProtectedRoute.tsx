import { useEffect, useState } from "react"
import { Navigate,Outlet } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import API from "../services/api"
import { setUser } from "../features/auth/authSlice"
import type { RootState } from "../app/store"

const ProtectedRoute = () => {
  const dispatch = useDispatch()
  const user = useSelector((state: RootState) => state.auth.user)
  const [checking,setChecking] = useState(!user)
  const [allowed,setAllowed] = useState(Boolean(user))

  useEffect(() => {
    if (user) {
      setAllowed(true)
      setChecking(false)
      return
    }

    API.get("/auth/me")
      .then((res) => {
        dispatch(setUser(res.data.user))
        setAllowed(true)
      })
      .catch(() => {
        setAllowed(false)
      })
      .finally(() => setChecking(false))
  }, [dispatch, user])

  if (checking) {
    return null
  }

  if (!allowed) {
    return <Navigate to="/login" />
  }

  return <Outlet/>
}

export default ProtectedRoute