import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Ban,
  Building2,
  Calendar,
  Check,
  Droplet,
  Heart,
  Info,
  MapPin,
  Timer,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../context/ToastContext'
import {
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  StatusBadge,
} from '../../components/ui'
import type { BloodRequest, RequestStatus } from '../../types'

type FilterKey = 'all' | 'new' | 'nearby' | 'urgent' | 'accepted' | 'completed'
type SortKey = 'newest' | 'oldest' | 'urgency'

const filters: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'All requests' },
  { key: 'new', label: 'New' },
  { key: 'nearby', label: 'Nearby' },
  { key: 'urgent', label: 'Urgent' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'completed', label: 'Completed' },
]

function urgencyLabel(urgency: BloodRequest['urgency']) {
  if (urgency === 'EMERGENCY') return 'Emergency'
  if (urgency === 'URGENT') return 'Urgent'
  return null
}

function urgencyTone(urgency: BloodRequest['urgency']) {
  if (urgency === 'EMERGENCY') return 'critical' as const
  if (urgency === 'URGENT') return 'warning' as const
  return 'neutral' as const
}

function matchesFilter(r: BloodRequest, filter: FilterKey) {
  switch (filter) {
    case 'all':
      return r.status !== 'CANCELLED'
    case 'new':
      return r.status === 'FINDING_DONORS' || r.status === 'MATCHING'
    case 'nearby':
      return r.status !== 'CANCELLED' && r.status !== 'COMPLETED'
    case 'urgent':
      return (
        (r.urgency === 'URGENT' || r.urgency === 'EMERGENCY') &&
        r.status !== 'CANCELLED' &&
        r.status !== 'COMPLETED'
      )
    case 'accepted':
      return r.status === 'DONOR_ACCEPTED' || r.status === 'IN_PROGRESS'
    case 'completed':
      return r.status === 'COMPLETED'
    default:
      return true
  }
}

function sortRequests(list: BloodRequest[], sort: SortKey) {
  const copy = [...list]
  if (sort === 'oldest') {
    return copy.sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
    )
  }
  if (sort === 'urgency') {
    const rank = (u: BloodRequest['urgency']) =>
      u === 'EMERGENCY' ? 0 : u === 'URGENT' ? 1 : 2
    return copy.sort((a, b) => rank(a.urgency) - rank(b.urgency))
  }
  return copy.sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  )
}

function expiresLabel(createdAt: string, requiredDate: string) {
  const deadline = new Date(requiredDate)
  deadline.setHours(23, 59, 59, 999)
  const diff = deadline.getTime() - Date.now()
  if (diff <= 0) return 'Required today'
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `Expires in ${hours}h ${Math.floor((diff % 3600000) / 60000)}m`
  const days = Math.ceil(hours / 24)
  return `Required in ${days}d`
}

function canRespond(status: RequestStatus) {
  return status === 'FINDING_DONORS' || status === 'MATCHING'
}

