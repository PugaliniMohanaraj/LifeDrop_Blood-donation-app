import type { ReactNode } from 'react'
import { PublicNavbar } from './Navbar'
import { PublicFooter } from './PublicFooter'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <PublicNavbar />
      <main className="flex-1">{children}</main>
      <PublicFooter />
    </div>
  )
}
