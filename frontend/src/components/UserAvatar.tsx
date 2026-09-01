import { User } from 'lucide-react'

interface UserAvatarProps {
  name: string
  photoUrl?: string
  size?: 'sm' | 'md'
}

const sizes = {
  sm: 'h-7 w-7 text-xs',
  md: 'h-16 w-16 text-lg',
}

function initials(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('')
}

export function UserAvatar({ name, photoUrl, size = 'sm' }: UserAvatarProps) {
  if (photoUrl) {
    return (
      <img
        src={photoUrl}
        alt=""
        className={`${sizes[size]} shrink-0 rounded-full object-cover ring-2 ring-brand/20`}
      />
    )
  }

  const label = initials(name)
  if (label) {
    return (
      <span
        className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-brand/10 font-bold text-brand ring-2 ring-brand/20`}
        aria-hidden
      >
        {label}
      </span>
    )
  }

  return (
    <span
      className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand ring-2 ring-brand/20`}
      aria-hidden
    >
      <User className={size === 'md' ? 'h-7 w-7' : 'h-4 w-4'} />
    </span>
  )
}

export function mergeProfilePhoto(prev: { email?: string; photoUrl?: string } | null, next: { email: string; photoUrl?: string }) {
  if (prev?.email === next.email && prev.photoUrl && !next.photoUrl) {
    return { ...next, photoUrl: prev.photoUrl }
  }
  return next
}
