import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronRight,
  Clock,
  Download,
  Droplet,
  Filter,
  History,
  Trash2,
  Users,
  XCircle,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../context/ToastContext'
import { Button, Card, ConfirmationDialog, EmptyState, StatusBadge, requestStatusMeta } from '../../components/ui'
import type { BloodRequest } from '../../types'

type HistoryFilter = 'all' | 'accepted' | 'completed' | 'declined' | 'expired'

const tabs: { key: HistoryFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'accepted', label: 'Accepted' },
  { key: 'completed', label: 'Completed' },
  { key: 'declined', label: 'Declined' },
  { key: 'expired', label: 'Expired' },
]

function isExpired(r: BloodRequest) {
  const deadline = new Date(r.requiredDate)
  deadline.setHours(23, 59, 59, 999)
  return (
    deadline.getTime() < Date.now() &&
    (r.status === 'FINDING_DONORS' || r.status === 'MATCHING')
  )
}

function historyCategory(r: BloodRequest): HistoryFilter | 'other' {
  if (r.status === 'DONOR_ACCEPTED' || r.status === 'IN_PROGRESS') return 'accepted'
  if (r.status === 'COMPLETED') return 'completed'
  if (r.status === 'CANCELLED') return 'declined'
  if (isExpired(r)) return 'expired'
  return 'other'
}

function matchesTab(r: BloodRequest, tab: HistoryFilter) {
  if (tab === 'all') return true
  return historyCategory(r) === tab
}

function statusIcon(r: BloodRequest) {
  const cat = historyCategory(r)
  if (cat === 'accepted')
    return { Icon: CheckCircle2, wrap: 'bg-success-bg text-success' }
  if (cat === 'completed') return { Icon: Droplet, wrap: 'bg-info-bg text-info' }
  if (cat === 'declined') return { Icon: XCircle, wrap: 'bg-critical-bg text-critical' }
  if (cat === 'expired') return { Icon: Clock, wrap: 'bg-info-bg text-info' }
  return { Icon: Droplet, wrap: 'bg-surface text-muted' }
}

function statusNote(r: BloodRequest) {
  const cat = historyCategory(r)
  if (cat === 'accepted') return 'Awaiting hospital coordination'
  if (cat === 'completed') return 'Donation completed'
  if (cat === 'declined') return 'You declined this request'
  if (cat === 'expired') return 'Request expired before response'
  return requestStatusMeta(r.status).label
}

