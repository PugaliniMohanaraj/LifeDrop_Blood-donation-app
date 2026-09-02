import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  ArrowRight,
  ChevronDown,
  Droplet,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react'
import { Button, ErrorMessage } from '../components/ui'
import { AuthField, authFieldClass } from '../components/AuthField'
import { AuthShell } from '../components/AuthShell'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { BLOOD_GROUPS, type BloodGroup } from '../types'
import {
  getPasswordValidationError,
  isGmailEmail,
  isValidPhone,
  passwordsMatch,
  validateDonorForm,
  validateRecipientForm,
} from '../utils/validation'

type PublicRole = 'donor' | 'recipient'

export function RegisterPage() {
  const [params] = useSearchParams()
  const initial = params.get('role') === 'recipient' ? 'recipient' : 'donor'
  const [role, setRole] = useState<PublicRole>(initial)
  const { registerDonor, registerRecipient } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [bloodGroup, setBloodGroup] = useState('')
  const [location, setLocation] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const bloodOptions = useMemo(() => BLOOD_GROUPS.map((g) => ({ value: g, label: g })), [])

  const validateField = (name: string, value: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      if (name === 'email') {
        if (!value.trim()) delete next.email
        else if (!isGmailEmail(value))
          next.email = 'Please use a Gmail address ending with @gmail.com.'
        else delete next.email
      }
      if (name === 'phone') {
        if (value && !isValidPhone(value)) next.phone = 'Please enter a valid phone number.'
        else delete next.phone
      }
      if (name === 'password') {
        const err = value ? getPasswordValidationError(value) : null
        if (err) next.password = err
        else delete next.password
        if (confirmPassword && !passwordsMatch(value, confirmPassword))
          next.confirmPassword = 'Passwords do not match.'
        else if (confirmPassword) delete next.confirmPassword
      }
      if (name === 'confirmPassword') {
        if (value && !passwordsMatch(password, value))
          next.confirmPassword = 'Passwords do not match.'
        else delete next.confirmPassword
      }
      return next
    })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    if (!agreed) {
      setErrors((prev) => ({
        ...prev,
        terms: 'Please agree to the Terms & Conditions and Privacy Policy.',
      }))
      return
    }
    const payload = { fullName, email, phone, password, confirmPassword, bloodGroup, location }
    const v =
      role === 'donor'
        ? validateDonorForm(payload)
        : validateRecipientForm({ fullName, email, phone, password, confirmPassword, location })
    setErrors(v)
    if (Object.keys(v).length) return

    setLoading(true)
    const run =
      role === 'donor'
        ? registerDonor({
            fullName,
            email: email.trim().toLowerCase(),
            phone,
            password,
            bloodGroup: bloodGroup as BloodGroup,
            location,
          })
        : registerRecipient({
            fullName,
            email: email.trim().toLowerCase(),
            phone,
            password,
            location,
          })

    void run.then((result) => {
      setLoading(false)
      if (!result.ok) {
        setFormError(result.message || 'Registration failed.')
        return
      }
      toast(
        role === 'donor'
          ? 'Welcome to LifeDrop! Your donor account is ready.'
          : 'Welcome to LifeDrop! Your recipient account is ready.',
        'success',
      )
      navigate(role === 'donor' ? '/donor' : '/recipient')
    })
  }

  return (
    <AuthShell
      title="Create your account"
      subtitle="Choose how you want to use LifeDrop."
      footer={
        <p className="text-center text-sm text-muted">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {(
          [
            {
              id: 'donor' as const,
              label: 'Donor',
              hint: 'I want to donate blood',
              icon: Droplet,
            },
            {
              id: 'recipient' as const,
              label: 'Recipient',
              hint: 'I need blood',
              icon: Heart,
            },
          ] as const
        ).map((opt) => {
          const active = role === opt.id
          const Icon = opt.icon
          return (
            <label
              key={opt.id}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border px-4 py-3.5 transition ${
                active
                  ? 'border-brand bg-[#FFF5F5] shadow-sm'
                  : 'border-border bg-white hover:border-brand/25'
              }`}
            >
              <input
                type="radio"
                name="role"
                value={opt.id}
                checked={active}
                onChange={() => setRole(opt.id)}
                className="sr-only"
              />
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                  active ? 'bg-brand text-white' : 'bg-[#F1F5F9] text-muted'
                }`}
              >
                <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden />
              </span>
              <span className="min-w-0">
                <span className={`block text-sm font-bold ${active ? 'text-brand' : 'text-navy'}`}>
                  {opt.label}
                </span>
                <span className="mt-0.5 block text-[11px] text-muted">{opt.hint}</span>
              </span>
            </label>
          )
        })}
      </div>

      <p className="mt-4 text-sm">
        <span className="text-muted">Hospital or blood bank? </span>
        <Link to="/organization/register" className="font-semibold text-brand hover:underline">
          Organization Registration →
        </Link>
      </p>

      {formError && (
        <div className="mt-4">
          <ErrorMessage title="Could not create account" message={formError} />
        </div>
      )}

      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <div className="grid gap-4 sm:grid-cols-2">
          {/* Left column — mockup order */}
          <AuthField label="Full Name" icon={User} required error={errors.fullName}>
            <input
              name="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              autoComplete="name"
              className={authFieldClass(errors.fullName)}
            />
          </AuthField>

          <AuthField
            label="Email"
            icon={Mail}
            required
            error={errors.email}
            hint="Gmail address required (@gmail.com)"
          >
            <input
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                validateField('email', e.target.value)
              }}
              placeholder="Enter your email"
              autoComplete="email"
              className={authFieldClass(errors.email)}
            />
          </AuthField>

          <AuthField label="Phone" icon={Phone} required error={errors.phone}>
            <input
              name="phone"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                validateField('phone', e.target.value)
              }}
              placeholder="Enter your phone number"
              autoComplete="tel"
              className={authFieldClass(errors.phone)}
            />
          </AuthField>

          <AuthField
            label="Password"
            icon={Lock}
            required
            error={errors.password}
            hint="At least 8 characters"
          >
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                validateField('password', e.target.value)
              }}
              placeholder="Create a strong password"
              autoComplete="new-password"
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

          <AuthField
            label="Confirm Password"
            icon={Lock}
            required
            error={errors.confirmPassword}
          >
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              name="confirmPassword"
              required
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                validateField('confirmPassword', e.target.value)
              }}
              placeholder="Re-enter your password"
              autoComplete="new-password"
              className={`${authFieldClass(errors.confirmPassword)} pr-11`}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-muted hover:text-foreground"
              onClick={() => setShowConfirmPassword((v) => !v)}
              aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </AuthField>

          {role === 'donor' ? (
            <AuthField label="Blood Group" icon={Droplet} required error={errors.bloodGroup}>
              <select
                name="bloodGroup"
                required
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className={`${authFieldClass(errors.bloodGroup)} appearance-none pr-10`}
              >
                <option value="">Select your blood group</option>
                {bloodOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
            </AuthField>
          ) : (
            <AuthField label="Location" icon={MapPin} required error={errors.location}>
              <input
                name="location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or area"
                className={authFieldClass(errors.location)}
              />
            </AuthField>
          )}

          {role === 'donor' && (
            <AuthField label="Location" icon={MapPin} required error={errors.location}>
              <input
                name="location"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="City or area"
                className={authFieldClass(errors.location)}
              />
            </AuthField>
          )}
        </div>

        <label className="flex cursor-pointer items-start gap-3">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => {
              setAgreed(e.target.checked)
              if (e.target.checked) {
                setErrors((prev) => {
                  const { terms, ...rest } = prev
                  return rest
                })
              }
            }}
            className="mt-0.5 h-4 w-4 rounded accent-brand"
          />
          <span className="text-sm text-muted">
            I agree to the{' '}
            <Link to="/guide" className="font-semibold text-brand hover:underline">
              Terms &amp; Conditions
            </Link>{' '}
            and{' '}
            <Link to="/guide" className="font-semibold text-brand hover:underline">
              Privacy Policy
            </Link>
          </span>
        </label>
        {errors.terms && (
          <p className="text-sm text-critical" role="alert">
            {errors.terms}
          </p>
        )}

        <div className="space-y-3 pt-1">
          <Button
            type="submit"
            loading={loading}
            className="min-h-12 w-full gap-2 rounded-xl text-base !shadow-md"
          >
            {role === 'donor' ? 'Register as Donor' : 'Register as Recipient'}
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Link to="/" className="block">
            <Button
              type="button"
              variant="outline"
              className="min-h-12 w-full rounded-xl border-2 text-base"
            >
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </AuthShell>
  )
}
