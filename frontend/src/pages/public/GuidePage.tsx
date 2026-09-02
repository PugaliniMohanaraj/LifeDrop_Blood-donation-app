import { Link } from 'react-router-dom'
import { useMemo, useState } from 'react'
import {
  ArrowRight,
  BookOpen,
  ChevronRight,
  Search,
} from 'lucide-react'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { AnimatedCard } from '../../components/public/AnimatedCard'
import { PublicPageSection } from '../../components/public/PublicHero'
import {
  guideModuleDetails,
  guideModules,
  popularGuides,
  topResourceGuides,
} from '../../data/publicContent'

function matchesQuery(text: string, query: string) {
  return text.toLowerCase().includes(query.toLowerCase())
}

export function GuidePage() {
  const [query, setQuery] = useState('')

  const filteredTop = useMemo(() => {
    if (!query.trim()) return topResourceGuides
    return topResourceGuides.filter(
      (g) => matchesQuery(g.title, query) || matchesQuery(g.description, query),
    )
  }, [query])

  const filteredEssential = useMemo(() => {
    if (!query.trim()) return guideModules
    return guideModules.filter(
      (g) => matchesQuery(g.title, query) || matchesQuery(g.description, query),
    )
  }, [query])

  const filteredPopular = useMemo(() => {
    if (!query.trim()) return popularGuides
    return popularGuides.filter((g) => matchesQuery(g.title, query))
  }, [query])

  return (
    <PublicLayout>
      {/* Search hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-brand via-[#C40510] to-[#8B0A0A] py-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="container-app relative z-10 text-center">
          <h1 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            Hi, How Can I Help You?
          </h1>
          <div className="relative mx-auto mt-8 max-w-2xl">
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search guides, eligibility, preparation…"
              className="w-full rounded-full border-0 bg-white py-4 pl-6 pr-14 text-sm text-navy shadow-lg outline-none placeholder:text-muted sm:text-base"
              aria-label="Search guides"
            />
            <span className="absolute right-2 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-brand text-white">
              <Search className="h-5 w-5" aria-hidden />
            </span>
          </div>
        </div>
      </section>

      <PublicPageSection>
        <h2 className="text-center text-2xl font-extrabold text-navy sm:text-3xl lg:text-4xl">
          Blood Donation <span className="text-brand">Guides &amp; Resources</span>
        </h2>

        {/* Top resources */}
        {filteredTop.length > 0 && (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTop.map((guide, i) => (
              <AnimatedCard
                key={guide.id}
                as="article"
                index={i}
                className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <span className="card-icon flex h-14 w-14 items-center justify-center rounded-full bg-critical-bg text-brand">
                  <guide.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 text-base font-bold text-navy sm:text-lg">{guide.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">
                  {guide.description}
                </p>
                <a
                  href={`#detail-${guide.anchor}`}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-navy hover:text-brand"
                >
                  Read Guide
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </a>
              </AnimatedCard>
            ))}
          </div>
        )}

        {/* Essential guides */}
        {filteredEssential.length > 0 && (
          <>
            <h3 className="mt-14 text-center text-xl font-extrabold text-navy sm:text-2xl">
              Essential <span className="text-brand">Guides</span>
            </h3>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredEssential.map((mod, i) => (
                <AnimatedCard
                  key={mod.id}
                  as="article"
                  id={mod.id}
                  index={i}
                  className="scroll-mt-28 flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
                >
                  <span className="card-icon flex h-14 w-14 items-center justify-center rounded-full bg-critical-bg text-brand">
                    <mod.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-bold text-navy sm:text-lg">{mod.title}</h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-muted">{mod.description}</p>
                  <a
                    href={`#detail-${mod.id}`}
                    className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-critical-bg px-4 py-2 text-sm font-bold text-brand hover:bg-critical-bg/80"
                  >
                    {mod.modules} Modules
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </a>
                </AnimatedCard>
              ))}
            </div>
          </>
        )}

        {/* Popular guides list */}
        {filteredPopular.length > 0 && (
          <>
            <h3 className="mt-14 text-center text-xl font-extrabold text-navy sm:text-2xl">
              Popular <span className="text-brand">Guides</span>
            </h3>
            <div className="mx-auto mt-6 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              {filteredPopular.map((item, i) => (
                <a
                  key={item.title}
                  href={`#detail-${item.anchor}`}
                  className={`flex items-center gap-4 px-5 py-4 transition hover:bg-critical-bg/30 sm:px-6 ${
                    i > 0 ? 'border-t border-border' : ''
                  }`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-critical-bg text-brand">
                    <BookOpen className="h-4 w-4" aria-hidden />
                  </span>
                  <span className="flex-1 text-sm font-semibold text-navy sm:text-base">
                    {item.title}
                  </span>
                  <ChevronRight className="h-5 w-5 shrink-0 text-muted" aria-hidden />
                </a>
              ))}
            </div>
          </>
        )}

        {query && filteredTop.length === 0 && filteredEssential.length === 0 && filteredPopular.length === 0 && (
          <p className="mt-10 text-center text-muted">No guides match your search. Try another keyword.</p>
        )}

        {/* Detail sections */}
        <div className="mt-14 space-y-6">
          {Object.entries(guideModuleDetails).map(([id, detail], i) => (
            <AnimatedCard
              key={id}
              as="article"
              id={`detail-${id}`}
              index={i}
              variant="default"
              className="scroll-mt-28 rounded-2xl border border-border bg-surface p-6 sm:p-8"
            >
              <h3 className="text-lg font-bold text-navy sm:text-xl">{detail.title}</h3>
              <ul className="mt-4 space-y-2">
                {detail.topics.map((topic, i) => (
                  <li key={topic} className="flex gap-3 text-sm text-muted">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-xs font-bold text-white">
                      {i + 1}
                    </span>
                    {topic}
                  </li>
                ))}
              </ul>
            </AnimatedCard>
          ))}
        </div>
      </PublicPageSection>

      {/* Help CTA */}
      <section className="pb-12 sm:pb-16">
        <div className="container-app">
          <div className="flex flex-col items-center gap-6 rounded-2xl bg-critical-bg/60 px-6 py-8 sm:flex-row sm:px-10 sm:py-10">
            <img
              src="/logo.png"
              alt=""
              className="h-20 w-20 shrink-0 object-contain sm:h-24 sm:w-24"
            />
            <div className="flex-1 text-center sm:text-left">
              <h3 className="text-xl font-extrabold text-navy sm:text-2xl">Still need help?</h3>
              <p className="mt-2 text-sm text-muted sm:text-base">
                Our support team can answer eligibility questions, camp locations, and how to use
                LifeDrop.
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
