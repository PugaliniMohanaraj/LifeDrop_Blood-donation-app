import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  Droplet,
  Heart,
  MapPin,
  Sparkles,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { useNotifications } from '../../hooks/useNotifications'
import { Button, Card, EmptyState, StatusBadge, requestStatusMeta } from '../../components/ui'
import { HeroPanel } from '../../components/PageChrome'
import type { ReactNode } from 'react'

function MetricCard({
  label,
  value,
  icon,
  iconClass,
  footer,
}: {
  label: string
  value: ReactNode
  icon: ReactNode
  iconClass: string
  footer?: ReactNode
}) {
  return (
    <Card className="relative overflow-hidden p-5 transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-wider text-muted">{label}</p>
          <div className="mt-2 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            {value}
          </div>
          {footer && <div className="mt-3">{footer}</div>}
        </div>
        <span
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${iconClass}`}
        >
          {icon}
        </span>
      </div>
    </Card>
  )
}

function SectionHeader({ title, to, linkLabel }: { title: string; to?: string; linkLabel?: string }) {
  return (
    <div className="mb-4 flex items-center justify-between gap-3">
      <h2 className="text-base font-bold text-foreground sm:text-lg">{title}</h2>
      {to && linkLabel && (
        <Link to={to} className="text-sm font-semibold text-brand hover:underline">
          {linkLabel}
        </Link>
      )}
    </div>
  )
}

function urgencyTone(urgency: string) {
  if (urgency === 'EMERGENCY') return 'critical' as const
  if (urgency === 'URGENT') return 'warning' as const
  return 'neutral' as const
}

function urgencyLabel(urgency: string) {
  if (urgency === 'EMERGENCY') return 'Emergency'
  if (urgency === 'URGENT') return 'Urgent'
  return 'Normal'
}

export function DonorDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const { items: notifications, loading: notificationsLoading } = useNotifications()

  const available = user?.availability === 'AVAILABLE'
  const firstName = user?.fullName?.split(' ')[0] || 'Donor'

  const openRequests = requests.filter(
    (r) => r.status !== 'CANCELLED' && r.status !== 'COMPLETED',
  )
  const nearby = openRequests.filter(
    (r) => r.status === 'FINDING_DONORS' || r.status === 'MATCHING',
  )
  const activeDonation = requests.find(
    (r) => r.status === 'DONOR_ACCEPTED' || r.status === 'IN_PROGRESS',
  )
  const recentActivity = requests
    .filter((r) =>
      ['DONOR_ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(r.status),
    )
    .slice(0, 4)

  const eligible = available && Boolean(user?.bloodGroup)

  return (
    <div className="mx-auto w-full max-w-none space-y-6 pb-4">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Hello, {firstName}! 
        </h1>
        <p className="mt-1 text-sm text-muted sm:text-base">
          Your donor overview — stay available, respond to requests, and track donations.
        </p>
      </div>

      {/* Metrics */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Blood Group"
          value={user?.bloodGroup || '—'}
          icon={<Droplet className="h-5 w-5 text-brand" fill="currentColor" />}
          iconClass="bg-critical-bg"
        />
        <MetricCard
          label="Availability"
          value={
            <StatusBadge
              label={available ? 'Available' : user?.availability === 'BUSY' ? 'Busy' : 'Unavailable'}
              tone={available ? 'success' : user?.availability === 'BUSY' ? 'warning' : 'neutral'}
              icon={<span>{available ? '🟢' : user?.availability === 'BUSY' ? '🟡' : '⚪'}</span>}
            />
          }
          icon={<Sparkles className="h-5 w-5 text-success" />}
          iconClass="bg-success-bg"
          footer={
            <Link
              to="/donor/availability"
              className="text-sm font-semibold text-brand hover:underline"
            >
              Update availability
            </Link>
          }
        />
        <MetricCard
          label="Eligibility"
          value={
            <StatusBadge
              label={eligible ? 'Eligible' : 'Review status'}
              tone={eligible ? 'success' : 'warning'}
              icon={<span>{eligible ? '✓' : '!'}</span>}
            />
          }
          icon={<CheckCircle2 className="h-5 w-5 text-success" />}
          iconClass="bg-success-bg"
          footer={
            <p className="text-xs text-muted">
              {eligible ? 'Ready to donate when matched' : 'Set availability to receive requests'}
            </p>
          }
        />
        <MetricCard
          label="Total Donations"
          value={user?.totalDonations ?? 0}
          icon={<Heart className="h-5 w-5 text-brand" fill="currentColor" />}
          iconClass="bg-critical-bg"
        />
      </div>

      {/* CTA */}
      <HeroPanel
        title="Ready to help?"
        subtitle="View nearby blood requests that match your group and availability."
      >
        <Link to="/donor/requests">
          <Button variant="hero">
            <Droplet className="h-4 w-4" /> View Blood Requests
          </Button>
        </Link>
        <Link to="/donor/availability">
          <Button variant="heroOutline">Update Availability</Button>
        </Link>
      </HeroPanel>

      {/* Three-column workspace */}
      <div className="grid gap-6 xl:grid-cols-12">
        {/* Nearby requests */}
        <section className="xl:col-span-5">
          <SectionHeader title="Nearby Blood Requests" to="/donor/requests" linkLabel="See all" />
          <div className="space-y-3">
            {nearby.length === 0 ? (
              <Card className="py-8 text-center">
                <p className="text-sm font-medium text-muted">No open requests right now.</p>
                <p className="mt-1 text-xs text-muted">We will notify you when something matches.</p>
              </Card>
            ) : (
              nearby.slice(0, 4).map((r) => (
                <Card key={r.id} as="article" className="p-4 transition hover:border-brand/30 hover:shadow-md">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-bold text-foreground">{r.bloodGroup} blood required</p>
                      <p className="mt-0.5 text-sm text-muted">
                        {r.units} units · {r.hospital}
                      </p>
                    </div>
                    <StatusBadge
                      label={urgencyLabel(r.urgency)}
                      tone={urgencyTone(r.urgency)}
                      icon={<span>{r.urgency === 'NORMAL' ? '○' : '🚨'}</span>}
                    />
                  </div>
                  <p className="mt-3 flex items-center gap-1.5 text-sm text-muted">
                    <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                    {r.distanceKm != null ? `${r.distanceKm.toFixed(1)} km · ` : ''}
                    {r.location}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs text-muted">
                      Required {new Date(r.requiredDate).toLocaleDateString()}
                    </span>
                    <Link
                      to={`/donor/requests/${r.id}`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-brand hover:underline"
                    >
                      View request <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </Card>
              ))
            )}
          </div>
        </section>

        {/* Active donation */}
        <section className="xl:col-span-4">
          <SectionHeader title="Your Active Donation" />
          {activeDonation ? (
            <Card className="overflow-hidden p-0">
              <div className="border-b border-border bg-success-bg/50 px-5 py-4">
                <StatusBadge
                  label={requestStatusMeta(activeDonation.status).label}
                  tone="success"
                  icon={<span>✓</span>}
                />
                <p className="mt-3 text-lg font-bold text-foreground">
                  {activeDonation.bloodGroup} · {activeDonation.units} units
                </p>
                <p className="mt-1 text-sm text-muted">{activeDonation.hospital}</p>
              </div>
              <div className="space-y-3 px-5 py-4 text-sm">
                <div className="flex items-center gap-2 text-muted">
                  <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                  {activeDonation.location}
                  {activeDonation.distanceKm != null && ` · ${activeDonation.distanceKm.toFixed(1)} km`}
                </div>
                <div className="flex items-center gap-2 text-muted">
                  <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                  Required by {new Date(activeDonation.requiredDate).toLocaleDateString()}
                </div>
              </div>
              <div className="border-t border-border px-5 py-4">
                <Link to={`/donor/requests/${activeDonation.id}`}>
                  <Button className="w-full sm:w-auto">View details</Button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card className="flex min-h-[220px] flex-col items-center justify-center py-10 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-surface">
                <Heart className="h-7 w-7 text-muted" />
              </div>
              <p className="mt-4 font-semibold text-foreground">No active donation</p>
              <p className="mt-1 max-w-xs text-sm text-muted">
                When you accept a request, progress and hospital details appear here.
              </p>
              <Link to="/donor/requests" className="mt-4">
                <Button variant="outline" size="sm">
                  Browse requests
                </Button>
              </Link>
            </Card>
          )}
        </section>

        {/* Notifications + activity */}
        <section className="xl:col-span-3">
          <SectionHeader
            title="Notifications"
            to="/donor/notifications"
            linkLabel="View all"
          />
          <Card className="mb-6 p-0">
            {notificationsLoading ? (
              <p className="p-4 text-sm text-muted">Loading…</p>
            ) : notifications.length === 0 ? (
              <p className="p-4 text-sm text-muted">No new notifications.</p>
            ) : (
              <ul className="divide-y divide-border">
                {notifications.slice(0, 3).map((n) => (
                  <li key={n.id} className="flex gap-3 px-4 py-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-critical-bg">
                      <Bell className="h-4 w-4 text-brand" />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-foreground">{n.title}</p>
                      <p className="line-clamp-2 text-xs text-muted">{n.message}</p>
                      <p className="mt-1 text-[11px] text-muted">{n.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <SectionHeader title="Recent Activity" to="/donor/history" linkLabel="History" />
          {recentActivity.length === 0 ? (
            <EmptyState
              title="No activity yet"
              description="Your accepted and completed donations will appear here."
            />
          ) : (
            <Card className="p-0">
              <ul className="divide-y divide-border">
                {recentActivity.map((r) => {
                  const meta = requestStatusMeta(r.status)
                  return (
                    <li key={r.id} className="flex items-start gap-3 px-4 py-3">
                      <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-success-bg text-xs font-bold text-success">
                        ✓
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">
                          {r.bloodGroup} · {r.hospital}
                        </p>
                        <p className="text-xs text-muted">{meta.label}</p>
                      </div>
                      <span className="shrink-0 text-[11px] text-muted">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </Card>
          )}
        </section>
      </div>

      {/* Bottom banner */}
      <Card className="overflow-hidden border-brand/20 bg-gradient-to-r from-critical-bg/80 via-card to-card p-0">
        <div className="flex flex-col items-center gap-6 px-6 py-8 sm:flex-row sm:justify-between sm:px-8">
          <div className="flex items-center gap-4">
            <img
              src="/logo.png"
              alt=""
              className="h-16 w-16 rounded-2xl object-cover shadow-md ring-2 ring-brand/10"
            />
            <div>
              <h2 className="text-lg font-extrabold text-foreground sm:text-xl">
                You&apos;re ready to donate!
              </h2>
              <p className="mt-1 max-w-md text-sm text-muted">
                Every donation can save up to three lives. Stay available and respond when you can.
              </p>
            </div>
          </div>
          <Link to="/donor/requests" className="shrink-0">
            <Button>
              Find requests <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
