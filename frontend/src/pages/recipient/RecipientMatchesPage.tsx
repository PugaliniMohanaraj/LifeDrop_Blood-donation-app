import { useState } from 'react'
import { DEMO_MATCHES } from '../../data/demo'
import { useToast } from '../../context/ToastContext'
import { Button, Card, LoadingSpinner, StatusBadge, Tooltip } from '../../components/ui'

export function RecipientMatchesPage() {
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState<Set<string>>(new Set())

  const send = (id: string) => {
    setLoading(true)
    window.setTimeout(() => {
      setSent((prev) => new Set(prev).add(id))
      setLoading(false)
      toast('Request sent to donor.', 'success')
    }, 400)
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">
          {DEMO_MATCHES.length} Suitable Donors Found
        </h1>
        <p className="text-sm text-muted">
          Review matches and send a request. Scores help you compare — they are not a medical
          guarantee.
        </p>
      </div>

      {loading && <LoadingSpinner label="Sending request to donor…" />}

      <div className="grid gap-4">
        {DEMO_MATCHES.map((m) => (
          <Card key={m.id} as="article">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={m.available ? 'Available' : 'Unavailable'}
                    tone={m.available ? 'success' : 'neutral'}
                    icon={<span>{m.available ? '🟢' : '⚪'}</span>}
                  />
                  <StatusBadge
                    label={m.eligible ? 'Eligible' : 'Not eligible'}
                    tone={m.eligible ? 'success' : 'warning'}
                  />
                </div>
                <p className="mt-3 font-bold text-navy">{m.name}</p>
                <dl className="mt-2 space-y-1 text-sm text-muted">
                  <div>Blood Group: <span className="font-medium text-navy">{m.bloodGroup}</span></div>
                  <div>Distance: <span className="font-medium text-navy">{m.distanceKm} km</span></div>
                  <div className="flex items-center gap-1">
                    Match: <span className="font-medium text-navy">{m.matchScore}%</span>
                    <Tooltip text="Match score is based on blood-group compatibility, eligibility, availability and location. It is not a medical guarantee." />
                  </div>
                </dl>
              </div>
              <Button
                disabled={!m.available || sent.has(m.id)}
                onClick={() => send(m.id)}
              >
                {sent.has(m.id) ? 'Request Sent' : 'Send Request'}
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
