import { useEffect, useState } from 'react'
import { fetchMatches } from '../../api/bloodBridge'
import { useToast } from '../../context/ToastContext'
import { Button, Card, EmptyState, LoadingSpinner, StatusBadge, Tooltip } from '../../components/ui'
import type { DonorMatch } from '../../types'

export function HospitalFindDonorsPage() {
  const { toast } = useToast()
  const [matches, setMatches] = useState<DonorMatch[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetchMatches()
      .then(setMatches)
      .catch(() => setMatches([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <LoadingSpinner label="Finding suitable donors…" />

  const available = matches.filter((m) => m.available)

  if (!available.length) {
    return (
      <EmptyState
        title="No available donors nearby"
        description="When donors mark themselves available, they will appear here."
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Find Donors</h1>
        <p className="text-sm text-muted">Suitable available donors near your facility.</p>
      </div>
      {available.map((m) => (
        <Card key={m.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <StatusBadge label="Available" tone="success" icon={<span>🟢</span>} />
            <p className="mt-2 font-bold text-navy">
              {m.name} · {m.bloodGroup}
            </p>
            <p className="text-sm text-muted">
              {Number(m.distanceKm).toFixed(1)} km · Match {m.matchScore}%{' '}
              <Tooltip text="Match score is based on blood-group compatibility, eligibility, availability and location. It is not a medical guarantee." />
            </p>
          </div>
          <Button onClick={() => toast('Contact request sent to donor.', 'success')}>
            Contact Donor
          </Button>
        </Card>
      ))}
    </div>
  )
}
