import type { UserRole } from '../types'
import {
  LayoutDashboard,
  User,
  HeartPulse,
  Droplets,
  Bell,
  History,
  ClipboardList,
  Users,
  Package,
  Search,
  FileBarChart,
  Settings,
  ShieldCheck,
  type LucideIcon,
} from 'lucide-react'

export interface NavItem {
  label: string
  to: string
  icon: LucideIcon
}

export function getNavForRole(role: UserRole): NavItem[] {
  switch (role) {
    case 'DONOR':
      return [
        { label: 'Dashboard', to: '/donor', icon: LayoutDashboard },
        { label: 'Profile', to: '/donor/profile', icon: User },
        { label: 'Availability', to: '/donor/availability', icon: HeartPulse },
        { label: 'Requests', to: '/donor/requests', icon: Droplets },
        { label: 'Notifications', to: '/donor/notifications', icon: Bell },
        { label: 'History', to: '/donor/history', icon: History },
      ]
    case 'RECIPIENT':
      return [
        { label: 'Dashboard', to: '/recipient', icon: LayoutDashboard },
        { label: 'Request Blood', to: '/recipient/request', icon: Droplets },
        { label: 'My Requests', to: '/recipient/requests', icon: ClipboardList },
        { label: 'Matches', to: '/recipient/matches', icon: Users },
        { label: 'Notifications', to: '/recipient/notifications', icon: Bell },
      ]
    case 'HOSPITAL':
      return [
        { label: 'Dashboard', to: '/hospital', icon: LayoutDashboard },
        { label: 'Blood Requests', to: '/hospital/requests', icon: ClipboardList },
        { label: 'Blood Stock', to: '/hospital/stock', icon: Package },
        { label: 'Find Donors', to: '/hospital/donors', icon: Search },
        { label: 'Notifications', to: '/hospital/notifications', icon: Bell },
      ]
    case 'BLOOD_BANK':
      return [
        { label: 'Dashboard', to: '/blood-bank', icon: LayoutDashboard },
        { label: 'Blood Stock', to: '/blood-bank/stock', icon: Package },
        { label: 'Requests', to: '/blood-bank/requests', icon: ClipboardList },
        { label: 'Donations', to: '/blood-bank/donations', icon: Droplets },
        { label: 'Reports', to: '/blood-bank/reports', icon: FileBarChart },
      ]
    case 'ADMIN':
      return [
        { label: 'Dashboard', to: '/admin', icon: LayoutDashboard },
        { label: 'Verify Organizations', to: '/admin/verify', icon: ShieldCheck },
        { label: 'Users', to: '/admin/users', icon: Users },
        { label: 'Reports', to: '/admin/reports', icon: FileBarChart },
        { label: 'Settings', to: '/admin/settings', icon: Settings },
      ]
    default:
      return []
  }
}
