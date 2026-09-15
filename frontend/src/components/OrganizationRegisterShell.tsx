import type { ReactNode } from 'react'
import { Building2, Headphones, Lock, ShieldCheck, Users } from 'lucide-react'
import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { ThemeToggle } from './ThemeToggle'
import { publicImages } from '../data/publicImages'
import { contactInfo } from '../config/contact'

const features = [
  {
    icon: ShieldCheck,
    title: 'Verified & Trusted',
    text: 'Build trust by verifying your organization on LifeDrop.',
  },
  {
    icon: Users,
    title: 'Access Special Features',
    text: 'Manage blood stock, staff, and respond to requests.',
  },
  {
    icon: Lock,
    title: 'Secure & Compliant',
    text: 'Your information is encrypted and used only for verification.',
  },
] as const

export function OrganizationRegisterShell({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen bg-[#F4F6F8] px-4 py-6 sm:px-6 sm:py-8">
      <div className="mx-auto w-full max-w-[1240px]">
        <div className="flex items-start justify-between gap-4">
          <BrandMark />
          <ThemeToggle variant="pill" />
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10 xl:gap-12">
          {/* Left informational column */}
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 text-brand">
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-critical-bg">
                  <Building2 className="h-4 w-4" aria-hidden />
                </span>
                <span className="text-sm font-bold">Organization Verification</span>
              </div>
              <h1 className="mt-4 text-3xl font-extrabold leading-tight text-navy sm:text-[2.1rem]">
                Register your organization
              </h1>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-muted">
                To protect patients and donors, hospital and blood bank accounts must be verified
                before accessing LifeDrop organization features.
              </p>
            </div>

            <div className="overflow-hidden rounded-[1.75rem] border border-border/60 bg-white shadow-[0_16px_48px_rgba(11,28,51,0.08)]">
              <div className="relative h-52 sm:h-60">
                <img
                  src={publicImages.hero.register}
                  alt=""
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent" />
              </div>
              <div className="space-y-5 px-6 py-6 sm:px-7">
                {features.map(({ icon: Icon, title, text }) => (
                  <div key={title} className="flex gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-critical-bg text-brand">
                      <Icon className="h-[1.1rem] w-[1.1rem]" aria-hidden />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-navy">{title}</p>
                      <p className="mt-0.5 text-sm leading-relaxed text-muted">{text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.35rem] border border-border/60 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-critical-bg text-brand">
                  <Headphones className="h-[1.1rem] w-[1.1rem]" aria-hidden />
                </span>
                <div>
                  <p className="text-sm font-bold text-navy">Need help?</p>
                  <p className="mt-1 text-sm text-muted">Our support team is here to help you.</p>
                  <a
                    href={`tel:${contactInfo.phoneTel}`}
                    className="mt-2 block text-sm font-semibold text-brand hover:underline"
                  >
                    {contactInfo.phoneDisplay}
                  </a>
                  <a
                    href={`mailto:${contactInfo.email}`}
                    className="text-sm font-semibold text-brand hover:underline"
                  >
                    {contactInfo.email}
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Right form column */}
          <div className="rounded-[1.75rem] border border-border/60 bg-white px-6 py-7 shadow-[0_16px_48px_rgba(11,28,51,0.08)] sm:px-8 sm:py-8">
            <div className="mb-6">
              <h2 className="text-xl font-extrabold text-navy sm:text-2xl">
                Register your organization
              </h2>
              <p className="mt-1.5 text-sm text-muted">
                Please provide accurate information for verification.
              </p>
            </div>
            {children}
          </div>
        </div>

        <footer className="mt-10 pb-4 text-center">
          <p className="inline-flex items-center gap-2 text-sm text-muted">
            <Lock className="h-4 w-4 text-brand" aria-hidden />
            Your information is secure and protected.
          </p>
          <p className="mt-2 text-xs text-muted/80">© 2025 LifeDrop. All rights reserved.</p>
          <p className="mt-4">
            <Link to="/" className="text-sm font-semibold text-brand hover:underline">
              ← Back to home
            </Link>
          </p>
        </footer>
      </div>
    </div>
  )
}
