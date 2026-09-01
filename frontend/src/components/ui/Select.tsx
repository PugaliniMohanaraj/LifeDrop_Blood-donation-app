import type { SelectHTMLAttributes } from 'react'

interface Option {
  value: string
  label: string
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string
  options: Option[]
  error?: string
  hint?: string
  placeholder?: string
}

export function Select({
  label,
  options,
  error,
  hint,
  placeholder = 'Select…',
  id,
  className = '',
  ...props
}: SelectProps) {
  const selectId = id || props.name || label.replace(/\s+/g, '-').toLowerCase()
  return (
    <div className="w-full">
      <label htmlFor={selectId} className="mb-1.5 block text-sm font-medium text-foreground">
        {label}
        {props.required && (
          <span className="ml-0.5 text-brand" aria-hidden>
            *
          </span>
        )}
      </label>
      <select
        id={selectId}
        aria-invalid={!!error}
        aria-describedby={error ? `${selectId}-error` : hint ? `${selectId}-hint` : undefined}
        className={`w-full rounded-2xl border bg-card px-4 py-3 text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20 ${
          error ? 'border-critical' : 'border-border'
        } ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {hint && !error && (
        <p id={`${selectId}-hint`} className="mt-1.5 text-xs text-muted">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${selectId}-error`} className="mt-1.5 text-sm text-critical" role="alert">
          {error}
        </p>
      )}
    </div>
  )
}
