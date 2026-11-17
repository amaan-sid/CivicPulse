import axios from "axios"

const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") ||
  "http://localhost:4000/api"

const API = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true
})

export default API