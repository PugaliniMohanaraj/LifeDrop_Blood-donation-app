import { Users } from 'lucide-react'
import { StatusBadge } from '../../components/ui'
import { IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'

export function AdminUsersPage() {
  const users = [
    { name: 'Arun Kumar', role: 'Donor', email: 'donor@bloodbridge.com' },
    { name: 'Nisha Perera', role: 'Recipient', email: 'recipient@bloodbridge.com' },
    { name: 'Dr. Siva Rajan', role: 'Hospital', email: 'hospital@bloodbridge.com' },
    { name: 'Meena Fernando', role: 'Blood Bank', email: 'bloodbank@bloodbridge.com' },
  ]

  return (
    <PageContainer>
      <IconPageHeader
        icon={Users}
        title="Users"
        subtitle="Overview of accounts on the LifeDrop platform."
      />

      <div className="space-y-4">
        {users.map((u) => (
          <ListCard key={u.email} className="flex justify-between gap-3 p-5">
            <div>
              <p className="font-semibold text-foreground">{u.name}</p>
              <p className="text-sm text-muted">{u.email}</p>
            </div>
            <StatusBadge label={u.role} tone="neutral" />
          </ListCard>
        ))}
      </div>
    </PageContainer>
  )
}
