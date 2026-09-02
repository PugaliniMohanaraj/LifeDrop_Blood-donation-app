import { useEffect, useState, type FormEvent } from 'react'
import { X } from 'lucide-react'
import { Button, Input, Select } from '../ui'
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
  const [sending, setSending] = useState(false)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      setStory('')
      setSending(false)
    }
  }, [open])

  if (!open) return null

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSending(true)
    window.setTimeout(() => {
      setSending(false)
      onClose()
      toast('Thank you! Your story has been submitted for review.', 'success')
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" role="presentation">
      <button
        type="button"
        className="absolute inset-0 bg-navy/50"
        aria-label="Close dialog"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="share-story-title"
        className="relative z-10 max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-card p-6 shadow-xl sm:p-8"
      >
        <div className="mb-6 flex items-start justify-between gap-4">
          <div>
            <h2 id="share-story-title" className="text-xl font-extrabold text-navy sm:text-2xl">
              Share Your Story With Us!
            </h2>
            <p className="mt-1 text-sm text-muted">
              Upload and attach files to this project.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted hover:bg-surface hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Your Full Name"
            name="fullName"
            required
            placeholder="Enter full name"
          />
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

          <Button type="submit" className="w-full" disabled={sending}>
            {sending ? 'Submitting…' : 'Submit Story'}
          </Button>
        </form>
      </div>
    </div>
  )
}
