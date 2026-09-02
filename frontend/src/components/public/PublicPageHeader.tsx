import type { ReactNode } from 'react'

export function PublicSectionHeader({
  eyebrow,
  title,
  subtitle,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'center' | 'left'
}) {
  const alignClass = align === 'center' ? 'text-center mx-auto' : 'text-left'
  return (
    <div className={`max-w-3xl ${alignClass}`}>
      {eyebrow && (
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">{title}</h2>
      {subtitle && <p className="mt-3 text-base text-muted">{subtitle}</p>}
    </div>
  )
}

export function PublicPageHeader({
  title,
  subtitle,
  icon,
  eyebrow,
}: {
  title: string
  subtitle?: string
  icon?: ReactNode
  eyebrow?: string
}) {
  return (
    <section className="border-b border-border bg-gradient-to-br from-critical-bg/40 via-card to-card">
      <div className="container-app py-12 sm:py-14">
        <div className="flex items-start gap-3">
          {icon && <span className="mt-1 text-brand">{icon}</span>}
          <div>
            {eyebrow && (
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">{eyebrow}</p>
            )}
            <h1 className="text-3xl font-extrabold tracking-tight text-navy sm:text-4xl">{title}</h1>
            {subtitle && <p className="mt-2 max-w-2xl text-base text-muted">{subtitle}</p>}
          </div>
        </div>
      </div>
    </section>
  )
}
