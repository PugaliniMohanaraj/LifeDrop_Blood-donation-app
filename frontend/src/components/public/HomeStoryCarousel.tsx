import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react'
import { donorStories } from '../../data/publicContent'

export function HomeStoryCarousel() {
  const [index, setIndex] = useState(0)
  const story = donorStories[index]
  const total = donorStories.length

  function prev() {
    setIndex((i) => (i === 0 ? total - 1 : i - 1))
  }

  function next() {
    setIndex((i) => (i === total - 1 ? 0 : i + 1))
  }

  return (
    <section className="relative overflow-hidden bg-brand py-16 sm:py-20">
      <div className="container-app">
        <h2 className="text-center text-3xl font-extrabold text-white sm:text-4xl lg:text-5xl">
          Stories That Remind Us Why This{' '}
          <span className="font-serif italic">Matters.</span>
        </h2>

        <div className="relative mx-auto mt-10 max-w-3xl">
          <button
            type="button"
            onClick={prev}
            className="absolute -left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:-left-14 sm:h-12 sm:w-12"
            aria-label="Previous story"
          >
            <ChevronLeft className="h-6 w-6" />
          </button>

          <article className="rounded-3xl bg-card p-6 shadow-2xl sm:p-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-critical-bg px-4 py-1.5 text-sm font-bold text-brand">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand text-xs text-white">
                ♥
              </span>
              {story.bloodGroup}
            </span>

            <blockquote className="mt-6 text-xl font-extrabold leading-snug text-brand sm:text-2xl">
              &ldquo;{story.quote}&rdquo;
            </blockquote>
            <p className="mt-4 text-sm leading-relaxed text-muted sm:text-base">{story.excerpt}</p>

            <footer className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
              <div className="flex items-center gap-3">
                {story.photo ? (
                  <img
                    src={story.photo}
                    alt=""
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-brand/20"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                    {story.name
                      .split(/\s+/)
                      .map((p) => p[0])
                      .join('')
                      .slice(0, 2)}
                  </span>
                )}
                <div>
                  <p className="font-bold text-navy">{story.name}</p>
                  <p className="text-sm text-muted">{story.location}</p>
                </div>
              </div>
              <Link
                to="/stories"
                className="inline-flex items-center gap-1.5 rounded-full border-2 border-brand px-5 py-2 text-sm font-bold text-brand hover:bg-critical-bg/50"
              >
                Read
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
            </footer>
          </article>

          <button
            type="button"
            onClick={next}
            className="absolute -right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:-right-14 sm:h-12 sm:w-12"
            aria-label="Next story"
          >
            <ChevronRight className="h-6 w-6" />
          </button>
        </div>

        <div className="mt-8 flex justify-center gap-2">
          {donorStories.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
              }`}
              aria-label={`Go to story ${i + 1}`}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/stories"
            className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-white px-8 py-2.5 text-sm font-bold text-white hover:bg-white/10"
          >
            Explore More Stories
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  )
}
