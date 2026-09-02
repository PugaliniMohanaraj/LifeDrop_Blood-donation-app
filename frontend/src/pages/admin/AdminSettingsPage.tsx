import { Settings } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiErrorMessage, changePassword } from '../../api/bloodBridge'
import { useAuth } from '../../context/AuthContext'
import { useTheme } from '../../context/ThemeContext'
import { useToast } from '../../context/ToastContext'
import { Button, Card, Input } from '../../components/ui'
import { IconPageHeader, ListCard, PageContainer } from '../../components/PageChrome'
import { getPasswordValidationError } from '../../utils/validation'

const PREFS_KEY = 'lifedrop_admin_prefs'

type Prefs = {
  emailAlerts: boolean
  orgApplications: boolean
  criticalStock: boolean
}

const defaultPrefs: Prefs = {
  emailAlerts: true,
  orgApplications: true,
  criticalStock: true,
}

function loadPrefs(): Prefs {
  try {
    const raw = localStorage.getItem(PREFS_KEY)
    return raw ? { ...defaultPrefs, ...(JSON.parse(raw) as Prefs) } : defaultPrefs
  } catch {
    return defaultPrefs
  }
}

export function AdminSettingsPage() {
  const { user, updateProfile, logout } = useAuth()
  const { theme, setTheme } = useTheme()
  const { toast } = useToast()
  const navigate = useNavigate()

  const [fullName, setFullName] = useState(user?.fullName || '')
  const [phone, setPhone] = useState(user?.phone || '')
  const [prefs, setPrefs] = useState<Prefs>(loadPrefs)

  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [pwErrors, setPwErrors] = useState<Record<string, string>>({})
  const [savingPw, setSavingPw] = useState(false)

  useEffect(() => {
    setFullName(user?.fullName || '')
    setPhone(user?.phone || '')
  }, [user])

  const saveProfile = () => {
    if (!fullName.trim()) {
      toast('Please enter your name.', 'error')
      return
    }
    updateProfile({ fullName: fullName.trim(), phone: phone.trim() })
    toast('Profile saved.', 'success')
  }

  const savePrefs = (next: Prefs) => {
    setPrefs(next)
    localStorage.setItem(PREFS_KEY, JSON.stringify(next))
    toast('Notification preferences saved.', 'success')
  }

  const submitPassword = async () => {
    const errors: Record<string, string> = {}
    if (!currentPassword) errors.currentPassword = 'Please enter your current password.'
    if (!newPassword) errors.newPassword = 'Please enter a new password.'
    else {
      const passwordError = getPasswordValidationError(newPassword)
      if (passwordError) errors.newPassword = passwordError
    }
    if (newPassword !== confirmPassword) errors.confirmPassword = 'Passwords do not match.'
    setPwErrors(errors)
    if (Object.keys(errors).length) return

    setSavingPw(true)
    try {
      const message = await changePassword(currentPassword, newPassword)
      toast(message, 'success')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setPwErrors({})
    } catch (err) {
      toast(apiErrorMessage(err, 'Could not update password.'), 'error')
    } finally {
      setSavingPw(false)
    }
  }

  return (
    <PageContainer className="max-w-2xl">
      <IconPageHeader
        icon={Settings}
        title="Settings"
        subtitle="Manage your admin account and alert preferences."
      />

      <ListCard className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Appearance</h2>
          <p className="text-sm text-muted">Choose light or dark mode for the whole app.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {(['light', 'dark'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              onClick={() => {
                setTheme(mode)
                toast(`${mode === 'light' ? 'Light' : 'Dark'} mode enabled.`, 'success')
              }}
              className={`rounded-2xl border px-4 py-4 text-left transition ${
                theme === mode
                  ? 'border-brand bg-critical-bg/30 ring-2 ring-brand/20'
                  : 'border-border bg-surface hover:border-brand/40'
              }`}
            >
              <span className="block text-sm font-bold capitalize text-foreground">{mode} mode</span>
              <span className="mt-1 block text-xs text-muted">
                {mode === 'light' ? 'Bright workspace' : 'Easier on the eyes at night'}
              </span>
            </button>
          ))}
        </div>
      </ListCard>

      <ListCard className="space-y-4 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-foreground">Account</h2>
        <Input
          label="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          autoComplete="name"
        />
        <Input
          label="Email"
          value={user?.email || ''}
          disabled
          hint="Email is used for sign-in and cannot be changed here."
        />
        <Input
          label="Phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoComplete="tel"
        />
        <div className="rounded-2xl border border-border bg-surface px-4 py-3 text-sm">
          <p className="text-muted">Role</p>
          <p className="font-semibold text-foreground">Platform Administrator</p>
        </div>
        <Button onClick={saveProfile}>Save profile</Button>
      </ListCard>

      <ListCard className="space-y-4 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-foreground">Change password</h2>
        <Input
          label="Current password"
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          error={pwErrors.currentPassword}
          autoComplete="current-password"
        />
        <Input
          label="New password"
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          error={pwErrors.newPassword}
          hint="At least 8 characters."
          autoComplete="new-password"
        />
        <Input
          label="Confirm new password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={pwErrors.confirmPassword}
          autoComplete="new-password"
        />
        <Button loading={savingPw} onClick={() => void submitPassword()}>
          Update password
        </Button>
      </ListCard>

      <ListCard className="space-y-4 p-5 sm:p-6">
        <div>
          <h2 className="text-lg font-bold text-foreground">Notifications</h2>
          <p className="text-sm text-muted">Choose which admin alerts you want to see.</p>
        </div>
        {(
          [
            {
              key: 'emailAlerts' as const,
              label: 'Email alerts',
              hint: 'Send a summary when important platform events happen.',
            },
            {
              key: 'orgApplications' as const,
              label: 'Organization applications',
              hint: 'Notify when a hospital or blood bank requests verification.',
            },
            {
              key: 'criticalStock' as const,
              label: 'Critical stock warnings',
              hint: 'Highlight when reported blood stock reaches critical levels.',
            },
          ] as const
        ).map((item) => (
          <label
            key={item.key}
            className="flex cursor-pointer items-start gap-3 rounded-2xl border border-border px-4 py-3 transition hover:bg-surface"
          >
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[var(--color-brand,#E30613)]"
              checked={prefs[item.key]}
              onChange={(e) => savePrefs({ ...prefs, [item.key]: e.target.checked })}
            />
            <span>
              <span className="block font-medium text-foreground">{item.label}</span>
              <span className="block text-sm text-muted">{item.hint}</span>
            </span>
          </label>
        ))}
      </ListCard>

      <ListCard className="space-y-3 p-5 sm:p-6">
        <h2 className="text-lg font-bold text-foreground">Session</h2>
        <p className="text-sm text-muted">Sign out of this admin account on this device.</p>
        <Button
          variant="outline"
          onClick={() => {
            logout()
            toast('Signed out.', 'info')
            navigate('/login')
          }}
        >
          Sign out
        </Button>
      </ListCard>
    </PageContainer>
  )
}
