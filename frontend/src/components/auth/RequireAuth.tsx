import { Link, Navigate, useLocation } from 'react-router-dom'
import { loadStoredUser, useAuth } from '../../context/AuthContext'
import type { UserRole } from '../../types'
import { Button } from '../ui'

function dashboardPath(role: UserRole): string {
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
      return '/'
  }
}

export function RequireAuth({
  children,
  roles,
}: {
  children: React.ReactNode
  roles?: UserRole[]
}) {
  const { user } = useAuth()
  const location = useLocation()
  const sessionUser = user ?? loadStoredUser()

  if (!sessionUser) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }

  if (roles && !roles.includes(sessionUser.role)) {
    return (
      <div className="container-app py-16">
        <div className="mx-auto max-w-md rounded-2xl border border-critical/20 bg-critical-bg p-6 text-center">
          <h1 className="text-lg font-bold text-critical">Access restricted</h1>
          <p className="mt-2 text-sm text-critical">
            You don&apos;t have permission to access this page.
          </p>
          <p className="mt-1 text-sm text-muted">
            Switch to an account with the correct role, or go back to your dashboard.
          </p>
          <Link to={dashboardPath(sessionUser.role)} className="mt-6 inline-block">
            <Button>Go to my dashboard</Button>
          </Link>
        </div>
      </div>
    )
  }

  return children
}
