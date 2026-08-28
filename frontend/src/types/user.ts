export type Role = "admin" | "member" | "staff" | "resident"

export interface Membership{
  societyId:{
    _id: string
    name?: string
    code?: string
  }
  userId: {
    _id:string
    name?:string
  }
  role: Role
}

export interface User {
  id: string
  _id?: string
  name: string
  email: string
  platformRole?: "SUPER_ADMIN" | "USER"
  currentSocietyId: string
  memberships: Membership[]
  role?: Role
  society?: string
}

export interface Resident {
  _id: string
  name: string
  role: Role
}