export function DonorRequestsPage() {
  const { user } = useAuth()
  const { requests, acceptRequest, declineRequest } = useAppData()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [filter, setFilter] = useState<FilterKey>('all')
  const [sort, setSort] = useState<SortKey>('newest')
  const [confirmAcceptId, setConfirmAcceptId] = useState<string | null>(null)
  const [confirmDeclineId, setConfirmDeclineId] = useState<string | null>(null)
  const [busyId, setBusyId] = useState<string | null>(null)

  const counts = useMemo(
    () =>
      Object.fromEntries(
        filters.map((f) => [f.key, requests.filter((r) => matchesFilter(r, f.key)).length]),
      ) as Record<FilterKey, number>,
    [requests],
  )

  const visible = useMemo(
    () => sortRequests(requests.filter((r) => matchesFilter(r, filter)), sort),
    [requests, filter, sort],
  )

  const handleAccept = async (id: string) => {
    setBusyId(id)
    try {
      await acceptRequest(id)
      setConfirmAcceptId(null)
      toast('Request accepted. The recipient has been notified.', 'success')
      navigate('/donor/history')
    } catch {
      toast('Could not accept this request. Please try again.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  const handleDecline = async (id: string) => {
    setBusyId(id)
    try {
      await declineRequest(id)
      setConfirmDeclineId(null)
      toast('You declined this request.', 'info')
    } catch {
      toast('Could not decline this request. Please try again.', 'error')
    } finally {
      setBusyId(null)
    }
  }

  return (
    <div className="mx-auto w-full max-w-none space-y-6 pb-2">
      <div>
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-brand" aria-hidden />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Blood Requests
          </h1>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">
          Review invitations, compare urgency, and respond when you are ready. You stay in control
          at every step.
        </p>
      </div>

      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.key}
              type="button"
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                filter === f.key
                  ? 'bg-brand text-white shadow-md shadow-brand/20'
                  : 'border border-border bg-card text-muted hover:border-brand/30 hover:text-foreground'
              }`}
            >
              {f.label}{' '}
              <span className={filter === f.key ? 'text-white/90' : 'text-foreground'}>
                ({counts[f.key]})
              </span>
            </button>
          ))}
        </div>
        <label className="flex items-center gap-2 text-sm text-muted">
          Sort by
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value as SortKey)}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="urgency">Urgency</option>
          </select>
        </label>
      </div>

      {visible.length === 0 ? (
        <EmptyState
          title="No requests in this view"
          description={
            filter === 'all'
              ? 'When a recipient invites you, the request will appear here.'
              : 'Try another filter or check back later.'
          }
          actionLabel={filter !== 'all' ? 'Show all requests' : undefined}
          onAction={filter !== 'all' ? () => setFilter('all') : undefined}
        />
      ) : (
        <div className="space-y-4">
          {visible.map((r) => {
            const urgent = urgencyLabel(r.urgency)
            const groupMatch = user?.bloodGroup === r.bloodGroup
            const open = canRespond(r.status)

            return (
              <Card key={r.id} as="article" className="overflow-hidden p-0">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-surface/50 px-5 py-3 sm:px-6">
                  <StatusBadge
                    label={expiresLabel(r.createdAt, r.requiredDate)}
                    tone="info"
                    icon={<Timer className="h-3.5 w-3.5" />}
                  />
                  {urgent && (
                    <StatusBadge label={urgent} tone={urgencyTone(r.urgency)} icon={<span>!</span>} />
                  )}
                </div>

                <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1fr_auto]">
                  <div className="min-w-0">
                    <div className="flex items-start gap-4">
                      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-critical-bg">
                        <Droplet className="h-7 w-7 text-brand" fill="currentColor" />
                      </span>
                      <div className="min-w-0">
                        <h2 className="text-xl font-extrabold text-foreground sm:text-2xl">
                          {r.bloodGroup} · {r.units} units
                        </h2>
                        <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
                          <span className="inline-flex items-center gap-1">
                            <Building2 className="h-4 w-4 shrink-0" aria-hidden />
                            {r.hospital}
                          </span>
                          {r.distanceKm != null && (
                            <span className="inline-flex items-center gap-1">
                              <MapPin className="h-4 w-4 shrink-0" aria-hidden />
                              {r.distanceKm.toFixed(1)} km away
                            </span>
                          )}
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="h-4 w-4 shrink-0" aria-hidden />
                            Required {new Date(r.requiredDate).toLocaleDateString()}
                          </span>
                        </p>
                      </div>
                    </div>

                    {groupMatch && open && (
                      <div className="mt-4 flex gap-3 rounded-xl border border-info/20 bg-info-bg px-4 py-3 text-sm text-info">
                        <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                        <p>This request matches your blood group and location.</p>
                      </div>
                    )}
                  </div>

                  <dl className="grid min-w-[220px] gap-3 rounded-2xl border border-border bg-surface/60 p-4 text-sm">
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Blood group</dt>
                      <dd className="font-semibold text-foreground">{r.bloodGroup}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Units required</dt>
                      <dd className="font-semibold text-foreground">{r.units}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Hospital</dt>
                      <dd className="max-w-[140px] truncate text-right font-semibold text-foreground">
                        {r.hospital}
                      </dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-muted">Request type</dt>
                      <dd className="font-semibold text-foreground">Patient request</dd>
                    </div>
                  </dl>
                </div>

                <div className="flex flex-wrap items-center gap-3 border-t border-border px-5 py-4 sm:px-6">
                  <Link to={`/donor/requests/${r.id}`}>
                    <Button variant="outline" size="sm">
                      View details
                    </Button>
                  </Link>
                  {open && (
                    <>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setConfirmDeclineId(r.id)}
                        disabled={busyId === r.id}
                      >
                        <Ban className="h-4 w-4" />
                        Decline request
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => setConfirmAcceptId(r.id)}
                        disabled={busyId === r.id}
                      >
                        <Check className="h-4 w-4" />
                        Accept request
                      </Button>
                    </>
                  )}
                </div>
              </Card>
            )
          })}
        </div>
      )}

      <Card className="border-brand/15 bg-gradient-to-r from-critical-bg/80 via-card to-card">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand/10">
              <Heart className="h-6 w-6 text-brand" fill="currentColor" aria-hidden />
            </span>
            <div>
              <p className="font-bold text-foreground">Make a difference today</p>
              <p className="mt-0.5 max-w-lg text-sm text-muted">
                A timely response helps recipients and hospitals act with confidence.
              </p>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => setFilter('nearby')}>
            View nearby requests <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>

      <ConfirmationDialog
        open={confirmAcceptId !== null}
        title="Accept this donation request?"
        message="The recipient will be notified that you accepted. You can still contact the hospital to confirm details."
        confirmLabel="Accept request"
        onCancel={() => setConfirmAcceptId(null)}
        onConfirm={() => confirmAcceptId && void handleAccept(confirmAcceptId)}
      />
      <ConfirmationDialog
        open={confirmDeclineId !== null}
        title="Decline this request?"
        message="You will not be matched to this request. Other donors may still help."
        confirmLabel="Decline"
        danger
        onCancel={() => setConfirmDeclineId(null)}
        onConfirm={() => confirmDeclineId && void handleDecline(confirmDeclineId)}
      />
    </div>
  )
}
