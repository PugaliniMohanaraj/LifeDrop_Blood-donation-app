import { useState, type FormEvent } from 'react'
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ChevronDown,
  Eye,
  EyeOff,
  FileText,
  Info,
  Mail,
  MapPin,
  Paperclip,
  Phone,
  Lock,
  User,
} from 'lucide-react'
import { Link } from 'react-router-dom'
import { AuthField, authFieldClass } from '../components/AuthField'
import { OrganizationRegisterShell } from '../components/OrganizationRegisterShell'
import { BrandMark } from '../components/BrandMark'
import { ThemeToggle } from '../components/ThemeToggle'
import { Button, Card, ErrorMessage, StatusBadge } from '../components/ui'
import { apiErrorMessage, registerOrganization } from '../api/bloodBridge'
import { validateOrgForm, isValidEmail, isValidPhone } from '../utils/validation'
import type { OrgType } from '../types'

export function OrganizationRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '',
    type: '' as '' | OrgType,
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    staffId: '',
    staffName: '',
    password: '',
    documentName: '',
  })

  const set = (key: keyof typeof form, value: string) => {
    setForm((f) => ({ ...f, [key]: value }))
    if (key === 'email' && value && !isValidEmail(value)) {
      setErrors((e) => ({ ...e, email: 'Please enter a valid email address.' }))
    } else if (key === 'phone' && value && !isValidPhone(value)) {
      setErrors((e) => ({ ...e, phone: 'Please enter a valid phone number.' }))
    } else {
      setErrors((e) => {
        const next = { ...e }
        delete next[key]
        return next
      })
    }
  }

  const onFile = (file: File | null) => {
    set('documentName', file?.name || '')
  }

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    const v = validateOrgForm({ ...form, type: form.type })
    setErrors(v)
    if (Object.keys(v).length || !form.type) return

    setLoading(true)
    void registerOrganization({
      name: form.name,
      type: form.type,
      registrationNumber: form.registrationNumber,
      email: form.email.trim().toLowerCase(),
      phone: form.phone,
      address: form.address,
      staffId: form.staffId,
      staffName: form.staffName,
      password: form.password,
      documentName: form.documentName,
    })
      .then(() => {
        setSubmitted(true)
      })
      .catch((err) => {
        setFormError(
          apiErrorMessage(
            err,
            'Could not submit the application. Please check your details and try again.',
          ),
        )
      })
      .finally(() => setLoading(false))
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-[#F4F6F8] px-4 py-10 sm:px-6">
        <div className="absolute right-5 top-5 z-10 sm:right-8">
          <ThemeToggle variant="pill" />
        </div>
        <div className="mx-auto max-w-lg pt-8">
          <BrandMark />
          <Card className="mt-8 rounded-[1.75rem] p-8 text-center shadow-[0_16px_48px_rgba(11,28,51,0.08)]">
            <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
            <h1 className="mt-4 text-2xl font-extrabold text-navy">Application Submitted</h1>
            <p className="mt-2 text-muted">
              Your organization is currently under review. We will notify you at{' '}
              <strong>{form.email}</strong> when verification is complete.
            </p>
            <div className="mt-6 flex justify-center">
              <StatusBadge label="Pending Verification" tone="pending" icon={<span>🟡</span>} />
            </div>
            <p className="mt-4 text-sm text-muted">
              After approval, sign in with this email and the password you created.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link to="/login">
                <Button className="rounded-xl">Go to Login</Button>
              </Link>
              <Link to="/">
                <Button variant="outline" className="rounded-xl">
                  Back to Home
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <OrganizationRegisterShell>
      {formError && (
        <ErrorMessage title="Could not submit" message={formError} />
      )}

      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <AuthField label="Organization Name" icon={Building2} required error={errors.name}>
          <input
            required
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="Enter organization name"
            className={authFieldClass(errors.name)}
          />
        </AuthField>

        <AuthField label="Organization Type" icon={Building2} required error={errors.type}>
          <select
            required
            value={form.type}
            onChange={(e) => set('type', e.target.value)}
            className={`${authFieldClass(errors.type)} appearance-none pr-10`}
          >
            <option value="">Select type</option>
            <option value="HOSPITAL">Hospital</option>
            <option value="BLOOD_BANK">Blood Bank</option>
          </select>
          <ChevronDown
            className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
        </AuthField>

        <AuthField
          label="Registration Number"
          icon={FileText}
          required
          error={errors.registrationNumber}
          hint="Official government or health authority registration ID"
        >
          <input
            required
            value={form.registrationNumber}
            onChange={(e) => set('registrationNumber', e.target.value)}
            placeholder="Enter registration number"
            className={authFieldClass(errors.registrationNumber)}
          />
        </AuthField>

        <AuthField label="Staff Contact Name" icon={User} required error={errors.staffName}>
          <input
            required
            value={form.staffName}
            onChange={(e) => set('staffName', e.target.value)}
            placeholder="Full name of the contact person"
            className={authFieldClass(errors.staffName)}
          />
        </AuthField>

        <AuthField
          label="Official Email"
          icon={Mail}
          required
          error={errors.email}
          hint="Used to sign in after verification"
        >
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="official@organization.lk"
            autoComplete="email"
            className={authFieldClass(errors.email)}
          />
        </AuthField>

        <AuthField
          label="Password"
          icon={Lock}
          required
          error={errors.password}
          hint="At least 8 characters — use this after admin approval"
        >
          <input
            type={showPassword ? 'text' : 'password'}
            required
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
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

        <AuthField label="Phone" icon={Phone} required error={errors.phone}>
          <input
            required
            value={form.phone}
            onChange={(e) => set('phone', e.target.value)}
            placeholder="Enter contact number"
            autoComplete="tel"
            className={authFieldClass(errors.phone)}
          />
        </AuthField>

        <AuthField label="Address" icon={MapPin} required error={errors.address}>
          <input
            required
            value={form.address}
            onChange={(e) => set('address', e.target.value)}
            placeholder="Official address of the organization"
            className={authFieldClass(errors.address)}
          />
        </AuthField>

        <AuthField
          label="Staff ID"
          icon={User}
          required
          error={errors.staffId}
          hint="Your employee or staff identifier at the organization"
        >
          <input
            required
            value={form.staffId}
            onChange={(e) => set('staffId', e.target.value)}
            placeholder="Employee or staff identifier"
            className={authFieldClass(errors.staffId)}
          />
        </AuthField>

        <div>
          <label htmlFor="document" className="mb-1.5 block text-sm font-semibold text-navy">
            Supporting Document
            <span className="ml-0.5 text-brand" aria-hidden>
              *
            </span>
          </label>
          <div className="relative">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center border-r border-border text-muted">
              <Paperclip className="h-4 w-4" aria-hidden />
            </span>
            <input
              id="document"
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              className={`${authFieldClass(errors.documentName)} file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-1 file:text-xs file:font-semibold`}
              onChange={(e) => onFile(e.target.files?.[0] || null)}
              aria-invalid={!!errors.documentName}
            />
          </div>
          <p className="mt-1.5 text-xs text-muted">
            Upload registration certificate / license / authorization letter (PDF, JPG, PNG).
          </p>
          {errors.documentName && (
            <p className="mt-1.5 text-sm text-critical" role="alert">
              {errors.documentName}
            </p>
          )}
          {form.documentName && !errors.documentName && (
            <p className="mt-1.5 text-xs text-muted">Selected: {form.documentName}</p>
          )}
        </div>

        <div className="flex gap-3 rounded-xl border border-brand/15 bg-critical-bg/40 p-4">
          <Info className="mt-0.5 h-5 w-5 shrink-0 text-brand" aria-hidden />
          <p className="text-sm leading-relaxed text-navy">
            <span className="font-bold text-brand">Important:</span> Our team will review your
            information. You will be notified via email once your organization is verified.
          </p>
        </div>

        <div className="space-y-3 pt-1">
          <Button
            type="submit"
            loading={loading}
            className="min-h-12 w-full gap-2 rounded-xl text-base !shadow-md"
          >
            Submit for Verification
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
          <Link to="/" className="block">
            <Button type="button" variant="outline" className="min-h-12 w-full rounded-xl border-2">
              Cancel
            </Button>
          </Link>
        </div>
      </form>
    </OrganizationRegisterShell>
  )
}
