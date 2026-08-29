import { useState } from 'react'
import { DEMO_NOTIFICATIONS } from '../../data/demo'
import { EmptyState, NotificationCard } from '../../components/ui'

export function RecipientNotificationsPage() {
  const [items, setItems] = useState([
    {
      id: 'nr-1',
      title: 'Donors found',
      message: '4 potential donors match your O+ request.',
      time: 'Just now',
      read: false,
      type: 'success' as const,
    },
    ...DEMO_NOTIFICATIONS,
  ])

  if (!items.length) {
    return (
      <EmptyState
        title="No notifications"
        description="Updates about matches and donor responses will appear here."
      />
    )
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Notifications</h1>
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
