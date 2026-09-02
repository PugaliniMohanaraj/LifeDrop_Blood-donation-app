import { Link } from 'react-router-dom'
import { AnimatedCard } from './AnimatedCard'
import { STOCK_THRESHOLDS, NBTS_SOURCE_LABEL } from '../../data/bloodAvailabilityConfig'
import type { BloodGroup } from '../../types'

type UnitCell = { group: BloodGroup; units: number }

export type HomeInventoryPreview = {
  id: string
  badge: string
  name: string
  units: UnitCell[]
}

/** Demo preview cards for the home page — not live NBTS data. */
export const homeInventoryPreviews: HomeInventoryPreview[] = [
  {
    id: 'jaffna',
    badge: 'Hospital',
    name: 'Jaffna Teaching Hospital',
    units: [
      { group: 'A+', units: 12 },
      { group: 'A-', units: 3 },
      { group: 'B+', units: 6 },
      { group: 'B-', units: 2 },
      { group: 'AB+', units: 8 },
      { group: 'AB-', units: 1 },
      { group: 'O+', units: 18 },
      { group: 'O-', units: 4 },
    ],
  },
  {
    id: 'nbts-colombo',
    badge: 'Blood Bank',
    name: 'National Blood Bank, Colombo',
    units: [
      { group: 'A+', units: 22 },
      { group: 'A-', units: 15 },
      { group: 'B+', units: 9 },
      { group: 'B-', units: 5 },
      { group: 'AB+', units: 10 },
      { group: 'AB-', units: 3 },
      { group: 'O+', units: 6 },
      { group: 'O-', units: 4 },
    ],
  },
]

function cellTone(units: number): 'available' | 'low' | 'critical' {
  if (units === 0) return 'critical'
  if (units <= STOCK_THRESHOLDS.lowStockMaxUnits) return 'low'
  return 'available'
}

const toneClasses = {
  available: 'border-success/40 bg-success-bg text-success',
  low: 'border-warning/50 bg-warning-bg text-warning',
  critical: 'border-critical/50 bg-critical-bg text-critical',
} as const

function BloodUnitCell({ group, units }: UnitCell) {
  const tone = cellTone(units)
  const label =
    units === 0 ? 'Critical' : units <= STOCK_THRESHOLDS.lowStockMaxUnits ? 'Low' : 'Available'

  return (
    <div
      className={`rounded-xl border px-2 py-2 text-center ${toneClasses[tone]}`}
      title={`${group}: ${units} units (${label})`}
    >
      <p className="text-xs font-bold">{group}</p>
      <p className="text-sm font-extrabold tabular-nums">{units}</p>
      <p className="sr-only">{label}</p>
    </div>
  )
}

export function HomeBloodInventorySection() {
  return (
    <section className="border-t border-border bg-card py-16 sm:py-20">
      <div className="container-app">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <span className="inline-flex rounded-full border border-brand/30 bg-critical-bg/60 px-4 py-1 text-xs font-bold uppercase tracking-[0.15em] text-brand">
              Blood Inventory
            </span>
            <h2 className="mt-4 text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-[2.75rem]">
              Real-Time Blood <span className="text-brand">Inventory</span>
            </h2>
            <p className="mt-4 text-base leading-relaxed text-muted sm:text-lg">
              Instantly check blood stock at verified hospitals and blood banks near you. During
              emergencies, every second counts — know exactly where life-saving units are available.
            </p>
          </div>
          <Link
            to="/blood-availability"
            className="inline-flex min-h-12 shrink-0 items-center justify-center self-start rounded-full bg-brand px-8 py-3 text-base font-bold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark lg:mt-10"
          >
            Check Availability
          </Link>
        </div>

        <p className="mt-8 rounded-2xl border border-brand/20 bg-critical-bg/50 px-4 py-3 text-sm font-medium text-brand sm:px-5">
          Data Source: {NBTS_SOURCE_LABEL} — verified organization inventory (demo preview).
        </p>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          {homeInventoryPreviews.map((facility, i) => (
            <AnimatedCard
              key={facility.id}
              as="article"
              index={i}
              className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <span className="inline-flex rounded-full bg-critical-bg px-3 py-1 text-xs font-bold text-brand">
                {facility.badge}
              </span>
              <h3 className="mt-3 text-lg font-bold text-navy sm:text-xl">{facility.name}</h3>
              <p className="mt-4 text-sm font-medium text-muted">Units Availability</p>
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-4">
                {facility.units.map((cell) => (
                  <BloodUnitCell key={cell.group} {...cell} />
                ))}
              </div>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
