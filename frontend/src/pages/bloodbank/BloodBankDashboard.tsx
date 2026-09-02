import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, CheckCircle2, Droplet, Mail } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { fetchPlatformStats, fetchStock } from '../../api/bloodBridge'
import {
  Button,
  StatusBadge,
  stockIcon,
  stockLabel,
  stockTone,
} from '../../components/ui'
import {
  HeroPanel,
  ListCard,
  MetricCard,
  PageContainer,
  PageHeader,
  SectionHeader,
} from '../../components/PageChrome'
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
    <PageContainer>
      <PageHeader
        title={user?.organizationName || 'Blood Bank'}
        subtitle="LifeDrop blood bank workspace — stock, donations, and critical groups."
        action={<StatusBadge label="Verified" tone="success" icon={<span>✓</span>} />}
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <MetricCard
          label="Pending Invites"
          value={pendingInvites}
          icon={<Mail className="h-5 w-5 text-brand" />}
          iconClass="bg-critical-bg"
        />
        <MetricCard
          label="Requests Fulfilled"
          value={completed}
          icon={<CheckCircle2 className="h-5 w-5 text-success" />}
          iconClass="bg-success-bg"
        />
        <MetricCard
          label="Critical Blood Groups"
          value={critical.length}
          icon={<AlertTriangle className="h-5 w-5 text-critical" />}
          iconClass="bg-critical-bg"
        />
      </div>

      <HeroPanel
        title="Keep stock ready"
        subtitle="Update units and review critical groups before the next emergency."
      >
        <Link to="/blood-bank/stock">
          <Button variant="hero">Manage Blood Stock</Button>
        </Link>
        <Link to="/blood-bank/donations">
          <Button variant="heroOutline">View Donations</Button>
        </Link>
      </HeroPanel>

      <section>
        <SectionHeader title="Blood Stock" to="/blood-bank/stock" linkLabel="Manage stock" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stock.map((s) => (
            <ListCard key={s.bloodGroup} className="p-4">
              <p className="text-lg font-extrabold text-foreground">{s.bloodGroup}</p>
              <p className="mt-1 text-sm text-muted">{s.units} units</p>
              <div className="mt-2">
                <StatusBadge
                  label={stockLabel(s.level)}
                  tone={stockTone(s.level)}
                  icon={<span>{stockIcon(s.level)}</span>}
                />
              </div>
            </ListCard>
          ))}
        </div>
      </section>

      {critical.length > 0 && (
        <ListCard className="border-critical/30 bg-critical-bg/40 p-5">
          <h2 className="font-bold text-foreground">Critical Blood Groups</h2>
          <p className="mt-1 text-sm text-muted">These groups need urgent replenishment.</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {critical.map((c) => (
              <li key={c.bloodGroup}>
                <StatusBadge
                  label={`${c.bloodGroup} · ${c.units} units`}
                  tone="critical"
                  icon={<span>!</span>}
                />
              </li>
            ))}
          </ul>
        </ListCard>
      )}
    </PageContainer>
  )
}
