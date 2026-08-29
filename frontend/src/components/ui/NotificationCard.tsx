import { Bell, X } from 'lucide-react'
import type { NotificationItem } from '../../types'

interface NotificationCardProps {
  item: NotificationItem
  onDismiss?: (id: string) => void
}

const typeStyles = {
  info: 'border-info/20 bg-info-bg',
  success: 'border-success/20 bg-success-bg',
  warning: 'border-warning/20 bg-warning-bg',
  critical: 'border-critical/20 bg-critical-bg',
}

export function NotificationCard({ item, onDismiss }: NotificationCardProps) {
  return (
    <article
      className={`relative rounded-xl border p-4 ${typeStyles[item.type]} ${
        item.read ? 'opacity-75' : ''
      }`}
    >
      <div className="flex gap-3">
        <Bell className="mt-0.5 h-5 w-5 shrink-0 text-navy" aria-hidden />
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-navy">{item.title}</h3>
          <p className="mt-0.5 text-sm text-muted">{item.message}</p>
          <p className="mt-2 text-xs text-muted">{item.time}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={() => onDismiss(item.id)}
            className="rounded-lg p-1 text-muted hover:bg-white/60 hover:text-navy"
            aria-label={`Dismiss ${item.title}`}
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    </article>
  )
}
