import { CheckCircle2, Quote, Star } from 'lucide-react'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { AnimatedCard } from '../../components/public/AnimatedCard'
import { PublicHero } from '../../components/public/PublicHero'
import { BrandMark } from '../../components/BrandMark'
import { publicPageHeroes } from '../../data/publicPageHeroes'
import {
  aboutGallery,
  aboutJourney,
  aboutMission,
  aboutPurpose,
  aboutTestimonials,
  aboutVision,
} from '../../data/publicContent'

function QuoteMark({ light = false }: { light?: boolean }) {
  return (
    <Quote
      className={`h-10 w-10 sm:h-12 sm:w-12 ${light ? 'text-white/90' : 'text-brand'}`}
      aria-hidden
    />
  )
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5" aria-label={`${count} out of 5 stars`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" aria-hidden />
      ))}
    </div>
  )
}

function JourneyCircle({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="flex justify-center lg:justify-center">
      <div className="h-44 w-44 overflow-hidden rounded-full border-4 border-white shadow-lg ring-2 ring-brand/20 sm:h-52 sm:w-52">
        <img src={src} alt={alt} className="h-full w-full object-cover" />
      </div>
    </div>
  )
}

function JourneyText({
  tag,
  title,
  text,
  bullets,
}: {
  tag: string
  title: string
  text: string
  bullets?: string[]
}) {
  return (
    <article className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
      <span className="inline-block rounded-full bg-brand px-3 py-1 text-xs font-bold text-white">
        {tag}
      </span>
      <h3 className="mt-4 text-xl font-extrabold text-navy sm:text-2xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">{text}</p>
      {bullets && (
        <ul className="mt-4 space-y-2">
          {bullets.map((b) => (
            <li key={b} className="flex gap-2 text-sm text-muted">
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
              {b}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

export function AboutPage() {
  return (
    <PublicLayout>
      <PublicHero {...publicPageHeroes.about} />

      {/* Mission & Vision */}
      <section className="py-12 sm:py-16">
        <div className="container-app">
          <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
            <article className="flex min-h-[18rem] flex-col justify-between rounded-2xl bg-brand p-6 text-white shadow-lg shadow-brand/20 sm:p-8">
              <QuoteMark light />
              <div>
                <h2 className="text-2xl font-extrabold sm:text-3xl">Our Mission</h2>
                <p className="mt-4 text-sm leading-relaxed text-white/90 sm:text-base">
                  {aboutMission}
                </p>
              </div>
            </article>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img
                src={aboutGallery.mission}
                alt="Team collaborating on LifeDrop"
                className="h-full min-h-[14rem] w-full object-cover sm:min-h-[18rem]"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
              <img
                src={aboutGallery.vision}
                alt="Community united in support"
                className="h-full min-h-[14rem] w-full object-cover sm:min-h-[18rem]"
              />
            </div>

            <article className="flex min-h-[18rem] flex-col justify-between rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8">
              <QuoteMark />
              <div>
                <h2 className="text-2xl font-extrabold text-brand sm:text-3xl">Our Vision</h2>
                <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{aboutVision}</p>
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* Journey timeline */}
      <section className="border-t border-border bg-surface py-14 sm:py-20">
        <div className="container-app">
          <div className="text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Our Journey</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
              From Compassion to Commitment
            </h2>
          </div>

          <div className="relative mt-14 space-y-14 lg:space-y-20">
            <div
              className="absolute bottom-0 left-1/2 top-0 hidden w-px -translate-x-1/2 bg-border lg:block"
              aria-hidden
            />

            {aboutJourney.map((step) => {
              const text = (
                <JourneyText
                  tag={step.tag}
                  title={step.title}
                  text={step.text}
                  bullets={'bullets' in step ? step.bullets : undefined}
                />
              )

              const visual =
                'logo' in step && step.logo ? (
                  <div className="flex min-h-[12rem] items-center justify-center rounded-2xl border border-border bg-card p-8 shadow-sm">
                    <BrandMark />
                  </div>
                ) : 'image' in step && step.image ? (
                  <JourneyCircle src={step.image} alt={step.title} />
                ) : null

              return (
                <div
                  key={step.tag}
                  className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-6"
                >
                  <span
                    className="absolute left-1/2 top-1/2 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand ring-4 ring-critical-bg lg:block"
                    aria-hidden
                  />

                  {step.side === 'left' ? (
                    <>
                      <div className="lg:pr-8">{text}</div>
                      <div className="hidden lg:block" aria-hidden />
                      <div className="lg:pl-8">{visual}</div>
                    </>
                  ) : (
                    <>
                      <div className="lg:pr-8 lg:text-right">{visual}</div>
                      <div className="hidden lg:block" aria-hidden />
                      <div className="lg:pl-8">{text}</div>
                    </>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Our Purpose */}
      <section className="bg-critical-bg/40 py-14 sm:py-20">
        <div className="container-app grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">
              {aboutPurpose.eyebrow}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
              {aboutPurpose.headline}{' '}
              <span className="text-brand">{aboutPurpose.highlight}</span> {aboutPurpose.headlineEnd}
            </h2>
            <p className="mt-4 text-muted leading-relaxed">{aboutPurpose.text}</p>
            <ul className="mt-6 space-y-3">
              {aboutPurpose.points.map((point) => (
                <li key={point} className="flex gap-3 text-sm text-navy sm:text-base">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand text-white">
                    <CheckCircle2 className="h-3.5 w-3.5" aria-hidden />
                  </span>
                  {point}
                </li>
              ))}
            </ul>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border shadow-md">
            <img
              src={aboutPurpose.image}
              alt="Medical professionals working together"
              className="aspect-[4/3] w-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-14 sm:py-20">
        <div className="container-app">
          <div className="grid gap-6 lg:grid-cols-2">
            {aboutTestimonials.map((member, i) => (
              <AnimatedCard
                key={member.name}
                as="article"
                index={i}
                className="relative overflow-hidden rounded-2xl bg-brand p-6 text-white shadow-lg shadow-brand/25 sm:p-8"
              >
                <Quote className="absolute right-6 top-6 h-14 w-14 text-white/20" aria-hidden />
                <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start">
                  <img
                    src={member.photo}
                    alt=""
                    className="h-20 w-20 shrink-0 rounded-full border-4 border-white/30 object-cover shadow-md"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="text-xl font-extrabold sm:text-2xl">{member.name}</h3>
                    <p className="mt-0.5 text-sm font-semibold text-white/80">{member.role}</p>
                    <p className="mt-4 text-sm leading-relaxed text-white/95 sm:text-[0.95rem]">
                      &ldquo;{member.quote}&rdquo;
                    </p>
                    <div className="mt-5">
                      <StarRating count={member.rating} />
                    </div>
                  </div>
                </div>
              </AnimatedCard>
            ))}
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
