import { Card } from '../../components/ui'

export function AdminSettingsPage() {
  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-extrabold text-navy">Settings</h1>
      <Card>
        <p className="text-sm text-muted">
          Platform settings will appear here. For this HCI prototype, core flows are prioritized
          over advanced configuration.
        </p>
      </Card>
    </div>
  )
}
