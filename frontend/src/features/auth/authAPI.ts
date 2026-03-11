import API from "../../services/api"

export const loginAPI = async (email: string, password: string, society: string) => {
  const res = await API.post("/auth/login", { email, password, society })
  return res.data
}

export const signupAPI = async (
  name: string,
  email: string,
  password: string,
  society: string,
  role?: string
) => {
  const res = await API.post("/auth/signup", { name, email, password, society, role })
  return res.data
}

export const logoutAPI = async () => {
  const res = await API.post("/auth/logout")
  return res.data
}

export const getMeAPI = async () => {
  const res = await API.get("/auth/me")
  return res.data
}
