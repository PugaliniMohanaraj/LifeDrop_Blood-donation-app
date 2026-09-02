import { Link } from 'react-router-dom'
import { ArrowLeft, Home } from 'lucide-react'
import { BrandMark } from '../components/BrandMark'
import { Button } from '../components/ui'

export function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface px-4 py-12">
      <BrandMark />
      <div className="mt-10 max-w-md rounded-[1.75rem] border border-border bg-card p-8 text-center shadow-lg">
        <p className="text-6xl font-extrabold text-brand">404</p>
        <h1 className="mt-4 text-2xl font-extrabold text-navy">Page not found</h1>
        <p className="mt-2 text-sm text-muted">
          The page you are looking for does not exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/">
            <Button className="gap-2 rounded-xl">
              <Home className="h-4 w-4" aria-hidden />
              Back to home
            </Button>
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex min-h-11 items-center gap-2 rounded-xl border-2 border-brand px-5 text-sm font-semibold text-brand transition hover:bg-critical-bg/40"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Go back
          </button>
        </div>
      </div>
    </div>
  )
}
