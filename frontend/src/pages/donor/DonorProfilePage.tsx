import { useRef, useState } from 'react'
import { Camera, X } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useToast } from '../../context/ToastContext'
import { UserAvatar } from '../../components/UserAvatar'
import { Button, Card, Input, Select } from '../../components/ui'
import { BLOOD_GROUPS, type BloodGroup } from '../../types'

const MAX_PHOTO_BYTES = 2 * 1024 * 1024

export function DonorProfilePage() {
  const { user, updateProfile } = useAuth()
  const { toast } = useToast()
  const fileRef = useRef<HTMLInputElement>(null)
  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [location, setLocation] = useState(user?.location || '')
  const [bloodGroup, setBloodGroup] = useState(user?.bloodGroup || '')
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || '')

  const handlePhoto = (file: File | undefined) => {
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast('Please choose an image file (JPG or PNG).', 'error')
      return
    }
    if (file.size > MAX_PHOTO_BYTES) {
      toast('Photo must be 2 MB or smaller.', 'error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') setPhotoUrl(reader.result)
    }
    reader.readAsDataURL(file)
  }

  const save = () => {
    updateProfile({
      fullName: fullName.trim(),
      phone: phone.trim(),
      location: location.trim(),
      bloodGroup: bloodGroup as BloodGroup,
      photoUrl: photoUrl || undefined,
    })
    toast('Profile saved.', 'success')
  }

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold text-navy">Profile</h1>
        <p className="text-sm text-muted">Keep your details up to date so matching stays accurate.</p>
      </div>
      <Card className="space-y-4">
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-border bg-surface px-4 py-5 text-center sm:flex-row sm:text-left">
          <UserAvatar name={fullName || user?.fullName || ''} photoUrl={photoUrl} size="md" />
          <div className="flex-1 space-y-2">
            <div>
              <p className="text-sm font-semibold text-foreground">Profile photo</p>
              <p className="text-xs text-muted">Optional — helps recipients recognize you.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileRef.current?.click()}
              >
                <Camera className="h-4 w-4" />
                {photoUrl ? 'Change photo' : 'Upload photo'}
              </Button>
              {photoUrl && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setPhotoUrl('')}
                >
                  <X className="h-4 w-4" />
                  Remove
                </Button>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="sr-only"
              onChange={(e) => {
                handlePhoto(e.target.files?.[0])
                e.target.value = ''
              }}
            />
          </div>
        </div>

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
        <Button onClick={save}>Save Profile</Button>
      </Card>
    </div>
  )
}
