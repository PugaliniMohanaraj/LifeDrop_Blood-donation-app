import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import {
  acceptBloodRequest,
  approveOrganization,
  cancelBloodRequest,
  createBloodRequest,
  declineBloodRequest,
  fetchOrganizations,
  fetchPendingOrganizations,
  fetchRequests,
  inviteDonor,
  rejectOrganization,
} from '../api/bloodBridge'
import { useAuth } from './AuthContext'
import type {
  BloodGroup,
  BloodRequest,
  Organization,
  RequestUrgency,
  VerificationStatus,
} from '../types'

interface AppDataContextValue {
  requests: BloodRequest[]
  organizations: Organization[]
  loading: boolean
  refresh: () => Promise<void>
  addRequest: (data: {
    bloodGroup: BloodGroup
    units: number
    hospital: string
    location: string
    requiredDate: string
    urgency: RequestUrgency
    notes?: string
  }) => Promise<BloodRequest>
  cancelRequest: (id: string) => Promise<void>
  acceptRequest: (id: string) => Promise<void>
  declineRequest: (id: string) => Promise<void>
  sendInvite: (requestId: string, donorId: string) => Promise<void>
  setOrgStatus: (id: string, status: VerificationStatus, rejectionReason?: string) => Promise<void>
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [requests, setRequests] = useState<BloodRequest[]>([])
  const [organizations, setOrganizations] = useState<Organization[]>([])
  const [loading, setLoading] = useState(false)

  const refresh = useCallback(async () => {
    if (!user) {
      setRequests([])
      setOrganizations([])
      return
    }
    setLoading(true)
    try {
      const reqs = await fetchRequests()
      setRequests(reqs)
      if (user.role === 'ADMIN') {
        try {
          const orgs = await fetchOrganizations()
          setOrganizations(orgs)
        } catch {
          const pending = await fetchPendingOrganizations()
          setOrganizations(pending)
        }
      }
    } catch {
      // Keep existing data if offline
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addRequest: AppDataContextValue['addRequest'] = useCallback(
    async (data) => {
      const created = await createBloodRequest(data)
      setRequests((prev) => [created, ...prev.filter((r) => r.id !== created.id)])
      return created
    },
    [],
  )

  const cancelRequest = useCallback(async (id: string) => {
    const updated = await cancelBloodRequest(id)
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
  }, [])

  const acceptRequest = useCallback(async (id: string) => {
    const updated = await acceptBloodRequest(id)
    setRequests((prev) => prev.map((r) => (r.id === id ? updated : r)))
  }, [])

  const declineRequest = useCallback(async (id: string) => {
    await declineBloodRequest(id)
    setRequests((prev) => prev.filter((r) => r.id !== id))
  }, [])

  const sendInvite = useCallback(async (requestId: string, donorId: string) => {
    await inviteDonor(requestId, donorId)
  }, [])

  const setOrgStatus = useCallback(
    async (id: string, status: VerificationStatus, rejectionReason?: string) => {
      const updated =
        status === 'APPROVED'
          ? await approveOrganization(id)
          : await rejectOrganization(id, rejectionReason || 'Application rejected.')
      setOrganizations((prev) => prev.map((o) => (o.id === id ? updated : o)))
    },
    [],
  )

  const value = useMemo(
    () => ({
      requests,
      organizations,
      loading,
      refresh,
      addRequest,
      cancelRequest,
      acceptRequest,
      declineRequest,
      sendInvite,
      setOrgStatus,
    }),
    [
      requests,
      organizations,
      loading,
      refresh,
      addRequest,
      cancelRequest,
      acceptRequest,
      declineRequest,
      sendInvite,
      setOrgStatus,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}

export { apiErrorMessage } from '../api/bloodBridge'
