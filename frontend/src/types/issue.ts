export interface Issue {
  _id: string
  title: string
  description: string
  reportCount: string
  priority: "low" | "medium" | "high"
  status: "open" | "in-progress" | "resolved"
  createdAt: string
}
