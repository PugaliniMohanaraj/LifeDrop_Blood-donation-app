import { useCallback, useEffect, useState } from 'react'
import { dismissNotification, fetchNotifications } from '../api/bloodBridge'
import type { NotificationItem } from '../types'

export function useNotifications() {
  const [items, setItems] = useState<NotificationItem[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      setItems(await fetchNotifications())
    } catch {
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const dismiss = useCallback(async (id: string) => {
    setItems((prev) => prev.filter((n) => n.id !== id))
    try {
      await dismissNotification(id)
    } catch {
      void refresh()
    }
  }, [refresh])

  return { items, loading, dismiss, refresh }
}
