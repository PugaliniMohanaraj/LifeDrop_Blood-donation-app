import { useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  Calendar,
  Clock,
  Heart,
  MessageCircle,
  Newspaper,
  PenLine,
  Sparkles,
} from 'lucide-react'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { AnimatedCard } from '../../components/public/AnimatedCard'
import { BlogPostModal } from '../../components/public/BlogPostModal'
import { PublicPageSection } from '../../components/public/PublicHero'
import { blogPosts, type BlogPost } from '../../data/publicContent'
import { publicImages } from '../../data/publicImages'

const categoryIcon: Record<string, typeof Sparkles> = {
  Awareness: Sparkles,
  Platform: Newspaper,
  Guide: BookOpen,
}

const FALLBACK_IMAGE = publicImages.hero.main

function BlogHero() {
  return (
    <section className="relative overflow-hidden bg-navy pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-0 top-0 h-full w-[55%] bg-gradient-to-l from-navy/20 to-navy">
          <img
            src={publicImages.hero.blogs}
            alt=""
            className="h-full w-full object-cover object-[center_20%] opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/40" />
        <MessageCircle className="absolute right-[12%] top-[18%] h-16 w-16 text-white/15" />
        <Heart className="absolute right-[22%] top-[42%] h-20 w-20 text-white/10" />
        <PenLine className="absolute right-[8%] bottom-[28%] h-14 w-14 text-white/12" />
      </div>

      <div className="container-app relative z-10 py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">
          Learn. Inspire. Share
        </p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[0.1em] text-white sm:text-5xl lg:text-6xl">
          BLOGS
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
          Stay informed, stay inspired — your go-to source for blood donation and impact.
        </p>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full text-brand"
        viewBox="0 0 1440 80"
        preserveAspectRatio="none"
        aria-hidden
      >
        <path
          fill="currentColor"
          d="M0,40 C360,90 720,0 1080,50 C1260,75 1380,65 1440,55 L1440,80 L0,80 Z"
        />
      </svg>
    </section>
  )
}

function BlogCard({ post, index, onRead }: { post: BlogPost; index: number; onRead: () => void }) {
  const CatIcon = categoryIcon[post.category] ?? Sparkles

  return (
    <AnimatedCard
      as="article"
      index={index}
      className="grid gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm sm:grid-cols-[1fr_min(42%,11rem)] sm:p-6"
    >
      <div className="flex min-w-0 flex-col">
        <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-critical-bg px-3 py-1 text-xs font-semibold text-brand">
          <CatIcon className="card-icon h-3.5 w-3.5" aria-hidden />
          {post.category}
        </span>
        <h2 className="mt-4 text-lg font-extrabold leading-snug text-navy sm:text-xl">{post.title}</h2>
        <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-3">{post.excerpt}</p>
        <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-muted">
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
      </div>

      <div className="relative min-h-[10rem] sm:min-h-0">
        <img
          src={post.image}
          alt=""
          className="h-full min-h-[10rem] w-full rounded-xl object-cover sm:min-h-[11rem]"
          onError={(e) => {
            e.currentTarget.onerror = null
            e.currentTarget.src = FALLBACK_IMAGE
          }}
        />
        <button
          type="button"
          onClick={onRead}
          className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white shadow-lg transition hover:bg-brand-dark"
          aria-label={`Read ${post.title}`}
        >
          <ArrowRight className="h-5 w-5" aria-hidden />
        </button>
      </div>
    </AnimatedCard>
  )
}

export function BlogsPage() {
  const [activePost, setActivePost] = useState<BlogPost | null>(null)

  return (
    <PublicLayout>
      <BlogPostModal post={activePost} onClose={() => setActivePost(null)} />
      <BlogHero />

      <PublicPageSection className="!pt-8">
        <div className="grid gap-6 lg:grid-cols-2">
          {blogPosts.map((post, i) => (
            <BlogCard key={post.slug} post={post} index={i} onRead={() => setActivePost(post)} />
          ))}
        </div>
      </PublicPageSection>
    </PublicLayout>
  )
}
