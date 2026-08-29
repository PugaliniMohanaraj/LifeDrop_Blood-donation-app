import { useState } from 'react'
import { Link } from 'react-router-dom'
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

export function RecipientRequestsPage() {
  const { user } = useAuth()
  const { requests, cancelRequest } = useAppData()
  const { toast } = useToast()
  const [cancelId, setCancelId] = useState<string | null>(null)

  const mine = requests.filter(
    (r) =>
      r.recipientId === user?.id ||
      r.recipientName === user?.fullName ||
      user?.email === 'recipient@bloodbridge.com',
  )

  if (!mine.length) {
    return (
      <EmptyState
        title="No requests yet"
        description="Create a blood request to start finding donors."
        actionLabel="Request Blood"
        onAction={() => {
          window.location.href = '/recipient/request'
        }}
      />
    )
  }

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-extrabold text-navy">My Requests</h1>
          <p className="text-sm text-muted">Track status or cancel if you no longer need help.</p>
        </div>
        <Link to="/recipient/request">
          <Button>Request Blood</Button>
        </Link>
      </div>
      {mine.map((r) => {
        const meta = requestStatusMeta(r.status)
        return (
          <Card key={r.id}>
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-navy">
                  {r.bloodGroup} · {r.units} Units
                </p>
                <p className="text-sm text-muted">{r.hospital}</p>
                <div className="mt-2">
                  <StatusBadge label={meta.label} tone={meta.tone} icon={<span>{meta.icon}</span>} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {r.status !== 'CANCELLED' && r.status !== 'COMPLETED' && (
                  <>
                    <Link to="/recipient/matches">
                      <Button size="sm" variant="outline">
                        View Matches
                      </Button>
                    </Link>
                    <Button size="sm" variant="danger" onClick={() => setCancelId(r.id)}>
                      Cancel Request
                    </Button>
                  </>
                )}
              </div>
            </div>
          </Card>
        )
      })}

      <ConfirmationDialog
        open={!!cancelId}
        title="Cancel this blood request?"
        message="Donors will stop receiving updates for this request. You can create a new request later."
        confirmLabel="Cancel Request"
        cancelLabel="Keep Request"
        danger
        onCancel={() => setCancelId(null)}
        onConfirm={() => {
          if (cancelId) cancelRequest(cancelId)
          setCancelId(null)
          toast('Blood request cancelled.', 'info')
        }}
      />
    </div>
  )
}
