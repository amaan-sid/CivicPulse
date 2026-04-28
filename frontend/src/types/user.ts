export type Role="admin"|"member"|"resident"

export interface Membership{
  societyId:string | {
    _id: string
    name?: string
    code?: string
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