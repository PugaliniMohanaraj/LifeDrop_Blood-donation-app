import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Building2, CheckCircle2 } from 'lucide-react'
import { Button, Card, Input, Select, StatusBadge } from '../components/ui'
import { validateOrgForm, isValidEmail, isValidPhone } from '../utils/validation'
import type { OrgType } from '../types'

export function OrganizationRegisterPage() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    name: '',
    type: '' as '' | OrgType,
    registrationNumber: '',
    email: '',
    phone: '',
    address: '',
    staffId: '',
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
    const v = validateOrgForm({
      ...form,
      type: form.type,
    })
    setErrors(v)
    if (Object.keys(v).length) return
    setLoading(true)
    window.setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 600)
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-surface py-12">
        <div className="container-app mx-auto max-w-lg">
          <Card className="text-center">
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
              You cannot access organization features until an admin approves your application.
            </p>
            <Link
              to="/"
              className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-5 py-2.5 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              Back to Home
            </Link>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-surface py-10">
      <div className="container-app mx-auto max-w-xl">
        <Link
          to="/register"
          className="mb-4 inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-navy"
        >
          <ArrowLeft className="h-4 w-4" /> Back to registration
        </Link>
        <Card>
          <div className="mb-2 flex items-center gap-2 text-brand">
            <Building2 className="h-6 w-6" />
            <span className="font-extrabold">Organization Verification</span>
          </div>
          <h1 className="text-2xl font-extrabold text-navy">Register your organization</h1>
          <p className="mt-2 text-sm leading-relaxed text-muted">
            To protect patients and donors, hospital and blood bank accounts must be verified before
            accessing organization features.
          </p>

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
              label="Official Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => set('email', e.target.value)}
              error={errors.email}
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
