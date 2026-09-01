import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  Activity,
  BellRing,
  Clock,
  EyeOff,
  Heart,
  HeartPulse,
  Info,
  ShieldCheck,
  UserCheck,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Button, Card, StatusBadge } from '../../components/ui'
import type { AvailabilityStatus } from '../../types'

const UPDATED_KEY = 'lifedrop_availability_updated'

const options: {
  value: AvailabilityStatus
  label: string
  hint: string
  Icon: typeof UserCheck
  iconWrap: string
  dot: string
}[] = [
  {
    value: 'AVAILABLE',
    label: 'Available',
    hint: 'Recipients can send you matching blood requests.',
    Icon: UserCheck,
    iconWrap: 'bg-success-bg text-success',
    dot: 'bg-success',
  },
  {
    value: 'BUSY',
    label: 'Busy',
    hint: 'Pause new requests while you finish an active donation.',
    Icon: Clock,
    iconWrap: 'bg-warning-bg text-warning',
    dot: 'bg-warning',
  },
  {
    value: 'UNAVAILABLE',
    label: 'Unavailable',
    hint: 'Hide from matching until you are ready to donate again.',
    Icon: EyeOff,
    iconWrap: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300',
    dot: 'bg-slate-400',
  },
]

function statusLabel(status: AvailabilityStatus) {
  if (status === 'AVAILABLE') return 'Available'
  if (status === 'BUSY') return 'Busy'
  return 'Unavailable'
}

function statusTone(status: AvailabilityStatus) {
  if (status === 'AVAILABLE') return 'success' as const
  if (status === 'BUSY') return 'warning' as const
  return 'neutral' as const
}

