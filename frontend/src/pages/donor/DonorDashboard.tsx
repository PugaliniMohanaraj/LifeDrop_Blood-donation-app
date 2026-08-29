import { Link } from 'react-router-dom'
import { MapPin, Droplets } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { Button, Card, StatusBadge, requestStatusMeta } from '../../components/ui'

export function DonorDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const nearby = requests.filter(
    (r) => r.status !== 'CANCELLED' && r.status !== 'COMPLETED' && r.urgency !== 'NORMAL',
  )

  const available = user?.availability === 'AVAILABLE'

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Hello 👋 {user?.fullName?.split(' ')[0]}</h1>
        <p className="text-sm text-muted">Here&apos;s your donor overview — status, needs nearby, and next actions.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Blood Group</p>
          <p className="mt-2 text-3xl font-extrabold text-brand">{user?.bloodGroup || '—'}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Availability</p>
          <div className="mt-2">
            <StatusBadge
              label={available ? 'Available' : 'Unavailable'}
              tone={available ? 'success' : 'neutral'}
              icon={<span>{available ? '🟢' : '⚪'}</span>}
            />
          </div>
          <Link to="/donor/availability" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
            Update Availability
          </Link>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Total Donations</p>
          <p className="mt-2 text-3xl font-extrabold text-navy">{user?.totalDonations ?? 0}</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/donor/requests">
          <Button size="lg">
            <Droplets className="h-4 w-4" /> View Blood Requests
          </Button>
        </Link>
        <Link to="/donor/requests">
          <Button variant="outline" size="lg">
            View Nearby Requests
          </Button>
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-navy">Nearby requests</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {nearby.slice(0, 4).map((r) => {
            const meta = requestStatusMeta(r.status)
            return (
              <Card key={r.id} as="article">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-navy">
                      {r.bloodGroup} Blood Required
                    </p>
                    <p className="mt-1 text-sm text-muted">{r.units} Units</p>
                  </div>
                  {r.urgency === 'EMERGENCY' || r.urgency === 'URGENT' ? (
                    <StatusBadge
                      label={r.urgency === 'EMERGENCY' ? 'Emergency' : 'Urgent'}
                      tone="critical"
                      icon={<span>🚨</span>}
                    />
                  ) : null}
                </div>
                <p className="mt-3 flex items-center gap-1 text-sm text-muted">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {r.distanceKm?.toFixed(1)} km · {r.hospital}
                </p>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
                  <Link
                    to={`/donor/requests/${r.id}`}
                    className="text-sm font-semibold text-brand hover:underline"
                  >
                    View Request
                  </Link>
                </div>
              </Card>
            )
          })}
        </div>
      </section>
    </div>
  )
}
