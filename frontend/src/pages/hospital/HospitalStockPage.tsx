import { useState } from 'react'
import { DEMO_STOCK } from '../../data/demo'
import type { BloodStockItem } from '../../types'
import {
  Button,
  Card,
  Input,
  StatusBadge,
  stockIcon,
  stockLabel,
  stockTone,
} from '../../components/ui'
import { useToast } from '../../context/ToastContext'

function levelFor(units: number): BloodStockItem['level'] {
  if (units <= 2) return 'CRITICAL'
  if (units <= 6) return 'LOW'
  return 'AVAILABLE'
}

export function HospitalStockPage() {
  const { toast } = useToast()
  const [stock, setStock] = useState(DEMO_STOCK)
  const [editing, setEditing] = useState<string | null>(null)
  const [units, setUnits] = useState('')

  return (
    <div className="mx-auto max-w-4xl space-y-4">
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
                        setStock((prev) =>
                          prev.map((item) =>
                            item.bloodGroup === s.bloodGroup
                              ? { ...item, units: n, level: levelFor(n) }
                              : item,
                          ),
                        )
                        setEditing(null)
                        toast('Blood stock updated.', 'success')
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
