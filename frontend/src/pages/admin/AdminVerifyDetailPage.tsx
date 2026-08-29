import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
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

export function AdminVerifyDetailPage() {
  const { id } = useParams()
  const { organizations, setOrgStatus } = useAppData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const org = organizations.find((o) => o.id === id)

  const [confirmApprove, setConfirmApprove] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')

  if (!org) {
    return (
      <EmptyState
        title="Application not found"
        description="This organization application may already be processed."
        actionLabel="Back to list"
        onAction={() => navigate('/admin/verify')}
      />
    )
  }

  const onReject = (e: FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setReasonError('Please provide a reason for rejection.')
      return
    }
    setOrgStatus(org.id, 'REJECTED', reason.trim())
    setRejectOpen(false)
    toast('Organization rejected. They can correct and re-apply.', 'warning')
    navigate('/admin/verify')
  }

  return (
    <div className="mx-auto max-w-xl space-y-4">
      <Link
        to="/admin/verify"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-navy"
      >
        <ArrowLeft className="h-4 w-4" /> Back to verifications
      </Link>
      <Card>
        <StatusBadge
          label={verificationLabel(org.status)}
          tone={verificationTone(org.status)}
          icon={<span>{org.status === 'PENDING' ? '🟡' : org.status === 'APPROVED' ? '✓' : '✕'}</span>}
        />
        <h1 className="mt-3 text-2xl font-extrabold text-navy">{org.name}</h1>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Type</dt>
            <dd className="font-medium">{org.type === 'HOSPITAL' ? 'Hospital' : 'Blood Bank'}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Registration number</dt>
            <dd className="font-medium">{org.registrationNumber}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Official email</dt>
            <dd className="font-medium">{org.email}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Phone</dt>
            <dd className="font-medium">{org.phone}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Address</dt>
            <dd className="font-medium text-right">{org.address}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Staff ID</dt>
            <dd className="font-medium">{org.staffId}</dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted">Supporting document</dt>
            <dd className="font-medium">{org.documentName || 'Attached'}</dd>
          </div>
        </dl>

        {org.status === 'PENDING' && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setConfirmApprove(true)}>✓ Approve</Button>
            <Button variant="danger" onClick={() => setRejectOpen(true)}>
              Reject
            </Button>
          </div>
        )}
      </Card>

      <ConfirmationDialog
        open={confirmApprove}
        title="Approve this organization?"
        message={`${org.name} will gain access to ${org.type === 'HOSPITAL' ? 'hospital' : 'blood bank'} features.`}
        confirmLabel="Approve"
        onCancel={() => setConfirmApprove(false)}
        onConfirm={() => {
          setOrgStatus(org.id, 'APPROVED')
          setConfirmApprove(false)
          toast('Organization approved. Verification status updated.', 'success')
          navigate('/admin/verify')
        }}
      />

      <Modal
        open={rejectOpen}
        title="Reject application"
        onClose={() => setRejectOpen(false)}
        footer={
          <>
            <Button variant="outline" onClick={() => setRejectOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" form="reject-form" type="submit">
              Reject
            </Button>
          </>
        }
      >
        <form id="reject-form" onSubmit={onReject} className="space-y-3">
          <p className="text-sm text-muted">
            Please provide a reason for rejection. This helps the organization fix the problem and
            re-apply.
          </p>
          <Input
            label="Reason"
            required
            value={reason}
            onChange={(e) => {
              setReason(e.target.value)
              setReasonError('')
            }}
            error={reasonError}
            placeholder="e.g. Registration number could not be verified"
          />
        </form>
      </Modal>
    </div>
  )
}
