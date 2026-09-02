import { Droplets } from 'lucide-react'
import { EmptyState } from '../ui'

interface AvailabilityEmptyStateProps {
  onClear: () => void
}

export function AvailabilityEmptyState({ onClear }: AvailabilityEmptyStateProps) {
  return (
    <EmptyState
      icon={<Droplets className="h-10 w-10" aria-hidden />}
      title="No blood availability found"
      description="We couldn't find availability matching your selected criteria. Try another blood group, district, or blood component."
      actionLabel="Clear Filters"
      onAction={onClear}
    />
  )
}
