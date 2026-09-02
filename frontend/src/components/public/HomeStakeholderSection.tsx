import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Heart } from 'lucide-react'
import { AnimatedCard } from './AnimatedCard'
import {
  stakeholderContent,
  type StakeholderKey,
} from '../../data/publicContent'

export function HomeStakeholderSection() {
  const [active, setActive] = useState<StakeholderKey>('donors')
  const content = stakeholderContent[active]

  return (
    <section className="py-16 sm:py-24">
      <div className="container-app">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-3xl font-extrabold leading-tight text-navy sm:text-4xl lg:text-[2.75rem]">
            Built for <span className="text-brand">every stakeholder</span> in blood donation
          </h2>
          <p className="mt-4 text-base text-muted sm:text-lg">
            Whether you donate, receive, or organise — LifeDrop is designed around your needs.
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2 sm:gap-3">
          {(Object.keys(stakeholderContent) as StakeholderKey[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
                active === key
                  ? 'bg-brand text-white shadow-lg shadow-brand/25'
                  : 'border border-border bg-card text-muted hover:border-brand/40 hover:text-brand'
              }`}
            >
              {stakeholderContent[key].label}
            </button>
          ))}
        </div>

        <div className="mx-auto mt-8 flex max-w-3xl items-center justify-center gap-3 rounded-2xl bg-critical-bg/70 px-6 py-4 text-center sm:px-8">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand/10 text-brand">
            <Heart className="h-4 w-4" aria-hidden />
          </span>
          <p className="text-sm font-semibold text-navy sm:text-base">{content.headline}</p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((f, i) => (
            <AnimatedCard
              key={f.title}
              as="article"
              index={i}
              className="rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <span className="card-icon flex h-11 w-11 items-center justify-center rounded-full bg-critical-bg text-sm font-extrabold text-brand">
                {f.badge}
              </span>
              <h3 className="mt-4 text-base font-bold text-navy sm:text-lg">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{f.text}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </section>
  )
}
