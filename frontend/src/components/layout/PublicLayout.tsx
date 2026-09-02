import type { ReactNode } from 'react'
import { PublicNavbar } from './Navbar'
import { PublicFooter } from './PublicFooter'
import { SkipLink } from '../SkipLink'

export function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface">
      <SkipLink />
      <PublicNavbar />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <PublicFooter />
    </div>
  )
}
