import { useMemo, useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useAppData } from '../../context/AppDataContext'
import { useToast } from '../../context/ToastContext'
import {
  Button,
  Card,
  ConfirmationDialog,
  Input,
  ProgressIndicator,
  Select,
  StatusBadge,
} from '../../components/ui'
import { BLOOD_GROUPS, type RequestUrgency } from '../../types'

const STEPS = [
  { id: 'details', label: 'Blood Details' },
  { id: 'location', label: 'Location' },
  { id: 'urgency', label: 'Urgency' },
  { id: 'confirm', label: 'Confirm' },
]

export function BloodRequestPage() {
  const [params] = useSearchParams()
  const initialUrgency = (params.get('urgency') as RequestUrgency) || 'NORMAL'
  const { user } = useAuth()
  const { addRequest } = useAppData()
  const { toast } = useToast()

  const [step, setStep] = useState(0)
  const [bloodGroup, setBloodGroup] = useState('')
  const [units, setUnits] = useState('1')
  const [hospital, setHospital] = useState('')
  const [location, setLocation] = useState(user?.location || '')
  const [requiredDate, setRequiredDate] = useState('')
  const [urgency, setUrgency] = useState<RequestUrgency>(
    ['NORMAL', 'URGENT', 'EMERGENCY'].includes(initialUrgency) ? initialUrgency : 'NORMAL',
  )
  const [notes, setNotes] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [confirmEmergency, setConfirmEmergency] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  const bloodOptions = useMemo(() => BLOOD_GROUPS.map((g) => ({ value: g, label: g })), [])

  const validateStep = () => {
    const e: Record<string, string> = {}
    if (step === 0) {
      if (!bloodGroup) e.bloodGroup = 'Please select a blood group.'
      const n = Number(units)
      if (!units || Number.isNaN(n) || n < 1) e.units = 'Please request at least 1 unit.'
      if (n > 20) e.units = 'Please enter a realistic number of units (max 20).'
    }
    if (step === 1) {
      if (!hospital.trim()) e.hospital = 'Please enter the hospital or facility name.'
      if (!location.trim()) e.location = 'Please enter the location.'
      if (!requiredDate) e.requiredDate = 'Please select the required date.'
    }
    if (step === 2) {
      if (!urgency) e.urgency = 'Please select urgency.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const next = () => {
    if (!validateStep()) return
    setStep((s) => Math.min(s + 1, STEPS.length - 1))
  }

  const back = () => setStep((s) => Math.max(s - 1, 0))

  const doSubmit = () => {
    if (!user) return
    setLoading(true)
    void addRequest({
      bloodGroup: bloodGroup as (typeof BLOOD_GROUPS)[number],
      units: Number(units),
      hospital,
      location,
      requiredDate,
      urgency,
      notes: notes || undefined,
    })
      .then(() => {
        setSubmitted(true)
        toast('Blood request created. Finding suitable donors…', 'success')
      })
      .catch(() => {
        toast('Could not create the blood request. Please try again.', 'error')
      })
      .finally(() => setLoading(false))
  }

  const onFinalSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (urgency === 'EMERGENCY') {
      setConfirmEmergency(true)
      return
    }
    doSubmit()
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-lg">
        <Card className="space-y-3 text-center">
          <p className="text-success font-semibold">✓ Request Created</p>
          <p className="text-navy font-semibold">✓ Searching for Donors</p>
          <StatusBadge label="Matching in Progress" tone="info" icon={<span>🔄</span>} />
          <p className="text-sm text-muted">
            We are finding suitable available donors for {bloodGroup}.
          </p>
          <div className="flex justify-center gap-3 pt-2">
            <Link to="/recipient/matches">
              <Button>View Matches</Button>
            </Link>
            <Link to="/recipient">
              <Button variant="outline">Back to Dashboard</Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">
          {urgency === 'EMERGENCY' ? '🚨 Emergency Blood Request' : 'Request Blood'}
        </h1>
        <p className="text-sm text-muted">
          Complete each step. You can go back or cancel anytime before confirming.
        </p>
      </div>

      <ProgressIndicator steps={STEPS} current={step} />

      <Card>
        {step === 0 && (
          <div className="space-y-4">
            <Select
              label="Blood Group"
              required
              value={bloodGroup}
              onChange={(e) => setBloodGroup(e.target.value)}
              options={bloodOptions}
              error={errors.bloodGroup}
              placeholder="Select Blood Group"
            />
            <Input
              label="Units Required"
              type="number"
              min={1}
              max={20}
              required
              value={units}
              onChange={(e) => setUnits(e.target.value)}
              error={errors.units}
              hint="Enter how many units are needed (minimum 1)."
            />
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <Input
              label="Hospital / Facility"
              required
              value={hospital}
              onChange={(e) => setHospital(e.target.value)}
              error={errors.hospital}
              placeholder="e.g. Jaffna Teaching Hospital"
            />
            <Input
              label="Location"
              required
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              error={errors.location}
            />
            <Input
              label="Required Date"
              type="date"
              required
              value={requiredDate}
              onChange={(e) => setRequiredDate(e.target.value)}
              error={errors.requiredDate}
            />
          </div>
        )}

        {step === 2 && (
          <fieldset className="space-y-3">
            <legend className="mb-2 text-sm font-medium text-navy">Urgency</legend>
            {(
              [
                { value: 'NORMAL', label: 'Normal', hint: 'Needed within a few days.' },
                { value: 'URGENT', label: 'Urgent', hint: 'Needed soon — notify nearby donors.' },
                {
                  value: 'EMERGENCY',
                  label: 'Emergency',
                  hint: 'Critical need — notify available donors immediately.',
                },
              ] as const
            ).map((o) => (
              <label
                key={o.value}
                className={`flex cursor-pointer gap-3 rounded-xl border p-4 ${
                  urgency === o.value
                    ? o.value === 'EMERGENCY'
                      ? 'border-critical bg-critical-bg'
                      : 'border-brand bg-critical-bg/30'
                    : 'border-border'
                }`}
              >
                <input
                  type="radio"
                  name="urgency"
                  checked={urgency === o.value}
                  onChange={() => setUrgency(o.value)}
                />
                <span>
                  <span className="font-semibold text-navy">
                    {o.value === 'EMERGENCY' ? '🚨 ' : ''}
                    {o.label}
                  </span>
                  <span className="mt-0.5 block text-sm text-muted">{o.hint}</span>
                </span>
              </label>
            ))}
            {errors.urgency && (
              <p className="text-sm text-critical" role="alert">
                {errors.urgency}
              </p>
            )}
            <div className="pt-2">
              <label htmlFor="notes" className="mb-1.5 block text-sm font-medium text-navy">
                Additional Information
              </label>
              <textarea
                id="notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full rounded-xl border border-border px-3.5 py-2.5 text-sm"
                placeholder="Optional notes for donors (surgery time, ward, etc.)"
              />
            </div>
          </fieldset>
        )}

        {step === 3 && (
          <form onSubmit={onFinalSubmit} className="space-y-3 text-sm">
            <h2 className="text-lg font-bold text-navy">Confirm your request</h2>
            <dl className="space-y-2 rounded-xl bg-surface p-4">
              <div className="flex justify-between">
                <dt className="text-muted">Blood Group</dt>
                <dd className="font-semibold">{bloodGroup}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Units</dt>
                <dd className="font-semibold">{units}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Hospital</dt>
                <dd className="font-semibold">{hospital}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Location</dt>
                <dd className="font-semibold">{location}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Required Date</dt>
                <dd className="font-semibold">{requiredDate}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted">Urgency</dt>
                <dd className="font-semibold">{urgency}</dd>
              </div>
            </dl>
            <div className="flex flex-wrap gap-3 pt-2">
              <Button type="submit" loading={loading} variant={urgency === 'EMERGENCY' ? 'emergency' : 'primary'}>
                {urgency === 'EMERGENCY' ? 'Request Emergency Blood' : 'Submit Request'}
              </Button>
              <Button type="button" variant="outline" onClick={back}>
                Back
              </Button>
              <Link to="/recipient">
                <Button type="button" variant="ghost">
                  Cancel
                </Button>
              </Link>
            </div>
          </form>
        )}

        {step < 3 && (
          <div className="mt-6 flex flex-wrap gap-3">
            {step > 0 && (
              <Button variant="outline" onClick={back}>
                Back
              </Button>
            )}
            <Button onClick={next}>Continue</Button>
            <Link to="/recipient">
              <Button variant="ghost">Cancel</Button>
            </Link>
          </div>
        )}
      </Card>

      <ConfirmationDialog
        open={confirmEmergency}
        title="Are you sure you want to submit an emergency blood request?"
        message="This will notify suitable available donors immediately."
        confirmLabel="Confirm Request"
        cancelLabel="Cancel"
        danger
        onCancel={() => setConfirmEmergency(false)}
        onConfirm={() => {
          setConfirmEmergency(false)
          doSubmit()
        }}
      />
    </div>
  )
}
