import { Moon, Sun } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'

type Variant = 'default' | 'sidebar' | 'ghost' | 'pill'

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
  const { theme, setTheme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  if (variant === 'pill') {
    return (
      <div
        className={`inline-flex items-center gap-0.5 rounded-full border border-border/80 bg-white/90 p-1 shadow-sm ${className}`}
        role="group"
        aria-label="Theme"
      >
        <button
          type="button"
          onClick={() => setTheme('light')}
          className={`rounded-full p-2 transition ${
            !isDark ? 'bg-surface text-brand shadow-sm' : 'text-muted hover:text-foreground'
          }`}
          aria-label="Light mode"
          aria-pressed={!isDark}
        >
          <Sun className="h-4 w-4" aria-hidden />
        </button>
        <button
          type="button"
          onClick={() => setTheme('dark')}
          className={`rounded-full p-2 transition ${
            isDark ? 'bg-surface text-brand shadow-sm' : 'text-muted hover:text-foreground'
          }`}
          aria-label="Dark mode"
          aria-pressed={isDark}
        >
          <Moon className="h-4 w-4" aria-hidden />
        </button>
      </div>
    )
  }

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
