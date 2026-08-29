import { Link } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { Card, EmptyState, StatusBadge, verificationLabel, verificationTone } from '../../components/ui'

export function AdminVerifyListPage() {
  const { organizations } = useAppData()
  const pending = organizations.filter((o) => o.status === 'PENDING')

  if (!pending.length) {
    return (
      <EmptyState
        title="No pending organizations"
        description="New hospital and blood bank applications will appear here."
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Organization Verification</h1>
      <p className="text-sm text-muted">Review each application before granting access.</p>
      {pending.map((o) => (
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
            className="text-sm font-semibold text-brand hover:underline"
          >
            View Details
          </Link>
        </Card>
      ))}
    </div>
  )
}
