import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Building2 } from 'lucide-react'
import { fetchOrganization } from '../../api/bloodBridge'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../context/ToastContext'
import {
  Button,
  Card,
  ConfirmationDialog,
  EmptyState,
  Input,
  LoadingSpinner,
  Modal,
  StatusBadge,
  verificationLabel,
  verificationTone,
} from '../../components/ui'
import { IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'
import type { Organization } from '../../types'

export function AdminVerifyDetailPage() {
  const { id } = useParams()
  const { organizations, setOrgStatus } = useAppData()
  const { toast } = useToast()
  const navigate = useNavigate()
  const [org, setOrg] = useState<Organization | null>(
    () => organizations.find((o) => o.id === id) || null,
  )
  const [loading, setLoading] = useState(!org)

  const [confirmApprove, setConfirmApprove] = useState(false)
  const [rejectOpen, setRejectOpen] = useState(false)
  const [reason, setReason] = useState('')
  const [reasonError, setReasonError] = useState('')

  useEffect(() => {
    const cached = organizations.find((o) => o.id === id)
    if (cached) {
      setOrg(cached)
      setLoading(false)
      return
    }
    if (!id) return
    setLoading(true)
    void fetchOrganization(id)
      .then(setOrg)
      .catch(() => setOrg(null))
      .finally(() => setLoading(false))
  }, [id, organizations])

  if (loading) {
    return (
      <PageContainer>
        <LoadingSpinner label="Loading application…" />
      </PageContainer>
    )
  }

  if (!org) {
    return (
      <PageContainer>
        <EmptyState
          title="Application not found"
          description="This organization application may already be processed."
          actionLabel="Back to list"
          onAction={() => navigate('/admin/verify')}
        />
      </PageContainer>
    )
  }

  const onReject = (e: FormEvent) => {
    e.preventDefault()
    if (!reason.trim()) {
      setReasonError('Please provide a reason for rejection.')
      return
    }
    void setOrgStatus(org.id, 'REJECTED', reason.trim())
      .then(() => {
        setRejectOpen(false)
        toast('Organization rejected. They can correct and re-apply.', 'warning')
        navigate('/admin/verify')
      })
      .catch(() => toast('Could not reject this application. Please try again.', 'error'))
  }

  return (
    <PageContainer className="max-w-2xl">
      <Link
        to="/admin/verify"
        className="inline-flex items-center gap-1 text-sm font-medium text-muted hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to verifications
      </Link>

      <IconPageHeader
        icon={Building2}
        title={org.name}
        subtitle="Review organization details before approving or rejecting."
      />

      <ListCard className="p-5 sm:p-6">
        <StatusBadge
          label={verificationLabel(org.status)}
          tone={verificationTone(org.status)}
          icon={<span>{org.status === 'PENDING' ? '🟡' : org.status === 'APPROVED' ? '✓' : '✕'}</span>}
        />
        <dl className="mt-4 space-y-3 text-sm">
          {[
            ['Type', org.type === 'HOSPITAL' ? 'Hospital' : 'Blood Bank'],
            ['Registration number', org.registrationNumber],
            ['Official email', org.email],
            ['Phone', org.phone],
            ['Address', org.address],
            ['Staff ID', org.staffId],
            ['Supporting document', org.documentName || 'Attached'],
          ].map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4 border-b border-border pb-2 last:border-0">
              <dt className="text-muted">{label}</dt>
              <dd className="font-medium text-right text-foreground">{value}</dd>
            </div>
          ))}
        </dl>

        {org.status === 'PENDING' && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button onClick={() => setConfirmApprove(true)}>✓ Approve</Button>
            <Button variant="danger" onClick={() => setRejectOpen(true)}>
              Reject
            </Button>
          </div>
        )}
      </ListCard>

      <ConfirmationDialog
        open={confirmApprove}
        title="Approve this organization?"
        message={`${org.name} will gain access to ${org.type === 'HOSPITAL' ? 'hospital' : 'blood bank'} features.`}
        confirmLabel="Approve"
        onCancel={() => setConfirmApprove(false)}
        onConfirm={() => {
          void setOrgStatus(org.id, 'APPROVED')
            .then(() => {
              setConfirmApprove(false)
              toast('Organization approved. Staff can now log in.', 'success')
              navigate('/admin/verify')
            })
            .catch(() => {
              toast('Could not approve this organization. Please try again.', 'error')
              setConfirmApprove(false)
            })
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
    </PageContainer>
  )
}
