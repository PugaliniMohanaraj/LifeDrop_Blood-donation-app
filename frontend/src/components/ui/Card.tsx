import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  as?: 'div' | 'article' | 'section'
}

export function Card({ children, className = '', as: Tag = 'div' }: CardProps) {
  return (
    <Tag
      className={`rounded-2xl border border-border bg-card p-5 shadow-sm shadow-navy/[0.03] dark:shadow-black/20 ${className}`}
    >
      {children}
    </Tag>
  )
}
