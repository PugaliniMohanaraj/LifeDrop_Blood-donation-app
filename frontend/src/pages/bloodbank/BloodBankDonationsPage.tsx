import { Card, StatusBadge } from '../../components/ui'

const donations = [
  { id: 1, donor: 'Arun Kumar', group: 'O+', units: 1, time: 'Today 09:20' },
  { id: 2, donor: 'Priya Nair', group: 'A+', units: 1, time: 'Today 11:05' },
  { id: 3, donor: 'Ravi Das', group: 'B+', units: 1, time: 'Yesterday' },
]

export function BloodBankDonationsPage() {
  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Donations</h1>
      <p className="text-sm text-muted">Recent donations recorded at this blood bank.</p>
      {donations.map((d) => (
        <Card key={d.id} className="flex items-center justify-between gap-3">
          <div>
            <p className="font-semibold text-navy">{d.donor}</p>
            <p className="text-sm text-muted">
              {d.group} · {d.units} unit · {d.time}
            </p>
          </div>
          <StatusBadge label="Recorded" tone="success" icon={<span>✓</span>} />
        </Card>
      ))}
    </div>
  )
}
