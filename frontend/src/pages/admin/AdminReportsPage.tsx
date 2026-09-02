import { BarChart3, Heart, Users } from 'lucide-react'
import { IconPageHeader, MetricCard, PageContainer } from '../../components/PageChrome'

export function AdminReportsPage() {
  return (
    <PageContainer>
      <IconPageHeader
        icon={BarChart3}
        title="Reports"
        subtitle="Platform-wide activity summary for planning and oversight."
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <MetricCard
          label="Active donors"
          value={128}
          icon={<Users className="h-5 w-5 text-brand" />}
          iconClass="bg-critical-bg"
        />
        <MetricCard
          label="Requests this month"
          value={64}
          icon={<Heart className="h-5 w-5 text-success" />}
          iconClass="bg-success-bg"
        />
      </div>
    </PageContainer>
  )
}
