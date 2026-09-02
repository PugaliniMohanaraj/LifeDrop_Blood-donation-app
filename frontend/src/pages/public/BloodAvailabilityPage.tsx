import { useCallback, useEffect, useMemo, useState } from 'react'
import { Droplet } from 'lucide-react'
import { fetchBloodAvailability } from '../../api/bloodBridge'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { PublicPageHeader } from '../../components/public/PublicPageHeader'
import { AvailabilityCard } from '../../components/bloodAvailability/AvailabilityCard'
import { AvailabilityEmptyState } from '../../components/bloodAvailability/AvailabilityEmptyState'
import { AvailabilityError } from '../../components/bloodAvailability/AvailabilityError'
import {
  AvailabilityFilters,
  defaultAvailabilityFilters,
  type AvailabilityFilterState,
} from '../../components/bloodAvailability/AvailabilityFilters'
import { AvailabilityInfoBanner } from '../../components/bloodAvailability/AvailabilityInfoBanner'
import { AvailabilityLoading } from '../../components/bloodAvailability/AvailabilityLoading'
import { resultCountLabel } from '../../components/bloodAvailability/availabilityUtils'
import { DEMO_INVENTORY_DISCLAIMER } from '../../data/bloodAvailabilityConfig'
import type { BloodAvailabilityItem } from '../../types/bloodAvailability'

export function BloodAvailabilityPage() {
  const [draft, setDraft] = useState<AvailabilityFilterState>(defaultAvailabilityFilters)
  const [applied, setApplied] = useState<AvailabilityFilterState>(defaultAvailabilityFilters)
  const [results, setResults] = useState<BloodAvailabilityItem[]>([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [error, setError] = useState(false)

  const load = useCallback(async (filters: AvailabilityFilterState, initial = false) => {
    if (initial) setLoading(true)
    else setSearching(true)
    setError(false)
    try {
      const data = await fetchBloodAvailability({
        province: filters.province || undefined,
        district: filters.district || undefined,
        bloodGroup: filters.bloodGroup,
        component: filters.component,
        availability: filters.availability,
        search: filters.search.trim() || undefined,
      })
      setResults(data)
    } catch {
      setResults([])
      setError(true)
    } finally {
      setLoading(false)
      setSearching(false)
    }
  }, [])

  useEffect(() => {
    void load(applied, true)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setApplied(draft)
    void load(draft)
  }

  const handleClear = () => {
    setDraft(defaultAvailabilityFilters)
    setApplied(defaultAvailabilityFilters)
    void load(defaultAvailabilityFilters)
  }

  const latestUpdate = useMemo(() => {
    if (!results.length) return undefined
    return results.reduce((latest, item) =>
      new Date(item.lastUpdated) > new Date(latest) ? item.lastUpdated : latest,
    results[0].lastUpdated)
  }, [results])

  const countLabel = resultCountLabel(results.length, applied.district, applied.province)

  return (
    <PublicLayout>
      <PublicPageHeader
        eyebrow="Public Service"
        title="Check Blood Availability"
        subtitle="Search verified hospitals and blood banks across Sri Lanka — by province, district, blood group, and component."
        icon={<Droplet className="h-8 w-8" aria-hidden />}
      />

      <section className="container-app space-y-8 py-8 sm:py-10">
        <AvailabilityInfoBanner lastUpdated={latestUpdate} />

        <div className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6">
          <AvailabilityFilters
            filters={draft}
            onChange={setDraft}
            onSearch={handleSearch}
            onClear={handleClear}
            searching={searching}
          />
        </div>

        <p className="text-sm font-medium text-navy" aria-live="polite">
          {loading ? 'Searching blood availability…' : countLabel}
        </p>

        <p className="text-xs text-muted">{DEMO_INVENTORY_DISCLAIMER}</p>

        {loading && <AvailabilityLoading />}

        {!loading && error && (
          <AvailabilityError onRetry={() => void load(applied)} />
        )}

        {!loading && !error && results.length === 0 && (
          <AvailabilityEmptyState onClear={handleClear} />
        )}

        {!loading && !error && results.length > 0 && (
          <div className="grid gap-5 sm:grid-cols-2">
            {results.map((item, i) => (
              <AvailabilityCard key={`${item.organizationId}-${item.bloodGroup}-${item.component}`} item={item} index={i} />
            ))}
          </div>
        )}
      </section>
    </PublicLayout>
  )
}
