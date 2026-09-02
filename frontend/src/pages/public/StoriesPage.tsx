import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { AnimatedCard } from '../../components/public/AnimatedCard'
import { PublicPageSection } from '../../components/public/PublicHero'
import { ShareStoryModal } from '../../components/public/ShareStoryModal'
import { featuredStory, storyGrid } from '../../data/publicContent'
import { publicImages } from '../../data/publicImages'

function StoryAvatar({ name, photo }: { name: string; photo?: string }) {
  const initials = name
    .split(/\s+/)
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  if (photo) {
    return (
      <img
        src={photo}
        alt=""
        className="h-10 w-10 shrink-0 rounded-full object-cover ring-2 ring-brand/20"
      />
    )
  }

  return (
    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand ring-2 ring-brand/20">
      {initials}
    </span>
  )
}

export function StoriesPage() {
  const [shareOpen, setShareOpen] = useState(false)

  return (
    <PublicLayout>
      <ShareStoryModal open={shareOpen} onClose={() => setShareOpen(false)} />
      {/* Hero — mockup style */}
      <section className="relative flex min-h-[16rem] items-center overflow-hidden sm:min-h-[20rem] lg:min-h-[24rem]">
        <img
          src={publicImages.hero.stories}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-navy/60" aria-hidden />
        <div className="container-app relative z-10 py-12 sm:py-16">
          <h1 className="max-w-3xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
            <span className="text-brand">Stories</span> that remind us why this matters.
          </h1>
          <p className="mt-4 max-w-xl text-base text-white/85 sm:text-lg">
            Real donors and organisers from across Sri Lanka — from Colombo to Jaffna, Kandy to
            Batticaloa.
          </p>
        </div>
      </section>

      {/* Highlight of the week */}
      <PublicPageSection>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
          Highlight of the Week
        </p>
        <AnimatedCard
          as="article"
          className="mt-4 grid overflow-hidden rounded-2xl border border-border bg-card shadow-sm lg:grid-cols-2"
        >
          <div className="relative min-h-[16rem] bg-surface lg:min-h-full">
            <img
              src={featuredStory.photo}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col justify-center p-6 sm:p-10">
            <span className="inline-flex w-fit rounded-full bg-critical-bg px-3 py-1 text-xs font-bold text-brand">
              {featuredStory.bloodGroup}
              {featuredStory.donationCount
                ? ` · ${featuredStory.donationCount} donations`
                : ''}
            </span>
            <blockquote className="mt-4 text-xl font-extrabold leading-snug text-brand sm:text-2xl">
              &ldquo;{featuredStory.quote}&rdquo;
            </blockquote>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">
              {featuredStory.excerpt}
            </p>
            <p className="mt-4 text-sm font-bold text-navy">
              {featuredStory.name}
              <span className="ml-2 font-normal text-muted">{featuredStory.location}</span>
            </p>
            <Link
              to="/contact"
              className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border-2 border-brand px-5 py-2.5 text-sm font-bold text-brand hover:bg-critical-bg/40"
            >
              Read Full Story
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </AnimatedCard>
      </PublicPageSection>

      {/* CTA banner */}
      <section className="bg-gradient-to-r from-[#8B0A0A] via-brand to-[#C40510] py-10 sm:py-12">
        <div className="container-app flex flex-col items-center justify-between gap-6 text-center text-white sm:flex-row sm:text-left">
          <h2 className="text-2xl font-extrabold sm:text-3xl">Every Donation Has a Story</h2>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-bold text-brand hover:bg-slate-100"
          >
            Share Your Story
            <ArrowRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </section>

      {/* Story grid */}
      <PublicPageSection tinted>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {storyGrid.map((story, i) => (
            <AnimatedCard
              key={story.id}
              as="article"
              index={i}
              className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6"
            >
              <span className="inline-flex w-fit rounded-full bg-critical-bg px-3 py-1 text-xs font-bold text-brand">
                {story.bloodGroup}
              </span>
              <blockquote className="mt-4 text-base font-bold leading-snug text-brand">
                &ldquo;{story.quote}&rdquo;
              </blockquote>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-muted line-clamp-4">
                {story.excerpt}
              </p>
              <footer className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                <div className="flex min-w-0 items-center gap-3">
                  <StoryAvatar name={story.name} photo={story.photo} />
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-navy">{story.name}</p>
                    <p className="truncate text-xs text-muted">{story.location}</p>
                  </div>
                </div>
                <Link
                  to="/contact"
                  className="shrink-0 rounded-full border border-brand px-3 py-1.5 text-xs font-bold text-brand hover:bg-critical-bg/40"
                >
                  Read
                </Link>
              </footer>
            </AnimatedCard>
          ))}
        </div>

        <p className="mt-10 text-center text-xs text-muted">
          Stories drawn from public donor experiences shared via{' '}
          <a
            href="https://nbts.health.gov.lk/"
            target="_blank"
            rel="noreferrer"
            className="text-brand hover:underline"
          >
            National Blood Transfusion Service Sri Lanka
          </a>
          , WHO Sri Lanka, and community donation reports.
        </p>
      </PublicPageSection>
    </PublicLayout>
  )
}
