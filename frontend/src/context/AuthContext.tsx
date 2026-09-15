import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import api from '../api/client'
import { mergeProfilePhoto } from '../components/UserAvatar'
import { DEMO_USERS } from '../data/demo'
import type { AvailabilityStatus, BloodGroup, User, UserRole } from '../types'

interface AuthContextValue {
  user: User | null
  login: (
    email: string,
    password: string,
  ) => Promise<{ ok: boolean; message?: string; role?: UserRole }>
  logout: () => void
  registerDonor: (data: {
    fullName: string
    email: string
    phone: string
    password: string
    bloodGroup: BloodGroup
    location: string
  }) => Promise<{ ok: boolean; message?: string }>
  registerRecipient: (data: {
    fullName: string
    email: string
    phone: string
    password: string
    location: string
  }) => Promise<{ ok: boolean; message?: string }>
  updateAvailability: (status: AvailabilityStatus) => void
  updateProfile: (patch: Partial<User>) => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

const STORAGE_KEY = 'bloodbridge_user'
const TOKEN_KEY = 'bloodbridge_token'

export function loadStoredUser(): User | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as User) : null
  } catch {
    return null
  }
}

function mapApiUser(u: Record<string, unknown>): User {
  return {
    id: String(u.id),
    fullName: String(u.fullName),
    email: String(u.email),
    phone: String(u.phone),
    role: u.role as UserRole,
    bloodGroup: (u.bloodGroup as BloodGroup) || undefined,
    location: (u.location as string) || undefined,
    availability: (u.availability as AvailabilityStatus) || undefined,
    totalDonations: (u.totalDonations as number) ?? 0,
    organizationId: u.organizationId != null ? String(u.organizationId) : undefined,
    organizationName: (u.organizationName as string) || undefined,
    verified: Boolean(u.verified),
    photoUrl: (u.photoUrl as string) || undefined,
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => loadStoredUser())
  const [registry, setRegistry] = useState(() => ({ ...DEMO_USERS }))

  const persist = useCallback((next: User | null, token?: string | null) => {
    setUser(next)
    if (next) localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    else localStorage.removeItem(STORAGE_KEY)
    if (token) localStorage.setItem(TOKEN_KEY, token)
    if (token === null) localStorage.removeItem(TOKEN_KEY)
  }, [])

  const loginLocal = useCallback(
    (email: string, password: string) => {
      const account = registry[email.toLowerCase()]
      if (!account || account.password !== password) {
        return {
          ok: false as const,
          message: 'Email or password is incorrect. Please try again.',
        }
      }
      if (
        (account.role === 'HOSPITAL' || account.role === 'BLOOD_BANK') &&
        !account.verified
      ) {
        return {
          ok: false as const,
          message:
            'Your organization is still pending verification. You will be notified when access is ready.',
        }
      }
      const { password: _, ...safe } = account
      persist(safe, null)
      return { ok: true as const, role: safe.role }
    },
    [persist, registry],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      try {
        const { data } = await api.post('/auth/login', { email, password })
        const mapped = mapApiUser(data.user)
        const prev = loadStoredUser()
        persist(mergeProfilePhoto(prev, mapped), data.token)
        return { ok: true as const, role: mapped.role }
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { data?: { message?: string } }
          code?: string
        }
        if (!axiosErr.response) {
          return loginLocal(email, password)
        }
        return {
          ok: false as const,
          message:
            axiosErr.response.data?.message ||
            'Email or password is incorrect. Please try again.',
        }
      }
    },
    [loginLocal, persist],
  )

  const logout = useCallback(() => persist(null, null), [persist])

  const registerDonor = useCallback(
    async (data: {
      fullName: string
      email: string
      phone: string
      password: string
      bloodGroup: BloodGroup
      location: string
    }) => {
      try {
        const { data: res } = await api.post('/auth/register/donor', data)
        persist(mapApiUser(res.user), res.token)
        return { ok: true as const }
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { data?: { message?: string } }
        }
        if (!axiosErr.response) {
          const key = data.email.toLowerCase()
          if (registry[key]) {
            return {
              ok: false as const,
              message: 'An account with this email already exists. Please log in.',
            }
          }
          const newUser = {
            id: `u-${Date.now()}`,
            fullName: data.fullName,
            email: key,
            phone: data.phone,
            password: data.password,
            role: 'DONOR' as UserRole,
            bloodGroup: data.bloodGroup,
            location: data.location,
            availability: 'AVAILABLE' as AvailabilityStatus,
            totalDonations: 0,
          }
          setRegistry((prev) => ({ ...prev, [key]: newUser }))
          const { password: _, ...safe } = newUser
          persist(safe, null)
          return { ok: true as const }
        }
        return {
          ok: false as const,
          message: axiosErr.response.data?.message || 'Registration failed.',
        }
      }
    },
    [persist, registry],
  )

  const registerRecipient = useCallback(
    async (data: {
      fullName: string
      email: string
      phone: string
      password: string
      location: string
    }) => {
      try {
        const { data: res } = await api.post('/auth/register/recipient', data)
        persist(mapApiUser(res.user), res.token)
        return { ok: true as const }
      } catch (err: unknown) {
        const axiosErr = err as {
          response?: { data?: { message?: string } }
        }
        if (!axiosErr.response) {
          const key = data.email.toLowerCase()
          if (registry[key]) {
            return {
              ok: false as const,
              message: 'An account with this email already exists. Please log in.',
            }
          }
          const newUser = {
            id: `u-${Date.now()}`,
            fullName: data.fullName,
            email: key,
            phone: data.phone,
            password: data.password,
            role: 'RECIPIENT' as UserRole,
            location: data.location,
          }
          setRegistry((prev) => ({ ...prev, [key]: newUser }))
          const { password: _, ...safe } = newUser
          persist(safe, null)
          return { ok: true as const }
        }
        return {
          ok: false as const,
          message: axiosErr.response.data?.message || 'Registration failed.',
        }
      }
    },
    [persist, registry],
  )

  const updateAvailability = useCallback(
    (status: AvailabilityStatus) => {
      if (!user) return
      const next = { ...user, availability: status }
      persist(next)
      api.patch('/me/availability', { availability: status }).catch(() => undefined)
    },
    [persist, user],
  )

  const updateProfile = useCallback(
    (patch: Partial<User>) => {
      if (!user) return
      persist({ ...user, ...patch })
    },
    [persist, user],
  )

  const value = useMemo(
    () => ({
      user,
      login,
      logout,
      registerDonor,
      registerRecipient,
      updateAvailability,
      updateProfile,
    }),
    [user, login, logout, registerDonor, registerRecipient, updateAvailability, updateProfile],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
