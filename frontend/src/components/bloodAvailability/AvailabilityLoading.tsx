import { Card } from '../ui'

function SkeletonCard() {
  return (
    <Card className="animate-pulse space-y-4" aria-hidden>
      <div className="h-5 w-3/4 rounded-lg bg-surface" />
      <div className="h-4 w-1/2 rounded-lg bg-surface" />
      <div className="h-4 w-2/5 rounded-lg bg-surface" />
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="h-12 rounded-lg bg-surface" />
        <div className="h-12 rounded-lg bg-surface" />
        <div className="h-12 rounded-lg bg-surface" />
        <div className="h-12 rounded-lg bg-surface" />
      </div>
      <div className="h-10 w-full rounded-full bg-surface" />
    </Card>
  )
}

export function AvailabilityLoading() {
  return (
    <div
      className="grid gap-5 sm:grid-cols-2"
      role="status"
      aria-live="polite"
      aria-label="Loading blood availability"
    >
      {Array.from({ length: 4 }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}
