import type { ReactNode } from 'react'

/** Consistent page header used across dashboards */
export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string
  subtitle?: string
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-muted">{subtitle}</p>}
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
    <div className="rounded-3xl bg-gradient-to-br from-brand via-[#C40510] to-[#8B0A0A] p-6 text-white shadow-lg shadow-brand/20 sm:p-8">
      <h2 className="text-xl font-extrabold sm:text-2xl">{title}</h2>
      <p className="mt-1 max-w-xl text-sm text-white/85">{subtitle}</p>
      {children && <div className="mt-5 flex flex-wrap gap-3">{children}</div>}
    </div>
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
