import { Link } from 'react-router-dom'
import { Activity, ArrowRight } from 'lucide-react'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { AnimatedCard } from '../../components/public/AnimatedCard'
import { PublicHero, PublicPageSection } from '../../components/public/PublicHero'
import { PublicSectionHeader } from '../../components/public/PublicPageHeader'
import { StakeholderFeatures } from '../../components/public/StakeholderFeatures'
import { publicPageHeroes } from '../../data/publicPageHeroes'
import { howItWorksSteps } from '../../data/publicContent'

export function HowItWorksPage() {
  return (
    <PublicLayout>
      <PublicHero {...publicPageHeroes.howItWorks} />

      <PublicPageSection>
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 text-brand" aria-hidden>
            <span className="h-px w-8 bg-brand/40" />
            <Activity className="h-5 w-5" />
            <span className="h-px w-8 bg-brand/40" />
          </div>
        </div>

        <ol className="mt-10 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {howItWorksSteps.map((s, i) => (
            <li key={s.n} className="relative">
              {i < howItWorksSteps.length - 1 && (
                <span
                  className="absolute left-[calc(50%+2.5rem)] top-14 hidden w-[calc(100%-3rem)] border-t-2 border-dotted border-brand/30 lg:block"
                  aria-hidden
                />
              )}
              <AnimatedCard
                as="article"
                index={i}
                className="relative h-full rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
              >
                <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow">
                  {s.n}
                </span>
                <span className="card-icon mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-critical-bg text-brand">
                  <s.icon className="h-6 w-6" aria-hidden />
                </span>
                <h3 className="mt-4 font-bold text-navy">{s.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
              </AnimatedCard>
            </li>
          ))}
        </ol>
      </PublicPageSection>

      <PublicPageSection tinted>
        <PublicSectionHeader
          title="Built for every stakeholder"
          subtitle="Whether you donate, receive, or organise — LifeDrop is designed around your needs."
        />
        <div className="mt-10">
          <StakeholderFeatures />
        </div>
      </PublicPageSection>

      <PublicPageSection className="!pt-0">
        <div className="flex flex-wrap gap-4">
          <Link
            to="/register"
            className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-6 py-3 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark"
          >
            Get started
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
          <Link
            to="/guide"
            className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand px-6 py-3 text-sm font-bold text-brand hover:bg-critical-bg/40"
          >
            Read the full guide
          </Link>
        </div>
      </PublicPageSection>
    </PublicLayout>
  )
}
