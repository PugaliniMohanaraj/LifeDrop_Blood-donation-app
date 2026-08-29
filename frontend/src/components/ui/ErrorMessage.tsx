import { AlertCircle } from 'lucide-react'

interface ErrorMessageProps {
  title?: string
  message: string
  fix?: string
}

export function ErrorMessage({
  title = 'Something went wrong',
  message,
  fix,
}: ErrorMessageProps) {
  return (
    <div
      className="flex gap-3 rounded-xl border border-critical/20 bg-critical-bg px-4 py-3 text-critical"
      role="alert"
    >
      <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" aria-hidden />
      <div>
        <p className="font-semibold">{title}</p>
        <p className="mt-0.5 text-sm">{message}</p>
        {fix && <p className="mt-1 text-sm font-medium">What to do: {fix}</p>}
      </div>
    </div>
  )
}
