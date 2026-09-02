import { BellRing, CheckCircle2, Droplet, Users } from 'lucide-react'
import { RoleNotificationsPage } from '../../components/layout/RoleNotificationsPage'

const notifyAbout = [
  {
    icon: Users,
    title: 'Donor responses',
    text: 'When a donor accepts or declines your blood request.',
    tone: 'bg-success-bg text-success',
  },
  {
    icon: Droplet,
    title: 'Request status updates',
    text: 'Progress from matching through to completion.',
    tone: 'bg-critical-bg text-brand',
  },
  {
    icon: CheckCircle2,
    title: 'Match confirmations',
    text: 'When new suitable donors are found for your request.',
    tone: 'bg-info-bg text-info',
  },
  {
    icon: BellRing,
    title: 'Important alerts',
    text: 'Urgent updates and reminders about active requests.',
    tone: 'bg-warning-bg text-warning',
  },
]

export function RecipientNotificationsPage() {
  return (
    <RoleNotificationsPage
      icon={BellRing}
      subtitle="Updates about matches, donor responses, and request progress."
      emptyTitle="No notifications yet"
      emptyDescription="When donors respond or your request status changes, updates will appear here."
      emptyActionLabel="View my requests"
      emptyActionTo="/recipient/requests"
      emptyActionIcon={Droplet}
      notifyAbout={notifyAbout}
    />
  )
}
