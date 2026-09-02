import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { fetchMatches } from '../../api/bloodBridge'
import { useToast } from '../../context/ToastContext'
import {
  Button,
  EmptyState,
  LoadingSpinner,
  StatusBadge,
  Tooltip,
} from '../../components/ui'
import { GradientBanner, IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'
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

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Finding suitable donors…" />
      </PageContainer>
    )
  }

  const available = matches.filter((m) => m.available)

  if (!available.length) {
    return (
      <PageContainer>
        <IconPageHeader
          icon={Users}
          title="Find Donors"
          subtitle="Suitable available donors near your facility."
        />
        <EmptyState
          title="No available donors nearby"
          description="When donors mark themselves available, they will appear here."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <IconPageHeader
        icon={Users}
        title="Find Donors"
        subtitle={`${available.length} available donor${available.length === 1 ? '' : 's'} near your facility.`}
      />

      <div className="space-y-4">
        {available.map((m) => (
          <ListCard key={m.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <StatusBadge label="Available" tone="success" icon={<span>✓</span>} />
              <p className="mt-2 text-lg font-bold text-foreground">
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
          </ListCard>
        ))}
      </div>

      <GradientBanner
        title="Coordinate with donors"
        description="Contact available donors for urgent cases at your hospital."
        icon={<Users className="h-5 w-5 text-brand" />}
      />
    </PageContainer>
  )
}
