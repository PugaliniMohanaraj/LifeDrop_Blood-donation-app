import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  CircleHelp,
  HelpCircle,
  MessageCircle,
  Search,
} from 'lucide-react'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { AnimatedCard } from '../../components/public/AnimatedCard'
import { PublicPageSection } from '../../components/public/PublicHero'
import { faqs } from '../../data/publicContent'
import { publicImages } from '../../data/publicImages'

function FaqsHero() {
  return (
    <section className="relative overflow-hidden bg-navy pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-0 top-0 h-full w-[55%] bg-gradient-to-l from-navy/20 to-navy">
          <img
            src={publicImages.hero.faqs}
            alt=""
            className="h-full w-full object-cover object-center opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/40" />
        <HelpCircle className="absolute right-[14%] top-[20%] h-16 w-16 text-white/15" />
        <CircleHelp className="absolute right-[24%] top-[45%] h-20 w-20 text-white/10" />
        <MessageCircle className="absolute right-[10%] bottom-[30%] h-14 w-14 text-white/12" />
      </div>

      <div className="container-app relative z-10 py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Questions &amp; Answers</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[0.1em] text-white sm:text-5xl lg:text-6xl">
          FAQS
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
          Everything you need to know about donating, eligibility, and how LifeDrop works.
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

export function FaqsPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return faqs
    return faqs.filter(
      (f) => f.q.toLowerCase().includes(q) || f.a.toLowerCase().includes(q),
    )
  }, [query])

  return (
    <PublicLayout>
      <FaqsHero />

      <PublicPageSection className="!pt-8">
        <div className="relative mx-auto max-w-2xl">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full rounded-full border border-border bg-card py-4 pl-6 pr-14 text-sm text-navy shadow-sm outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20 placeholder:text-muted sm:text-base"
            aria-label="Search FAQs"
          />
          <span className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white">
            <Search className="h-5 w-5" aria-hidden />
          </span>
        </div>

        <div className="mx-auto mt-10 max-w-3xl space-y-3">
          {filtered.length === 0 ? (
            <p className="text-center text-muted">No questions match your search. Try another keyword.</p>
          ) : (
            filtered.map((f, i) => (
              <AnimatedCard
                key={f.q}
                as="details"
                index={i}
                variant="default"
                className="group rounded-2xl border border-border bg-card px-5 py-4 shadow-sm open:border-brand/25 open:shadow-md sm:px-6"
              >
                <summary className="cursor-pointer list-none font-semibold text-navy">
                  <span className="flex items-center justify-between gap-4">
                    <span className="text-left">{f.q}</span>
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-critical-bg text-lg font-light text-brand transition group-open:rotate-45">
                      +
                    </span>
                  </span>
                </summary>
                <p className="mt-4 border-t border-border pt-4 text-sm leading-relaxed text-muted">{f.a}</p>
              </AnimatedCard>
            ))
          )}
        </div>
      </PublicPageSection>

      <section className="pb-12 sm:pb-16">
        <div className="container-app">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-critical-bg/60 px-6 py-8 sm:flex-row sm:px-10 sm:py-10">
            <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
              <HelpCircle className="h-8 w-8" aria-hidden />
            </span>
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-extrabold text-navy sm:text-2xl">Still have questions?</h3>
              <p className="mt-2 text-sm text-muted sm:text-base">
                Our support team can help with eligibility, camps, and using LifeDrop across Sri Lanka.
              </p>
            </div>
            <Link
              to="/contact"
              className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark"
            >
              Contact Us
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
