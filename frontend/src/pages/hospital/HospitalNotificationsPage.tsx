import { useState } from 'react'
import { DEMO_NOTIFICATIONS } from '../../data/demo'
import { NotificationCard } from '../../components/ui'

export function HospitalNotificationsPage() {
  const [items, setItems] = useState(DEMO_NOTIFICATIONS)
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
