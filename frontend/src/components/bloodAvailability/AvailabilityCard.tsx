import { Link } from 'react-router-dom'
import { Building2, MapPin, ShieldCheck } from 'lucide-react'
import { BLOOD_COMPONENTS } from '../../data/bloodAvailabilityConfig'
import type { BloodAvailabilityItem } from '../../types/bloodAvailability'
import { Button, Card } from '../ui'
import { AnimatedCard } from '../public/AnimatedCard'
import {
  AvailabilityStatusBadge,
  formatRelativeTime,
} from './availabilityUtils'

function componentLabel(code: string): string {
  return BLOOD_COMPONENTS.find((c) => c.value === code)?.label ?? code.replace(/_/g, ' ')
}

function orgTypeLabel(type: string): string {
  return type === 'BLOOD_BANK' ? 'Blood Bank' : 'Hospital'
}

interface AvailabilityCardProps {
  item: BloodAvailabilityItem
  index?: number
}

export function AvailabilityCard({ item, index = 0 }: AvailabilityCardProps) {
  const detailUrl = `/blood-availability/${item.organizationId}?bloodGroup=${encodeURIComponent(item.bloodGroup)}&component=${encodeURIComponent(item.component)}`

  return (
    <AnimatedCard as="article" index={index}>
      <Card className="flex h-full flex-col">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="text-lg font-bold text-navy">{item.organizationName}</h3>
            <p className="mt-1 flex items-start gap-1.5 text-sm text-muted">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              {item.district}, {item.province} Province
            </p>
          </div>
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-critical-bg text-brand">
            <Building2 className="h-5 w-5" aria-hidden />
          </span>
        </div>

        {item.verified && (
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-success">
            <ShieldCheck className="h-4 w-4" aria-hidden />
            Verified {orgTypeLabel(item.organizationType)}
          </p>
        )}

        <dl className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">Blood Group</dt>
            <dd className="mt-1 text-lg font-bold text-navy">{item.bloodGroup}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">Blood Component</dt>
            <dd className="mt-1 font-semibold text-navy">{componentLabel(item.component)}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">Available Units</dt>
            <dd className="mt-1 text-lg font-bold text-navy">
              {item.availableUnits} Unit{item.availableUnits === 1 ? '' : 's'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-muted">Status</dt>
            <dd className="mt-1">
              <AvailabilityStatusBadge status={item.status} />
            </dd>
          </div>
        </dl>

        <p className="mt-4 text-xs text-muted">
          Last updated: {formatRelativeTime(item.lastUpdated)}
        </p>

        <div className="mt-5">
          <Link to={detailUrl} className="block">
            <Button variant="outline" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </Card>
    </AnimatedCard>
  )
}
