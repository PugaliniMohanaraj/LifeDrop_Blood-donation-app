import { AlertTriangle, BarChart3, Droplet, Heart } from 'lucide-react'
import { MetricCard, IconPageHeader, PageContainer } from '../../components/PageChrome'

export function BloodBankReportsPage() {
  return (
    <PageContainer>
      <IconPageHeader
        icon={BarChart3}
        title="Reports"
        subtitle="A simple summary for weekly planning and compliance."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Donations this week"
          value={47}
          icon={<Heart className="h-5 w-5 text-success" />}
          iconClass="bg-success-bg"
        />
        <MetricCard
          label="Units issued"
          value={39}
          icon={<Droplet className="h-5 w-5 text-brand" fill="currentColor" />}
          iconClass="bg-critical-bg"
        />
        <MetricCard
          label="Emergency fills"
          value={6}
          icon={<AlertTriangle className="h-5 w-5 text-critical" />}
          iconClass="bg-critical-bg"
        />
        <MetricCard
          label="Critical groups"
          value={2}
          icon={<BarChart3 className="h-5 w-5 text-warning" />}
          iconClass="bg-warning-bg"
        />
      </div>
    </PageContainer>
  )
}
