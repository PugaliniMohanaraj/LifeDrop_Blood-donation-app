import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Droplet } from 'lucide-react'
import { Button, Card, ErrorMessage, Input } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { validateLogin, isValidEmail } from '../utils/validation'

function dashboardPath(role: string) {
  switch (role) {
    case 'DONOR':
      return '/donor'
    case 'RECIPIENT':
      return '/recipient'
    case 'HOSPITAL':
      return '/hospital'
    case 'BLOOD_BANK':
      return '/blood-bank'
    case 'ADMIN':
      return '/admin'
    default:
      return '/'
  }
}

export function LoginPage() {
  const { login } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: string } | null)?.from

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const onEmailChange = (value: string) => {
    setEmail(value)
    if (value && !isValidEmail(value)) {
      setErrors((e) => ({ ...e, email: 'Please enter a valid email address.' }))
    } else {
      setErrors((e) => {
        const { email: _, ...rest } = e
        return rest
      })
    }
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    const v = validateLogin(email, password)
    setErrors(v)
    if (Object.keys(v).length) return

    setLoading(true)
    void login(email.trim().toLowerCase(), password).then((result) => {
      setLoading(false)
      if (!result.ok) {
        setFormError(result.message || 'Unable to log in.')
        return
      }
      toast('Welcome back! You are signed in.', 'success')
      const stored = JSON.parse(localStorage.getItem('bloodbridge_user') || '{}')
      navigate(from || dashboardPath(stored.role), { replace: true })
    })
  }

  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <div className="container-app flex flex-1 items-center justify-center py-12">
        <Card className="w-full max-w-md">
          <Link to="/" className="mb-6 flex items-center gap-2 font-extrabold text-brand">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <Droplet className="h-4 w-4" fill="currentColor" />
            </span>
            BLOOD BRIDGE
          </Link>
          <h1 className="text-2xl font-extrabold text-navy">Login</h1>
          <p className="mt-1 text-sm text-muted">Sign in to continue to your dashboard.</p>

          {formError && (
            <div className="mt-4">
              <ErrorMessage
                title="Could not sign in"
                message={formError}
                fix="Check your email and password, or reset access with support."
              />
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Email"
              type="email"
              name="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => onEmailChange(e.target.value)}
              error={errors.email}
              placeholder="you@example.com"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
              placeholder="Your password"
            />
            <Button type="submit" className="w-full" loading={loading}>
              Login
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="font-semibold text-brand hover:underline">
              Register
            </Link>
          </p>

          <details className="mt-6 rounded-xl bg-surface p-3 text-xs text-muted">
            <summary className="cursor-pointer font-medium text-navy">Demo accounts</summary>
            <ul className="mt-2 space-y-1">
              <li>donor@bloodbridge.com / password123</li>
              <li>recipient@bloodbridge.com / password123</li>
              <li>hospital@bloodbridge.com / password123</li>
              <li>bloodbank@bloodbridge.com / password123</li>
              <li>admin@bloodbridge.com / password123</li>
            </ul>
          </details>
        </Card>
      </div>
    </div>
  )
}
