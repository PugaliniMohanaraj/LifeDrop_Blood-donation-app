import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ClipboardList, Droplet } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../context/ToastContext'
import {
  Button,
  ConfirmationDialog,
  EmptyState,
  StatusBadge,
  requestStatusMeta,
} from '../../components/ui'
import { GradientBanner, IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'

export function RecipientRequestsPage() {
  const { user } = useAuth()
  const { requests, cancelRequest } = useAppData()
  const { toast } = useToast()
  const [cancelId, setCancelId] = useState<string | null>(null)

  const mine = requests.filter((r) => r.recipientId === user?.id)

  if (!mine.length) {
    return (
      <PageContainer>
        <IconPageHeader
          icon={ClipboardList}
          title="My Requests"
          subtitle="Track status or cancel if you no longer need help."
        />
        <EmptyState
          title="No requests yet"
          description="Create a blood request to start finding donors."
          actionLabel="Request Blood"
          onAction={() => {
            window.location.href = '/recipient/request'
          }}
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <IconPageHeader
        icon={ClipboardList}
        title="My Requests"
        subtitle="Track status or cancel if you no longer need help."
        action={
          <Link to="/recipient/request">
            <Button>
              <Droplet className="h-4 w-4" /> Request Blood
            </Button>
          </Link>
        }
      />

      <div className="space-y-4">
        {mine.map((r) => {
          const meta = requestStatusMeta(r.status)
          return (
            <ListCard key={r.id} className="p-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-bold text-foreground">
                    {r.bloodGroup} · {r.units} Units
                  </p>
                  <p className="text-sm text-muted">{r.hospital}</p>
                  <p className="text-sm text-muted">{r.location}</p>
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
            </ListCard>
          )
        })}
      </div>

      <GradientBanner
        title="Need another request?"
        description="Create a new blood request if your situation changes."
        icon={<Droplet className="h-5 w-5 text-brand" />}
      >
        <Link to="/recipient/request">
          <Button variant="outline">New Request</Button>
        </Link>
      </GradientBanner>

      <ConfirmationDialog
        open={!!cancelId}
        title="Cancel this blood request?"
        message="Donors will stop receiving updates for this request. You can create a new request later."
        confirmLabel="Cancel Request"
        cancelLabel="Keep Request"
        danger
        onCancel={() => setCancelId(null)}
        onConfirm={() => {
          if (!cancelId) return
          void cancelRequest(cancelId)
            .then(() => {
              setCancelId(null)
              toast('Blood request cancelled.', 'info')
            })
            .catch(() => {
              toast('Could not cancel the request. Please try again.', 'error')
              setCancelId(null)
            })
        }}
      />
    </PageContainer>
  )
}