function formatUpdated(iso: string | null) {
  if (!iso) return 'Not updated yet'
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return 'Not updated yet'
  return date.toLocaleString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

function readUpdatedAt() {
  try {
    return localStorage.getItem(UPDATED_KEY)
  } catch {
    return null
  }
}

export function DonorAvailabilityPage() {
  const { user, updateAvailability } = useAuth()
  const { toast } = useToast()
  const navigate = useNavigate()
  const saved = user?.availability || 'AVAILABLE'
  const [status, setStatus] = useState<AvailabilityStatus>(saved)
  const [lastUpdated, setLastUpdated] = useState<string | null>(() => readUpdatedAt())
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    setStatus(saved)
  }, [saved])

  const dirty = status !== saved
  const eligible = Boolean(user?.bloodGroup) && saved === 'AVAILABLE'

  const save = async () => {
    setSaving(true)
    try {
      updateAvailability(status)
      const now = new Date().toISOString()
      localStorage.setItem(UPDATED_KEY, now)
      setLastUpdated(now)
      toast('Availability updated.', 'success')
    } finally {
      setSaving(false)
    }
  }

  const cancel = () => {
    setStatus(saved)
    navigate('/donor')
  }

  return (
    <div className="mx-auto w-full max-w-none space-y-6 pb-2">
      <div>
        <div className="flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-brand" aria-hidden />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Availability
          </h1>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">
          Set when you can respond to blood requests. Matching uses this status together with your
          blood group and location.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-12">
        <div className="space-y-6 xl:col-span-8">
          <Card className="p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-4 sm:px-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                  Current status
                </p>
                <div className="mt-2">
                  <StatusBadge
                    label={statusLabel(saved)}
                    tone={statusTone(saved)}
                    icon={
                      <span
                        className={`inline-block h-2 w-2 rounded-full ${
                          options.find((o) => o.value === saved)?.dot
                        }`}
                      />
                    }
                  />
                </div>
              </div>
              <p className="text-xs text-muted">
                Last updated:{' '}
                <span className="font-medium text-foreground">{formatUpdated(lastUpdated)}</span>
              </p>
            </div>

            <div className="space-y-4 px-5 py-5 sm:px-6">
              <fieldset>
                <legend className="mb-3 text-sm font-semibold text-foreground">
                  Choose a status
                </legend>
                <div className="grid gap-3">
                  {options.map(({ value, label, hint, Icon, iconWrap, dot }) => {
                    const selected = status === value
                    return (
                      <label
                        key={value}
                        className={`flex cursor-pointer items-start gap-4 rounded-2xl border p-4 transition ${
                          selected
                            ? 'border-brand bg-critical-bg/25 ring-1 ring-brand/20'
                            : 'border-border hover:border-brand/30 hover:bg-surface/60'
                        }`}
                      >
                        <input
                          type="radio"
                          name="availability"
                          value={value}
                          checked={selected}
                          onChange={() => setStatus(value)}
                          className="mt-1 accent-[var(--color-brand,#E30613)]"
                        />
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${iconWrap}`}
                        >
                          <Icon className="h-5 w-5" aria-hidden />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="flex items-center gap-2">
                            <span className="font-semibold text-foreground">{label}</span>
                            <span className={`h-2 w-2 rounded-full ${dot}`} aria-hidden />
                          </span>
                          <span className="mt-0.5 block text-sm leading-relaxed text-muted">
                            {hint}
                          </span>
                        </span>
                      </label>
                    )
                  })}
                </div>
              </fieldset>

              <div className="flex gap-3 rounded-xl border border-info/20 bg-info-bg px-4 py-3 text-sm leading-relaxed text-info">
                <Info className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
                <p>
                  Emergency requests still respect your chosen status. You can change this at any
                  time from the dashboard or this page.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 border-t border-border pt-5">
                <Button loading={saving} disabled={!dirty} onClick={() => void save()}>
                  Update availability
                </Button>
                <Button variant="outline" onClick={cancel}>
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <aside className="space-y-4 xl:col-span-4">
          <Card>
            <h2 className="text-sm font-bold text-foreground">Why update availability?</h2>
            <ul className="mt-4 space-y-4">
              {[
                {
                  icon: BellRing,
                  title: 'Receive relevant requests',
                  text: 'Only available donors appear in recipient matching results.',
                },
                {
                  icon: ShieldCheck,
                  title: 'Protect your time',
                  text: 'Use Busy or Unavailable when you cannot respond promptly.',
                },
                {
                  icon: Activity,
                  title: 'Keep records accurate',
                  text: 'Hospitals and recipients see a clear status before contacting you.',
                },
              ].map((item) => (
                <li key={item.title} className="flex gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-brand">
                    <item.icon className="h-4 w-4" aria-hidden />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{item.title}</p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted">{item.text}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h2 className="text-sm font-bold text-foreground">Your summary</h2>
            <dl className="mt-4 space-y-3 text-sm">
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <dt className="text-muted">Blood group</dt>
                <dd className="font-semibold text-foreground">{user?.bloodGroup || '—'}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <dt className="text-muted">Total donations</dt>
                <dd className="font-semibold text-foreground">{user?.totalDonations ?? 0}</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-border pb-3">
                <dt className="text-muted">Eligibility</dt>
                <dd>
                  <StatusBadge
                    label={eligible ? 'Eligible' : 'Check status'}
                    tone={eligible ? 'success' : 'warning'}
                    icon={<span>{eligible ? '✓' : '!'}</span>}
                  />
                </dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="text-muted">Location</dt>
                <dd className="font-semibold text-foreground">{user?.location || '—'}</dd>
              </div>
            </dl>
          </Card>
        </aside>
      </div>

      <Card className="border-success/20 bg-gradient-to-r from-success-bg/70 via-card to-card">
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-success/10">
              <Heart className="h-6 w-6 text-success" fill="currentColor" aria-hidden />
            </span>
            <div>
              <p className="font-bold text-foreground">Thank you for being a donor</p>
              <p className="mt-0.5 text-sm text-muted">
                Accurate availability helps patients get the right support at the right time.
              </p>
            </div>
          </div>
          <Link to="/donor/requests">
            <Button variant="outline" size="sm">
              View open requests
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
