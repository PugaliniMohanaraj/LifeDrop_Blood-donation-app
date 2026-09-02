import { Heart } from 'lucide-react'
import { StatusBadge } from '../../components/ui'
import { IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'

const donations = [
  { id: 1, donor: 'Nimeda Perera', group: 'O+', units: 1, time: 'Today 09:20' },
  { id: 2, donor: 'Priya Fernando', group: 'A+', units: 1, time: 'Today 11:05' },
  { id: 3, donor: 'Ravi Silva', group: 'B+', units: 1, time: 'Yesterday' },
]

export function BloodBankDonationsPage() {
  return (
    <PageContainer>
      <IconPageHeader
        icon={Heart}
        title="Donations"
        subtitle="Recent donations recorded at this blood bank."
      />

      <div className="space-y-4">
        {donations.map((d) => (
          <ListCard key={d.id} className="flex items-center justify-between gap-3 p-5">
            <div>
              <p className="font-semibold text-foreground">{d.donor}</p>
              <p className="text-sm text-muted">
                {d.group} · {d.units} unit · {d.time}
              </p>
            </div>
            <StatusBadge label="Recorded" tone="success" icon={<span>✓</span>} />
          </ListCard>
        ))}
      </div>
    </PageContainer>
  )
}
