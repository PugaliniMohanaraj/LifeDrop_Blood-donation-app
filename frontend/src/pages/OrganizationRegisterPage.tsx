import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { Building2, CheckCircle2 } from 'lucide-react'
import { Button, Card, ErrorMessage, Input, Select, StatusBadge } from '../components/ui'
import { BrandMark } from '../components/BrandMark'
import { ThemeToggle } from '../components/ThemeToggle'
import { apiErrorMessage, registerOrganization } from '../api/bloodBridge'
import { validateOrgForm, isValidEmail, isValidPhone } from '../utils/validation'
import type { OrgType } from '../types'


export function OrganizationRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
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
      <div className="relative min-h-screen overflow-hidden bg-surface py-12">
        <div className="absolute right-5 top-5 z-10 sm:right-8">
          <ThemeToggle />
        </div>
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(227,6,19,0.08),_transparent_50%)]"
          aria-hidden
        />
        <div className="container-app relative mx-auto max-w-lg">
          <Card className="rounded-3xl p-8 text-center shadow-xl shadow-brand/5">
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
                <Button>Go to Login</Button>
              </Link>
              <Link to="/">
                <Button variant="outline">Back to Home</Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-surface py-10">
      <div className="absolute right-5 top-5 z-10 sm:right-8">
        <ThemeToggle />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(227,6,19,0.07),_transparent_50%)]"
        aria-hidden
      />
      <div className="container-app relative mx-auto max-w-xl">
        <div className="mb-6">
          <BrandMark />
        </div>
        <Card className="rounded-3xl p-6 shadow-xl shadow-brand/5 sm:p-8">
          <div className="mb-2 flex items-center gap-2 text-brand">
            <Building2 className="h-6 w-6" />
            <span className="font-extrabold">Organization Verification</span>
          </div>
          <h1 className="text-2xl font-extrabold text-navy">Register your organization</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            To protect patients and donors, hospital and blood bank accounts must be verified before
            accessing LifeDrop organization features.
          </p>

          {formError && (
            <div className="mt-4">
              <ErrorMessage title="Could not submit" message={formError} />
            </div>
          )}

          <form className="mt-6 space-y-4" onSubmit={onSubmit} noValidate>
            <Input
              label="Organization Name"
              required
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              error={errors.name}
            />
            <Select
              label="Organization Type"
              required
              value={form.type}
              onChange={(e) => set('type', e.target.value)}
              options={[
                { value: 'HOSPITAL', label: 'Hospital' },
                { value: 'BLOOD_BANK', label: 'Blood Bank' },
              ]}
              error={errors.type}
              placeholder="Select type"
            />
            <Input
              label="Registration Number"
              required
              value={form.registrationNumber}
              onChange={(e) => set('registrationNumber', e.target.value)}
              error={errors.registrationNumber}
              hint="Official government or health authority registration ID"
            />
            <Input
              label="Staff Contact Name"
              required
              value={form.staffName}
              onChange={(e) => set('staffName', e.target.value)}
              error={errors.staffName}
            />
            <Input
              label="Official Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
              hint="Used to sign in after verification"
            />
            <Input
              label="Password"
              type="password"
              required
              value={form.password}
              onChange={(e) => set('password', e.target.value)}
              error={errors.password}
              hint="At least 8 characters — use this after admin approval"
              autoComplete="new-password"
            />
            <Input
              label="Phone"
              required
              value={form.phone}
              onChange={(e) => set('phone', e.target.value)}
              error={errors.phone}
            />
            <Input
              label="Address"
              required
              value={form.address}
              onChange={(e) => set('address', e.target.value)}
              error={errors.address}
            />
            <Input
              label="Staff ID"
              required
              value={form.staffId}
              onChange={(e) => set('staffId', e.target.value)}
              error={errors.staffId}
              hint="Your employee or staff identifier at the organization"
            />
            <div>
              <label htmlFor="document" className="mb-1.5 block text-sm font-medium text-navy">
                Supporting Document<span className="text-brand">*</span>
              </label>
              <input
                id="document"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                className="w-full rounded-xl border border-border bg-white px-3 py-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-surface file:px-3 file:py-1.5 file:text-sm file:font-medium"
                onChange={(e) => onFile(e.target.files?.[0] || null)}
                aria-invalid={!!errors.documentName}
              />
              {errors.documentName && (
                <p className="mt-1.5 text-sm text-critical" role="alert">
                  {errors.documentName}
                </p>
              )}
              {form.documentName && !errors.documentName && (
                <p className="mt-1.5 text-xs text-muted">Selected: {form.documentName}</p>
              )}
            </div>

            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" loading={loading}>
                Submit for Verification
              </Button>
              <Link to="/">
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        </Card>
      </div>
    </div>
  )
}
