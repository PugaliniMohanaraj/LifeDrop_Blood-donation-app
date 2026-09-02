import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Calendar, CheckCircle2, ClipboardList, Clock, Droplet, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { Button, EmptyState, StatusBadge, requestStatusMeta } from '../../components/ui'
import {
  BloodGroupCircle,
  GradientBanner,
  HeroPanel,
  ListCard,
  MetricCard,
  PageContainer,
  PageHeader,
  SectionHeader,
} from '../../components/PageChrome'
import type { BloodRequest } from '../../types'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ActiveRequestCard({ request: r }: { request: BloodRequest }) {
  const meta = requestStatusMeta(r.status)
  return (
    <ListCard className="p-0">
      <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex min-w-0 flex-1 gap-4">
          <BloodGroupCircle group={r.bloodGroup} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-lg font-bold text-foreground">
                {r.bloodGroup} · {r.units} {r.units === 1 ? 'Unit' : 'Units'}
              </p>
              <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
            </div>
            <p className="mt-1 text-sm text-muted">{r.hospital}</p>
            <p className="mt-1 text-sm font-medium text-brand">
              {r.matchCount} potential {r.matchCount === 1 ? 'donor' : 'donors'} found
            </p>
            <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Requested {formatDate(r.createdAt)}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Calendar className="h-3.5 w-3.5 shrink-0" aria-hidden />
                Needed by {formatDate(r.requiredDate)}
              </span>
            </div>
          </div>
        </div>
        <Link to="/recipient/matches" className="shrink-0 self-start sm:self-center">
          <Button variant="outline" size="sm" className="gap-1.5 rounded-xl">
            View Matches
            <ArrowRight className="h-3.5 w-3.5" aria-hidden />
          </Button>
        </Link>
      </div>
    </ListCard>
  )
}

export function RecipientDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const navigate = useNavigate()
  const mine = requests.filter((r) => r.recipientId === user?.id)
  const active = mine.filter((r) => r.status !== 'CANCELLED' && r.status !== 'COMPLETED')
  const completed = mine.filter((r) => r.status === 'COMPLETED')
  const inProgress = active.filter((r) => r.status !== 'FINDING_DONORS' && r.status !== 'MATCHING')
  const matchTotal = active.reduce((sum, r) => sum + r.matchCount, 0)
  const firstName = user?.fullName?.split(' ')[0] || 'there'

  return (
    <PageContainer>
      <PageHeader
        title={`Hello, ${firstName}!`}
        subtitle="Request blood quickly and track every LifeDrop step from here."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Requests in Progress"
          value={inProgress.length}
          icon={<ClipboardList className="h-5 w-5 text-brand" />}
          iconClass="bg-critical-bg"
          statusHint={active.length ? 'Active on your dashboard' : 'No open requests'}
          statusTone="brand"
        />
        <MetricCard
          label="Completed"
          value={completed.length}
          icon={<CheckCircle2 className="h-5 w-5 text-success" />}
          iconClass="bg-success-bg"
          statusHint={completed.length ? 'Successfully fulfilled' : 'None yet'}
          statusTone="success"
        />
        <MetricCard
          label="Potential Matches"
          value={matchTotal}
          icon={<Users className="h-5 w-5 text-info" />}
          iconClass="bg-info-bg"
          statusHint={matchTotal ? 'Donors found so far' : 'Waiting for matches'}
          statusTone="info"
        />
        <MetricCard
          label="Total Requests"
          value={mine.length}
          icon={<Droplet className="h-5 w-5 text-brand" fill="currentColor" />}
          iconClass="bg-critical-bg"
          statusHint={`${active.length} currently active`}
          statusTone="brand"
        />
      </div>

      <HeroPanel
        title="Need Blood?"
        subtitle="Create a new request and find suitable donors near you."
      >
        <Link to="/recipient/request">
          <Button variant="hero">
            <Droplet className="h-4 w-4" /> Request Blood
          </Button>
        </Link>
        <Link to="/recipient/requests">
          <Button variant="heroOutline">View Active Requests</Button>
        </Link>
      </HeroPanel>

      <section>
        <SectionHeader title="Active Requests" to="/recipient/requests" linkLabel="See all" />
        {active.length === 0 ? (
          <EmptyState
            icon={<ClipboardList className="h-8 w-8" aria-hidden />}
            title="No active requests"
            description="You have no active requests yet. Create one to find matching donors near you."
            actionLabel="Create your first request"
            onAction={() => navigate('/recipient/request')}
          />
        ) : (
          <div className="grid gap-4">
            {active.map((r) => (
              <ActiveRequestCard key={r.id} request={r} />
            ))}
          </div>
        )}
      </section>

      <GradientBanner
        title="Need help finding donors?"
        description="Browse matched donors and send invites once your request is active."
        icon={<Users className="h-5 w-5 text-brand" />}
      >
        <Link to="/recipient/matches">
          <Button className="gap-1.5">
            Browse Matches
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Button>
        </Link>
      </GradientBanner>
    </PageContainer>
  )
}
