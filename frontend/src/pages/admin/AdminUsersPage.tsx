import { Card } from '../../components/ui'

export function AdminUsersPage() {
  const users = [
    { name: 'Arun Kumar', role: 'Donor', email: 'donor@bloodbridge.com' },
    { name: 'Nisha Perera', role: 'Recipient', email: 'recipient@bloodbridge.com' },
    { name: 'Dr. Siva Rajan', role: 'Hospital', email: 'hospital@bloodbridge.com' },
    { name: 'Meena Fernando', role: 'Blood Bank', email: 'bloodbank@bloodbridge.com' },
  ]
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Users</h1>
      <p className="text-sm text-muted">Overview of accounts on the platform.</p>
      {users.map((u) => (
        <Card key={u.email} className="flex justify-between gap-3">
          <div>
            <p className="font-semibold text-navy">{u.name}</p>
            <p className="text-sm text-muted">{u.email}</p>
          </div>
          <p className="text-sm font-medium text-muted">{u.role}</p>
        </Card>
      ))}
    </div>
  )
}
