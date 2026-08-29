import { EmptyState, LoadingSpinner, NotificationCard } from '../../components/ui'
import { useNotifications } from '../../hooks/useNotifications'

export function HospitalNotificationsPage() {
  const { items, loading, dismiss } = useNotifications()

  if (loading) return <LoadingSpinner label="Loading notifications…" />

  if (!items.length) {
    return (
      <EmptyState
        title="No notifications"
        description="Organization updates will appear here."
      />
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Notifications</h1>
      <div className="space-y-3">
        {items.map((item) => (
          <NotificationCard key={item.id} item={item} onDismiss={(id) => void dismiss(id)} />
        ))}
      </div>
    </div>
  )
}
