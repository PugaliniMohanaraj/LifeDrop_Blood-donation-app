import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { DEMO_ORGS, DEMO_REQUESTS } from '../data/demo'
import type { BloodRequest, Organization, RequestUrgency, BloodGroup, VerificationStatus } from '../types'

interface AppDataContextValue {
  requests: BloodRequest[]
  organizations: Organization[]
  addRequest: (data: {
    recipientId: string
    recipientName: string
    bloodGroup: BloodGroup
    units: number
    hospital: string
    location: string
    requiredDate: string
    urgency: RequestUrgency
    notes?: string
  }) => BloodRequest
  cancelRequest: (id: string) => void
  updateRequestStatus: (id: string, status: BloodRequest['status']) => void
  setOrgStatus: (id: string, status: VerificationStatus, rejectionReason?: string) => void
  addOrganization: (org: Omit<Organization, 'id' | 'status' | 'submittedAt'>) => void
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const [requests, setRequests] = useState<BloodRequest[]>(DEMO_REQUESTS)
  const [organizations, setOrganizations] = useState<Organization[]>(DEMO_ORGS)

  const addRequest: AppDataContextValue['addRequest'] = useCallback((data) => {
    const req: BloodRequest = {
      id: `req-${Date.now()}`,
      ...data,
      status: data.urgency === 'EMERGENCY' ? 'FINDING_DONORS' : 'FINDING_DONORS',
      matchCount: data.urgency === 'EMERGENCY' ? 3 : 4,
      createdAt: new Date().toISOString(),
      distanceKm: 2.1,
    }
    setRequests((prev) => [req, ...prev])
    return req
  }, [])

  const cancelRequest = useCallback((id: string) => {
    setRequests((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: 'CANCELLED' as const } : r)),
    )
  }, [])

  const updateRequestStatus = useCallback((id: string, status: BloodRequest['status']) => {
    setRequests((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)))
  }, [])

  const setOrgStatus = useCallback(
    (id: string, status: VerificationStatus, rejectionReason?: string) => {
      setOrganizations((prev) =>
        prev.map((o) =>
          o.id === id ? { ...o, status, rejectionReason: rejectionReason || undefined } : o,
        ),
      )
    },
    [],
  )

  const addOrganization = useCallback(
    (org: Omit<Organization, 'id' | 'status' | 'submittedAt'>) => {
      setOrganizations((prev) => [
        {
          ...org,
          id: `org-${Date.now()}`,
          status: 'PENDING',
          submittedAt: new Date().toISOString(),
        },
        ...prev,
      ])
    },
    [],
  )

  const value = useMemo(
    () => ({
      requests,
      organizations,
      addRequest,
      cancelRequest,
      updateRequestStatus,
      setOrgStatus,
      addOrganization,
    }),
    [
      requests,
      organizations,
      addRequest,
      cancelRequest,
      updateRequestStatus,
      setOrgStatus,
      addOrganization,
    ],
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used within AppDataProvider')
  return ctx
}
