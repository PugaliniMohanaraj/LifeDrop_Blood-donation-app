import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { Button, Card, Input, Select } from '../../components/ui'
import { BLOOD_GROUPS, type BloodGroup } from '../../types'

export function DonorProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [location, setLocation] = useState(user?.location || '')
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '')

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Profile</h1>
        <p className="text-sm text-muted">Keep your details up to date so matching stays accurate.</p>
      </div>
      <Card className="space-y-4">
        <Input label="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
        <Input label="Email" value={user?.email || ''} disabled hint="Email cannot be changed here." />
        <Input label="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
        <Select
          label="Blood Group"
          value={bloodGroup}
          onChange={(e) => setBloodGroup(e.target.value)}
          options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
        />
        <Input label="Location" value={location} onChange={(e) => setLocation(e.target.value)} />
        <Button
          onClick={() => {
            updateProfile({
              fullName,
              phone,
              location,
              bloodGroup: bloodGroup as BloodGroup,
            })
            toast('Profile saved.', 'success')
          }}
        >
          Save Profile
        </Button>
      </Card>
    </div>
  )
}
