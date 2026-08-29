import { Card } from '../../components/ui'

export function AdminReportsPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Reports</h1>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs uppercase text-muted">Active donors</p>
          <p className="mt-2 text-3xl font-extrabold">128</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Requests this month</p>
          <p className="mt-2 text-3xl font-extrabold">64</p>
        </Card>
      </div>
    </div>
  )
}
