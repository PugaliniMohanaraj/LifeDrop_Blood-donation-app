import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  ArrowRight,
  Building2,
  Calendar,
  ChevronRight,
  Droplet,
  Heart,
  MapPin,
  Phone,
  Plus,
  Siren,
} from 'lucide-react'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { AnimatedCard } from '../../components/public/AnimatedCard'
import { HomeStakeholderSection } from '../../components/public/HomeStakeholderSection'
import { HomeStoryCarousel } from '../../components/public/HomeStoryCarousel'
import { ShareStoryModal } from '../../components/public/ShareStoryModal'
import { fetchPlatformStats } from '../../api/bloodBridge'
import { blogPosts, faqs, guideModules, upcomingCamps } from '../../data/publicContent'
import { publicImages } from '../../data/publicImages'

export function HomePage() {
  const [shareOpen, setShareOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState(0)
  const previewFaqs = faqs.slice(0, 5)
  const [stats, setStats] = useState([
    { value: '—', label: 'Active Donors' },
    { value: '—', label: 'Requests Today' },
    { value: '—', label: 'Hospitals' },
  ])

  useEffect(() => {
    void fetchPlatformStats()
      .then((s) =>
        setStats([
          { value: s.activeDonors.toLocaleString(), label: 'Active Donors' },
          { value: s.requestsToday.toLocaleString(), label: 'Requests Today' },
          { value: s.hospitals.toLocaleString(), label: 'Hospitals' },
        ]),
      )
      .catch(() => {})
  }, [])

  return (
    <PublicLayout>
      <ShareStoryModal open={shareOpen} onClose={() => setShareOpen(false)} />

      {/* Compact hero */}
      <section className="relative overflow-hidden border-b border-border bg-card">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(227,6,19,0.06),_transparent_50%)]"
          aria-hidden
        />
        <div className="container-app grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div>
            <h1 className="text-4xl font-extrabold leading-[1.08] text-navy sm:text-5xl lg:text-[3.25rem]">
              No life lost for
              <br />
              <span className="text-brand">the want of blood.</span>
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
              Sri Lanka&apos;s smart blood donation network — connecting donors, recipients, and
              verified healthcare partners across the island.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register?role=donor"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-7 py-3 text-base font-semibold text-white shadow-lg shadow-brand/25 hover:bg-brand-dark"
              >
                <Heart className="h-5 w-5" aria-hidden />
                Become a Donor
              </Link>
              <Link
                to="/register?role=recipient"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand px-7 py-3 text-base font-semibold text-brand hover:bg-critical-bg/40"
              >
                <Droplet className="h-5 w-5" aria-hidden />
                Request Blood
              </Link>
            </div>
          </div>
          <div className="relative flex justify-center lg:justify-end">
            <div className="absolute -inset-6 rounded-full bg-brand/10 blur-3xl" aria-hidden />
            <img
              src="/logo.png"
              alt="LifeDrop"
              className="relative w-[min(100%,22rem)] animate-float object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Emergency stats bar */}
      <section className="bg-gradient-to-r from-[#8B0A0A] via-brand to-[#C40510]">
        <div className="container-app flex flex-col gap-6 py-5 text-white lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Siren className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-bold">Need Blood Urgently?</h2>
              <p className="text-sm text-white/80">Notify available donors nearby now.</p>
            </div>
          </div>
          <dl className="grid flex-1 grid-cols-3 gap-3 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <dd className="text-xl font-extrabold sm:text-2xl">{s.value}</dd>
                <dt className="text-[11px] font-medium uppercase tracking-wide text-white/75">
                  {s.label}
                </dt>
              </div>
            ))}
          </dl>
          <Link
            to="/recipient/request?urgency=EMERGENCY"
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand hover:bg-slate-100"
          >
            Emergency Request
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* Stakeholder features — mockup style */}
      <HomeStakeholderSection />

      {/* Upcoming camps — for organizers */}
      <section className="border-t border-border bg-surface py-16 sm:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">For Organizers</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
              Upcoming <span className="text-brand">Donation Camps</span>
            </h2>
            <p className="mt-3 text-muted">
              Join a voluntary blood donation camp near you — or register your organization to host
              one with NBTS support.
            </p>
          </div>

          <div className="mt-10 space-y-4">
            {upcomingCamps.map((camp, i) => (
              <AnimatedCard
                key={camp.id}
                as="article"
                index={i}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <p className="text-xs font-bold uppercase tracking-wide text-brand">
                  Voluntary Blood Donation Camp
                </p>
                <h3 className="mt-2 text-lg font-bold text-navy">{camp.title}</h3>
                <div className="mt-4 grid gap-3 text-sm text-muted sm:grid-cols-2">
                  <p className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                    {new Date(camp.date).toLocaleDateString(undefined, {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                  <p className="flex items-center gap-2">
                    <Phone className="h-4 w-4 shrink-0 text-brand" aria-hidden />
                    {camp.phone}
                  </p>
                  <p className="flex items-start gap-2 sm:col-span-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand" aria-hidden />
                    {camp.venue}
                  </p>
                </div>
                <p className="mt-3 text-xs text-muted">
                  Conducted by {camp.conductedBy} · Organized by {camp.organizedBy}
                </p>
              </AnimatedCard>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/guide"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-brand px-6 py-2.5 text-sm font-bold text-brand hover:bg-critical-bg/40"
            >
              Find a Camp Near You
            </Link>
            <Link
              to="/organization/register"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark"
            >
              <Building2 className="h-4 w-4" aria-hidden />
              Register as Organizer
            </Link>
          </div>
        </div>
      </section>

      {/* Guide preview */}
      <section className="py-16 sm:py-20">
        <div className="container-app">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand">Guide</p>
            <h2 className="mt-2 text-3xl font-extrabold text-navy sm:text-4xl">
              Have questions about <span className="text-brand">blood donation?</span>
            </h2>
            <p className="mt-3 text-muted">
              Read our guides to understand eligibility, preparation, recovery, and more.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {guideModules.slice(0, 3).map((mod, i) => (
              <AnimatedCard
                key={mod.id}
                as={Link}
                to={`/guide#${mod.id}`}
                index={i}
                className="group block rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <span className="card-icon flex h-11 w-11 items-center justify-center rounded-xl bg-critical-bg text-brand">
                  <mod.icon className="h-5 w-5" aria-hidden />
                </span>
                <h3 className="mt-4 font-bold text-navy group-hover:text-brand">{mod.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted line-clamp-3">
                  {mod.description}
                </p>
                <p className="mt-3 text-xs font-semibold text-brand">{mod.modules} Modules</p>
              </AnimatedCard>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Link
              to="/guide"
              className="inline-flex min-h-11 items-center gap-2 rounded-full border-2 border-brand px-6 py-2.5 text-sm font-bold text-brand hover:bg-critical-bg/40"
            >
              Read Our Guides
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Stories carousel — red section */}
      <HomeStoryCarousel />

      {/* Blogs — Learn. Inspire. Share */}
      <section className="py-16 sm:py-24">
        <div className="container-app">
          <h2 className="text-center text-3xl font-extrabold text-navy sm:text-4xl">
            Learn. <span className="text-brand">Inspire.</span> Share
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-center text-muted">
            Your go-to source for blood donation news, guides, and impact stories.
          </p>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {blogPosts.slice(0, 3).map((post, i) => (
              <AnimatedCard
                key={post.slug}
                as={Link}
                to="/blogs"
                index={i}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-surface">
                  <img
                    src={post.image}
                    alt=""
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    onError={(e) => {
                      e.currentTarget.onerror = null
                      e.currentTarget.src = publicImages.hero.main
                    }}
                  />
                </div>
                <div className="relative flex flex-1 flex-col p-5 sm:p-6">
                  <h3 className="font-bold leading-snug text-navy group-hover:text-brand line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm text-muted line-clamp-3">{post.excerpt}</p>
                  <span className="absolute bottom-5 right-5 flex h-9 w-9 items-center justify-center rounded-full bg-brand text-white shadow-md transition group-hover:scale-110 sm:bottom-6 sm:right-6">
                    <ArrowRight className="h-4 w-4" aria-hidden />
                  </span>
                </div>
              </AnimatedCard>
            ))}
          </div>

          <div className="mt-10 text-center">
            <Link
              to="/blogs"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-8 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark"
            >
              View All Blogs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Our Why — two column */}
      <section className="border-t border-border bg-surface py-16 sm:py-24">
        <div className="container-app grid items-start gap-10 lg:grid-cols-2 lg:gap-16">
          <div className="overflow-hidden rounded-3xl shadow-lg">
            <img
              src={publicImages.home.whyMain}
              alt="Blood donation in Sri Lanka"
              className="aspect-[4/5] w-full object-cover lg:aspect-auto lg:min-h-[28rem]"
            />
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Our Why</p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
              The Problem We Couldn&apos;t Ignore
            </h2>
            <p className="mt-5 text-base leading-relaxed text-muted">
              When someone falls ill, finding blood should not become another crisis. Yet too often,
              families are left navigating fragmented networks, informal requests, and endless phone
              calls.
            </p>
            <p className="mt-4 text-base leading-relaxed text-muted">
              LifeDrop exists to bring clarity and coordination to that process — connecting donors,
              recipients, and verified healthcare partners across Sri Lanka.
            </p>
            <Link
              to="/about"
              className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-full bg-brand px-7 py-2.5 text-sm font-bold text-white shadow-md shadow-brand/20 hover:bg-brand-dark"
            >
              Read More
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>

            <div className="mt-8 grid grid-cols-2 gap-4">
              <img
                src={publicImages.home.whySmall1}
                alt="Voluntary blood donation"
                className="aspect-square rounded-2xl object-cover shadow-md"
              />
              <img
                src={publicImages.home.whySmall2}
                alt="Blood donation camp"
                className="aspect-square rounded-2xl object-cover shadow-md"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Share your story CTA */}
      <section className="relative overflow-hidden bg-brand py-14 sm:py-16">
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#6B0508] to-transparent opacity-60"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-20 opacity-20"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 120' preserveAspectRatio='none'%3E%3Cpath fill='%23000000' d='M0,80 C200,40 400,100 600,70 C800,40 1000,90 1200,60 L1200,120 L0,120 Z'/%3E%3C/svg%3E")`,
            backgroundSize: 'cover',
            backgroundPosition: 'bottom',
          }}
        />
        <div className="container-app relative text-center">
          <h2 className="text-2xl font-extrabold text-white sm:text-3xl lg:text-4xl">
            Every Donation Has a Story
          </h2>
          <button
            type="button"
            onClick={() => setShareOpen(true)}
            className="mt-8 inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-8 py-3 text-sm font-bold text-brand shadow-lg hover:bg-slate-50"
          >
            Share Your Story
            <ChevronRight className="h-4 w-4" aria-hidden />
          </button>
        </div>
      </section>

      {/* FAQs — two column */}
      <section className="py-16 sm:py-24">
        <div className="container-app grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:gap-16">
          <div className="lg:pt-4">
            <h2 className="text-4xl font-extrabold text-navy sm:text-5xl">FAQs</h2>
            <p className="mt-4 max-w-md text-base leading-relaxed text-muted">
              Everything you need to know about donating, eligibility, and how LifeDrop works across
              Sri Lanka.
            </p>
            <p className="mt-4 text-sm text-muted">
              Can&apos;t find your answer?{' '}
              <Link to="/contact" className="font-semibold text-brand hover:underline">
                Contact our team
              </Link>
              .
            </p>
          </div>

          <div className="space-y-2">
            {previewFaqs.map((f, i) => {
              const isOpen = openFaq === i
              return (
                <AnimatedCard
                  key={f.q}
                  index={i}
                  variant="default"
                  className={`overflow-hidden rounded-2xl border transition-colors ${
                    isOpen ? 'border-brand/30 bg-critical-bg/30' : 'border-border bg-card'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(isOpen ? -1 : i)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left sm:px-6"
                  >
                    <span className="font-semibold text-navy">{f.q}</span>
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-brand transition ${
                        isOpen ? 'rotate-45 bg-brand/10' : 'bg-critical-bg'
                      }`}
                    >
                      <Plus className="h-5 w-5" aria-hidden />
                    </span>
                  </button>
                  <div
                    className={`grid transition-all duration-300 ease-out ${
                      isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="border-t border-border px-5 pb-5 pt-3 text-sm leading-relaxed text-muted sm:px-6">
                        {f.a}
                      </p>
                    </div>
                  </div>
                </AnimatedCard>
              )
            })}
            <Link
              to="/faqs"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand hover:underline"
            >
              View all FAQs
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* Join network CTA */}
      <section className="bg-navy py-16 text-white">
        <div className="container-app text-center">
          <h2 className="text-3xl font-extrabold sm:text-4xl">
            Join Sri Lanka&apos;s Most Reliable Blood Donation Network
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-300">
            Be part of the change — donate safely, host camps, or register your hospital or blood
            bank on LifeDrop.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/register?role=donor"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-7 py-3 font-semibold text-white hover:bg-brand-dark"
            >
              <Heart className="h-5 w-5" aria-hidden />
              Become a Donor
            </Link>
            <Link
              to="/organization/register"
              className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-white/30 px-7 py-3 font-semibold text-white hover:bg-white/10"
            >
              <Building2 className="h-5 w-5" aria-hidden />
              For Organizations
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
