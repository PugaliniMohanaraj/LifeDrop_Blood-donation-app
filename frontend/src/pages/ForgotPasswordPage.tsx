import { useState, type FormEvent } from 'react'
import { ArrowRight, CheckCircle2, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import api from '../api/client'
import { apiErrorMessage } from '../api/bloodBridge'
import { AuthField, authFieldClass } from '../components/AuthField'
import { AuthShell } from '../components/AuthShell'
import { Button, ErrorMessage } from '../components/ui'
import { publicImages } from '../data/publicImages'
import { isValidEmail } from '../utils/validation'
import { contactInfo } from '../config/contact'

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const onSubmit = (e: FormEvent) => {
    e.preventDefault()
    setFormError('')
    const next: Record<string, string> = {}
    if (!email.trim()) next.email = 'Please enter your email address.'
    else if (!isValidEmail(email)) next.email = 'Please enter a valid email address.'
    setErrors(next)
    if (Object.keys(next).length) return

    setLoading(true)
    void api
      .post<{ message: string }>('/auth/forgot-password', { email: email.trim().toLowerCase() })
      .then(() => setSubmitted(true))
      .catch((err) => {
        const axiosErr = err as { response?: { data?: { message?: string } } }
        if (!axiosErr.response) {
          setSubmitted(true)
          return
        }
        setFormError(
          apiErrorMessage(
            err,
            `Could not process your request. Please try again or contact ${contactInfo.email}.`,
          ),
        )
      })
      .finally(() => setLoading(false))
  }

  if (submitted) {
    return (
      <AuthShell
        title="Check your email"
        subtitle="Password reset instructions may be on the way."
        heroImage={publicImages.hero.login}
        heroImageAlt="A healthcare professional performing a blood draw in a clinical setting"
      >
        <div className="rounded-2xl border border-success/20 bg-success-bg/40 p-6 text-center">
          <CheckCircle2 className="mx-auto h-12 w-12 text-success" aria-hidden />
          <p className="mt-4 text-sm leading-relaxed text-navy">
            If an account exists for <strong>{email}</strong>, we&apos;ve sent password reset
            instructions. Check your inbox and spam folder.
          </p>
          <p className="mt-3 text-xs text-muted">
            Demo note: email delivery is simulated. Contact{' '}
            <a href={`mailto:${contactInfo.email}`} className="font-semibold text-brand hover:underline">
              {contactInfo.email}
            </a>{' '}
            if you need help signing in.
          </p>
        </div>
        <Link to="/login" className="mt-6 block">
          <Button className="min-h-12 w-full rounded-xl">Back to Log In</Button>
        </Link>
      </AuthShell>
    )
  }

  return (
    <AuthShell
      title="Forgot password?"
      subtitle="Enter your email and we'll send you reset instructions."
      heroImage={publicImages.hero.login}
      heroImageAlt="A healthcare professional performing a blood draw in a clinical setting"
      footer={
        <p className="text-center text-sm text-muted">
          Remember your password?{' '}
          <Link to="/login" className="font-semibold text-brand hover:underline">
            Log in
          </Link>
        </p>
      }
    >
      {formError && (
        <ErrorMessage title="Could not send reset link" message={formError} />
      )}

      <form className="mt-6 space-y-5" onSubmit={onSubmit} noValidate>
        <AuthField label="Email" icon={Mail} required error={errors.email}>
          <input
            type="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value)
              if (errors.email) setErrors((prev) => ({ ...prev, email: '' }))
            }}
            placeholder="Enter your email"
            className={authFieldClass(errors.email)}
          />
        </AuthField>

        <Button
          type="submit"
          loading={loading}
          className="min-h-12 w-full gap-2 rounded-xl text-base !shadow-md"
        >
          Send reset link
          <ArrowRight className="h-4 w-4" aria-hidden />
        </Button>
      </form>
    </AuthShell>
  )
}
