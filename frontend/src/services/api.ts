import axios from "axios";

const apiBaseUrl =
  (import.meta.env.VITE_API_BASE_URL as string | undefined)?.replace(/\/$/, "") || "/api";

const API = axios.create({
  baseURL: apiBaseUrl,
  withCredentials: true,
  timeout: 10_000,
});

export default API;
