import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { DEMO_STOCK } from '../../data/demo'
import {
  Button,
  Card,
  StatusBadge,
  stockIcon,
  stockLabel,
  stockTone,
} from '../../components/ui'

export function HospitalDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const pending = requests.filter((r) => r.status === 'FINDING_DONORS' || r.status === 'MATCHING')
  const emergency = requests.filter((r) => r.urgency === 'EMERGENCY' && r.status !== 'CANCELLED')

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-navy">
          {user?.organizationName || 'Hospital'}
        </h1>
        <StatusBadge label="Verified" tone="success" icon={<span>✓</span>} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Total Requests</p>
          <p className="mt-2 text-3xl font-extrabold text-navy">{requests.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Pending Requests</p>
          <p className="mt-2 text-3xl font-extrabold text-warning">{pending.length}</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Emergency Requests</p>
          <p className="mt-2 text-3xl font-extrabold text-critical">{emergency.length}</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/hospital/stock">
          <Button>Manage Blood Stock</Button>
        </Link>
        <Link to="/hospital/donors">
          <Button variant="outline">Find Donors</Button>
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-lg font-bold text-navy">Blood Stock</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {DEMO_STOCK.map((s) => (
            <Card key={s.bloodGroup}>
              <p className="text-lg font-extrabold text-navy">{s.bloodGroup}</p>
              <p className="mt-1 text-sm text-muted">{s.units} units</p>
              <div className="mt-2">
                <StatusBadge
                  label={stockLabel(s.level)}
                  tone={stockTone(s.level)}
                  icon={<span>{stockIcon(s.level)}</span>}
                />
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
