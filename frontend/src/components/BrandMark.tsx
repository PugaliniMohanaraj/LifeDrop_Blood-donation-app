import { Link } from 'react-router-dom'

interface BrandMarkProps {
  compact?: boolean
  light?: boolean
}

export function BrandMark({ compact = false, light = false }: BrandMarkProps) {
  return (
    <Link to="/" className="flex items-center gap-3 sm:gap-3.5">
      <img
        src="/logo.png"
        alt="LifeDrop"
        className={`rounded-full object-cover shadow-md shadow-brand/10 ring-1 ring-black/5 ${
          compact ? 'h-11 w-11' : 'h-12 w-12 sm:h-[3.25rem] sm:w-[3.25rem]'
        }`}
      />
      <span className="min-w-0">
        <span
          className={`block font-extrabold leading-none tracking-tight ${
            light ? 'text-white' : 'text-foreground'
          } ${compact ? 'text-xl' : 'text-[1.35rem] sm:text-[1.5rem]'}`}
        >
          Life<span className="text-brand">Drop</span>
        </span>
        {!compact && (
          <span
            className={`mt-1.5 block text-[11px] font-semibold tracking-[0.04em] sm:text-xs ${
              light ? 'text-white/75' : 'text-muted'
            }`}
          >
            Every Drop. A New Life.
          </span>
        )}
      </span>
    </Link>
  )
}
