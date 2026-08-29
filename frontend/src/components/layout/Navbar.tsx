import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'
import { publicLinks } from '../../config/publicNav'
import { useAuth } from '../../context/AuthContext'
import { BrandMark } from '../BrandMark'

function dashboardForRole(role: string | undefined) {
  switch (role) {
    case 'DONOR':
      return '/donor'
    case 'RECIPIENT':
      return '/recipient'
    case 'HOSPITAL':
      return '/hospital'
    case 'BLOOD_BANK':
      return '/blood-bank'
    case 'ADMIN':
      return '/admin'
    default:
      return null
  }
}

export function PublicNavbar() {
  const [open, setOpen] = useState(false)
  const { user } = useAuth()
  const location = useLocation()
  const dashboardPath = dashboardForRole(user?.role)

  const isActive = (to: string) => {
    if (to === '/') return location.pathname === '/' && !location.hash
    if (to.startsWith('/#')) {
      return location.hash === to.slice(1) || (location.pathname === '/' && location.hash === to.slice(1))
    }
    return location.pathname === to
  }

  return (
    <header className="sticky top-0 z-40 border-b border-border/60 bg-white/90 shadow-[0_1px_0_rgba(11,28,51,0.04)] backdrop-blur-md">
      <div className="container-app flex h-[4.75rem] items-center justify-between gap-5 lg:h-[5.25rem]">
        <BrandMark />

        <nav className="hidden items-center gap-1 xl:flex" aria-label="Main">
          {publicLinks.map((l) => {
            const active = l.to === '/' ? location.pathname === '/' && !location.hash : isActive(l.to)
            return (
              <a
                key={l.to}
                href={l.to}
                className={`relative rounded-full px-3.5 py-2 text-[0.95rem] font-semibold tracking-tight transition ${
                  active
                    ? 'text-brand'
                    : 'text-navy/75 hover:bg-critical-bg/40 hover:text-brand'
                }`}
              >
                {l.label}
                {active && (
                  <span
                    className="absolute inset-x-3.5 -bottom-0.5 mx-auto h-[3px] w-auto rounded-full bg-brand"
                    aria-hidden
                  />
                )}
              </a>
            )
          })}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {dashboardPath ? (
            <Link
              to={dashboardPath}
              className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-6 py-2.5 text-[0.95rem] font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex min-h-12 items-center rounded-full border-2 border-brand bg-white px-6 py-2.5 text-[0.95rem] font-bold text-brand transition hover:bg-critical-bg/50"
              >
                Log In
              </Link>
              <Link
                to="/register"
                className="inline-flex min-h-12 items-center justify-center rounded-full bg-brand px-6 py-2.5 text-[0.95rem] font-bold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-full p-2.5 text-navy hover:bg-surface xl:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-5 py-5 xl:hidden">
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {publicLinks.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="rounded-xl px-3 py-3 text-base font-semibold text-navy hover:bg-critical-bg/40 hover:text-brand"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-border pt-4">
              {dashboardPath ? (
                <Link
                  to={dashboardPath}
                  onClick={() => setOpen(false)}
                  className="rounded-full bg-brand px-4 py-3 text-center text-base font-bold text-white"
                >
                  Go to Dashboard
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-full border-2 border-brand px-4 py-3 text-center text-base font-bold text-brand"
                  >
                    Log In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setOpen(false)}
                    className="rounded-full bg-brand px-4 py-3 text-center text-base font-bold text-white"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
