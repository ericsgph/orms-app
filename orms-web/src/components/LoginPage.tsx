import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../auth'
import type { CurrentUser } from '../auth'

type LoginPageProps = {
  onLogin: (user: CurrentUser) => void
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const navigate = useNavigate()
  const [username, setUsername] = useState('usr001@mail.com')
  const [password, setPassword] = useState('admin1')
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    setIsSubmitting(true)
    setError('')

    try {
      const user = await login({ username, password })
      console.log(user)
      onLogin(user)
      navigate('/risk-events', { replace: true })
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : 'Unable to sign in. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-screen">
      <div className="login-card">
        <div className="login-header">
          <span className="brand-mark large">OR</span>
          <div>
            <p className="eyebrow">Secure Access</p>
            <h1>ORM Login</h1>
          </div>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input
              type="email"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="name@orms.local"
            />
          </label>

          <label>
            Password
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
            />
          </label>

          {error ? <p className="login-error">{error}</p> : null}

          <button type="submit" className="primary-button full-width" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <div className="demo-accounts">
          <p>Demo accounts</p>
          <ul>
            <li><strong>Admin:</strong> usr001@mail.com / admin1</li>
            <li><strong>Risk Manager:</strong> usr002@mail.com / risk1</li>
            <li><strong>Compliance:</strong> compliance@orms.local / compliance1</li>
            <li><strong>Auditor:</strong> audit@orms.local / audit1</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
