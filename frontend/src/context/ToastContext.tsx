import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { X } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info' | 'warning'

interface Toast {
  id: string
  type: ToastType
  message: string
}

interface ToastContextValue {
  toast: (message: string, type?: ToastType) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const styles: Record<ToastType, string> = {
  success: 'bg-success text-white',
  error: 'bg-critical text-white',
  info: 'bg-navy text-white',
  warning: 'bg-warning text-white',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = useCallback(
    (message: string, type: ToastType = 'success') => {
      const id = String(Date.now() + Math.random())
      setToasts((prev) => [...prev, { id, type, message }])
      window.setTimeout(() => dismiss(id), 4500)
    },
    [dismiss],
  )

  const value = useMemo(() => ({ toast }), [toast])

  const politeToasts = toasts.filter((t) => t.type !== 'error')
  const assertiveToasts = toasts.filter((t) => t.type === 'error')

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-[100] flex w-[min(100%-2rem,22rem)] flex-col gap-2"
        role="region"
        aria-label="Notifications"
      >
        <div aria-live="polite" className="flex flex-col gap-2">
          {politeToasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
        <div aria-live="assertive" className="flex flex-col gap-2">
          {assertiveToasts.map((t) => (
            <ToastItem key={t.id} toast={t} onDismiss={dismiss} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  )
}

function ToastItem({ toast: t, onDismiss }: { toast: Toast; onDismiss: (id: string) => void }) {
  return (
    <div
      className={`flex items-start gap-3 rounded-xl px-4 py-3 shadow-lg ${styles[t.type]}`}
      role="status"
    >
      <p className="flex-1 text-sm font-medium">{t.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(t.id)}
        className="rounded p-0.5 opacity-80 hover:opacity-100"
        aria-label="Close notification"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
