import { useEffect } from 'react'
import { Calendar, Clock, ExternalLink, X } from 'lucide-react'
import type { BlogPost } from '../../data/publicContent'

interface BlogPostModalProps {
  post: BlogPost | null
  onClose: () => void
}

export function BlogPostModal({ post, onClose }: BlogPostModalProps) {
  useEffect(() => {
    if (!post) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [post, onClose])

  if (!post) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-navy/60 p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="blog-modal-title"
      onClick={onClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-card shadow-2xl sm:rounded-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative h-44 shrink-0 sm:h-52">
          <img src={post.image} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-navy/80 to-transparent" />
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-navy shadow hover:bg-white"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
          <span className="absolute bottom-4 left-4 rounded-full bg-critical-bg px-3 py-1 text-xs font-semibold text-brand">
            {post.category}
          </span>
        </div>

        <div className="overflow-y-auto px-6 py-6 sm:px-8">
          <h2 id="blog-modal-title" className="text-xl font-extrabold leading-snug text-navy sm:text-2xl">
            {post.title}
          </h2>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5" aria-hidden />
              {new Date(post.date).toLocaleDateString(undefined, {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" aria-hidden />
              {post.readMinutes} min read
            </span>
          </div>

          <div className="mt-6 space-y-4">
            {post.body.map((paragraph) => (
              <p key={paragraph.slice(0, 40)} className="text-sm leading-relaxed text-muted sm:text-base">
                {paragraph}
              </p>
            ))}
          </div>

          <a
            href={post.source}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
          >
            Source: {post.sourceLabel}
            <ExternalLink className="h-3.5 w-3.5" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  )
}
