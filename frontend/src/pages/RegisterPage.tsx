import { useMemo, useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Droplet, ArrowLeft } from 'lucide-react'
import { Button, Card, ErrorMessage, Input, Select } from '../components/ui'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import { BLOOD_GROUPS, type BloodGroup } from '../types'
import {
  isValidEmail,
  isValidPhone,
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
  const [bloodGroup, setBloodGroup] = useState('')
  const [location, setLocation] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)

  const bloodOptions = useMemo(
    () => BLOOD_GROUPS.map((g) => ({ value: g, label: g })),
    [],
  )

  const validateField = (name: string, value: string) => {
    setErrors((prev) => {
      const next = { ...prev }
      if (name === 'email') {
        if (value && !isValidEmail(value)) next.email = 'Please enter a valid email address.'
        else delete next.email
      }
      if (name === 'phone') {
        if (value && !isValidPhone(value)) next.phone = 'Please enter a valid phone number.'
        else delete next.phone
      }
      if (name === 'password') {
        if (value && value.length < 8) next.password = 'Password must be at least 8 characters.'
        else delete next.password
      }
      return next
    })
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    const payload = { fullName, email, phone, password, bloodGroup, location }
    const v =
      role === 'donor'
        ? validateDonorForm(payload)
        : validateRecipientForm({ fullName, email, phone, password, location })
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
          ? 'Welcome! Your donor account is ready.'
          : 'Welcome! Your recipient account is ready.',
        'success',
      )
      navigate(role === 'donor' ? '/donor' : '/recipient')
    })
  }

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="container-app mx-auto max-w-lg">
        <Link to="/" className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-navy">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </Link>
        <Card>
          <div className="mb-2 flex items-center gap-2 font-extrabold text-brand">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand text-white">
              <Droplet className="h-4 w-4" fill="currentColor" />
            </span>
            BLOOD BRIDGE
          </div>
          <h1 className="text-2xl font-extrabold text-navy">Create your account</h1>
          <p className="mt-1 text-sm text-muted">
            Choose how you want to use Blood Bridge. Organization staff register separately.
          </p>

          <fieldset className="mt-6">
            <legend className="mb-2 text-sm font-medium text-navy">I am registering as</legend>
            <div className="grid grid-cols-2 gap-3">
              {(
                [
                  { id: 'donor', label: 'Donor', hint: 'I want to donate blood' },
                  { id: 'recipient', label: 'Recipient', hint: 'I need blood' },
                ] as const
              ).map((opt) => (
                <label
                  key={opt.id}
                  className={`cursor-pointer rounded-xl border p-4 transition ${
                    role === opt.id
                      ? 'border-brand bg-critical-bg/40 ring-2 ring-brand/20'
                      : 'border-border bg-white hover:border-slate-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={opt.id}
                    checked={role === opt.id}
                    onChange={() => setRole(opt.id)}
                    className="sr-only"
                  />
                  <span className="block font-semibold text-navy">{opt.label}</span>
                  <span className="mt-0.5 block text-xs text-muted">{opt.hint}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <p className="mt-4 text-sm text-muted">
            Are you registering on behalf of a hospital or blood bank?{' '}
            <Link to="/organization/register" className="font-semibold text-brand hover:underline">
              Organization Registration
            </Link>
          </p>

          {formError && (
            <div className="mt-4">
              <ErrorMessage title="Could not create account" message={formError} />
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Full Name"
              name="fullName"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              error={errors.fullName}
              autoComplete="name"
            />
            <Input
              label="Email"
              type="email"
              name="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                validateField('email', e.target.value)
              }}
              error={errors.email}
              autoComplete="email"
            />
            <Input
              label="Phone"
              name="phone"
              required
              value={phone}
              onChange={(e) => {
                setPhone(e.target.value)
                validateField('phone', e.target.value)
              }}
              error={errors.phone}
              hint="Include country code if possible, e.g. +94771234567"
              autoComplete="tel"
            />
            <Input
              label="Password"
              type="password"
              name="password"
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                validateField('password', e.target.value)
              }}
              error={errors.password}
              hint="At least 8 characters"
              autoComplete="new-password"
            />
            {role === 'donor' && (
              <Select
                label="Blood Group"
                name="bloodGroup"
                required
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                options={bloodOptions}
                error={errors.bloodGroup}
                placeholder="Select Blood Group"
              />
            )}
            <Input
              label="Location"
              name="location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
              placeholder="City or area"
            />

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" loading={loading} className="flex-1 sm:flex-none">
                {role === 'donor' ? 'Register as Donor' : 'Register as Recipient'}
              </Button>
              <Link to="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold text-brand hover:underline">
              Login
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}
