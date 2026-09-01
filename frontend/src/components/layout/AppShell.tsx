import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom'
import { LogOut, Menu, X, CheckCircle2, LifeBuoy, Mail, Phone } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getNavForRole } from '../../config/navigation'
import { Modal, StatusBadge } from '../ui'
import { ThemeToggle } from '../ThemeToggle'
import { UserAvatar } from '../UserAvatar'
import { useNotifications } from '../../hooks/useNotifications'
import { useToast } from '../../context/ToastContext'
import { Button } from '../ui/Button'

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const { items: notifications } = useNotifications()

  if (!user) return null

  const nav = getNavForRole(user.role)
  const unreadCount = notifications.filter((n) => !n.read).length

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const copySupportEmail = async () => {
    const email = 'support@lifedrop.lk'
    try {
      await navigator.clipboard.writeText(email)
      toast('Email copied to clipboard.', 'success')
    } catch {
      toast(`Email: ${email}`, 'info')
    }
  }

  const emailSupport = () => {
    window.open('mailto:support@lifedrop.lk?subject=LifeDrop%20Support%20Request', '_self')
    setHelpOpen(false)
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
      isActive
        ? 'bg-brand text-white shadow-md shadow-brand/30'
        : 'text-slate-300 hover:bg-white/10 hover:text-white'
    }`

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-center gap-3 px-1">
        <img
          src="/logo.png"
          alt=""
          className="h-11 w-11 rounded-full object-cover ring-2 ring-white/15"
        />
        <div>
          <p className="text-sm font-extrabold text-white">
            Life<span className="text-brand-light">Drop</span>
          </p>
          <p className="text-[11px] font-medium text-slate-400">Every Drop. A New Life.</p>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1" aria-label="App">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to.split('/').length <= 2}
            className={linkClass}
            onClick={() => setOpen(false)}
          >
            <item.icon className="h-4 w-4 shrink-0" aria-hidden />
            <span className="flex-1">{item.label}</span>
            {item.label === 'Notifications' && unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand px-1.5 text-[10px] font-bold text-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.07] p-4">
        <div className="flex items-start gap-2">
          <LifeBuoy className="mt-0.5 h-4 w-4 shrink-0 text-brand-light" aria-hidden />
          <div>
            <p className="text-sm font-semibold text-white">Need help?</p>
            <p className="mt-1 text-xs leading-relaxed text-slate-300">
              Questions about donating or your account?
            </p>
            <button
              type="button"
              onClick={() => setHelpOpen(true)}
              className="mt-3 inline-flex min-h-9 items-center rounded-full bg-white/15 px-4 text-xs font-semibold text-white transition hover:bg-white/25"
            >
              Contact support
            </button>
          </div>
        </div>
      </div>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-slate-300 transition hover:bg-white/10 hover:text-white"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Log out
      </button>

      <div className="mt-3 flex items-center justify-between rounded-xl px-1 py-1">
        <span className="text-xs font-medium text-slate-400">Dark mode</span>
        <ThemeToggle variant="sidebar" />
      </div>
    </>
  )

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_rgba(227,6,19,0.04),_transparent_45%),var(--color-surface)] lg:flex">
      <aside className="hidden w-[17rem] shrink-0 flex-col bg-sidebar p-5 lg:flex">
        <SidebarContent />
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            type="button"
            className="absolute inset-0 bg-navy/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-sidebar p-5 shadow-xl">
            <button
              type="button"
              className="mb-2 self-end rounded-lg p-2 text-white"
              aria-label="Close menu"
              onClick={() => setOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
            <SidebarContent />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border/80 bg-card/95 backdrop-blur-md">
          <div className="flex min-h-[4.25rem] flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <button
                type="button"
                className="rounded-full p-2 text-foreground hover:bg-surface lg:hidden"
                aria-label="Open menu"
                onClick={() => setOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </button>
              {user.role === 'DONOR' && (
                <UserAvatar name={user.fullName} photoUrl={user.photoUrl} size="sm" />
              )}
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-bold text-foreground">{user.fullName}</p>
                  {user.verified !== false && user.role === 'DONOR' && (
                    <CheckCircle2 className="h-4 w-4 text-success" aria-label="Verified" />
                  )}
                </div>
                <p className="text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center justify-end gap-2">
              <ThemeToggle variant="ghost" className="sm:hidden" />
              {user.role === 'DONOR' && (
                <Link
                  to="/donor/profile"
                  className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-sm font-semibold text-foreground transition hover:border-brand/40 hover:bg-critical-bg/30"
                >
                  <UserAvatar name={user.fullName} photoUrl={user.photoUrl} />
                  <span className="hidden sm:inline">Profile</span>
                </Link>
              )}
              {user.bloodGroup && (
                <StatusBadge label={`Blood Group ${user.bloodGroup}`} tone="critical" />
              )}
              {user.organizationName && user.verified && (
                <StatusBadge label={`${user.organizationName} ✓ Verified`} tone="success" />
              )}
            </div>
          </div>
        </header>
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>

      <Modal
        open={helpOpen}
        title="Contact support"
        onClose={() => setHelpOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setHelpOpen(false)}>
              Close
            </Button>
            <Button onClick={emailSupport}>
              <Mail className="h-4 w-4" /> Email support
            </Button>
          </>
        }
      >
        <p className="text-sm text-muted">
          Our team typically responds within one business day. Choose how you&apos;d like to reach us.
        </p>
        <ul className="mt-4 space-y-3">
          <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <Mail className="h-5 w-5 shrink-0 text-brand" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Email</p>
              <p className="font-medium text-foreground">support@lifedrop.lk</p>
            </div>
            <Button variant="ghost" size="sm" onClick={() => void copySupportEmail()}>
              Copy
            </Button>
          </li>
          <li className="flex items-center gap-3 rounded-2xl border border-border bg-surface px-4 py-3">
            <Phone className="h-5 w-5 shrink-0 text-brand" aria-hidden />
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">Phone</p>
              <p className="font-medium text-foreground">+94 11 200 2002</p>
            </div>
          </li>
        </ul>
        <Link
          to="/#faqs"
          onClick={() => setHelpOpen(false)}
          className="mt-4 inline-block text-sm font-semibold text-brand hover:underline"
        >
          Read frequently asked questions →
        </Link>
      </Modal>
    </div>
  )
}
