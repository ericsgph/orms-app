import { useEffect, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import LoginPage from './components/LoginPage'
import ProtectedApp from './components/ProtectedApp'
import { getCurrentUser } from './auth'
import type { CurrentUser } from './auth'
import './App.css'
import { Analytics } from "@vercel/analytics/react"

function App() {
  const [user, setUser] = useState<CurrentUser | null>(null)

  useEffect(() => {
    const current = getCurrentUser()
    if (current) {
      setUser(current)
    }
  }, [])

  return (
    <BrowserRouter>
      {!user ? <LoginPage onLogin={setUser} /> : <ProtectedApp user={user} onLogout={() => setUser(null)} />}
      <Analytics />
    </BrowserRouter>
  )
}

export default App
