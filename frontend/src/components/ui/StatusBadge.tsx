import type { ReactNode } from 'react'
import type { RequestStatus, StockLevel, VerificationStatus } from '../../types'

type Tone = 'success' | 'warning' | 'critical' | 'info' | 'neutral' | 'pending'

interface StatusBadgeProps {
  label: string
  tone?: Tone
  icon?: ReactNode
}

const tones: Record<Tone, string> = {
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  critical: 'bg-critical-bg text-critical',
  info: 'bg-info-bg text-info',
  neutral: 'bg-slate-100 text-slate-700',
  pending: 'bg-warning-bg text-warning',
}

export function StatusBadge({ label, tone = 'neutral', icon }: StatusBadgeProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${tones[tone]}`}
    >
      {icon}
      {label}
    </span>
  )
}

export function stockTone(level: StockLevel): Tone {
  if (level === 'AVAILABLE') return 'success'
  if (level === 'LOW') return 'warning'
  return 'critical'
}

export function stockLabel(level: StockLevel): string {
  if (level === 'AVAILABLE') return 'Available'
  if (level === 'LOW') return 'Low'
  return 'Critical'
}

export function stockIcon(level: StockLevel): string {
  if (level === 'AVAILABLE') return '🟢'
  if (level === 'LOW') return '🟡'
  return '🔴'
}

export function verificationTone(status: VerificationStatus): Tone {
  if (status === 'APPROVED') return 'success'
  if (status === 'REJECTED') return 'critical'
  return 'pending'
}

export function verificationLabel(status: VerificationStatus): string {
  if (status === 'APPROVED') return 'Verified'
  if (status === 'REJECTED') return 'Rejected'
  return 'Pending Verification'
}

export function requestStatusMeta(status: RequestStatus): { label: string; tone: Tone; icon: string } {
  switch (status) {
    case 'FINDING_DONORS':
      return { label: 'Finding Donors', tone: 'info', icon: '🔄' }
    case 'MATCHING':
      return { label: 'Matching in Progress', tone: 'info', icon: '🔄' }
    case 'DONOR_ACCEPTED':
      return { label: 'Request Accepted', tone: 'success', icon: '✓' }
    case 'IN_PROGRESS':
      return { label: 'Donation In Progress', tone: 'warning', icon: '⏳' }
    case 'COMPLETED':
      return { label: 'Completed', tone: 'success', icon: '✓' }
    case 'CANCELLED':
      return { label: 'Cancelled', tone: 'neutral', icon: '✕' }
  }
}
