import { Link } from 'react-router-dom'
import { ClipboardList } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { StatusBadge, requestStatusMeta } from '../../components/ui'
import { IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'

export function HospitalRequestsPage() {
  const { requests } = useAppData()

  return (
    <PageContainer>
      <IconPageHeader
        icon={ClipboardList}
        title="Blood Requests"
        subtitle="Monitor patient and emergency requests linked to your facility."
      />

      <div className="space-y-4">
        {requests.map((r) => {
          const meta = requestStatusMeta(r.status)
          return (
            <ListCard key={r.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-lg font-bold text-foreground">
                  {r.bloodGroup} · {r.units} units · {r.recipientName}
                </p>
                <p className="text-sm text-muted">{r.hospital}</p>
                <p className="text-sm text-muted">{r.location}</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
                  {r.urgency === 'EMERGENCY' && (
                    <StatusBadge label="Emergency" tone="critical" icon={<span>!</span>} />
                  )}
                </div>
              </div>
              <Link to="/hospital/donors" className="text-sm font-semibold text-brand hover:underline">
                Find Donors
              </Link>
            </ListCard>
          )
        })}
      </div>
    </PageContainer>
  )
}
