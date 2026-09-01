import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

type Variant = 'default' | 'sidebar' | 'ghost'

interface ThemeToggleProps {
  variant?: Variant
  className?: string
}

const styles: Record<Variant, string> = {
  default:
    'rounded-full border border-border bg-card p-2.5 text-foreground shadow-sm transition hover:bg-surface',
  sidebar:
    'rounded-full p-2.5 text-slate-300 transition hover:bg-white/10 hover:text-white',
  ghost: 'rounded-full p-2.5 text-foreground transition hover:bg-surface',
}

export function ThemeToggle({ variant = 'default', className = '' }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`${styles[variant]} ${className}`}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="h-5 w-5" aria-hidden /> : <Moon className="h-5 w-5" aria-hidden />}
    </button>
  )
}
