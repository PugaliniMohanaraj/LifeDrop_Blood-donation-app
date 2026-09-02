interface LoadingSpinnerProps {
  label?: string
  className?: string
}

export function LoadingSpinner({ label = 'Loading…', className = '' }: LoadingSpinnerProps) {
  return (
    <div
      className={`flex flex-col items-center justify-center gap-3 py-10 ${className}`}
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand/20 border-t-brand" aria-hidden />
      <p className="text-sm font-medium text-muted">{label}</p>
    </div>
  )
}
