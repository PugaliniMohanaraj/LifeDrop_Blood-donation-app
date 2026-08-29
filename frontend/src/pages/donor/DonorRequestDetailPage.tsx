import { useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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

export function DonorRequestDetailPage() {
  const { id } = useParams()
  const { requests, acceptRequest, declineRequest } = useAppData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [confirmAccept, setConfirmAccept] = useState(false)
  const [confirmDecline, setConfirmDecline] = useState(false)

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

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link
        to="/donor/requests"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to requests
      </Link>
      <Card>
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
          {request.urgency !== 'NORMAL' && (
            <StatusBadge
              label={request.urgency === 'EMERGENCY' ? 'Emergency' : 'Urgent'}
              tone="critical"
              icon={<span>🚨</span>}
            />
          )}
        </div>
        <h1 className="mt-4 text-2xl font-extrabold text-navy">
          {request.bloodGroup} · {request.units} Units
        </h1>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Hospital</dt>
            <dd className="font-medium text-navy">{request.hospital}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Location</dt>
            <dd className="font-medium text-navy">{request.location}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Required date</dt>
            <dd className="font-medium text-navy">{request.requiredDate}</dd>
          </div>
          {request.distanceKm != null && (
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Distance</dt>
              <dd className="font-medium text-navy">{request.distanceKm} km</dd>
            </div>
          )}
          {request.notes && (
            <div>
              <dt className="text-muted">Additional information</dt>
              <dd className="mt-1 text-navy">{request.notes}</dd>
            </div>
          )}
        </dl>

        {request.status !== 'CANCELLED' && request.status !== 'COMPLETED' && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setConfirmAccept(true)}>Accept Donation Request</Button>
            <Button variant="outline" onClick={() => setConfirmDecline(true)}>
              Decline
            </Button>
          </div>
        )}
      </Card>

      <ConfirmationDialog
        open={confirmAccept}
        title="Accept this donation request?"
        message="The recipient will be notified that you accepted. You can still contact the hospital to confirm details."
        confirmLabel="Accept Request"
        onCancel={() => setConfirmAccept(false)}
        onConfirm={() => {
          void acceptRequest(request.id)
            .then(() => {
              setConfirmAccept(false)
              toast('Request Accepted. The recipient has been notified.', 'success')
              navigate('/donor/history')
            })
            .catch(() => {
              toast('Could not accept this request. Please try again.', 'error')
              setConfirmAccept(false)
            })
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
        }}
      />
    </div>
  )
}
