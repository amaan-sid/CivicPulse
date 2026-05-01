export type Role="admin"|"member"|"resident"

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
  name: string
  email: string
  currentSocietyId: string
  memberships: Membership[]
  role?: Role
}

export interface Resident {
  _id: string
  name: string
  role: Role
}