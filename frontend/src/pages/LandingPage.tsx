import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'
import {
  Activity,
  ArrowRight,
  Building2,
  CheckCircle2,
  Droplet,
  Heart,
  ShieldCheck,
  Siren,
  Target,
  UserPlus,
  Users,
} from 'lucide-react'
import { PublicNavbar } from '../components/layout/Navbar'
import { BrandMark } from '../components/BrandMark'
import { fetchPlatformStats } from '../api/bloodBridge'

const steps = [
  {
    n: '1',
    title: 'Create an Account',
    text: 'Register as a donor or recipient in a few simple steps.',
    icon: UserPlus,
  },
  {
    n: '2',
    title: 'Request or Donate Blood',
    text: 'Ask for blood when you need it, or open your availability to help.',
    icon: Droplet,
  },
  {
    n: '3',
    title: 'Find Suitable Donors',
    text: 'We match by blood group, location, and availability.',
    icon: Users,
  },
  {
    n: '4',
    title: 'Connect & Complete',
    text: 'Send requests, accept donations, and track status clearly.',
    icon: Heart,
  },
]

const reasons = [
  {
    icon: ShieldCheck,
    title: 'Safe & Verified',
    text: 'Hospitals and blood banks are reviewed before accessing organization tools.',
    tone: 'bg-critical-bg text-brand',
  },
  {
    icon: Target,
    title: 'Clear Matching',
    text: 'Compare donors with transparent match scores — never a medical guess.',
    tone: 'bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-300',
  },
  {
    icon: CheckCircle2,
    title: 'Real-time Status',
    text: 'See pending, matching, accepted, and completed states at every step.',
    tone: 'bg-success-bg text-success',
  },
  {
    icon: Users,
    title: 'For Everyone',
    text: 'Donors, recipients, hospitals, and blood banks — each with a focused experience.',
    tone: 'bg-orange-100 text-orange-700 dark:bg-orange-950 dark:text-orange-300',
  },
]

const faqs = [
  {
    q: 'Who can register on LifeDrop?',
    a: 'Anyone can register as a donor or recipient. Hospitals and blood banks use Organization Registration and must be verified first.',
  },
  {
    q: 'How do emergency requests work?',
    a: 'Emergency requests ask for confirmation first, then notify suitable available donors nearby.',
  },
  {
    q: 'Is the match score a medical guarantee?',
    a: 'No. Match score helps compare options using blood group, eligibility, availability, and location.',
  },
]

