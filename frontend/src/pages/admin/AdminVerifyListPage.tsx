import { Link } from 'react-router-dom'
import { ShieldCheck } from 'lucide-react'
import { useAppData } from '../../context/AppDataContext'
import { Button, EmptyState, StatusBadge, verificationLabel, verificationTone } from '../../components/ui'
import { IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'

export function AdminVerifyListPage() {
  const { organizations } = useAppData()
  const pending = organizations.filter((o) => o.status === 'PENDING')

  if (!pending.length) {
    return (
      <PageContainer>
        <IconPageHeader
          icon={ShieldCheck}
          title="Organization Verification"
          subtitle="Review each application before granting access."
        />
        <EmptyState
          title="No pending organizations"
          description="New hospital and blood bank applications will appear here."
        />
      </PageContainer>
    )
  }

  return (
    <PageContainer>
      <IconPageHeader
        icon={ShieldCheck}
        title="Organization Verification"
        subtitle="Review each application before granting access."
      />

      <div className="space-y-4">
        {pending.map((o) => (
          <ListCard key={o.id} className="flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <p className="font-bold text-foreground">{o.name}</p>
              <p className="text-sm text-muted">
                Type: {o.type === 'HOSPITAL' ? 'Hospital' : 'Blood Bank'}
              </p>
              <div className="mt-2">
                <StatusBadge
                  label={verificationLabel(o.status)}
                  tone={verificationTone(o.status)}
                  icon={<span>🟡</span>}
                />
              </div>
            </div>
            <Link to={`/admin/verify/${o.id}`}>
              <Button size="sm" variant="outline">
                View Details
              </Button>
            </Link>
          </ListCard>
        ))}
      </div>
    </PageContainer>
  )
}
