import {
  Children,
  cloneElement,
  isValidElement,
  useId,
  type ReactElement,
  type ReactNode,
} from 'react'
import type { LucideIcon } from 'lucide-react'

function isFormControl(child: ReactElement): boolean {
  const type = child.type
  if (typeof type === 'string') {
    return type === 'input' || type === 'select' || type === 'textarea'
  }
  return false
}

export function AuthField({
  id,
  label,
  icon: Icon,
  required,
  error,
  hint,
  children,
}: {
  id?: string
  label: string
  icon: LucideIcon
  required?: boolean
  error?: string
  hint?: string
  children: ReactNode
}) {
  const autoId = useId()
  const fieldId = id ?? autoId.replace(/:/g, '')
  const hintId = hint && !error ? `${fieldId}-hint` : undefined
  const errorId = error ? `${fieldId}-error` : undefined
  const describedBy = [errorId, hintId].filter(Boolean).join(' ') || undefined

  const enhancedChildren = Children.map(children, (child) => {
    if (!isValidElement(child) || !isFormControl(child)) return child
    return cloneElement(child as ReactElement<Record<string, unknown>>, {
      id: (child.props as { id?: string }).id ?? fieldId,
      'aria-invalid': error ? true : undefined,
      'aria-describedby': describedBy,
    })
  })

  return (
    <div className="w-full">
      <label htmlFor={fieldId} className="mb-1.5 block text-sm font-semibold text-navy">
        {label}
        {required && (
          <span className="ml-0.5 text-brand" aria-hidden>
            *
          </span>
        )}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute inset-y-0 left-0 flex w-11 items-center justify-center border-r border-border text-muted">
          <Icon className="h-4 w-4" aria-hidden />
        </span>
        {enhancedChildren}
      </div>
      {hint && !error && (
        <p id={hintId} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-1.5 text-sm text-critical" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}

export const authFieldClass = (error?: string) =>
  `w-full rounded-xl border bg-white py-3 pl-[3.25rem] pr-4 text-sm text-foreground placeholder:text-muted/80 transition focus:border-brand focus:ring-2 focus:ring-brand/15 dark:bg-card ${
    error ? 'border-critical' : 'border-border'
  }`
