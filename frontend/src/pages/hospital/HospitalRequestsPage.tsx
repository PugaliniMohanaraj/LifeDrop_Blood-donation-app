import { Link } from 'react-router-dom'
import { useAppData } from '../../context/AppDataContext'
import { Card, StatusBadge, requestStatusMeta } from '../../components/ui'

export function HospitalRequestsPage() {
  const { requests } = useAppData()
  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Blood Requests</h1>
      <p className="text-sm text-muted">Monitor patient and emergency requests linked to your facility.</p>
      {requests.map((r) => {
        const meta = requestStatusMeta(r.status)
        return (
          <Card key={r.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-navy">
                {r.bloodGroup} · {r.units} units · {r.recipientName}
              </p>
              <p className="text-sm text-muted">{r.hospital}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
                {r.urgency === 'EMERGENCY' && (
                  <StatusBadge label="Emergency" tone="critical" icon={<span>🚨</span>} />
                )}
              </div>
            </div>
            <Link to="/hospital/donors" className="text-sm font-semibold text-brand hover:underline">
              Find Donors
            </Link>
          </Card>
        )
      })}
    </div>
  )
}
