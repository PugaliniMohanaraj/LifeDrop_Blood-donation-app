import { Link } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { Card, StatusBadge, verificationLabel, verificationTone } from '../../components/ui'
import { HeroPanel, PageHeader, StatCard } from '../../components/PageChrome'

export function AdminDashboard() {
  const { organizations } = useAppData()
  const pending = organizations.filter((o) => o.status === 'PENDING')

  return (
    <div className="mx-auto w-full max-w-none space-y-6">
      <PageHeader
        title="Admin Dashboard"
        subtitle="Review organizations and keep LifeDrop trustworthy."
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending verifications" value={pending.length} tone="warning" />
        <StatCard label="Organizations" value={organizations.length} />
        <StatCard
          label="Approved"
          value={organizations.filter((o) => o.status === 'APPROVED').length}
          tone="success"
        />
      </div>

      <HeroPanel
        title="Organization Verification"
        subtitle="Approve trusted hospitals and blood banks, or reject with a clear reason."
      >
        <Link to="/admin/verify">
          <ButtonLike>View all applications</ButtonLike>
        </Link>
      </HeroPanel>

      <section className="space-y-3">
        {pending.slice(0, 3).map((o) => (
          <Card key={o.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-navy">{o.name}</p>
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
            <Link
              to={`/admin/verify/${o.id}`}
              className="inline-flex min-h-11 items-center rounded-full bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
            >
              View Details
            </Link>
          </Card>
        ))}
      </section>
    </div>
  )
}

function ButtonLike({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-bold text-brand shadow-sm">
      {children}
    </span>
  )
}
