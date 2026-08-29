import { Link } from 'react-router-dom'
import { MapPin } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { Card, EmptyState, StatusBadge, requestStatusMeta } from '../../components/ui'

export function DonorRequestsPage() {
  const { requests } = useAppData()
  const active = requests.filter((r) => r.status !== 'CANCELLED' && r.status !== 'COMPLETED')

  if (!active.length) {
    return (
      <EmptyState
        title="No blood requests nearby"
        description="When someone needs your blood type, requests will appear here."
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Blood Requests</h1>
        <p className="text-sm text-muted">Open a request to accept or decline. You stay in control.</p>
      </div>
      <div className="grid gap-4">
        {active.map((r) => {
          const meta = requestStatusMeta(r.status)
          return (
            <Card key={r.id} as="article" className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-bold text-navy">
                  {r.bloodGroup} · {r.units} Units
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm text-muted">
                  <MapPin className="h-4 w-4" /> {r.hospital}
                  {r.distanceKm != null && ` · ${r.distanceKm} km`}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
                  {r.urgency !== 'NORMAL' && (
                    <StatusBadge
                      label={r.urgency === 'EMERGENCY' ? 'Emergency' : 'Urgent'}
                      tone="critical"
                      icon={<span>🚨</span>}
                    />
                  )}
                </div>
              </div>
              <Link
                to={`/donor/requests/${r.id}`}
                className="inline-flex min-h-11 items-center justify-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                View Request
              </Link>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
