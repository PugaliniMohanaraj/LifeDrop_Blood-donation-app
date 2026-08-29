import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { DEMO_STOCK } from '../../data/demo'
import {
  Button,
  Card,
  StatusBadge,
  stockIcon,
  stockLabel,
  stockTone,
} from '../../components/ui'

export function BloodBankDashboard() {
  const { user } = useAuth()
  const critical = DEMO_STOCK.filter((s) => s.level === 'CRITICAL')

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-navy">
          {user?.organizationName || 'Blood Bank'}
        </h1>
        <StatusBadge label="Verified" tone="success" icon={<span>✓</span>} />
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Today&apos;s Donations</p>
          <p className="mt-2 text-3xl font-extrabold text-navy">12</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Requests Fulfilled</p>
          <p className="mt-2 text-3xl font-extrabold text-success">8</p>
        </Card>
        <Card>
          <p className="text-xs font-medium uppercase text-muted">Critical Blood Groups</p>
          <p className="mt-2 text-3xl font-extrabold text-critical">{critical.length}</p>
        </Card>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link to="/blood-bank/stock">
          <Button>Manage Blood Stock</Button>
        </Link>
        <Link to="/blood-bank/donations">
          <Button variant="outline">View Donations</Button>
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

      {critical.length > 0 && (
        <Card className="border-critical/30 bg-critical-bg/40">
          <h2 className="font-bold text-navy">Critical Blood Groups</h2>
          <p className="mt-1 text-sm text-muted">These groups need urgent replenishment.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {critical.map((c) => (
              <li key={c.bloodGroup}>
                <StatusBadge
                  label={`${c.bloodGroup} · ${c.units} units`}
                  tone="critical"
                  icon={<span>🔴</span>}
                />
              </li>
            ))}
          </ul>
        </Card>
      )}
    </div>
  )
}
