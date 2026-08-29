import { Link } from 'react-router-dom'
import { Menu, X, Droplet } from 'lucide-react'
import { useState } from 'react'
import { publicLinks } from '../../config/navigation'
import { useAuth } from '../../context/AuthContext'

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
  const dashboardPath = dashboardForRole(user?.role)

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/95 backdrop-blur">
      <div className="container-app flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-extrabold tracking-tight text-brand">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
            <Droplet className="h-5 w-5" fill="currentColor" />
          </span>
          <span className="text-lg">BLOOD BRIDGE</span>
        </Link>

        <nav className="hidden items-center gap-6 md:flex" aria-label="Main">
          {publicLinks.map((l) => (
            <a key={l.to} href={l.to} className="text-sm font-medium text-muted hover:text-navy">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {dashboardPath ? (
            <Link
              to={dashboardPath}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex min-h-11 items-center rounded-xl px-4 py-2.5 text-sm font-semibold text-navy hover:bg-slate-100"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                Register
              </Link>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-lg p-2 text-navy md:hidden"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="border-t border-border bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3" aria-label="Mobile">
            {publicLinks.map((l) => (
              <a
                key={l.to}
                href={l.to}
                className="text-sm font-medium text-navy"
                onClick={() => setOpen(false)}
              >
                {l.label}
              </a>
            ))}
            {dashboardPath ? (
              <Link
                to={dashboardPath}
                onClick={() => setOpen(false)}
                className="font-semibold text-brand"
              >
                Go to Dashboard
              </Link>
            ) : (
              <>
                <Link to="/login" onClick={() => setOpen(false)} className="font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setOpen(false)}
                  className="font-semibold text-brand"
                >
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
