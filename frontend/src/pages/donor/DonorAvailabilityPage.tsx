import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Button, Card, StatusBadge } from '../../components/ui'
import type { AvailabilityStatus } from '../../types'

export function DonorAvailabilityPage() {
  const { user, updateAvailability } = useAuth()
  const { toast } = useToast()
  const [status, setStatus] = useState<AvailabilityStatus>(user?.availability || 'AVAILABLE')

  const save = () => {
    updateAvailability(status)
    toast('Availability updated.', 'success')
  }

  const options: { value: AvailabilityStatus; label: string; hint: string; icon: string }[] = [
    { value: 'AVAILABLE', label: 'Available', hint: 'You can receive blood requests.', icon: '🟢' },
    { value: 'BUSY', label: 'Busy', hint: 'Temporarily not taking new requests.', icon: '🟡' },
    { value: 'UNAVAILABLE', label: 'Unavailable', hint: 'Hide you from matching for now.', icon: '⚪' },
  ]

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Availability</h1>
        <p className="text-sm text-muted">Change when donors can contact you. You can update this anytime.</p>
      </div>
      <Card>
        <p className="mb-3 text-sm font-medium text-navy">Current status</p>
        <StatusBadge
          label={status === 'AVAILABLE' ? 'Available' : status === 'BUSY' ? 'Busy' : 'Unavailable'}
          tone={status === 'AVAILABLE' ? 'success' : status === 'BUSY' ? 'warning' : 'neutral'}
        />
        <fieldset className="mt-6 space-y-3">
          <legend className="sr-only">Choose availability</legend>
          {options.map((o) => (
            <label
              key={o.value}
              className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${
                status === o.value ? 'border-brand bg-critical-bg/30' : 'border-border'
              }`}
            >
              <input
                type="radio"
                name="availability"
                value={o.value}
                checked={status === o.value}
                onChange={() => setStatus(o.value)}
                className="mt-1"
              />
              <span>
                <span className="font-semibold text-navy">
                  {o.icon} {o.label}
                </span>
                <span className="mt-0.5 block text-sm text-muted">{o.hint}</span>
              </span>
            </label>
          ))}
        </fieldset>
        <div className="mt-6 flex gap-3">
          <Button onClick={save}>Update Availability</Button>
          <Link to="/donor">
            <Button variant="outline">Cancel</Button>
          </Link>
        </div>
      </Card>
    </div>
  )
}
