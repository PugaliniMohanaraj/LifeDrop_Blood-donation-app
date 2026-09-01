import { HelpCircle } from 'lucide-react'
import { useState } from 'react'

interface TooltipProps {
  text: string
  label?: string
}

export function Tooltip({ text, label = 'More information' }: TooltipProps) {
  const [open, setOpen] = useState(false)
  return (
    <span className="relative inline-flex">
      <button
        type="button"
        className="rounded-full p-0.5 text-muted hover:text-foreground"
        aria-label={label}
        aria-expanded={open}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
      >
        <HelpCircle className="h-4 w-4" />
      </button>
      {open && (
        <span
          role="tooltip"
          className="absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-lg bg-navy px-3 py-2 text-xs leading-relaxed text-white shadow-lg"
        >
          {text}
        </span>
      )}
    </span>
  )
}
