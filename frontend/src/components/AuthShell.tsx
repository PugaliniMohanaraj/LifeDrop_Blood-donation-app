import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'
import { ThemeToggle } from './ThemeToggle'
import { publicImages } from '../data/publicImages'

export function AuthShell({
  title,
  subtitle,
  children,
  footer,
  heroImage = publicImages.hero.register,
  heroImageAlt = 'A doctor comforting a young patient in hospital care',
}: {
  title: string
  subtitle?: string
  children: ReactNode
  footer?: ReactNode
  heroImage?: string
  heroImageAlt?: string
}) {
  return (
    <div className="min-h-screen bg-[#F3EAE3] px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-[1180px] overflow-hidden rounded-[1.75rem] border border-border/50 bg-white shadow-[0_24px_80px_rgba(11,28,51,0.1)]">
        <div className="grid lg:grid-cols-[1fr_1.08fr]">
          {/* Left visual panel — full-bleed image */}
          <div className="relative hidden min-h-[740px] overflow-hidden lg:block">
            <img
              src={heroImage}
              alt={heroImageAlt}
              className="absolute inset-0 h-full w-full object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-[#FDF6F3]/95 via-[#FCE8E8]/20 to-[#FCE8E8]/55" />
            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#FCE8E8]/80 to-transparent" />

            <div className="relative z-10 p-8 xl:p-10">
              <BrandMark />
            </div>

            <div
              className="absolute inset-x-0 bottom-0 z-10 h-1 bg-gradient-to-r from-brand via-brand-light to-brand"
              aria-hidden
            />
          </div>

          {/* Right form panel */}
          <div className="relative flex flex-col bg-white px-6 py-8 sm:px-9 sm:py-10 lg:px-10 lg:py-11">
            <div className="absolute right-6 top-6 sm:right-8 sm:top-8">
              <ThemeToggle variant="pill" />
            </div>

            <div className="mb-6 lg:hidden">
              <BrandMark />
            </div>

            <div className="mb-7 pr-16">
              <h2 className="text-[1.65rem] font-extrabold leading-tight text-brand sm:text-[1.75rem]">
                {title}
              </h2>
              {subtitle && <p className="mt-1.5 text-sm text-muted">{subtitle}</p>}
            </div>

            {children}

            {footer && <div className="mt-8">{footer}</div>}

            <p className="mt-6 text-center">
              <Link to="/" className="text-sm font-semibold text-brand hover:underline">
                ← Back to home
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
