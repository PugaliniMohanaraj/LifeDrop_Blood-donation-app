import type { AvailabilityStatus } from '../../data/bloodAvailabilityConfig'
import { StatusBadge } from '../../components/ui'

export function availabilityLabel(status: AvailabilityStatus): string {
  if (status === 'AVAILABLE') return 'Available'
  if (status === 'LOW_STOCK') return 'Low Stock'
  return 'Critical'
}

export function availabilityIcon(status: AvailabilityStatus): string {
  if (status === 'AVAILABLE') return '✓'
  if (status === 'LOW_STOCK') return '⚠'
  return '!'
}

export function availabilityTone(
  status: AvailabilityStatus,
): 'success' | 'warning' | 'critical' {
  if (status === 'AVAILABLE') return 'success'
  if (status === 'LOW_STOCK') return 'warning'
  return 'critical'
}

export function formatRelativeTime(iso: string): string {
  const then = new Date(iso).getTime()
  const diffMs = Date.now() - then
  if (Number.isNaN(diffMs)) return 'Recently'
  const mins = Math.max(1, Math.round(diffMs / 60000))
  if (mins < 60) return `${mins} minute${mins === 1 ? '' : 's'} ago`
  const hours = Math.round(mins / 60)
  if (hours < 48) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.round(hours / 24)
  return `${days} day${days === 1 ? '' : 's'} ago`
}

export function AvailabilityStatusBadge({ status }: { status: AvailabilityStatus }) {
  return (
    <StatusBadge
      label={availabilityLabel(status)}
      tone={availabilityTone(status)}
      icon={<span aria-hidden>{availabilityIcon(status)}</span>}
    />
  )
}

export function resultCountLabel(
  count: number,
  district?: string,
  province?: string,
): string {
  if (district) {
    return `Showing ${count} blood bank${count === 1 ? '' : 's'} in ${district} District`
  }
  if (province) {
    return `Showing ${count} blood bank${count === 1 ? '' : 's'} in ${province} Province`
  }
  return count === 0
    ? 'Showing blood availability across Sri Lanka'
    : `Showing ${count} verified blood bank${count === 1 ? '' : 's'} across Sri Lanka`
}
