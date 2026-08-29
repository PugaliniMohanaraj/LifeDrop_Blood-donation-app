import { Link } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { Card, StatusBadge, verificationLabel, verificationTone } from '../../components/ui'

export function AdminDashboard() {
  const { organizations } = useAppData()
  const pending = organizations.filter((o) => o.status === 'PENDING')

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Admin Dashboard</h1>
        <p className="text-sm text-muted">Review organizations and keep the platform trustworthy.</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs uppercase text-muted">Pending verifications</p>
          <p className="mt-2 text-3xl font-extrabold text-warning">{pending.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Organizations</p>
          <p className="mt-2 text-3xl font-extrabold text-navy">{organizations.length}</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Approved</p>
          <p className="mt-2 text-3xl font-extrabold text-success">
            {organizations.filter((o) => o.status === 'APPROVED').length}
          </p>
        </Card>
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-bold text-navy">Organization Verification</h2>
          <Link to="/admin/verify" className="text-sm font-semibold text-brand hover:underline">
            View all
          </Link>
        </div>
        <div className="space-y-3">
          {pending.slice(0, 3).map((o) => (
            <Card key={o.id} className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="font-bold text-navy">{o.name}</p>
                <p className="text-sm text-muted">Type: {o.type === 'HOSPITAL' ? 'Hospital' : 'Blood Bank'}</p>
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
                className="inline-flex min-h-11 items-center rounded-xl bg-brand px-4 py-2 text-sm font-semibold text-white hover:bg-brand-dark"
              >
                View Details
              </Link>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
