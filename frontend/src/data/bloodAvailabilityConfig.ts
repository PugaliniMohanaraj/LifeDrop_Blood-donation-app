import type { BloodGroup } from '../types'

export const BLOOD_COMPONENTS = [
  { value: 'WHOLE_BLOOD', label: 'Whole Blood' },
  { value: 'PACKED_RED_CELLS', label: 'Packed Red Cells' },
  { value: 'PLATELETS', label: 'Platelets' },
  { value: 'FRESH_FROZEN_PLASMA', label: 'Fresh Frozen Plasma' },
] as const

export type BloodComponentCode = (typeof BLOOD_COMPONENTS)[number]['value']

export const AVAILABILITY_FILTERS = [
  { value: 'ALL', label: 'All' },
  { value: 'AVAILABLE', label: 'Available' },
  { value: 'LOW_STOCK', label: 'Low Stock' },
  { value: 'CRITICAL', label: 'Critical' },
] as const

export type AvailabilityStatus = 'AVAILABLE' | 'LOW_STOCK' | 'CRITICAL'

/** Match backend StockThresholds — used for client-side display only. */
export const STOCK_THRESHOLDS = {
  availableMinUnits: 11,
  lowStockMaxUnits: 10,
} as const

export const DEFAULT_BLOOD_GROUP: BloodGroup = 'O+'
export const DEFAULT_COMPONENT: BloodComponentCode = 'WHOLE_BLOOD'

export const NBTS_SOURCE_LABEL =
  'National Blood Transfusion Service (NBTS), Sri Lanka'

export const DEMO_INVENTORY_DISCLAIMER =
  'Availability shown is from verified LifeDrop organizations (demo seed data). Contact the blood bank before travelling — levels change quickly.'
