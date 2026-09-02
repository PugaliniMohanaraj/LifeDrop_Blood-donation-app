import type { ReactNode } from 'react'
import type { PublicHeroConfig } from '../../data/publicPageHeroes'

export function PublicHero({
  title,
  subtitle,
  image,
  objectPosition = 'center',
  eyebrow,
}: PublicHeroConfig) {
  return (
    <section className="relative flex min-h-[14rem] items-center overflow-hidden sm:min-h-[18rem] lg:min-h-[22rem]">
      <img
        src={image}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        style={{ objectPosition }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-r from-navy/75 via-navy/45 to-navy/20"
        aria-hidden
      />
      <div className="container-app relative z-10 py-12 sm:py-14">
        {eyebrow && (
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">{eyebrow}</p>
        )}
        <h1
          className={`text-4xl font-extrabold tracking-[0.12em] text-white sm:text-5xl lg:text-6xl ${
            eyebrow ? 'mt-2' : ''
          }`}
        >
          {title}
        </h1>
        <p className="mt-4 max-w-xl text-base leading-relaxed text-white/90 sm:text-lg">{subtitle}</p>
      </div>
    </section>
  )
}

/** Standard content section wrapper for public pages */
export function PublicPageSection({
  children,
  className = '',
  tinted = false,
}: {
  children: ReactNode
  className?: string
  tinted?: boolean
}) {
  return (
    <section
      className={`py-12 sm:py-16 ${tinted ? 'border-t border-border bg-surface' : ''} ${className}`}
    >
      <div className="container-app">{children}</div>
    </section>
  )
}
