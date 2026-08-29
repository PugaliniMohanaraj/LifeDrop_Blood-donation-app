import { Link } from 'react-router-dom'
import { Droplet } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { Button, Card, StatusBadge, requestStatusMeta } from '../../components/ui'

export function RecipientDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const mine = requests.filter(
    (r) =>
      r.recipientId === user?.id ||
      r.recipientName === user?.fullName ||
      user?.email === 'recipient@bloodbridge.com',
  )
  const active = mine.filter((r) => r.status !== 'CANCELLED' && r.status !== 'COMPLETED')

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Hello, {user?.fullName?.split(' ')[0]}</h1>
        <p className="text-sm text-muted">Request blood quickly and track every step.</p>
      </div>

      <Card className="border-brand/20 bg-gradient-to-br from-white to-critical-bg/40">
        <h2 className="text-xl font-extrabold text-navy">Need Blood?</h2>
        <p className="mt-1 text-sm text-muted">Create a request and find suitable donors.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          <Link to="/recipient/request">
            <Button size="lg">
              <Droplet className="h-4 w-4" /> Request Blood
            </Button>
          </Link>
          <Link to="/recipient/requests">
            <Button variant="outline" size="lg">
              View Active Requests
            </Button>
          </Link>
        </div>
      </Card>

      <section>
        <h2 className="mb-3 text-lg font-bold text-navy">Active requests</h2>
        {active.length === 0 ? (
          <p className="text-sm text-muted">You have no active requests yet.</p>
        ) : (
          <div className="grid gap-4">
            {active.map((r) => {
              const meta = requestStatusMeta(r.status)
              return (
                <Card key={r.id} as="article">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="font-bold text-navy">
                        {r.bloodGroup} · {r.units} Units
                      </p>
                      <div className="mt-2">
                        <StatusBadge
                          label={meta.label}
                          tone={meta.tone}
                          icon={<span>{meta.icon}</span>}
                        />
                      </div>
                      <p className="mt-2 text-sm text-muted">
                        {r.matchCount} potential donors found
                      </p>
                    </div>
                    <Link
                      to="/recipient/matches"
                      className="text-sm font-semibold text-brand hover:underline"
                    >
                      View Matches
                    </Link>
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </section>
    </div>
  )
}
