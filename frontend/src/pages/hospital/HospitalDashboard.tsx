import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { fetchStock } from '../../api/bloodBridge'
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

export function HospitalDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const [stock, setStock] = useState<BloodStockItem[]>([])
  const pending = requests.filter((r) => r.status === 'FINDING_DONORS' || r.status === 'MATCHING')
  const emergency = requests.filter((r) => r.urgency === 'EMERGENCY' && r.status !== 'CANCELLED')

  useEffect(() => {
    if (!user?.organizationId) return
    void fetchStock(user.organizationId).then(setStock).catch(() => setStock([]))
  }, [user?.organizationId])

  return (
    <div className="mx-auto w-full max-w-none space-y-6">
      <PageHeader
        title={user?.organizationName || 'Hospital'}
        subtitle="LifeDrop hospital workspace — requests, stock, and donor search."
        action={<StatusBadge label="Verified" tone="success" icon={<span>✓</span>} />}
      />

      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard label="Total Requests" value={requests.length} />
        <StatCard label="Pending Requests" value={pending.length} tone="warning" />
        <StatCard label="Emergency Requests" value={emergency.length} tone="critical" />
      </div>

      <HeroPanel
        title="Manage care faster"
        subtitle="Update stock levels or find suitable donors for urgent cases."
      >
        <Link to="/hospital/stock">
          <Button className="bg-white text-brand hover:bg-slate-100 shadow-none">
            Manage Blood Stock
          </Button>
        </Link>
        <Link to="/hospital/donors">
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            Find Donors
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
    </div>
  )
}
