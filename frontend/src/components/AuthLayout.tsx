import { Heart, ShieldCheck, UserCheck } from 'lucide-react'
import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { ThemeToggle } from './ThemeToggle'
import { publicImages } from '../data/publicImages'

const trustBadges = [
  { icon: ShieldCheck, label: '100% Secure' },
  { icon: UserCheck, label: 'Verified' },
  { icon: Heart, label: 'Saving Lives' },
] as const

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  panel = 'marketing',
  imageSrc = publicImages.hero.contact,
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  /** `visual` = logo + image + trust badges only (no headline copy) */
  panel?: 'marketing' | 'visual'
  imageSrc?: string
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-surface">
      <div className="absolute right-5 top-5 z-20 sm:right-8">
        <ThemeToggle />
      </div>
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(227,6,19,0.06),_transparent_50%)]"
        aria-hidden
      />

      <div className="container-app relative grid min-h-screen w-full items-center gap-8 py-8 lg:grid-cols-2 lg:gap-12 lg:py-10">
        {/* Left panel */}
        {panel === 'visual' ? (
          <div className="relative hidden min-h-[34rem] flex-col overflow-hidden rounded-3xl lg:flex">
            <div className="absolute inset-0 bg-gradient-to-br from-critical-bg/80 via-[#FDF2F2] to-[#F5EDE8]" />
            <div className="relative z-10 p-8">
              <BrandMark />
            </div>
            <div className="relative z-10 flex flex-1 items-end px-6 pb-4">
              <img
                src={imageSrc}
                alt=""
                className="max-h-[min(48vh,480px)] w-full rounded-2xl object-cover object-center shadow-xl"
              />
            </div>
            <div className="relative z-10 grid grid-cols-3 gap-2 border-t border-brand/10 bg-white/60 px-6 py-4 backdrop-blur-sm">
              {trustBadges.map(({ icon: Icon, label }) => (
                <div key={label} className="flex flex-col items-center gap-1 text-center">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-critical-bg text-brand">
                    <Icon className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="text-[11px] font-semibold text-navy">{label}</span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="hidden lg:block">
            <BrandMark />
            <h1 className="mt-10 max-w-xl text-4xl font-extrabold leading-tight text-navy xl:text-5xl">
              Every Drop Can <span className="text-brand">Save a Life</span>
            </h1>
            <p className="mt-4 max-w-lg text-muted">
              LifeDrop keeps donors, recipients, and hospitals connected with clear status and
              trustworthy matching.
            </p>
            <img
              src="/logo.png"
              alt=""
              className="mt-10 w-80 animate-float rounded-[2rem] object-contain drop-shadow-xl xl:w-96"
            />
          </div>
        )}

        {/* Right panel — form */}
        <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-xl lg:justify-self-end">
          <div className="mb-6 lg:hidden">
            <BrandMark />
          </div>
          <div className="rounded-3xl border border-border bg-card p-6 shadow-xl shadow-brand/5 sm:p-8">
            <h2 className="text-2xl font-extrabold text-navy sm:text-[1.65rem]">{title}</h2>
            {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
            <div className="mt-6">{children}</div>
            {footer && <div className="mt-6">{footer}</div>}
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            <Link to="/" className="inline-flex items-center gap-1 font-medium text-brand hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
