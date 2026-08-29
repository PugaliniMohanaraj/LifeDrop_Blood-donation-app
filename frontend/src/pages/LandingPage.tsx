import { Link } from 'react-router-dom'
import { Droplet, Heart, Siren, CheckCircle2, Users, Handshake, ArrowRight } from 'lucide-react'
import { PublicNavbar } from '../components/layout/Navbar'
import { Card } from '../components/ui'

const steps = [
  {
    n: '1',
    title: 'Create an account',
    text: 'Register as a donor or recipient in a few simple steps.',
  },
  {
    n: '2',
    title: 'Request or donate blood',
    text: 'Recipients create requests. Donors set availability.',
  },
  {
    n: '3',
    title: 'Find suitable donors',
    text: 'We match by blood group, location, and availability.',
  },
  {
    n: '4',
    title: 'Connect',
    text: 'Send and accept donation requests with clear status updates.',
  },
  {
    n: '5',
    title: 'Complete the donation',
    text: 'Track progress until the donation is completed safely.',
  },
]

export function LandingPage() {
  return (
    <div className="min-h-screen bg-surface">
      <PublicNavbar />

      {/* Hero — one composition, brand first */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-white via-surface to-critical-bg/40">
        <div
          className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand/10 blur-3xl"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -bottom-32 left-10 h-64 w-64 rounded-full bg-navy/5 blur-3xl"
          aria-hidden
        />
        <div className="container-app grid items-center gap-10 py-16 lg:grid-cols-2 lg:py-24">
          <div>
            <p className="mb-3 text-sm font-bold uppercase tracking-[0.2em] text-brand">
              Blood Bridge
            </p>
            <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-navy sm:text-5xl">
              Every Drop Can Save a Life.
            </h1>
            <p className="mt-4 max-w-lg text-lg text-muted">
              Connect with blood donors and find blood when it matters most.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/register?role=recipient"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-brand px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-brand-dark"
              >
                <Droplet className="h-5 w-5" aria-hidden />
                Find Blood
              </Link>
              <Link
                to="/register?role=donor"
                className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-white px-6 py-3 text-base font-semibold text-navy hover:bg-slate-50"
              >
                <Heart className="h-5 w-5 text-brand" aria-hidden />
                Become a Donor
              </Link>
            </div>
          </div>

          <div className="relative">
            <div className="aspect-[4/3] overflow-hidden rounded-3xl bg-gradient-to-br from-navy to-brand shadow-xl">
              <div className="flex h-full flex-col items-center justify-center p-8 text-center text-white">
                <Droplet className="mb-4 h-16 w-16 opacity-90" fill="currentColor" />
                <p className="text-2xl font-bold">Trusted donor matching</p>
                <p className="mt-2 max-w-xs text-sm text-white/80">
                  Clear status, nearby matches, and emergency support — designed for people, not
                  paperwork.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency — visually distinct, not alarming whole site */}
      <section className="container-app py-10">
        <Card className="flex flex-col items-start gap-4 border-critical/30 bg-critical-bg/50 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-critical text-white">
              <Siren className="h-6 w-6" aria-hidden />
            </span>
            <div>
              <h2 className="text-xl font-bold text-navy">Need Blood Urgently?</h2>
              <p className="text-sm text-muted">
                Submit an emergency request and notify suitable available donors nearby.
              </p>
            </div>
          </div>
          <Link
            to="/recipient/request?urgency=EMERGENCY"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-critical px-5 py-3 text-sm font-semibold text-white ring-2 ring-critical/30 hover:bg-red-800"
          >
            <Siren className="h-4 w-4" aria-hidden />
            Request Emergency Blood
          </Link>
        </Card>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="scroll-mt-20 border-y border-border bg-white py-16">
        <div className="container-app">
          <h2 className="text-3xl font-extrabold text-navy">How Blood Bridge Works</h2>
          <p className="mt-2 max-w-2xl text-muted">
            A simple path from need to donation — with status you can always see.
          </p>
          <ol className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {steps.map((s) => (
              <li key={s.n} className="rounded-2xl border border-border bg-surface p-4">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand text-sm font-bold text-white">
                  {s.n}
                </span>
                <h3 className="mt-3 font-semibold text-navy">{s.title}</h3>
                <p className="mt-1 text-sm text-muted">{s.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* About */}
      <section id="about" className="scroll-mt-20 py-16">
        <div className="container-app grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <h2 className="text-3xl font-extrabold text-navy">About</h2>
            <p className="mt-3 text-muted">
              Blood Bridge helps communities connect donors, recipients, hospitals, and blood banks
              with clear, human-centered design.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3 lg:col-span-2">
            {[
              {
                icon: Users,
                title: 'For donors & recipients',
                text: 'Register once, stay informed, act quickly.',
              },
              {
                icon: CheckCircle2,
                title: 'Verified organizations',
                text: 'Hospitals and blood banks are reviewed before access.',
              },
              {
                icon: Handshake,
                title: 'Clear matching',
                text: 'See why a donor matches — never guess.',
              },
            ].map((f) => (
              <Card key={f.title}>
                <f.icon className="h-6 w-6 text-brand" aria-hidden />
                <h3 className="mt-3 font-semibold text-navy">{f.title}</h3>
                <p className="mt-1 text-sm text-muted">{f.text}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Org CTA */}
      <section className="border-t border-border bg-navy py-12 text-white">
        <div className="container-app flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div>
            <h2 className="text-2xl font-bold">Registering a hospital or blood bank?</h2>
            <p className="mt-1 text-slate-300">
              Organization accounts require verification to protect patients and donors.
            </p>
          </div>
          <Link
            to="/organization/register"
            className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-navy hover:bg-slate-100"
          >
            Organization Registration
            <ArrowRight className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </section>

      <footer className="border-t border-border bg-white py-8">
        <div className="container-app flex flex-col gap-2 text-sm text-muted sm:flex-row sm:items-center sm:justify-between">
          <p className="font-semibold text-navy">Blood Bridge</p>
          <p>Built to demonstrate HCI principles in healthcare matching.</p>
        </div>
      </footer>
    </div>
  )
}
