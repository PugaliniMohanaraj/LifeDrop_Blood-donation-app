import type { LucideIcon } from 'lucide-react'
import { ChevronRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { Card } from './ui'
import type { BloodGroup, StockLevel } from '../types'
import { stockLabel, stockTone } from './ui'

/** Consistent page header used across dashboards */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1.5 text-sm text-muted sm:text-base">{subtitle}</p>}
      </div>
      {action}
    </div>
  )
}

/** Standard authenticated page wrapper */
export function PageContainer({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div className={`mx-auto w-full max-w-none space-y-6 pb-4 ${className}`}>{children}</div>
  )
}

/** Donor-style icon + title header for sub-pages */
export function IconPageHeader({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: LucideIcon
  title: string
  subtitle?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="flex flex-wrap items-start justify-between gap-4">
      <div>
        <div className="flex items-center gap-2">
          <Icon className="h-6 w-6 text-brand" aria-hidden />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        </div>
        {subtitle && (
          <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  )
}

/** Soft red gradient hero strip for primary dashboard CTAs */
export function HeroPanel({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children?: ReactNode
}) {
  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand via-[#C40510] to-[#8B0A0A] p-6 text-white shadow-lg shadow-brand/25 sm:p-8">
      <HeroBloodIllustration />
      <div className="relative z-10 max-w-xl">
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/15 backdrop-blur-sm">
          <span className="text-lg" aria-hidden>
            🩸
          </span>
        </div>
        <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
        <p className="mt-2 max-w-lg text-sm leading-relaxed text-white/90">{subtitle}</p>
        {children && <div className="mt-6 flex flex-wrap gap-3">{children}</div>}
      </div>
    </div>
  )
}

function HeroBloodIllustration() {
  return (
    <div
      className="pointer-events-none absolute -right-2 bottom-0 top-0 hidden w-[min(42%,16rem)] items-center justify-center lg:flex"
      aria-hidden
    >
      <div className="relative h-44 w-44 xl:h-52 xl:w-52">
        <div className="absolute right-6 top-2 text-2xl opacity-60">♥</div>
        <div className="absolute right-16 top-10 text-lg opacity-40">+</div>
        <div className="absolute right-2 top-16 text-sm opacity-50">+</div>
        <div className="absolute left-4 top-8 h-3 w-3 rounded-full bg-white/30" />
        <div className="absolute right-10 bottom-16 h-2 w-2 rounded-full bg-white/25" />
        <svg viewBox="0 0 120 140" className="h-full w-full drop-shadow-2xl">
          <path
            d="M38 8h44c6 0 10 4 10 10v8c0 8-6 14-14 14H42c-8 0-14-6-14-14V18c0-6 4-10 10-10z"
            fill="rgba(255,255,255,0.35)"
          />
          <rect x="54" y="4" width="12" height="10" rx="3" fill="rgba(255,255,255,0.5)" />
          <path
            d="M30 36h60c8 0 14 6 14 14v58c0 28-22 32-44 32S16 136 16 108V50c0-8 6-14 14-14z"
            fill="rgba(255,255,255,0.22)"
            stroke="rgba(255,255,255,0.45)"
            strokeWidth="2"
          />
          <path
            d="M52 62h16v16H52z"
            fill="none"
            stroke="rgba(255,255,255,0.85)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M60 92 C48 104 34 98 34 88 C34 78 48 72 60 84 C72 72 86 78 86 88 C86 98 72 104 60 92Z"
            fill="none"
            stroke="rgba(255,255,255,0.55)"
            strokeWidth="3"
          />
        </svg>
      </div>
    </div>
  )
}

export function BloodGroupCircle({ group }: { group: BloodGroup | string }) {
  return (
    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-critical-bg text-sm font-extrabold text-brand ring-2 ring-brand/10">
      {group}
    </span>
  )
}

export function StatCard({
  label,
  value,
  tone = 'navy',
}: {
  label: string
  value: string | number
  tone?: 'navy' | 'brand' | 'success' | 'warning' | 'critical'
}) {
  const tones = {
    navy: 'text-foreground',
    brand: 'text-brand',
    success: 'text-success',
    warning: 'text-warning',
    critical: 'text-critical',
  }
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className={`mt-2 text-3xl font-extrabold ${tones[tone]}`}>{value}</p>
    </div>
  )
}

/** Donor-style metric card with icon */
export function MetricCard({
  label,
  value,
  icon,
  iconClass,
  footer,
  statusHint,
  statusTone = 'brand',
}: {
  label: string
  value: ReactNode
  icon: ReactNode
  iconClass: string
  footer?: ReactNode
  statusHint?: string
  statusTone?: 'brand' | 'success' | 'warning' | 'critical' | 'info'
}) {
  const hintColors = {
    brand: 'text-brand',
    success: 'text-success',
    warning: 'text-warning',
    critical: 'text-critical',
    info: 'text-info',
  }
  return (
    <Card className="relative overflow-hidden p-5 transition hover:border-brand/20 hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</p>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {value}
          </div>
          {statusHint && (
            <p className={`mt-2 text-xs font-semibold ${hintColors[statusTone]}`}>{statusHint}</p>
          )}
          {footer && <div className="mt-3">{footer}</div>}
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </span>
      </div>
    </Card>
  )
}

export function SectionHeader({
  title,
  to,
  linkLabel,
}: {
  title: string
  to?: string
  linkLabel?: string
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <div className="flex items-center gap-2.5">
        <span className="h-5 w-1 rounded-full bg-brand" aria-hidden />
        <h2 className="text-base font-bold text-foreground sm:text-lg">{title}</h2>
      </div>
      {to && linkLabel && (
        <Link
          to={to}
          className="inline-flex items-center gap-0.5 text-sm font-semibold text-brand hover:underline"
        >
          {linkLabel}
          <ChevronRight className="h-4 w-4" aria-hidden />
        </Link>
      )}
    </div>
  )
}

export function FilterPills<T extends string>({
  options,
  value,
  onChange,
  counts,
}: {
  options: { key: T; label: string }[]
  value: T
  onChange: (key: T) => void
  counts?: Partial<Record<T, number>>
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((opt) => {
        const active = value === opt.key
        const count = counts?.[opt.key]
        return (
          <button
            key={opt.key}
            type="button"
            onClick={() => onChange(opt.key)}
            aria-pressed={active}
            className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
              active
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'border border-border bg-card text-muted hover:border-brand/40 hover:text-brand'
            }`}
          >
            {opt.label}
            {count !== undefined && (
              <span className={`ml-1.5 ${active ? 'text-white/85' : 'text-muted'}`}>
                ({count})
              </span>
            )}
          </button>
        )
      })}
    </div>
  )
}

/** Bottom gradient CTA banner */
export function GradientBanner({
  variant = 'brand',
  icon,
  title,
  description,
  children,
}: {
  variant?: 'brand' | 'success'
  icon?: ReactNode
  title: string
  description: string
  children?: ReactNode
}) {
  const bg =
    variant === 'success'
      ? 'border-success/20 bg-gradient-to-r from-success-bg/80 via-card to-card'
      : 'border-brand/20 bg-gradient-to-r from-critical-bg/80 via-card to-card'
  return (
    <Card className={`${bg} p-5 sm:p-6`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          {icon && (
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-card shadow-sm">
              {icon}
            </span>
          )}
          <div>
            <h3 className="font-bold text-foreground">{title}</h3>
            <p className="mt-1 text-sm text-muted">{description}</p>
          </div>
        </div>
        {children && <div className="flex flex-wrap gap-2">{children}</div>}
      </div>
    </Card>
  )
}

export function ListCard({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={`transition hover:border-brand/20 hover:shadow-md ${className}`}>
      {children}
    </Card>
  )
}

const stockPillStyles: Record<ReturnType<typeof stockTone>, string> = {
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  critical: 'bg-critical-bg text-critical',
  info: 'bg-info-bg text-info',
  neutral: 'bg-slate-100 text-slate-700',
  pending: 'bg-warning-bg text-warning',
}

/** Blood stock tile for hospital / blood bank dashboards */
export function StockLevelCard({
  bloodGroup,
  units,
  level,
}: {
  bloodGroup: BloodGroup
  units: number
  level: StockLevel
}) {
  const tone = stockTone(level)
  return (
    <Card className="overflow-hidden p-0 transition hover:border-brand/20 hover:shadow-md">
      <div className="px-5 py-5">
        <p className="text-2xl font-extrabold tracking-tight text-foreground">{bloodGroup}</p>
        <p className="mt-1 text-sm text-muted">{units} units</p>
      </div>
      <div
        className={`flex items-center justify-center gap-1.5 py-2.5 text-xs font-bold ${stockPillStyles[tone]}`}
      >
        <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden />
        {stockLabel(level)}
      </div>
    </Card>
  )
}
