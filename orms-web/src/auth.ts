import apiClient from './api/apiClient'

export type Role = 'admin' | 'risk_manager' | 'compliance_officer' | 'auditor'

export type CurrentUser = {
  email: string
  name: string
  role: Role
  iat: number
  exp: number
}

const STORAGE_KEY = 'orms-jwt'

const base64UrlDecode = (value: string): string => {
  const normalized = value.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
  try {
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0))
    return new TextDecoder().decode(bytes)
  } catch {
    return atob(padded)
  }
}

const normalizeRole = (raw: unknown): Role => {
  if (Array.isArray(raw)) {
    return normalizeRole(raw[0])
  }
  if (typeof raw === 'number' || (typeof raw === 'string' && /^\d+$/.test(raw.trim()))) {
    const id = Number(raw)
    if (id === 1) return 'admin'
    if (id === 2) return 'risk_manager'
    if (id === 3) return 'compliance_officer'
    if (id === 4) return 'auditor'
  }
  if (typeof raw === 'string') {
    const lower = raw.trim().toLowerCase().replace(/[\s-]+/g, '_')
    if (lower === 'admin' || lower === 'administrator') return 'admin'
    if (lower === 'risk_manager' || lower === 'riskmanager' || lower === 'risk_mgr' || lower === 'risk') return 'risk_manager'
    if (lower === 'compliance_officer' || lower === 'complianceofficer' || lower === 'compliance') return 'compliance_officer'
    if (lower === 'auditor' || lower === 'audit') return 'auditor'
  }
  return 'admin'
}

const extractToken = (data: unknown): string | null => {
  if (!data) return null
  if (typeof data === 'string') return data.trim()

  if (typeof data === 'object') {
    const obj = data as Record<string, unknown>
    if (typeof obj.token === 'string') return obj.token.trim()
    if (typeof obj.accessToken === 'string') return obj.accessToken.trim()
    if (typeof obj.access_token === 'string') return obj.access_token.trim()
    if (typeof obj.jwt === 'string') return obj.jwt.trim()
    if (obj.data) {
      const nested = extractToken(obj.data)
      if (nested) return nested
    }
    if (obj.result) {
      const nested = extractToken(obj.result)
      if (nested) return nested
    }
  }
  return null
}

export type LoginCredentials = {
  username?: string
  email?: string
  password: string
}

export const login = async (credentials: LoginCredentials) => {
  const userIdentifier = (credentials.username ?? credentials.email ?? '').trim()
  const response = await apiClient.post<unknown>(
    import.meta.env.VITE_AUTH_LOGIN_PATH ?? '/api/auth/login',
    {
      username: userIdentifier,
      email: userIdentifier,
      password: credentials.password,
    },
  )

  const token = extractToken(response.data)

  if (!token) {
    throw new Error('The login response did not include an access token.')
  }

  localStorage.setItem(STORAGE_KEY, token)
  const user = decodeJwt(token)

  if (!user) {
    localStorage.removeItem(STORAGE_KEY)
    throw new Error('The login response included an invalid access token.')
  }

  return user
}

export const decodeJwt = (token: string): CurrentUser | null => {
  try {
    if (!token || typeof token !== 'string') return null

    const cleanToken = token.startsWith('Bearer ') ? token.slice(7) : token
    const parts = cleanToken.split('.')
    if (parts.length < 2) return null

    const payloadJson = JSON.parse(base64UrlDecode(parts[1])) as Record<string, unknown>
    if (!payloadJson || typeof payloadJson !== 'object') return null

    const email =
      (typeof payloadJson.email === 'string' && payloadJson.email) ||
      (typeof payloadJson['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] === 'string' &&
        (payloadJson['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] as string)) ||
      (typeof payloadJson.unique_name === 'string' && payloadJson.unique_name) ||
      (typeof payloadJson.sub === 'string' && payloadJson.sub) ||
      (typeof payloadJson['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] === 'string' &&
        (payloadJson['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier'] as string)) ||
      (typeof payloadJson.username === 'string' && payloadJson.username) ||
      'user@orms.local'

    const name =
      (typeof payloadJson.name === 'string' && payloadJson.name) ||
      (typeof payloadJson['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] === 'string' &&
        (payloadJson['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'] as string)) ||
      (typeof payloadJson.unique_name === 'string' && payloadJson.unique_name) ||
      (typeof payloadJson.fullName === 'string' && payloadJson.fullName) ||
      (typeof payloadJson.given_name === 'string' && payloadJson.given_name) ||
      (email.includes('@') ? email.split('@')[0] : email) ||
      'User'

    const rawRole =
      payloadJson.role ??
      payloadJson['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'] ??
      payloadJson.roles ??
      payloadJson.Role ??
      payloadJson.roleId ??
      payloadJson.RoleId

    const role = normalizeRole(rawRole)

    const expRaw = payloadJson.exp
    const exp =
      typeof expRaw === 'number'
        ? expRaw
        : typeof expRaw === 'string' && !isNaN(Number(expRaw))
          ? Number(expRaw)
          : Math.floor(Date.now() / 1000) + 86400

    const iatRaw = payloadJson.iat
    const iat =
      typeof iatRaw === 'number'
        ? iatRaw
        : typeof iatRaw === 'string' && !isNaN(Number(iatRaw))
          ? Number(iatRaw)
          : Math.floor(Date.now() / 1000)

    return {
      email,
      name,
      role,
      iat,
      exp,
    }
  } catch {
    return null
  }
}

export const getCurrentUser = (): CurrentUser | null => {
  const token = localStorage.getItem(STORAGE_KEY)
  if (!token) return null

  const user = decodeJwt(token)
  if (!user) {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }

  if (Date.now() >= user.exp * 1000) {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }

  return user
}

export const logout = () => {
  localStorage.removeItem(STORAGE_KEY)
}
