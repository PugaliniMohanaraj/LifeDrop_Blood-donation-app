import { DEMO_MATCHES } from '../../data/demo'
import { Button, Card, StatusBadge, Tooltip } from '../../components/ui'
import { useToast } from '../../context/ToastContext'

export function HospitalFindDonorsPage() {
  const { toast } = useToast()
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Find Donors</h1>
        <p className="text-sm text-muted">Suitable available donors near your facility.</p>
      </div>
      {DEMO_MATCHES.filter((m) => m.available).map((m) => (
        <Card key={m.id} className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <StatusBadge label="Available" tone="success" icon={<span>🟢</span>} />
            <p className="mt-2 font-bold text-navy">
              {m.name} · {m.bloodGroup}
            </p>
            <p className="text-sm text-muted">
              {m.distanceKm} km · Match {m.matchScore}%{' '}
              <Tooltip text="Match score is based on blood-group compatibility, eligibility, availability and location. It is not a medical guarantee." />
            </p>
          </div>
          <Button
            onClick={() => toast('Contact request sent to donor.', 'success')}
          >
            Contact Donor
          </Button>
        </Card>
      ))}
    </div>
  )
}
