import { AlertTriangle } from 'lucide-react'
import { Button, Card } from '../ui'

interface AvailabilityErrorProps {
  onRetry: () => void
}

export function AvailabilityError({ onRetry }: AvailabilityErrorProps) {
  return (
    <Card className="mx-auto max-w-lg text-center" role="alert">
      <AlertTriangle className="mx-auto h-10 w-10 text-brand" aria-hidden />
      <h3 className="mt-3 text-lg font-semibold text-navy">Unable to load blood availability</h3>
      <p className="mt-2 text-sm text-muted">
        Something went wrong while retrieving availability. Please try again.
      </p>
      <Button className="mt-5" onClick={onRetry}>
        Try Again
      </Button>
    </Card>
  )
}
