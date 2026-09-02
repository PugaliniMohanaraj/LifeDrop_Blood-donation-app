import { useEffect, useState, type FormEvent } from 'react'
import { ArrowRight, Eye, EyeOff, Lock, Mail } from 'lucide-react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { AuthField, authFieldClass } from '../components/AuthField'
import { AuthShell } from '../components/AuthShell'
import { Button, ErrorMessage } from '../components/ui'
import { publicImages } from '../data/publicImages'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import {
  clearRememberedEmail,
  loadRememberedEmail,
  saveRememberedEmail,
} from '../utils/rememberEmail'
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
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const saved = loadRememberedEmail()
    if (saved) {
      setEmail(saved)
      setRememberMe(true)
    }
  }, [])

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
      if (rememberMe) saveRememberedEmail(email)
      else clearRememberedEmail()
      toast('Welcome back! You are signed in.', 'success')
      const stored = JSON.parse(localStorage.getItem('bloodbridge_user') || '{}')
      navigate(from || dashboardPath(stored.role), { replace: true })
    })
  }

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue to your LifeDrop dashboard."
      heroImage={publicImages.hero.login}
      heroImageAlt="A healthcare professional performing a blood draw in a clinical setting"
      footer={
        <p className="text-center text-sm text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="font-semibold text-brand hover:underline">
            Register
          </Link>
        </p>
      }
    >
      {formError && (
        <ErrorMessage
          title="Could not sign in"
          message={formError}
          fix="Check your email and password, then try again."
        />
      )}

      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <AuthField label="Email" icon={Mail} required error={errors.email}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="Enter your email"
            className={authFieldClass(errors.email)}
          />
        </AuthField>

        <AuthField label="Password" icon={Lock} required error={errors.password}>
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            autoComplete="current-password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            className={`${authFieldClass(errors.password)} pr-11`}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-foreground"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </AuthField>

        <div className="flex items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2.5 text-sm text-muted">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded accent-brand"
            />
            Remember me
          </label>
          <Link to="/forgot-password" className="text-sm font-semibold text-brand hover:underline">
            Forgot password?
          </Link>
        </div>

        <Button
          type="submit"
          loading={loading}
          className="min-h-12 w-full gap-2 rounded-xl text-base !shadow-md"
        >
          Log In
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </form>

      <details className="mt-5 rounded-xl border border-border bg-surface/60 p-4 text-xs text-muted">
        <summary className="cursor-pointer font-semibold text-navy">Demo accounts</summary>
        <ul className="mt-3 space-y-1.5">
          <li>donor@bloodbridge.com / password123</li>
          <li>recipient@bloodbridge.com / password123</li>
          <li>hospital@bloodbridge.com / password123</li>
          <li>bloodbank@bloodbridge.com / password123</li>
          <li>admin@bloodbridge.com / password123</li>
        </ul>
      </details>
    </AuthShell>
  )
}
