import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Ban,
  Building2,
  Calendar,
  Check,
  Droplet,
  Eye,
  FileText,
  Heart,
  MapPin,
  Shield,
  User,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../context/ToastContext'
import {
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  StatusBadge,
  requestStatusMeta,
} from '../../components/ui'
import type { BloodRequest, RequestStatus } from '../../types'

function expiresLabel(requiredDate: string) {
  const deadline = new Date(requiredDate)
  deadline.setHours(23, 59, 59, 999)
  const diff = deadline.getTime() - Date.now()
  if (diff <= 0) return 'Required today'
  const hours = Math.floor(diff / 3600000)
  if (hours < 24) return `${hours}h ${Math.floor((diff % 3600000) / 60000)}m`
  return `${Math.ceil(hours / 24)} days`
}

function matchScore(request: BloodRequest, donorGroup?: string) {
  let score = 78
  if (donorGroup === request.bloodGroup) score += 10
  if (request.distanceKm != null && request.distanceKm <= 3) score += 8
  else if (request.distanceKm != null && request.distanceKm <= 8) score += 4
  if (request.urgency !== 'NORMAL') score += 2
  return Math.min(score, 98)
}

function canRespond(status: RequestStatus) {
  return status === 'FINDING_DONORS' || status === 'MATCHING'
}

function DetailRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Building2
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-surface text-muted">
        <Icon className="h-4 w-4" aria-hidden />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</p>
        <p className="mt-0.5 font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}

