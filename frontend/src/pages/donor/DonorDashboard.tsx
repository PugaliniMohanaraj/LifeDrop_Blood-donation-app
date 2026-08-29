import { Link } from 'react-router-dom'
import { Droplets, MapPin } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { Button, Card, StatusBadge, requestStatusMeta } from '../../components/ui'
import { HeroPanel, PageHeader, StatCard } from '../../components/PageChrome'

export function DonorDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const nearby = requests.filter(
    (r) => r.status !== 'CANCELLED' && r.status !== 'COMPLETED',
  )
  const available = user?.availability === 'AVAILABLE'

  return (
    <div className="mx-auto w-full max-w-none space-y-6">
      <PageHeader
        title={`Hello 👋 ${user?.fullName?.split(' ')[0] || ''}`}
        subtitle="Your LifeDrop donor overview — status, nearby needs, and next actions."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Blood Group" value={user?.bloodGroup || '—'} tone="brand" />
        <Card>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Availability</p>
          <div className="mt-3">
            <StatusBadge
              label={available ? 'Available' : 'Unavailable'}
              tone={available ? 'success' : 'neutral'}
              icon={<span>{available ? '🟢' : '⚪'}</span>}
            />
          </div>
          <Link
            to="/donor/availability"
            className="mt-3 inline-block text-sm font-semibold text-brand hover:underline"
          >
            Update Availability
          </Link>
        </Card>
        <StatCard label="Total Donations" value={user?.totalDonations ?? 0} />
      </div>

      <HeroPanel
        title="Ready to help?"
        subtitle="View nearby blood requests that match your group and availability."
      >
        <Link to="/donor/requests">
          <Button className="bg-white text-brand hover:bg-slate-100 shadow-none">
            <Droplets className="h-4 w-4" /> View Blood Requests
          </Button>
        </Link>
        <Link to="/donor/availability">
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            Update Availability
          </Button>
        </Link>
      </HeroPanel>

      <section>
        <h2 className="mb-3 text-lg font-bold text-navy">Nearby requests</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {nearby.slice(0, 4).map((r) => {
            const meta = requestStatusMeta(r.status)
            return (
              <Card key={r.id} as="article" className="transition hover:shadow-md">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <p className="font-bold text-navy">{r.bloodGroup} Blood Required</p>
                    <p className="mt-1 text-sm text-muted">{r.units} Units</p>
                  </div>
                  {r.urgency !== 'NORMAL' && (
                    <StatusBadge
                      label={r.urgency === 'EMERGENCY' ? 'Emergency' : 'Urgent'}
                      tone="critical"
                      icon={<span>🚨</span>}
                    />
                  )}
                </div>
                <p className="mt-3 flex items-center gap-1 text-sm text-muted">
                  <MapPin className="h-4 w-4" aria-hidden />
                  {r.distanceKm != null ? `${r.distanceKm.toFixed(1)} km · ` : ''}
                  {r.hospital}
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