function downloadCsv(rows: BloodRequest[]) {
  const header = ['Date', 'Blood group', 'Units', 'Hospital', 'Status']
  const lines = rows.map((r) =>
    [
      new Date(r.createdAt).toLocaleDateString(),
      r.bloodGroup,
      r.units,
      `"${r.hospital.replace(/"/g, '""')}"`,
      requestStatusMeta(r.status).label,
    ].join(','),
  )
  const blob = new Blob([[header.join(','), ...lines].join('\n')], { type: 'text/csv' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'lifedrop-history.csv'
  a.click()
  URL.revokeObjectURL(url)
}

export function DonorHistoryPage() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const { toast } = useToast()
  const [tab, setTab] = useState<HistoryFilter>('all')
  const [confirmClear, setConfirmClear] = useState(false)

  const history = useMemo(
    () =>
      [...requests].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      ),
    [requests],
  )

  const counts = useMemo(
    () =>
      Object.fromEntries(
        tabs.map((t) => [t.key, history.filter((r) => matchesTab(r, t.key)).length]),
      ) as Record<HistoryFilter, number>,
    [history],
  )

  const visible = useMemo(() => history.filter((r) => matchesTab(r, tab)), [history, tab])
  const completedCount = history.filter((r) => r.status === 'COMPLETED').length
  const livesImpacted = Math.max(completedCount * 2, user?.totalDonations ?? 0)

  return (
    <div className="mx-auto w-full max-w-none space-y-6 pb-4">
      <div>
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-brand" aria-hidden />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            History
          </h1>
        </div>
        <p className="mt-1 text-sm text-muted sm:text-base">
          Your past responses and completed donations.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-4 xl:col-span-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    tab === t.key
                      ? 'bg-brand text-white shadow-md shadow-brand/20'
                      : 'border border-border bg-card text-muted hover:border-brand/30 hover:text-foreground'
                  }`}
                >
                  {t.label} ({counts[t.key]})
                </button>
              ))}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast('Showing newest records first.', 'info')}
            >
              <Filter className="h-4 w-4" />
              Filter
            </Button>
          </div>

          {visible.length === 0 ? (
            <EmptyState
              title="No records in this view"
              description="Accepted, completed, and declined responses will appear here."
              actionLabel={tab !== 'all' ? 'Show all' : undefined}
              onAction={tab !== 'all' ? () => setTab('all') : undefined}
            />
          ) : (
            <div className="space-y-3">
              {visible.map((r) => {
                const meta = requestStatusMeta(r.status)
                const { Icon, wrap } = statusIcon(r)
                return (
                  <Link key={r.id} to={`/donor/requests/${r.id}`} className="block">
                    <Card className="flex items-center gap-4 p-4 transition hover:border-brand/30 hover:shadow-md">
                      <span
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${wrap}`}
                      >
                        <Icon className="h-5 w-5" aria-hidden />
                      </span>
                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-foreground">
                          {r.bloodGroup} · {r.units} units
                        </p>
                        <p className="mt-0.5 text-sm text-muted">{r.hospital}</p>
                        <p className="mt-1 text-xs text-muted">
                          {new Date(r.createdAt).toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}{' '}
                          · {statusNote(r)}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-center gap-2">
                        <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
                        <ChevronRight className="h-5 w-5 text-muted" aria-hidden />
                      </div>
                    </Card>
                  </Link>
                )
              })}
            </div>
          )}

          <p className="text-xs text-muted">
            History is kept for 2 years from the date of each request.
          </p>
        </div>

        <aside className="space-y-4 xl:col-span-4">
          <Card className="border-brand/15 bg-gradient-to-br from-critical-bg/50 to-card p-5">
            <div className="flex items-center gap-3">
              <img src="/logo.png" alt="" className="h-14 w-14 rounded-2xl object-cover" />
              <div>
                <p className="font-bold text-foreground">Your impact</p>
                <p className="mt-1 text-sm text-muted">Thank you for helping save lives.</p>
              </div>
            </div>
          </Card>

          <Card>
            <h2 className="text-sm font-bold text-foreground">Statistics</h2>
            <ul className="mt-4 space-y-3">
              {[
                { icon: Droplet, label: 'Total requests', value: history.length, tone: 'text-brand' },
                {
                  icon: CheckCircle2,
                  label: 'Donations completed',
                  value: completedCount,
                  tone: 'text-success',
                },
                {
                  icon: Users,
                  label: 'Lives impacted',
                  value: livesImpacted,
                  tone: 'text-info',
                },
              ].map((item) => (
                <li key={item.label} className="flex items-center justify-between gap-3 text-sm">
                  <span className="flex items-center gap-2 text-muted">
                    <item.icon className={`h-4 w-4 ${item.tone}`} aria-hidden />
                    {item.label}
                  </span>
                  <span className="font-bold text-foreground">{item.value}</span>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-sm font-bold text-foreground">Quick actions</h2>
            <div className="mt-4 space-y-2">
              <Button
                variant="outline"
                className="w-full justify-center"
                onClick={() => {
                  downloadCsv(history)
                  toast('History downloaded.', 'success')
                }}
              >
                <Download className="h-4 w-4" />
                Download history
              </Button>
              <Button
                variant="outline"
                className="w-full justify-center border-critical/40 text-critical hover:bg-critical-bg/40"
                onClick={() => setConfirmClear(true)}
              >
                <Trash2 className="h-4 w-4" />
                Clear history
              </Button>
            </div>
          </Card>
        </aside>
      </div>

      <ConfirmationDialog
        open={confirmClear}
        title="Clear history?"
        message="Your donation history is tied to your LifeDrop account and cannot be removed from our records. You can download a copy for your files instead."
        confirmLabel="Understood"
        cancelLabel="Cancel"
        onCancel={() => setConfirmClear(false)}
        onConfirm={() => {
          setConfirmClear(false)
          toast('History remains available on your account.', 'info')
        }}
      />
    </div>
  )
}
