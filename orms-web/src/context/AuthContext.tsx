import { createContext, useContext, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import { getCurrentUser } from '../auth'
import type { CurrentUser } from '../auth'

type AuthContextValue = {
  user: CurrentUser | null
  setUser: (user: CurrentUser | null) => void
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<CurrentUser | null>(() => getCurrentUser())

  const value = useMemo(() => ({ user, setUser }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return context
}
