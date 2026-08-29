import { useState } from 'react'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../context/ToastContext'
import {
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  Input,
  Modal,
  StatusBadge,
  verificationLabel,
  verificationTone,
} from '../../components/ui'
import type { Organization } from '../../types'

export function AdminVerifyPage() {
  const { organizations, setOrgStatus } = useAppData()
  const { toast } = useToast()
  const [selected, setSelected] = useState<Organization | null>(null)
  const [approveOpen, setApproveOpen] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')

  const pending = organizations.filter((o) => o.status === 'PENDING')

  if (!organizations.length) {
    return (
      <EmptyState
        title="No organizations yet"
        description="Submitted hospital and blood bank applications will appear here."
      />
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Organization Verification</h1>
        <p className="text-sm text-muted">Approve trusted organizations or reject with a clear reason.</p>
      </div>

      {pending.length === 0 && (
        <p className="text-sm text-muted">No pending applications right now.</p>
      )}

      <div className="grid gap-3">
        {organizations.map((o) => (
          <Card key={o.id} className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="font-bold text-navy">{o.name}</p>
              <p className="text-sm text-muted">Type: {o.type === 'HOSPITAL' ? 'Hospital' : 'Blood Bank'}</p>
              <div className="mt-2">
                <StatusBadge
                  label={verificationLabel(o.status)}
                  tone={verificationTone(o.status)}
                  icon={
                    <span>
                      {o.status === 'PENDING' ? '🟡' : o.status === 'APPROVED' ? '🟢' : '🔴'}
                    </span>
                  }
                />
              </div>
            </div>
            <Button
              variant="outline"
              onClick={() => setSelected(o)}
            >
              View Details
            </Button>
          </Card>
        ))}
      </div>

      <Modal
        open={!!selected}
        title={selected?.name || 'Organization'}
        onClose={() => setSelected(null)}
        footer={
          selected?.status === 'PENDING' ? (
            <>
              <Button
                variant="outline"
                onClick={() => {
                  setRejectOpen(true)
                }}
              >
                Reject
              </Button>
              <Button
                onClick={() => {
                  setApproveOpen(true)
                }}
              >
                ✓ Approve
              </Button>
            </>
          ) : undefined
        }
      >
        {selected && (
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Type</dt>
              <dd className="font-medium">{selected.type === 'HOSPITAL' ? 'Hospital' : 'Blood Bank'}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Registration number</dt>
              <dd className="font-medium">{selected.registrationNumber}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Official email</dt>
              <dd className="font-medium">{selected.email}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Phone</dt>
              <dd className="font-medium">{selected.phone}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Address</dt>
              <dd className="font-medium text-right">{selected.address}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Staff ID</dt>
              <dd className="font-medium">{selected.staffId}</dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-muted">Supporting document</dt>
              <dd className="font-medium">{selected.documentName || '—'}</dd>
            </div>
            {selected.rejectionReason && (
              <div className="rounded-xl bg-critical-bg p-3 text-critical">
                <p className="font-semibold">Rejection reason</p>
                <p className="mt-1">{selected.rejectionReason}</p>
              </div>
            )}
          </dl>
        )}
      </Modal>

      <ConfirmationDialog
        open={approveOpen}
        title="Approve this organization?"
        message="They will be able to access hospital or blood bank features after approval."
        confirmLabel="Approve"
        onCancel={() => setApproveOpen(false)}
        onConfirm={() => {
          if (selected) {
            setOrgStatus(selected.id, 'APPROVED')
            toast(`${selected.name} approved.`, 'success')
          }
          setApproveOpen(false)
          setSelected(null)
        }}
      />

      <Modal
        open={rejectOpen}
        title="Reject application"
        onClose={() => {
          setRejectOpen(false)
          setReason('')
          setReasonError('')
        }}
        footer={
          <>
            <Button
              variant="outline"
              onClick={() => {
                setRejectOpen(false)
                setReason('')
                setReasonError('')
              }}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={() => {
                if (!reason.trim()) {
                  setReasonError('Please provide a reason for rejection.')
                  return
                }
                if (selected) {
                  setOrgStatus(selected.id, 'REJECTED', reason.trim())
                  toast('Application rejected. The organization can revise and reapply.', 'warning')
                }
                setRejectOpen(false)
                setSelected(null)
                setReason('')
                setReasonError('')
              }}
            >
              Reject
            </Button>
          </>
        }
      >
        <p className="mb-3 text-sm text-muted">
          Please provide a reason for rejection. This helps the organization understand what went wrong
          and how to fix it.
        </p>
        <Input
          label="Rejection reason"
          required
          value={reason}
          onChange={(e) => {
            setReason(e.target.value)
            if (e.target.value.trim()) setReasonError('')
          }}
          error={reasonError}
          placeholder="e.g. Registration document is unclear or expired."
        />
      </Modal>
    </div>
  )
}
