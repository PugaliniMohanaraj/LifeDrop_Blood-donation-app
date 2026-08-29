import { Link } from 'react-router-dom'
import { Droplet } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { Button, Card, StatusBadge, requestStatusMeta } from '../../components/ui'
import { HeroPanel, PageHeader } from '../../components/PageChrome'

export function RecipientDashboard() {
  const { user } = useAuth()
  const { requests } = useAppData()
  const mine = requests.filter((r) => r.recipientId === user?.id)
  const active = mine.filter((r) => r.status !== 'CANCELLED' && r.status !== 'COMPLETED')

  return (
    <div className="mx-auto w-full max-w-none space-y-6">
      <PageHeader
        title={`Hello, ${user?.fullName?.split(' ')[0] || ''}`}
        subtitle="Request blood quickly and track every LifeDrop step."
      />

      <HeroPanel
        title="Need Blood?"
        subtitle="Create a request and find suitable donors nearby."
      >
        <Link to="/recipient/request">
          <Button className="bg-white text-brand hover:bg-slate-100 shadow-none">
            <Droplet className="h-4 w-4" /> Request Blood
          </Button>
        </Link>
        <Link to="/recipient/requests">
          <Button variant="outline" className="border-white text-white hover:bg-white/10">
            View Active Requests
          </Button>
        </Link>
      </HeroPanel>

      <section>
        <h2 className="mb-3 text-lg font-bold text-navy">Active requests</h2>
        {active.length === 0 ? (
          <Card>
            <p className="text-sm text-muted">You have no active requests yet.</p>
          </Card>
        ) : (
          <div className="grid gap-4">
            {active.map((r) => {
              const meta = requestStatusMeta(r.status)
              return (
                <Card key={r.id} as="article" className="transition hover:shadow-md">
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
