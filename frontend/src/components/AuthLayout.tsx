import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { BrandMark } from './BrandMark'

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string
  subtitle: string
  children: ReactNode
  footer?: ReactNode
}) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-white">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(227,6,19,0.08),_transparent_50%),radial-gradient(ellipse_at_bottom_left,_rgba(11,28,51,0.06),_transparent_45%)]"
        aria-hidden
      />

        <div className="container-app relative grid min-h-screen w-full items-center gap-10 py-10 lg:grid-cols-2 lg:gap-16">
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

        <div className="mx-auto w-full max-w-lg lg:mx-0 lg:max-w-xl lg:justify-self-end">
          <div className="mb-6 lg:hidden">
            <BrandMark />
          </div>
          <div className="rounded-3xl border border-border bg-white p-6 shadow-xl shadow-brand/5 sm:p-8">
            <h2 className="text-2xl font-extrabold text-navy">{title}</h2>
            <p className="mt-1 text-sm text-muted">{subtitle}</p>
            <div className="mt-6">{children}</div>
            {footer && <div className="mt-6">{footer}</div>}
          </div>
          <p className="mt-4 text-center text-sm text-muted">
            <Link to="/" className="font-medium text-brand hover:underline">
              ← Back to home
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