export function DonorRequestDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const { requests, acceptRequest, declineRequest } = useAppData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [confirmAccept, setConfirmAccept] = useState(false)
  const [confirmDecline, setConfirmDecline] = useState(false)
  const [busy, setBusy] = useState(false)

  const request = requests.find((r) => r.id === id)

  if (!request) {
    return (
      <EmptyState
        title="Request not found"
        description="This blood request may have been removed or completed."
        actionLabel="Back to requests"
        onAction={() => navigate('/donor/requests')}
      />
    )
  }

  const meta = requestStatusMeta(request.status)
  const open = canRespond(request.status)
  const accepted = request.status === 'DONOR_ACCEPTED' || request.status === 'IN_PROGRESS'
  const score = matchScore(request, user?.bloodGroup)
  const urgent =
    request.urgency === 'EMERGENCY' ? 'Emergency' : request.urgency === 'URGENT' ? 'Urgent' : null

  return (
    <div className="mx-auto w-full max-w-none space-y-6 pb-4">
      <Link
        to="/donor/requests"
        className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted transition hover:text-brand"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to requests
      </Link>

      <div className="grid gap-6 xl:grid-cols-[1fr_280px]">
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
            {urgent && (
              <StatusBadge label={urgent} tone={request.urgency === 'EMERGENCY' ? 'critical' : 'warning'} icon={<span>!</span>} />
            )}
          </div>
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
              {request.bloodGroup} · {request.units} units
            </h1>
            <p className="mt-2 max-w-2xl text-base text-muted">
              A patient needs {request.bloodGroup} blood. Your donation can help the care team at{' '}
              {request.hospital} respond without delay.
            </p>
          </div>
        </div>

        <Card className="border-brand/15 bg-gradient-to-br from-critical-bg/60 to-card p-5">
          <div className="flex items-start gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-brand/10">
              <Heart className="h-6 w-6 text-brand" fill="currentColor" aria-hidden />
            </span>
            <div>
              <p className="font-bold text-foreground">Thank you for responding</p>
              <p className="mt-1 text-sm leading-relaxed text-muted">
                {accepted
                  ? 'Your acceptance is visible to the recipient. Contact the hospital to confirm timing.'
                  : 'Review the details below, then accept if you are available to donate.'}
              </p>
            </div>
          </div>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-12">
        <Card className="lg:col-span-7">
          <h2 className="text-base font-bold text-foreground">Request details</h2>
          <div className="mt-2 divide-y divide-border">
            <DetailRow icon={Building2} label="Hospital" value={request.hospital} />
            <DetailRow icon={MapPin} label="Location" value={request.location} />
            <DetailRow
              icon={Calendar}
              label="Required date"
              value={new Date(request.requiredDate).toLocaleDateString(undefined, {
                weekday: 'short',
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            />
            <DetailRow icon={Droplet} label="Blood group" value={request.bloodGroup} />
            <DetailRow icon={Droplet} label="Units required" value={`${request.units} units`} />
            <DetailRow icon={FileText} label="Request type" value="Patient request" />
            {request.notes && (
              <DetailRow icon={FileText} label="Additional information" value={request.notes} />
            )}
          </div>
        </Card>

        <Card className="border-info/20 bg-info-bg/30 lg:col-span-5">
          <h2 className="text-base font-bold text-foreground">Quick summary</h2>
          <dl className="mt-4 space-y-3 text-sm">
            <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
              <dt className="text-muted">Distance</dt>
              <dd className="font-semibold text-foreground">
                {request.distanceKm != null ? `${request.distanceKm.toFixed(1)} km away` : '—'}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
              <dt className="text-muted">Requested on</dt>
              <dd className="font-semibold text-foreground">
                {new Date(request.createdAt).toLocaleDateString()}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
              <dt className="text-muted">Expires in</dt>
              <dd className="font-semibold text-critical">{expiresLabel(request.requiredDate)}</dd>
            </div>
            <div className="flex justify-between gap-4 border-b border-border/60 pb-3">
              <dt className="text-muted">Requested by</dt>
              <dd className="font-semibold text-foreground">{request.recipientName}</dd>
            </div>
            <div className="flex items-center justify-between gap-4">
              <dt className="text-muted">Match</dt>
              <dd>
                <StatusBadge label={`${score}% match`} tone="success" icon={<span>✓</span>} />
              </dd>
            </div>
          </dl>
        </Card>
      </div>

      {(accepted || open) && (
        <Card className="border-warning/25 bg-gradient-to-r from-warning-bg/70 via-card to-card">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-warning/15">
                <Shield className="h-5 w-5 text-warning" aria-hidden />
              </span>
              <div>
                <p className="font-bold text-foreground">
                  {accepted ? 'Hospital coordination in progress' : 'Respond when you are ready'}
                </p>
                <p className="mt-1 max-w-xl text-sm text-muted">
                  {accepted
                    ? 'The hospital can see that you accepted. Confirm donation timing directly with the facility.'
                    : 'Accepting notifies the recipient immediately. You can still decline if your plans change.'}
                </p>
              </div>
            </div>
            <img src="/logo.png" alt="" className="hidden h-16 w-16 rounded-2xl object-cover opacity-90 sm:block" />
          </div>
        </Card>
      )}

      <div className="flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:flex-wrap sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={() =>
            toast(`${request.hospital} · ${request.location}`, 'info')
          }
        >
          <Eye className="h-4 w-4" />
          View hospital profile
        </Button>

        <div className="flex flex-wrap gap-3 sm:justify-end">
          {open && (
            <>
              <Button variant="outline" onClick={() => setConfirmDecline(true)} disabled={busy}>
                <Ban className="h-4 w-4" />
                Decline request
              </Button>
              <Button onClick={() => setConfirmAccept(true)} disabled={busy}>
                <Check className="h-4 w-4" />
                Accept donation request
              </Button>
            </>
          )}
          {accepted && (
            <Link to="/donor/history">
              <Button>
                <User className="h-4 w-4" />
                View donation history
              </Button>
            </Link>
          )}
        </div>
      </div>

      <ConfirmationDialog
        open={confirmAccept}
        title="Accept this donation request?"
        message="The recipient will be notified that you accepted. You can still contact the hospital to confirm details."
        confirmLabel="Accept request"
        onCancel={() => setConfirmAccept(false)}
        onConfirm={() => {
          setBusy(true)
          void acceptRequest(request.id)
            .then(() => {
              setConfirmAccept(false)
              toast('Request accepted. The recipient has been notified.', 'success')
              navigate('/donor/history')
            })
            .catch(() => {
              toast('Could not accept this request. Please try again.', 'error')
              setConfirmAccept(false)
            })
            .finally(() => setBusy(false))
        }}
      />
      <ConfirmationDialog
        open={confirmDecline}
        title="Decline this request?"
        message="You will not be matched to this request. Other donors may still help."
        confirmLabel="Decline"
        danger
        onCancel={() => setConfirmDecline(false)}
        onConfirm={() => {
          setBusy(true)
          void declineRequest(request.id)
            .then(() => {
              setConfirmDecline(false)
              toast('You declined this request.', 'info')
              navigate('/donor/requests')
            })
            .catch(() => {
              toast('Could not decline this request. Please try again.', 'error')
              setConfirmDecline(false)
            })
            .finally(() => setBusy(false))
        }}
      />
    </div>
  )
}
