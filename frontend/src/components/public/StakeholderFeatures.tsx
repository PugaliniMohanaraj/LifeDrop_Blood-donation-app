import { useState } from 'react'
import { AnimatedCard } from './AnimatedCard'
import {
  stakeholderContent,
  type StakeholderKey,
} from '../../data/publicContent'

export function StakeholderFeatures() {
  const [active, setActive] = useState<StakeholderKey>('donors')
  const content = stakeholderContent[active]

  return (
    <div>
      <div className="flex flex-wrap justify-center gap-2">
        {(Object.keys(stakeholderContent) as StakeholderKey[]).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setActive(key)}
            className={`rounded-full px-5 py-2.5 text-sm font-semibold transition ${
              active === key
                ? 'bg-brand text-white shadow-md shadow-brand/20'
                : 'border border-border bg-card text-muted hover:border-brand/30 hover:text-brand'
            }`}
          >
            {stakeholderContent[key].label}
          </button>
        ))}
      </div>

      <div className="mt-10 rounded-3xl border border-border bg-card p-6 shadow-sm sm:p-10">
        <h3 className="text-2xl font-extrabold text-navy">{content.headline}</h3>
        <p className="mt-2 max-w-2xl text-muted">{content.subhead}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.features.map((f, i) => (
            <AnimatedCard
              key={f.title}
              as="article"
              index={i}
              className="rounded-2xl border border-border bg-surface p-5"
            >
              <span className="card-icon inline-flex h-10 w-10 items-center justify-center rounded-full bg-critical-bg text-sm font-extrabold text-brand">
                {f.badge}
              </span>
              <h4 className="mt-3 font-bold text-navy">{f.title}</h4>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{f.text}</p>
            </AnimatedCard>
          ))}
        </div>
      </div>
    </div>
  )
}
