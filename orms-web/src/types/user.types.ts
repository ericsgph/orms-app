import type { AppRole } from './enums'

export type User = {
  id: number
  username: string
  fullName: string
  email: string
  roleId: number
  role?: { id: number; name: string }
  businessUnitId?: number | null
  businessUnit?: { id: number; name: string }
  isActive: boolean
  createdAt: string
}

export type UserMaintenanceInput = {
  username: string
  fullName: string
  email: string
  password?: string
  roleId: number
  businessUnitId?: number | null
  isActive: boolean
}

export type AuthTokenPayload = {
  sub: string
  email: string
  name: string
  role: AppRole
  iat: number
  exp: number
}
