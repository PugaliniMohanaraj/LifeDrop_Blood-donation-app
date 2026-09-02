import { Link } from 'react-router-dom'
import type { LucideIcon } from 'lucide-react'
import { Card, LoadingSpinner, NotificationCard } from '../ui'
import { IconPageHeader, PageContainer } from '../PageChrome'
import { useNotifications } from '../../hooks/useNotifications'

export type NotifyAboutItem = {
  icon: LucideIcon
  title: string
  text: string
  tone: string
}

type RoleNotificationsPageProps = {
  icon: LucideIcon
  title?: string
  subtitle: string
  emptyTitle: string
  emptyDescription: string
  emptyActionLabel?: string
  emptyActionTo?: string
  emptyActionIcon?: LucideIcon
  notifyAbout: NotifyAboutItem[]
}

export function RoleNotificationsPage({
  icon: HeaderIcon,
  title = 'Notifications',
  subtitle,
  emptyTitle,
  emptyDescription,
  emptyActionLabel,
  emptyActionTo,
  emptyActionIcon: EmptyIcon,
  notifyAbout,
}: RoleNotificationsPageProps) {
  const { items, loading, dismiss } = useNotifications()
  const EmptyActionIcon = EmptyIcon || HeaderIcon

  return (
    <PageContainer>
      <IconPageHeader icon={HeaderIcon} title={title} subtitle={subtitle} />

      {loading ? (
        <LoadingSpinner label="Loading notifications…" />
      ) : items.length === 0 ? (
        <Card className="flex flex-col items-center justify-center border-dashed px-6 py-14 text-center">
          <div className="relative">
            <span className="flex h-20 w-20 items-center justify-center rounded-full bg-critical-bg">
              <HeaderIcon className="h-10 w-10 text-brand" aria-hidden />
            </span>
            <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
              0
            </span>
          </div>
          <h2 className="mt-6 text-lg font-bold text-foreground">{emptyTitle}</h2>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted">{emptyDescription}</p>
          {emptyActionLabel && emptyActionTo && (
            <Link
              to={emptyActionTo}
              className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white shadow-md shadow-brand/20 transition hover:bg-brand-dark"
            >
              <EmptyActionIcon className="h-4 w-4" aria-hidden />
              {emptyActionLabel}
            </Link>
          )}
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
            <Card key={item.title} className="p-4 transition hover:border-brand/30 hover:shadow-md">
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
    </PageContainer>
  )
}
