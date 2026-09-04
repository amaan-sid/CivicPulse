export interface Society {
  _id: string
  name: string
  type?: "SOCIETY" | "HOSTEL" | "CAMPUS"
  address: string
  city: string
  state: string
  totalFlats: number
  code?: string
  isActive?: boolean
  admin?: string | { _id: string; name: string; email: string; profilePic?: string; gender?: "male" | "female" }
}