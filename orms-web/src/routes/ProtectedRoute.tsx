import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { getCurrentUser } from '../auth'
import { ROUTES } from '../constants/routes'

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const user = getCurrentUser()

  if (!user) {
    return <Navigate to={ROUTES.login} replace />
  }

  return <>{children}</>
}
