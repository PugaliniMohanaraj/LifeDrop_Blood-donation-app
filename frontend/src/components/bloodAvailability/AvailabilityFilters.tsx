import { Search } from 'lucide-react'
import {
  AVAILABILITY_FILTERS,
  BLOOD_COMPONENTS,
  DEFAULT_BLOOD_GROUP,
  DEFAULT_COMPONENT,
  type AvailabilityStatus,
} from '../../data/bloodAvailabilityConfig'
import { SRI_LANKA_PROVINCES, districtsForProvince } from '../../data/sriLankaLocations'
import { BLOOD_GROUPS } from '../../types'
import { Button, Select } from '../ui'
import { availabilityIcon, availabilityLabel } from './availabilityUtils'

export type AvailabilityFilterState = {
  province: string
  district: string
  component: string
  bloodGroup: string
  availability: string
  search: string
}

export const defaultAvailabilityFilters: AvailabilityFilterState = {
  province: '',
  district: '',
  component: DEFAULT_COMPONENT,
  bloodGroup: DEFAULT_BLOOD_GROUP,
  availability: 'ALL',
  search: '',
}

interface AvailabilityFiltersProps {
  filters: AvailabilityFilterState
  onChange: (next: AvailabilityFilterState) => void
  onSearch: () => void
  onClear: () => void
  searching?: boolean
}

export function AvailabilityFilters({
  filters,
  onChange,
  onSearch,
  onClear,
  searching,
}: AvailabilityFiltersProps) {
  const districts = districtsForProvince(filters.province)

  const set = (patch: Partial<AvailabilityFilterState>) =>
    onChange({ ...filters, ...patch })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-[1fr_1fr_1fr_1fr_auto] xl:items-end">
        <Select
          label="Select Province"
          name="province"
          value={filters.province}
          placeholder="All provinces"
          options={SRI_LANKA_PROVINCES.map((p) => ({ value: p, label: p }))}
          onChange={(e) => set({ province: e.target.value, district: '' })}
        />
        <Select
          label="Select District"
          name="district"
          value={filters.district}
          placeholder={filters.province ? 'All districts' : 'Select province first'}
          options={districts.map((d) => ({ value: d, label: d }))}
          disabled={!filters.province}
          onChange={(e) => set({ district: e.target.value })}
        />
        <Select
          label="Blood Component"
          name="component"
          value={filters.component}
          placeholder="Whole Blood"
          options={BLOOD_COMPONENTS.map((c) => ({ value: c.value, label: c.label }))}
          onChange={(e) => set({ component: e.target.value })}
        />
        <Select
          label="Blood Group"
          name="bloodGroup"
          value={filters.bloodGroup}
          options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
          onChange={(e) => set({ bloodGroup: e.target.value })}
        />
        <Button
          className="w-full xl:w-auto xl:min-w-[8.5rem]"
          size="lg"
          loading={searching}
          onClick={onSearch}
        >
          <Search className="h-4 w-4" aria-hidden />
          Search
        </Button>
      </div>

      <div>
        <label htmlFor="hospital-search" className="mb-1.5 block text-sm font-medium text-foreground">
          Search Hospital or Blood Bank
        </label>
        <div className="relative">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            id="hospital-search"
            type="search"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value.slice(0, 120) })}
            placeholder="Search hospital or blood bank…"
            className="w-full rounded-2xl border border-border bg-card py-3 pl-11 pr-4 text-foreground transition focus:border-brand focus:ring-2 focus:ring-brand/20"
            aria-describedby="hospital-search-hint"
          />
        </div>
        <p id="hospital-search-hint" className="mt-1.5 text-xs text-muted">
          Filter results by organization name, then press Search.
        </p>
      </div>

      <fieldset>
        <legend className="mb-2 text-sm font-medium text-foreground">Availability</legend>
        <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {AVAILABILITY_FILTERS.map((f) => {
            const active = filters.availability === f.value
            const status = f.value as AvailabilityStatus | 'ALL'
            const showIcon = status !== 'ALL'
            return (
              <button
                key={f.value}
                type="button"
                aria-pressed={active}
                onClick={() => set({ availability: f.value })}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  active
                    ? 'border-brand bg-brand text-white shadow-sm shadow-brand/20'
                    : 'border-border bg-card text-muted hover:border-brand/40 hover:text-brand'
                }`}
              >
                {showIcon && (
                  <span aria-hidden>{availabilityIcon(status as AvailabilityStatus)}</span>
                )}
                {f.label}
                {showIcon && (
                  <span className="sr-only">({availabilityLabel(status as AvailabilityStatus)})</span>
                )}
              </button>
            )
          })}
        </div>
      </fieldset>

      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onClear}>
          Clear Filters
        </Button>
      </div>
    </div>
  )
}
