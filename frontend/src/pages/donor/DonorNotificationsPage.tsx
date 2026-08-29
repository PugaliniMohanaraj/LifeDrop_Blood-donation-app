import { EmptyState, LoadingSpinner, NotificationCard } from '../../components/ui'
import { useNotifications } from '../../hooks/useNotifications'

export function DonorNotificationsPage() {
  const { items, loading, dismiss } = useNotifications()

  if (loading) return <LoadingSpinner label="Loading notifications…" />

  if (!items.length) {
    return (
      <EmptyState
        title="No notifications"
        description="Updates about nearby requests and donations will appear here."
      />
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Notifications</h1>
        <p className="text-sm text-muted">Dismiss any update you no longer need.</p>
      </div>
      <div className="space-y-3">
        {items.map((item) => (
          <NotificationCard key={item.id} item={item} onDismiss={(id) => void dismiss(id)} />
        ))}
      </div>
    </div>
  )
}
