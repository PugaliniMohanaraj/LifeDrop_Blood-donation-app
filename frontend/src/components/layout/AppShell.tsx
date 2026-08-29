import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Droplet, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { getNavForRole } from '../../config/navigation'
import { StatusBadge } from '../ui'

export function AppShell() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)

  if (!user) return null

  const nav = getNavForRole(user.role)

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
      isActive ? 'bg-brand text-white' : 'text-slate-300 hover:bg-navy-muted hover:text-white'
    }`

  const SidebarContent = () => (
    <>
      <div className="mb-8 flex items-center gap-2 px-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand text-white">
          <Droplet className="h-5 w-5" fill="currentColor" />
        </span>
        <div>
          <p className="text-sm font-extrabold text-white">BLOOD BRIDGE</p>
          <p className="text-xs text-slate-400 capitalize">{user.role.replace('_', ' ').toLowerCase()}</p>
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
            {item.label}
          </NavLink>
        ))}
      </nav>

      <button
        type="button"
        onClick={handleLogout}
        className="mt-4 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-300 hover:bg-navy-muted hover:text-white"
      >
        <LogOut className="h-4 w-4" aria-hidden />
        Logout
      </button>
    </>
  )

  return (
    <div className="min-h-screen bg-surface lg:flex">
      <aside className="hidden w-64 shrink-0 flex-col bg-navy p-4 lg:flex">
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
          <aside className="absolute inset-y-0 left-0 flex w-72 flex-col bg-navy p-4 shadow-xl">
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
        <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-border bg-white px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="rounded-lg p-2 text-navy lg:hidden"
              aria-label="Open menu"
              onClick={() => setOpen(true)}
            >
              <Menu className="h-5 w-5" />
            </button>
            <div>
              <p className="text-sm font-semibold text-navy">{user.fullName}</p>
              <p className="text-xs text-muted">{user.email}</p>
            </div>
          </div>
          {user.bloodGroup && (
            <StatusBadge label={`Blood Group ${user.bloodGroup}`} tone="critical" />
          )}
          {user.organizationName && user.verified && (
            <StatusBadge label={`${user.organizationName} ✓ Verified`} tone="success" />
          )}
        </header>
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
