import { useEffect, useState } from 'react'
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

  if (loading) return <LoadingSpinner label="Loading blood stock…" />

  if (!orgId) {
    return (
      <EmptyState
        title="Organization not linked"
        description="Your account is not linked to a hospital or blood bank yet."
      />
    )
  }

  if (!stock.length) {
    return (
      <EmptyState
        title="No stock records yet"
        description="Stock appears after organization verification or when units are added."
      />
    )
  }

  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Blood Stock</h1>
        <p className="text-sm text-muted">
          Status uses color, icon, and text so levels stay clear for everyone.
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {stock.map((s) => (
          <Card key={s.bloodGroup}>
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xl font-extrabold text-navy">{s.bloodGroup}</p>
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
                            toast('Blood stock updated.', 'success')
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
          </Card>
        ))}
      </div>
    </div>
  )
}
