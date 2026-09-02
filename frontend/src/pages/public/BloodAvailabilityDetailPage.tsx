import { useEffect, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Building2, Mail, MapPin, Navigation, Phone, ShieldCheck } from 'lucide-react'
import { fetchBloodAvailabilityDetail } from '../../api/bloodBridge'
import { PublicLayout } from '../../components/layout/PublicLayout'
import {
  AvailabilityStatusBadge,
  formatRelativeTime,
} from '../../components/bloodAvailability/availabilityUtils'
import { BLOOD_COMPONENTS, DEFAULT_BLOOD_GROUP, DEFAULT_COMPONENT } from '../../data/bloodAvailabilityConfig'
import type { BloodAvailabilityDetail } from '../../types/bloodAvailability'
import { Button, Card, LoadingSpinner } from '../../components/ui'
import { AvailabilityError } from '../../components/bloodAvailability/AvailabilityError'

function componentLabel(code: string): string {
  return BLOOD_COMPONENTS.find((c) => c.value === code)?.label ?? code.replace(/_/g, ' ')
}

function orgTypeLabel(type: string): string {
  return type === 'BLOOD_BANK' ? 'Blood Bank' : 'Hospital'
}

export function BloodAvailabilityDetailPage() {
  const { organizationId } = useParams<{ organizationId: string }>()
  const [searchParams] = useSearchParams()
  const bloodGroup = searchParams.get('bloodGroup') || DEFAULT_BLOOD_GROUP
  const component = searchParams.get('component') || DEFAULT_COMPONENT

  const [detail, setDetail] = useState<BloodAvailabilityDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!organizationId) {
      setLoading(false)
      setError(true)
      return
    }
    setLoading(true)
    setError(false)
    void fetchBloodAvailabilityDetail(organizationId, bloodGroup, component)
      .then(setDetail)
      .catch(() => {
        setDetail(null)
        setError(true)
      })
      .finally(() => setLoading(false))
  }, [organizationId, bloodGroup, component])

  const mapsQuery = detail
    ? encodeURIComponent(`${detail.organizationName}, ${detail.address}, ${detail.district}, Sri Lanka`)
    : ''

  return (
    <PublicLayout>
      <section className="border-b border-border bg-gradient-to-br from-critical-bg/40 via-card to-card">
        <div className="container-app py-8 sm:py-10">
          <Link
            to="/blood-availability"
            className="inline-flex items-center gap-2 text-sm font-semibold text-brand hover:underline"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back to search
          </Link>
        </div>
      </section>

      <section className="container-app py-8 sm:py-10">
        {loading && <LoadingSpinner label="Loading organization details…" />}

        {!loading && error && (
          <AvailabilityError
            onRetry={() => {
              if (!organizationId) return
              setLoading(true)
              setError(false)
              void fetchBloodAvailabilityDetail(organizationId, bloodGroup, component)
                .then(setDetail)
                .catch(() => setError(true))
                .finally(() => setLoading(false))
            }}
          />
        )}

        {!loading && !error && detail && (
          <div className="mx-auto max-w-3xl space-y-6">
            <Card>
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-critical-bg text-brand">
                  <Building2 className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h1 className="text-2xl font-extrabold text-navy sm:text-3xl">
                    {detail.organizationName}
                  </h1>
                  {detail.verified && (
                    <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-success">
                      <ShieldCheck className="h-4 w-4" aria-hidden />
                      Verified LifeDrop Organization
                    </p>
                  )}
                  <p className="mt-2 flex items-start gap-2 text-sm text-muted">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    <span>
                      {detail.address}
                      <br />
                      {detail.district}, {detail.province} Province
                    </span>
                  </p>
                  <p className="mt-1 text-sm text-muted">
                    Type: {orgTypeLabel(detail.organizationType)}
                  </p>
                </div>
              </div>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-navy">Blood Availability</h2>
              <p className="mt-1 text-sm text-muted">
                {detail.bloodGroup} · {componentLabel(detail.component)}
              </p>
              <div className="mt-4 flex flex-wrap items-end gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wide text-muted">Available Units</p>
                  <p className="text-3xl font-extrabold text-navy">
                    {detail.availableUnits} Unit{detail.availableUnits === 1 ? '' : 's'}
                  </p>
                </div>
                <AvailabilityStatusBadge status={detail.status} />
              </div>
              <p className="mt-4 text-sm text-muted">
                Last updated: {formatRelativeTime(detail.lastUpdated)}
              </p>
              <p className="mt-2 text-xs text-muted">
                Source: {detail.sourceName} ({detail.sourceType === 'ORGANIZATION' ? 'verified organization inventory' : detail.sourceType})
              </p>
            </Card>

            <Card>
              <h2 className="text-lg font-bold text-navy">Contact Information</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {detail.phone && (
                  <li className="flex items-center gap-2 text-muted">
                    <Phone className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                    <a href={`tel:${detail.phone.replace(/\s/g, '')}`} className="font-medium text-navy hover:text-brand">
                      {detail.phone}
                    </a>
                  </li>
                )}
                {detail.email && (
                  <li className="flex items-center gap-2 text-muted">
                    <Mail className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                    <a href={`mailto:${detail.email}`} className="font-medium text-navy hover:text-brand">
                      {detail.email}
                    </a>
                  </li>
                )}
              </ul>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {detail.phone && (
                  <a href={`tel:${detail.phone.replace(/\s/g, '')}`} className="flex-1">
                    <Button className="w-full">Contact Blood Bank</Button>
                  </a>
                )}
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1"
                >
                  <Button variant="outline" className="w-full">
                    <Navigation className="h-4 w-4" aria-hidden />
                    Get Directions
                  </Button>
                </a>
              </div>
            </Card>

            <div className="rounded-2xl border border-dashed border-border bg-surface p-8 text-center">
              <MapPin className="mx-auto h-8 w-8 text-muted" aria-hidden />
              <p className="mt-2 text-sm font-medium text-navy">Map preview</p>
              <p className="mt-1 text-xs text-muted">
                Interactive map integration can be added when location services are connected.
              </p>
            </div>
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
