import { Clock, FileText, Info } from 'lucide-react'
import { NBTS_SOURCE_LABEL } from '../../data/bloodAvailabilityConfig'
import { Tooltip } from '../ui/Tooltip'
import { formatRelativeTime } from './availabilityUtils'

export function AvailabilityInfoBanner({ lastUpdated }: { lastUpdated?: string }) {
  return (
    <div
      className="rounded-2xl border border-border bg-critical-bg/30 px-4 py-3 sm:px-5"
      role="status"
      aria-live="polite"
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-navy">
          <span className="inline-flex items-center gap-2">
            <FileText className="h-4 w-4 shrink-0 text-brand" aria-hidden />
            <span>
              Data Source: <span className="font-medium">{NBTS_SOURCE_LABEL}</span>
            </span>
          </span>
          {lastUpdated && (
            <span className="inline-flex items-center gap-2 text-muted">
              <Clock className="h-4 w-4 shrink-0 text-brand" aria-hidden />
              Last updated: {formatRelativeTime(lastUpdated)}
            </span>
          )}
        </div>
        <div className="inline-flex items-center gap-1.5 text-sm text-muted">
          <Info className="h-4 w-4 shrink-0 text-brand" aria-hidden />
          <span>Availability may change quickly</span>
          <Tooltip
            label="About blood availability data"
            text="Blood availability is based on the latest information provided by verified blood banks and hospitals. Availability may change quickly. Please contact the blood bank before travelling."
          />
        </div>
      </div>
    </div>
  )
}
