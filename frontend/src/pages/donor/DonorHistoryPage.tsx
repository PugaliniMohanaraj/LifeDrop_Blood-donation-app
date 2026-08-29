import { useAppData } from '../../context/AppDataContext'
import { Card, EmptyState, StatusBadge, requestStatusMeta } from '../../components/ui'

export function DonorHistoryPage() {
  const { requests } = useAppData()
  const history = requests.filter(
    (r) => r.status === 'DONOR_ACCEPTED' || r.status === 'COMPLETED' || r.status === 'CANCELLED',
  )

  if (!history.length) {
    return (
      <EmptyState
        title="No donation history yet"
        description="Accepted and completed donations will show up here."
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">History</h1>
        <p className="text-sm text-muted">Your past responses and completed donations.</p>
      </div>
      {history.map((r) => {
        const meta = requestStatusMeta(r.status)
        return (
          <Card key={r.id} className="flex items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-navy">
                {r.bloodGroup} · {r.units} units · {r.hospital}
              </p>
              <p className="text-xs text-muted">{new Date(r.createdAt).toLocaleDateString()}</p>
            </div>
            <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
          </Card>
        )
      })}
    </div>
  )
}
