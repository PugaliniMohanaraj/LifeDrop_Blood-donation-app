import { BellRing, Building2, ClipboardList, Droplet } from 'lucide-react'
import { RoleNotificationsPage } from '../../components/layout/RoleNotificationsPage'

const notifyAbout = [
  {
    icon: ClipboardList,
    title: 'New blood requests',
    text: 'When patient or emergency requests need hospital coordination.',
    tone: 'bg-critical-bg text-brand',
  },
  {
    icon: Droplet,
    title: 'Stock alerts',
    text: 'When blood groups at your facility reach low or critical levels.',
    tone: 'bg-warning-bg text-warning',
  },
  {
    icon: Building2,
    title: 'Organization updates',
    text: 'Verification, account, and platform messages for your hospital.',
    tone: 'bg-info-bg text-info',
  },
  {
    icon: BellRing,
    title: 'Emergency notices',
    text: 'Time-sensitive alerts for urgent patient needs.',
    tone: 'bg-success-bg text-success',
  },
]

export function HospitalNotificationsPage() {
  return (
    <RoleNotificationsPage
      icon={BellRing}
      subtitle="Organization updates, requests, and stock alerts for your hospital."
      emptyTitle="No notifications yet"
      emptyDescription="Updates about requests, stock, and organization activity will appear here."
      emptyActionLabel="View requests"
      emptyActionTo="/hospital/requests"
      emptyActionIcon={ClipboardList}
      notifyAbout={notifyAbout}
    />
  )
}
