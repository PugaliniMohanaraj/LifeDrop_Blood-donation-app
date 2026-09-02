import { Link } from 'react-router-dom'
import { Building2, CheckCircle2, ShieldCheck } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { Button, StatusBadge, verificationLabel, verificationTone } from '../../components/ui'
import {
  HeroPanel,
  ListCard,
  MetricCard,
  PageContainer,
  PageHeader,
  SectionHeader,
} from '../../components/PageChrome'

export function AdminDashboard() {
  const { organizations } = useAppData()
  const pending = organizations.filter((o) => o.status === 'PENDING')
  const approved = organizations.filter((o) => o.status === 'APPROVED')

  return (
    <PageContainer>
      <PageHeader
        title="Admin Dashboard"
        subtitle="Review organizations and keep LifeDrop trustworthy."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Pending verifications"
          value={pending.length}
          icon={<ShieldCheck className="h-5 w-5 text-warning" />}
          iconClass="bg-warning-bg"
        />
        <MetricCard
          label="Organizations"
          value={organizations.length}
          icon={<Building2 className="h-5 w-5 text-brand" />}
          iconClass="bg-critical-bg"
        />
        <MetricCard
          label="Approved"
          value={approved.length}
          icon={<CheckCircle2 className="h-5 w-5 text-success" />}
          iconClass="bg-success-bg"
        />
      </div>

      <HeroPanel
        title="Organization Verification"
        subtitle="Approve trusted hospitals and blood banks, or reject with a clear reason."
      >
        <Link to="/admin/verify">
          <Button variant="hero">View all applications</Button>
        </Link>
      </HeroPanel>

      <section>
        <SectionHeader title="Pending applications" to="/admin/verify" linkLabel="See all" />
        <div className="space-y-3">
          {pending.slice(0, 3).map((o) => (
            <ListCard key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="font-bold text-foreground">{o.name}</p>
                <p className="text-sm text-muted">
                  Type: {o.type === 'HOSPITAL' ? 'Hospital' : 'Blood Bank'}
                </p>
                <div className="mt-2">
                  <StatusBadge
                    label={verificationLabel(o.status)}
                    tone={verificationTone(o.status)}
                    icon={<span>🟡</span>}
                  />
                </div>
              </div>
              <Link to={`/admin/verify/${o.id}`}>
                <Button size="sm">View Details</Button>
              </Link>
            </ListCard>
          ))}
          {pending.length === 0 && (
            <ListCard className="p-5">
              <p className="text-sm text-muted">No pending applications right now.</p>
            </ListCard>
          )}
        </div>
      </section>
    </PageContainer>
  )
}
