import { ClipboardList } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { StatusBadge, requestStatusMeta } from '../../components/ui'
import { IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'

export function BloodBankRequestsPage() {
  const { requests } = useAppData()

  return (
    <PageContainer>
      <IconPageHeader
        icon={ClipboardList}
        title="Requests"
        subtitle="Blood requests that may need bank support."
      />

      <div className="space-y-4">
        {requests.map((r) => {
          const meta = requestStatusMeta(r.status)
          return (
            <ListCard key={r.id} className="p-5">
              <p className="text-lg font-bold text-foreground">
                {r.bloodGroup} · {r.units} units
              </p>
              <p className="text-sm text-muted">{r.hospital}</p>
              <p className="text-sm text-muted">{r.recipientName}</p>
              <div className="mt-2">
                <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
              </div>
            </ListCard>
          )
        })}
      </div>
    </PageContainer>
  )
}
