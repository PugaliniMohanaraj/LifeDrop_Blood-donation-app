import type { AvailabilityStatus } from '../data/bloodAvailabilityConfig'

export type BloodAvailabilityItem = {
  organizationId: number
  organizationName: string
  organizationType: 'HOSPITAL' | 'BLOOD_BANK'
  province: string
  district: string
  address: string
  phone: string
  bloodGroup: string
  component: string
  availableUnits: number
  status: AvailabilityStatus
  verified: boolean
  sourceType: string
  sourceName: string
  lastUpdated: string
}

export type BloodAvailabilityDetail = BloodAvailabilityItem & {
  email: string
  inventory: BloodAvailabilityItem[]
}

export type BloodAvailabilitySearchParams = {
  province?: string
  district?: string
  bloodGroup?: string
  component?: string
  availability?: string
  search?: string
}
