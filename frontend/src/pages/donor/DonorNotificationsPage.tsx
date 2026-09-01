import { Link } from 'react-router-dom'
import {
  Bell,
  BellRing,
  Building2,
  CheckCircle2,
  Droplet,
  Flame,
} from 'lucide-react'
import { Card, LoadingSpinner, NotificationCard } from '../../components/ui'
import { useNotifications } from '../../hooks/useNotifications'

const notifyAbout = [
  {
    icon: Flame,
    title: 'New blood requests near you',
    text: 'When a recipient invites you or a urgent request matches your group.',
    tone: 'bg-critical-bg text-brand',
  },
  {
    icon: CheckCircle2,
    title: "Requests you've accepted",
    text: 'Confirmations and status changes on donations you agreed to.',
    tone: 'bg-success-bg text-success',
  },
  {
    icon: Building2,
    title: 'Updates from hospitals',
    text: 'Messages related to hospital coordination or verification.',
    tone: 'bg-info-bg text-info',
  },
  {
    icon: BellRing,
    title: 'Reminders and important alerts',
    text: 'Availability reminders and time-sensitive notices.',
    tone: 'bg-warning-bg text-warning',
  },
]

export function DonorNotificationsPage() {
  const { items, loading, dismiss } = useNotifications()

  return (
    <div className="mx-auto w-full max-w-none space-y-6 pb-4">
      <div>
        <div className="flex items-center gap-2">
          <Bell className="h-6 w-6 text-brand" aria-hidden />
          <h1 className="text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Notifications
          </h1>
        </div>
        <p className="mt-1 max-w-2xl text-sm text-muted sm:text-base">
          Stay updated on blood requests, donations, and important alerts.
        </p>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading notifications…" />
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed px-6 py-14 text-center">
          <div className="relative">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-critical-bg">
              <Bell className="h-10 w-10 text-brand" aria-hidden />
            </span>
            <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              0
            </span>
          </div>
          <h2 className="mt-6 text-lg font-bold text-foreground">No notifications yet</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">
            When there are updates about nearby requests, donations, or important alerts, they
            will appear here.
          </p>
          <Link
            to="/donor/requests"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark"
          >
            <Droplet className="h-4 w-4" aria-hidden />
            View nearby requests
          </Link>
        </Card>
      ) : (
        <div className="space-y-3">
          <p className="text-sm font-medium text-muted">
            {items.length} notification{items.length === 1 ? '' : 's'}
          </p>
          {items.map((item) => (
            <NotificationCard key={item.id} item={item} onDismiss={(id) => void dismiss(id)} />
          ))}
        </div>
      )}

      <section>
        <h2 className="mb-4 text-base font-bold text-foreground">You&apos;ll be notified about</h2>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {notifyAbout.map((item) => (
            <Card key={item.title} className="p-4 transition hover:shadow-md">
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${item.tone}`}
              >
                <item.icon className="h-5 w-5" aria-hidden />
              </span>
              <h3 className="mt-3 text-sm font-bold text-foreground">{item.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.text}</p>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