export function LandingPage() {
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
      .catch(() => {
        /* keep placeholders */
      })
  }, [])

  return (
    <div className="min-h-screen bg-surface">
      <PublicNavbar />

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(227,6,19,0.08),_transparent_55%),radial-gradient(ellipse_at_bottom_left,_rgba(11,28,51,0.05),_transparent_50%)]"
          aria-hidden
        />

        <div className="container-app relative grid items-center gap-10 py-14 lg:grid-cols-2 lg:gap-12 lg:py-20 xl:gap-16">
          <div className="animate-fade-up">
            <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-navy sm:text-5xl lg:text-[3.5rem]">
              Every Drop Can <span className="text-brand">Save a Life</span>
            </h1>
            <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
              LifeDrop connects donors, recipients, and hospitals so the right blood reaches the
              right person — faster and with clear status every step of the way.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register?role=recipient"
                className="inline-flex min-h-12 items-center gap-2 rounded-full bg-brand px-7 py-3 text-base font-semibold text-white shadow-lg shadow-brand/25 transition hover:bg-brand-dark"
              >
                <Droplet className="h-5 w-5" aria-hidden />
                Find Blood
              </Link>
              <Link
                to="/register?role=donor"
                className="inline-flex min-h-12 items-center gap-2 rounded-full border-2 border-brand bg-white px-7 py-3 text-base font-semibold text-brand transition hover:bg-critical-bg/40"
              >
                <Heart className="h-5 w-5" aria-hidden />
                Become a Donor
              </Link>
            </div>

            <div className="mt-8 flex items-center gap-3">
              <div className="flex -space-x-2.5" aria-hidden>
                {['#0B1C33', '#E30613', '#2563EB', '#15803D', '#EA580C'].map((c) => (
                  <span
                    key={c}
                    className="h-9 w-9 rounded-full border-[2.5px] border-white shadow-sm"
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">
                  <span className="text-brand">+2K</span> Join thousands of donors
                </p>
                <p className="text-xs text-muted">making a difference every day.</p>
              </div>
            </div>
          </div>

          <div className="animate-fade-up-delay relative flex min-h-[24rem] items-center justify-center lg:min-h-[32rem]">
            {/* floating chips */}
            <span className="absolute left-4 top-10 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-border animate-float sm:left-10">
              <Droplet className="h-5 w-5 text-brand" fill="currentColor" />
            </span>
            <span className="absolute right-6 top-20 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-border sm:right-14" style={{ animationDelay: '0.6s' }}>
              <Heart className="h-5 w-5 text-brand" />
            </span>
            <span className="absolute bottom-20 left-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-border sm:bottom-24 sm:left-16" style={{ animationDelay: '1s' }}>
              <Building2 className="h-5 w-5 text-navy" />
            </span>
            <span className="absolute bottom-12 right-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-border sm:right-16" style={{ animationDelay: '1.4s' }}>
              <Users className="h-5 w-5 text-brand" />
            </span>

            <div className="animate-float relative z-10">
              <div className="absolute -inset-12 rounded-full bg-brand/10 blur-3xl" aria-hidden />
              <img
                src="/logo.png"
                alt="LifeDrop — every drop can save a life"
                className="relative w-[min(100%,26rem)] rounded-[2rem] object-contain drop-shadow-2xl xl:w-[30rem]"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Emergency bar — full bleed like reference */}
      <section className="bg-gradient-to-r from-[#8B0A0A] via-brand to-[#C40510]">
        <div className="container-app flex flex-col gap-6 py-5 text-white lg:flex-row lg:items-center lg:justify-between lg:gap-8">
          <div className="flex items-center gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white/15">
              <Siren className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="text-lg font-bold">Need Blood Urgently?</h2>
              <p className="text-sm text-white/80">Notify available donors nearby now.</p>
            </div>
          </div>

          <dl className="grid flex-1 grid-cols-3 gap-3 text-center sm:gap-6">
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
            className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand transition hover:bg-slate-100"
          >
            Request Emergency Blood
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-24 w-full bg-surface py-16 sm:py-20">
        <div className="container-app w-full">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">How LifeDrop Works</h2>
            <div className="mt-3 flex items-center justify-center gap-2 text-brand" aria-hidden>
              <span className="h-px w-8 bg-brand/40" />
              <Activity className="h-5 w-5" />
              <span className="h-px w-8 bg-brand/40" />
            </div>
            <p className="mx-auto mt-3 max-w-2xl text-muted">
              Four clear steps from need to donation.
            </p>
          </div>

          <ol className="mt-12 grid w-full gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((s, i) => (
              <li key={s.n} className="relative">
                {i < steps.length - 1 && (
                  <span
                    className="absolute left-[calc(50%+2.5rem)] top-14 hidden w-[calc(100%-3rem)] border-t-2 border-dotted border-brand/30 lg:block"
                    aria-hidden
                  />
                )}
                <article className="relative h-full rounded-2xl border border-border bg-white p-6 text-center shadow-sm">
                  <span className="absolute -top-3 left-1/2 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full bg-brand text-xs font-bold text-white shadow">
                    {s.n}
                  </span>
                  <span className="mx-auto mt-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-critical-bg text-brand">
                    <s.icon className="h-6 w-6" aria-hidden />
                  </span>
                  <h3 className="mt-4 font-bold text-navy">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{s.text}</p>
                </article>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Why choose */}
      <section id="about" className="scroll-mt-24 w-full py-16 sm:py-20">
        <div className="container-app grid w-full items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="w-full">
            <h2 className="text-3xl font-extrabold text-navy sm:text-4xl">Why Choose LifeDrop?</h2>
            <p className="mt-3 max-w-xl text-muted">
              Designed with HCI principles so every action feels clear, safe, and fast — for donors
              and people in need.
            </p>

            <div className="mt-8 grid w-full gap-4 sm:grid-cols-2">
              {reasons.map((r) => (
                <article
                  key={r.title}
                  className="rounded-2xl border border-border bg-white p-5 shadow-sm"
                >
                  <span className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${r.tone}`}>
                    <r.icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-3 font-bold text-navy">{r.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{r.text}</p>
                </article>
              ))}
            </div>
          </div>

          <div className="relative flex justify-center">
            <div className="absolute inset-10 rounded-full bg-brand/10 blur-3xl" aria-hidden />
            <img
              src="/logo.png"
              alt=""
              className="relative w-full max-w-md rounded-[2rem] object-contain drop-shadow-xl"
            />
          </div>
        </div>
      </section>

      {/* Organizations — full width banner inside wide container */}
      <section id="organizations" className="scroll-mt-24 w-full pb-16">
        <div className="container-app">
          <div className="flex w-full flex-col items-start justify-between gap-6 overflow-hidden rounded-3xl bg-brand px-6 py-8 text-white sm:flex-row sm:items-center sm:px-10 lg:px-12">
            <div className="flex items-center gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-white/15">
                <Building2 className="h-7 w-7" aria-hidden />
              </span>
              <div>
                <h2 className="text-xl font-bold sm:text-2xl">For Organizations</h2>
                <p className="mt-1 text-sm text-white/85">
                  Registering a hospital or blood bank? Verification protects patients and donors.
                </p>
              </div>
            </div>
            <Link
              to="/organization/register"
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-brand hover:bg-slate-100"
            >
              Organization Registration
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQs — full page width */}
      <section id="faqs" className="scroll-mt-24 w-full border-t border-border bg-surface py-16">
        <div className="container-app w-full">
          <h2 className="text-center text-3xl font-extrabold text-navy">FAQs</h2>
          <p className="mt-2 text-center text-muted">Quick answers before you get started.</p>
          <div className="mt-8 grid w-full gap-3">
            {faqs.map((f) => (
              <details
                key={f.q}
                className="group rounded-2xl border border-border bg-white px-5 py-4 open:shadow-sm"
              >
                <summary className="cursor-pointer list-none font-semibold text-navy">
                  <span className="flex items-center justify-between gap-3">
                    {f.q}
                    <span className="text-brand transition group-open:rotate-45">+</span>
                  </span>
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-muted">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="scroll-mt-24 bg-navy text-white">
        <div className="container-app grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <BrandMark light compact />
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Connecting donors and recipients with clear, human-centered blood matching.
            </p>
          </div>
          <div>
            <h3 className="font-bold">Quick Links</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><a href="/" className="hover:text-white">Home</a></li>
              <li><a href="/#how-it-works" className="hover:text-white">How It Works</a></li>
              <li><a href="/#about" className="hover:text-white">About Us</a></li>
              <li><a href="/#organizations" className="hover:text-white">For Organizations</a></li>
              <li><a href="/#faqs" className="hover:text-white">FAQs</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold">For Donors</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link to="/register?role=donor" className="hover:text-white">Become a Donor</Link></li>
              <li><Link to="/donor" className="hover:text-white">Donor Dashboard</Link></li>
              <li><Link to="/donor/requests" className="hover:text-white">Blood Requests</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold">For Recipients</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li><Link to="/recipient/request" className="hover:text-white">Request Blood</Link></li>
              <li><Link to="/recipient/matches" className="hover:text-white">Find Donors</Link></li>
              <li>
                <Link to="/recipient/request?urgency=EMERGENCY" className="hover:text-white">
                  Emergency Request
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="font-bold">Contact Us</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-300">
              <li>+94 11 200 2002</li>
              <li>support@lifedrop.lk</li>
              <li>Colombo, Sri Lanka</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-white/10">
          <div className="container-app flex flex-col gap-2 py-5 text-xs text-slate-400 sm:flex-row sm:justify-between">
            <p>© {new Date().getFullYear()} LifeDrop. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
