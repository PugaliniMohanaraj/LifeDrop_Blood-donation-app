export type UserRole = 'DONOR' | 'RECIPIENT' | 'HOSPITAL' | 'BLOOD_BANK' | 'ADMIN'

export type BloodGroup = 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-'

export type AvailabilityStatus = 'AVAILABLE' | 'UNAVAILABLE' | 'BUSY'

export type RequestUrgency = 'NORMAL' | 'URGENT' | 'EMERGENCY'

export type RequestStatus =
  | 'FINDING_DONORS'
  | 'MATCHING'
  | 'DONOR_ACCEPTED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'CANCELLED'

export type OrgType = 'HOSPITAL' | 'BLOOD_BANK'

export type VerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED'

export type StockLevel = 'AVAILABLE' | 'LOW' | 'CRITICAL'

export interface User {
  id: string
  fullName: string
  email: string
  phone: string
  role: UserRole
  bloodGroup?: BloodGroup
  location?: string
  availability?: AvailabilityStatus
  totalDonations?: number
  organizationId?: string
  organizationName?: string
  verified?: boolean
  photoUrl?: string
}

export interface Organization {
  id: string
  name: string
  type: OrgType
  registrationNumber: string
  email: string
  phone: string
  address: string
  staffId: string
  documentName?: string
  status: VerificationStatus
  rejectionReason?: string
  submittedAt: string
}

export interface BloodRequest {
  id: string
  recipientId: string
  recipientName: string
  bloodGroup: BloodGroup
  units: number
  hospital: string
  location: string
  requiredDate: string
  urgency: RequestUrgency
  notes?: string
  status: RequestStatus
  matchCount: number
  createdAt: string
  distanceKm?: number
}

export interface DonorMatch {
  id: string
  name: string
  bloodGroup: BloodGroup
  distanceKm: number
  available: boolean
  eligible: boolean
  matchScore: number
}

export interface BloodStockItem {
  bloodGroup: BloodGroup
  units: number
  level: StockLevel
}

export interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  read: boolean
  type: 'info' | 'success' | 'warning' | 'critical'
}

export const BLOOD_GROUPS: BloodGroup[] = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
