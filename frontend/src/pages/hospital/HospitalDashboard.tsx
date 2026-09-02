import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { AlertTriangle, ClipboardList, Droplet, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { fetchStock } from '../../api/bloodBridge'
import { Button, StatusBadge } from '../../components/ui'
import {
  HeroPanel,
  MetricCard,
  PageContainer,
  PageHeader,
  SectionHeader,
  StockLevelCard,
} from '../../components/PageChrome'
import type { BloodStockItem } from '../../types'

export function HospitalDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const [stock, setStock] = useState<BloodStockItem[]>([])
  const pending = requests.filter((r) => r.status === 'FINDING_DONORS' || r.status === 'MATCHING')
  const emergency = requests.filter((r) => r.urgency === 'EMERGENCY' && r.status !== 'CANCELLED')
  const criticalStock = stock.filter((s) => s.level === 'CRITICAL')
  const firstName = user?.fullName?.split(' ')[0] || 'there'

  useEffect(() => {
    if (!user?.organizationId) return
    void fetchStock(user.organizationId).then(setStock).catch(() => setStock([]))
  }, [user?.organizationId])

  return (
    <PageContainer>
      <PageHeader
        title={`Welcome back, ${firstName}!`}
        subtitle="Manage requests, stock levels, and donor search from your hospital workspace."
        action={
          user?.organizationName && user.verified !== false ? (
            <StatusBadge
              label={`${user.organizationName} ✓ Verified`}
              tone="success"
              icon={<span>✓</span>}
            />
          ) : undefined
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <MetricCard
          label="Total Requests"
          value={requests.length}
          icon={<ClipboardList className="h-5 w-5 text-brand" />}
          iconClass="bg-critical-bg"
          statusHint={pending.length ? 'Need attention' : 'All clear'}
          statusTone={pending.length ? 'critical' : 'success'}
        />
        <MetricCard
          label="Pending Requests"
          value={pending.length}
          icon={<Users className="h-5 w-5 text-warning" />}
          iconClass="bg-warning-bg"
          statusHint={pending.length ? 'Awaiting donors' : 'No pending cases'}
          statusTone={pending.length ? 'warning' : 'success'}
        />
        <MetricCard
          label="Emergency Requests"
          value={emergency.length}
          icon={<AlertTriangle className="h-5 w-5 text-critical" />}
          iconClass="bg-critical-bg"
          statusHint={emergency.length ? 'Urgent cases' : 'No emergencies'}
          statusTone={emergency.length ? 'critical' : 'success'}
        />
        <MetricCard
          label="Critical Stock Groups"
          value={criticalStock.length}
          icon={<Droplet className="h-5 w-5 text-critical" fill="currentColor" />}
          iconClass="bg-critical-bg"
          statusHint={criticalStock.length ? 'Need attention' : 'Stock healthy'}
          statusTone={criticalStock.length ? 'critical' : 'success'}
        />
      </div>

      <HeroPanel
        title="Manage care faster"
        subtitle="Update stock levels or find suitable donors for urgent cases."
      >
        <Link to="/hospital/stock">
          <Button variant="hero">Manage Blood Stock</Button>
        </Link>
        <Link to="/hospital/donors">
          <Button variant="heroOutline">Find Donors</Button>
        </Link>
      </HeroPanel>

      <section>
        <SectionHeader title="Blood Stock" to="/hospital/stock" linkLabel="Manage stock" />
        {stock.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-card p-8 text-center">
            <p className="text-sm text-muted">No stock data yet. Add your inventory to get started.</p>
            <Link to="/hospital/stock" className="mt-3 inline-block text-sm font-semibold text-brand hover:underline">
              Manage blood stock
            </Link>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {stock.map((s) => (
              <StockLevelCard
                key={s.bloodGroup}
                bloodGroup={s.bloodGroup}
                units={s.units}
                level={s.level}
              />
            ))}
          </div>
        )}
      </section>
    </PageContainer>
  )
}
