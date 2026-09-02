import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Users } from 'lucide-react'
import { apiErrorMessage, fetchMatches } from '../../api/bloodBridge'
import { useAppData } from '../../context/AppDataContext'
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

export function RecipientMatchesPage() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const { requests, sendInvite } = useAppData()
  const [matches, setMatches] = useState<DonorMatch[]>([])
  const [loading, setLoading] = useState(true)
  const [sendingId, setSendingId] = useState<string | null>(null)
  const [sent, setSent] = useState<Set<string>>(new Set())

  const activeRequest = useMemo(
    () =>
      requests.find(
        (r) =>
          r.status === 'FINDING_DONORS' ||
          r.status === 'MATCHING' ||
          r.status === 'DONOR_ACCEPTED',
      ) ?? requests.find((r) => r.status !== 'CANCELLED' && r.status !== 'COMPLETED'),
    [requests],
  )

  useEffect(() => {
    void fetchMatches(activeRequest?.bloodGroup)
      .then(setMatches)
      .catch(() => setMatches([]))
      .finally(() => setLoading(false))
  }, [activeRequest?.bloodGroup])

  const send = async (donorId: string) => {
    if (!activeRequest) {
      toast('Create a blood request first, then invite donors.', 'warning')
      return
    }
    setSendingId(donorId)
    try {
      await sendInvite(activeRequest.id, donorId)
      setSent((prev) => new Set(prev).add(donorId))
      toast('Request sent to donor. They will be notified.', 'success')
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not send invite. Please try again.'), 'error')
    } finally {
      setSendingId(null)
    }
  }

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Finding suitable donors…" />
      </PageContainer>
    )
  }

  if (!activeRequest) {
    return (
      <PageContainer>
        <IconPageHeader
          icon={Users}
          title="Donor Matches"
          subtitle="Create a request first so we can match donors to the right blood group."
        />
        <EmptyState
          title="No active blood request"
          description="Create a request first so we can match donors to the right blood group."
          actionLabel="Create request"
          onAction={() => navigate('/recipient/request')}
        />
      </PageContainer>
    )
  }

  if (!matches.length) {
    return (
      <PageContainer>
        <IconPageHeader
          icon={Users}
          title="Donor Matches"
          subtitle={`Searching for ${activeRequest.bloodGroup} donors for your request.`}
        />
        <EmptyState
          title="No suitable donors found yet"
          description="When available donors match your blood request, they will appear here."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <IconPageHeader
        icon={Users}
        title={`${matches.length} Suitable Donors Found`}
        subtitle={
          <>
            Inviting for your {activeRequest.bloodGroup} request ({activeRequest.units} units).{' '}
            <Link to="/recipient/requests" className="font-medium text-brand hover:underline">
              View requests
            </Link>
          </>
        }
      />

      {sendingId && <LoadingSpinner label="Sending request to donor…" />}

      <div className="grid gap-4">
        {matches.map((m) => (
          <ListCard key={m.id} className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <StatusBadge
                    label={m.available ? 'Available' : 'Unavailable'}
                    tone={m.available ? 'success' : 'neutral'}
                    icon={<span>{m.available ? '✓' : '—'}</span>}
                  />
                  <StatusBadge
                    label={m.eligible ? 'Eligible' : 'Not eligible'}
                    tone={m.eligible ? 'success' : 'warning'}
                    icon={<span>{m.eligible ? '✓' : '!'}</span>}
                  />
                </div>
                <p className="mt-3 text-lg font-bold text-foreground">{m.name}</p>
                <dl className="mt-2 space-y-1 text-sm text-muted">
                  <div>
                    Blood Group:{' '}
                    <span className="font-medium text-foreground">{m.bloodGroup}</span>
                  </div>
                  <div>
                    Distance:{' '}
                    <span className="font-medium text-foreground">{m.distanceKm} km</span>
                  </div>
                  <div className="flex items-center gap-1">
                    Match: <span className="font-medium text-foreground">{m.matchScore}%</span>
                    <Tooltip text="Match score is based on blood-group compatibility, eligibility, availability and location. It is not a medical guarantee." />
                  </div>
                </dl>
              </div>
              <Button
                disabled={!m.available || sent.has(m.id) || sendingId === m.id}
                onClick={() => void send(m.id)}
              >
                {sent.has(m.id) ? 'Request Sent' : 'Send Request'}
              </Button>
            </div>
          </ListCard>
        ))}
      </div>

      <GradientBanner
        variant="success"
        title="Donor invited?"
        description="Track responses and request status from your requests page."
        icon={<Users className="h-5 w-5 text-success" />}
      >
        <Link to="/recipient/requests">
          <Button variant="outline">View Requests</Button>
        </Link>
      </GradientBanner>
    </PageContainer>
  )
}
