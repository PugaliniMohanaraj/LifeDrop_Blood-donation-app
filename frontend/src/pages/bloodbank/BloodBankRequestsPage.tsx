import { useAppData } from '../../context/AppDataContext'
import { Card, StatusBadge, requestStatusMeta } from '../../components/ui'

export function BloodBankRequestsPage() {
  const { requests } = useAppData()
  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Requests</h1>
      <p className="text-sm text-muted">Blood requests that may need bank support.</p>
      {requests.map((r) => {
        const meta = requestStatusMeta(r.status)
        return (
          <Card key={r.id}>
            <p className="font-bold text-navy">
              {r.bloodGroup} · {r.units} units
            </p>
            <p className="text-sm text-muted">{r.hospital}</p>
            <div className="mt-2">
              <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
            </div>
          </Card>
        )
      })}
    </div>
  )
}
