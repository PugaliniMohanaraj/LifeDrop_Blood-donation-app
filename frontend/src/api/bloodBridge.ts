import api from './client'
import type {
  BloodAvailabilityDetail,
  BloodAvailabilityItem,
  BloodAvailabilitySearchParams,
} from '../types/bloodAvailability'
import type {
  BloodGroup,
  BloodRequest,
  BloodStockItem,
  DonorMatch,
  Organization,
  RequestStatus,
  RequestUrgency,
  StockLevel,
  VerificationStatus,
} from '../types'

type ApiRequest = {
  id: number
  recipientId: number
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
}

type ApiOrg = {
  id: number
  name: string
  type: Organization['type']
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

type ApiStock = {
  bloodGroup: BloodGroup
  units: number
  level: StockLevel
  component?: string
  lastUpdated?: string
}

export function mapRequest(r: ApiRequest): BloodRequest {
  return {
    id: String(r.id),
    recipientId: String(r.recipientId),
    recipientName: r.recipientName,
    bloodGroup: r.bloodGroup,
    units: r.units,
    hospital: r.hospital,
    location: r.location,
    requiredDate: r.requiredDate,
    urgency: r.urgency,
    notes: r.notes,
    status: r.status,
    matchCount: r.matchCount,
    createdAt: r.createdAt,
  }
}

export function mapOrg(o: ApiOrg): Organization {
  return {
    id: String(o.id),
    name: o.name,
    type: o.type,
    registrationNumber: o.registrationNumber,
    email: o.email,
    phone: o.phone,
    address: o.address,
    staffId: o.staffId,
    documentName: o.documentName,
    status: o.status,
    rejectionReason: o.rejectionReason,
    submittedAt: o.submittedAt,
  }
}

export async function fetchRequests(): Promise<BloodRequest[]> {
  const { data } = await api.get<ApiRequest[]>('/requests')
  return data.map(mapRequest)
}

export async function fetchMyRequests(): Promise<BloodRequest[]> {
  const { data } = await api.get<ApiRequest[]>('/requests/mine')
  return data.map(mapRequest)
}

export async function createBloodRequest(payload: {
  bloodGroup: BloodGroup
  units: number
  hospital: string
  location: string
  requiredDate: string
  urgency: RequestUrgency
  notes?: string
}): Promise<BloodRequest> {
  const { data } = await api.post<ApiRequest>('/requests', payload)
  return mapRequest(data)
}

export async function cancelBloodRequest(id: string): Promise<BloodRequest> {
  const { data } = await api.post<ApiRequest>(`/requests/${id}/cancel`)
  return mapRequest(data)
}

export async function acceptBloodRequest(id: string): Promise<BloodRequest> {
  const { data } = await api.post<ApiRequest>(`/requests/${id}/accept`)
  return mapRequest(data)
}

export async function declineBloodRequest(id: string): Promise<void> {
  await api.post(`/requests/${id}/decline`)
}

export async function inviteDonor(requestId: string, donorId: string): Promise<void> {
  await api.post(`/requests/${requestId}/invite`, { donorId: Number(donorId) })
}

export async function fetchNotifications(): Promise<
  import('../types').NotificationItem[]
> {
  const { data } = await api.get<
    {
      id: number
      title: string
      message: string
      type: 'info' | 'success' | 'warning' | 'critical'
      read: boolean
      createdAt: string
    }[]
  >('/notifications')
  return data.map((n) => ({
    id: String(n.id),
    title: n.title,
    message: n.message,
    type: n.type,
    read: n.read,
    time: formatRelative(n.createdAt),
  }))
}

export async function dismissNotification(id: string): Promise<void> {
  await api.delete(`/notifications/${id}`)
}

export async function fetchPlatformStats(): Promise<{
  activeDonors: number
  requestsToday: number
  hospitals: number
  pendingInvites: number
  completedRequests: number
}> {
  const { data } = await api.get('/stats')
  return data
}

function formatRelative(iso: string): string {
  const then = new Date(iso).getTime()
  const diff = Date.now() - then
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins} min ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  return `${Math.floor(hours / 24)}d ago`
}

export async function fetchOrganizations(): Promise<Organization[]> {
  const { data } = await api.get<ApiOrg[]>('/admin/organizations')
  return data.map(mapOrg)
}

export async function fetchPendingOrganizations(): Promise<Organization[]> {
  const { data } = await api.get<ApiOrg[]>('/admin/organizations/pending')
  return data.map(mapOrg)
}

export async function fetchOrganization(id: string): Promise<Organization> {
  const { data } = await api.get<ApiOrg>(`/admin/organizations/${id}`)
  return mapOrg(data)
}

export async function approveOrganization(id: string): Promise<Organization> {
  const { data } = await api.post<ApiOrg>(`/admin/organizations/${id}/approve`)
  return mapOrg(data)
}

export async function rejectOrganization(id: string, reason: string): Promise<Organization> {
  const { data } = await api.post<ApiOrg>(`/admin/organizations/${id}/reject`, { reason })
  return mapOrg(data)
}

export async function registerOrganization(payload: {
  name: string
  type: Organization['type']
  registrationNumber: string
  email: string
  phone: string
  address: string
  staffId: string
  staffName: string
  password: string
  documentName: string
}): Promise<string> {
  const { data } = await api.post<{ message: string }>('/organizations', payload)
  return data.message
}

export async function fetchMatches(bloodGroup?: BloodGroup): Promise<DonorMatch[]> {
  const { data } = await api.get<DonorMatch[]>('/matches', {
    params: bloodGroup ? { bloodGroup } : undefined,
  })
  return data.map((m) => ({
    ...m,
    id: String(m.id),
    bloodGroup: m.bloodGroup,
  }))
}

export async function fetchStock(organizationId: string): Promise<BloodStockItem[]> {
  const { data } = await api.get<ApiStock[]>(`/stock/${organizationId}`)
  return data.map((s) => ({
    bloodGroup: s.bloodGroup,
    units: s.units,
    level: s.level,
  }))
}

export async function updateStock(
  organizationId: string,
  bloodGroup: BloodGroup,
  units: number,
): Promise<BloodStockItem> {
  const { data } = await api.patch<ApiStock>(`/stock/${organizationId}`, { bloodGroup, units })
  return {
    bloodGroup: data.bloodGroup,
    units: data.units,
    level: data.level,
  }
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<string> {
  const { data } = await api.post<{ message: string }>('/me/password', {
    currentPassword,
    newPassword,
  })
  return data.message
}

export function apiErrorMessage(err: unknown, fallback: string): string {
  const e = err as { response?: { data?: { message?: string } }; message?: string }
  return e.response?.data?.message || fallback
}

export async function fetchBloodAvailability(
  params: BloodAvailabilitySearchParams,
): Promise<BloodAvailabilityItem[]> {
  const { data } = await api.get<BloodAvailabilityItem[]>('/public/blood-availability', {
    params: {
      province: params.province || undefined,
      district: params.district || undefined,
      bloodGroup: params.bloodGroup || undefined,
      component: params.component || 'WHOLE_BLOOD',
      availabilityStatus: params.availability || 'ALL',
      search: params.search || undefined,
    },
  })
  return data
}

export async function fetchBloodAvailabilityDetail(
  organizationId: string | number,
  bloodGroup?: string,
  component?: string,
): Promise<BloodAvailabilityDetail> {
  const { data } = await api.get<BloodAvailabilityDetail>(
    `/public/blood-availability/${organizationId}`,
    {
      params: {
        bloodGroup: bloodGroup || undefined,
        component: component || 'WHOLE_BLOOD',
      },
    },
  )
  return data
}
