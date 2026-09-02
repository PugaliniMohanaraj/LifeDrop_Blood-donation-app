import { useEffect, useState, type FormEvent } from 'react'
import { Button, Input, Modal, Select } from '../ui'
import { useToast } from '../../context/ToastContext'
import { BLOOD_GROUPS } from '../../types'

const STORY_MAX = 5000

interface ShareStoryModalProps {
  open: boolean
  onClose: () => void
}

export function ShareStoryModal({ open, onClose }: ShareStoryModalProps) {
  const { toast } = useToast()
  const [story, setStory] = useState('')

  useEffect(() => {
    if (!open) setStory('')
  }, [open])

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const fullName = String(fd.get('fullName') || '').trim()
    const city = String(fd.get('city') || '').trim()
    const bloodGroup = String(fd.get('bloodGroup') || '').trim()
    const storyText = story.trim()

    if (!fullName || !city || !bloodGroup || !storyText) {
      toast('Please fill in all required fields.', 'error')
      return
    }

    const subject = encodeURIComponent(`[LifeDrop Story] ${fullName} — ${city}`)
    const body = encodeURIComponent(
      `Name: ${fullName}\nCity: ${city}\nBlood group: ${bloodGroup}\n\nStory:\n${storyText}`,
    )
    window.location.href = `mailto:support@lifedrop.lk?subject=${subject}&body=${body}`
    toast('Your email app will open to send your story for review.', 'info')
    onClose()
  }

  return (
    <Modal
      open={open}
      title="Share Your Story With Us!"
      onClose={onClose}
      className="max-h-[90vh] max-w-xl overflow-y-auto"
    >
      <p className="mb-4 text-sm text-muted">
        Tell us about your donation experience. Your email app will open so you can send your story
        to our team for review.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Your Full Name" name="fullName" required placeholder="Enter full name" />
        <Input label="Your City" name="city" required placeholder="Enter your city" />
        <Select
          label="Blood Group"
          name="bloodGroup"
          required
          placeholder="Select blood group"
          options={BLOOD_GROUPS.map((g) => ({ value: g, label: g }))}
        />
        <div>
          <label
            htmlFor="donor-story"
            className="mb-1.5 block text-sm font-medium text-foreground"
          >
            Your Story
            <span className="ml-0.5 text-brand" aria-hidden>
              *
            </span>
          </label>
          <textarea
            id="donor-story"
            name="story"
            required
            rows={6}
            maxLength={STORY_MAX}
            value={story}
            onChange={(e) => setStory(e.target.value)}
            placeholder="Write your story in detail"
            className="w-full rounded-2xl border border-border bg-card px-4 py-3 text-sm text-foreground placeholder:text-muted transition focus:border-brand focus:ring-2 focus:ring-brand/20"
          />
          <p className="mt-1.5 text-right text-xs text-muted">
            {story.length}/{STORY_MAX} characters
          </p>
        </div>

        <Button type="submit" className="w-full">
          Submit Story
        </Button>
      </form>
    </Modal>
  )
}
