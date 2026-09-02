import { useEffect, useState } from 'react'
import { Droplet, Info } from 'lucide-react'
import { fetchStock, updateStock } from '../../api/bloodBridge'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import {
  Button,
  Card,
  EmptyState,
  Input,
  LoadingSpinner,
  StatusBadge,
  stockIcon,
  stockLabel,
  stockTone,
} from '../../components/ui'
import { GradientBanner, IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'
import type { BloodStockItem } from '../../types'

export function HospitalStockPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [stock, setStock] = useState<BloodStockItem[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<string | null>(null)
  const [units, setUnits] = useState('')

  const orgId = user?.organizationId

  useEffect(() => {
    if (!orgId) {
      setLoading(false)
      return
    }
    void fetchStock(orgId)
      .then(setStock)
      .catch(() => setStock([]))
      .finally(() => setLoading(false))
  }, [orgId])

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading blood stock…" />
      </PageContainer>
    )
  }

  if (!orgId) {
    return (
      <PageContainer>
        <EmptyState
          title="Organization not linked"
          description="Your account is not linked to a hospital or blood bank yet."
        />
      </PageContainer>
    )
  }

  if (!stock.length) {
    return (
      <PageContainer>
        <IconPageHeader
          icon={Droplet}
          title="Blood Inventory"
          subtitle="Update units for each blood group at your facility."
        />
        <EmptyState
          title="No stock records yet"
          description="Stock appears after organization verification or when units are added."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <IconPageHeader
        icon={Droplet}
        title="Blood Inventory"
        subtitle="Status uses color, icon, and text so levels stay clear for everyone."
      />

      <Card className="flex items-start gap-3 border-info/20 bg-info-bg/40 p-4">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-info" aria-hidden />
        <p className="text-sm text-muted">
          Update inventory after each collection or issue. Public availability reflects verified
          organization data — contact the blood bank before travelling.
        </p>
      </Card>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {stock.map((s) => (
          <ListCard key={s.bloodGroup} className="p-5">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-extrabold text-foreground">{s.bloodGroup}</p>
                <p className="text-sm text-muted">{s.units} units</p>
                <div className="mt-2">
                  <StatusBadge
                    label={stockLabel(s.level)}
                    tone={stockTone(s.level)}
                    icon={<span>{stockIcon(s.level)}</span>}
                  />
                </div>
              </div>
              {editing === s.bloodGroup ? (
                <div className="flex min-w-[10rem] flex-col gap-2">
                  <Input
                    label="Units"
                    type="number"
                    min={0}
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => {
                        const n = Math.max(0, Number(units) || 0)
                        void updateStock(orgId, s.bloodGroup, n)
                          .then((updated) => {
                            setStock((prev) =>
                              prev.map((item) =>
                                item.bloodGroup === s.bloodGroup ? updated : item,
                              ),
                            )
                            setEditing(null)
                            toast('Blood inventory updated successfully.', 'success')
                          })
                          .catch(() => toast('Could not update stock. Please try again.', 'error'))
                      }}
                    >
                      Save
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEditing(null)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    setEditing(s.bloodGroup)
                    setUnits(String(s.units))
                  }}
                >
                  Update
                </Button>
              )}
            </div>
          </ListCard>
        ))}
      </div>

      <GradientBanner
        variant="success"
        title="Inventory updated?"
        description="Your changes help patients find blood faster across LifeDrop."
        icon={<Droplet className="h-5 w-5 text-success" fill="currentColor" />}
      />
    </PageContainer>
  )
}
