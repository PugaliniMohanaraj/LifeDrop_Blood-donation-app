import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline' | 'emergency' | 'hero' | 'heroOutline'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  children: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-white hover:bg-brand-dark shadow-md shadow-brand/20',
  secondary: 'bg-navy text-white hover:bg-navy-muted shadow-sm',
  danger: 'bg-critical text-white hover:bg-red-800 shadow-sm',
  ghost: 'bg-transparent text-foreground hover:bg-surface',
  outline: 'border-2 border-brand bg-card text-brand hover:bg-critical-bg/40',
  emergency: 'bg-critical text-white hover:bg-red-800 shadow-md shadow-critical/25',
  hero: 'bg-white text-brand hover:bg-slate-100 shadow-none',
  heroOutline: 'border-2 border-white bg-transparent text-white hover:bg-white/10',
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-1.5 text-sm min-h-9 rounded-full',
  md: 'px-5 py-2.5 text-sm min-h-11 rounded-full',
  lg: 'px-7 py-3 text-base min-h-12 rounded-full',
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={`inline-flex items-center justify-center gap-2 font-semibold transition disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span
          className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white"
          aria-hidden
        />
      )}
      {children}
    </button>
  )
}
