import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { fetchPlatformStats, fetchStock } from '../../api/bloodBridge'
import {
  Button,
  Card,
  StatusBadge,
  stockIcon,
  stockLabel,
  stockTone,
} from '../../components/ui'
import { HeroPanel, PageHeader, StatCard } from '../../components/PageChrome'
import type { BloodStockItem } from '../../types'

export function BloodBankDashboard() {
  const { user } = useAuth()
  const [stock, setStock] = useState<BloodStockItem[]>([])
  const [completed, setCompleted] = useState(0)
  const [pendingInvites, setPendingInvites] = useState(0)
  const critical = stock.filter((s) => s.level === 'CRITICAL')

  useEffect(() => {
    if (!user?.organizationId) return
    void fetchStock(user.organizationId).then(setStock).catch(() => setStock([]))
  }, [user?.organizationId])

  useEffect(() => {
    void fetchPlatformStats()
      .then((s) => {
        setCompleted(s.completedRequests)
        setPendingInvites(s.pendingInvites)
      })
      .catch(() => {
        setCompleted(0)
        setPendingInvites(0)
      })
  }, [])

  return (
    <div className="mx-auto w-full max-w-none space-y-6">
      <PageHeader
        title={user?.organizationName || 'Blood Bank'}
        subtitle="LifeDrop blood bank workspace — stock, donations, and critical groups."
        action={<StatusBadge label="Verified" tone="success" icon={<span>✓</span>} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Pending Invites" value={pendingInvites} />
        <StatCard label="Requests Fulfilled" value={completed} tone="success" />
        <StatCard label="Critical Blood Groups" value={critical.length} tone="critical" />
      </div>

      <HeroPanel
        title="Keep stock ready"
        subtitle="Update units and review critical groups before the next emergency."
      >
        <Link to="/blood-bank/stock">
          <Button className="bg-white text-brand hover:bg-slate-100 shadow-none">
            Manage Blood Stock
          </Button>
        </Link>
        <Link to="/blood-bank/donations">
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            View Donations
          </Button>
        </Link>
      </HeroPanel>

      <section>
        <h2 className="mb-3 text-lg font-bold text-navy">Blood Stock</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stock.map((s) => (
            <Card key={s.bloodGroup} className="transition hover:shadow-md">
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
