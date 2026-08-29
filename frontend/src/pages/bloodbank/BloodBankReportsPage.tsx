import { Card } from '../../components/ui'

export function BloodBankReportsPage() {
  return (
    <div className="mx-auto w-full max-w-none space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Reports</h1>
      <p className="text-sm text-muted">A simple summary for weekly planning.</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <p className="text-xs uppercase text-muted">Donations this week</p>
          <p className="mt-2 text-3xl font-extrabold text-navy">47</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Units issued</p>
          <p className="mt-2 text-3xl font-extrabold text-navy">39</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Emergency fills</p>
          <p className="mt-2 text-3xl font-extrabold text-critical">6</p>
        </Card>
        <Card>
          <p className="text-xs uppercase text-muted">Critical groups</p>
          <p className="mt-2 text-3xl font-extrabold text-warning">2</p>
        </Card>
      </div>
    </div>
  )
}
