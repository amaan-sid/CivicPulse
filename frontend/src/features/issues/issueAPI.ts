import API from "../../services/api"
import type { CreateIssuePayload } from "./issueTypes"

export const fetchIssuesAPI = async () => {
  const res = await API.get("/issues")
  return res.data
}

export const createIssueAPI = async (data: CreateIssuePayload) => {
  const res = await API.post("/issues", data)
  return res.data
}

export const updateIssueStatusAPI = async (id: string, status: string) => {
  const res = await API.patch(`/issues/${id}`, { status })
  return res.data
}

export const assignIssueAPI = async (id: string, userId: string) => {
  const res = await API.patch(`/issues/${id}/assign`, { assignedTo: userId })
  return res.data
}
