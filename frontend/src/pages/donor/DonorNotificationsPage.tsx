import { useState } from 'react'
import { DEMO_NOTIFICATIONS } from '../../data/demo'
import { EmptyState, NotificationCard } from '../../components/ui'

export function DonorNotificationsPage() {
  const [items, setItems] = useState(DEMO_NOTIFICATIONS)

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
          <NotificationCard
            key={item.id}
            item={item}
            onDismiss={(id) => setItems((prev) => prev.filter((n) => n.id !== id))}
          />
        ))}
      </div>
    </div>
  )
}
