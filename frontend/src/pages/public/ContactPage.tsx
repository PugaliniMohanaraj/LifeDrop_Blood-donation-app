import type { FormEvent } from 'react'
import { Clock, Mail, MapPin, MessageSquare, Phone, Send } from 'lucide-react'
import { PublicLayout } from '../../components/layout/PublicLayout'
import { AnimatedCard } from '../../components/public/AnimatedCard'
import { PublicPageSection } from '../../components/public/PublicHero'
import { publicImages } from '../../data/publicImages'
import { Button, Input } from '../../components/ui'
import { useToast } from '../../context/ToastContext'

const contactChannels = [
  {
    icon: Phone,
    title: 'Phone',
    detail: '+94 11 200 2002',
    hint: 'Mon–Fri, 8:00 AM – 6:00 PM',
    href: 'tel:+94112002002',
  },
  {
    icon: Mail,
    title: 'Email',
    detail: 'support@lifedrop.lk',
    hint: 'We reply within 1–2 business days',
    href: 'mailto:support@lifedrop.lk',
  },
  {
    icon: MapPin,
    title: 'Office',
    detail: 'Colombo 05, Sri Lanka',
    hint: 'National Blood Transfusion Service area',
    href: undefined,
  },
] as const

function ContactHero() {
  return (
    <section className="relative overflow-hidden bg-navy pb-16 pt-8 sm:pb-20 sm:pt-10">
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="absolute right-0 top-0 h-full w-[55%] bg-gradient-to-l from-navy/20 to-navy">
          <img
            src={publicImages.hero.contact}
            alt=""
            className="h-full w-full object-cover object-center opacity-90"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/95 to-navy/40" />
        <MessageSquare className="absolute right-[12%] top-[18%] h-16 w-16 text-white/15" />
        <Mail className="absolute right-[22%] top-[42%] h-20 w-20 text-white/10" />
        <Phone className="absolute right-[8%] bottom-[28%] h-14 w-14 text-white/12" />
      </div>

      <div className="container-app relative z-10 py-8 sm:py-12">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-brand">Get in Touch</p>
        <h1 className="mt-3 text-4xl font-extrabold tracking-[0.1em] text-white sm:text-5xl lg:text-6xl">
          CONTACT US
        </h1>
        <p className="mt-4 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
          Questions, feedback, or partnership enquiries — we are here to help.
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

export function ContactPage() {
  const { toast } = useToast()

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    const name = String(fd.get('name') || '').trim()
    const email = String(fd.get('email') || '').trim()
    const subject = String(fd.get('subject') || '').trim()
    const message = String(fd.get('message') || '').trim()

    if (!name || !email || !subject || !message) {
      toast('Please fill in all required fields.', 'error')
      return
    }

    const mailSubject = encodeURIComponent(`[LifeDrop Contact] ${subject}`)
    const mailBody = encodeURIComponent(
      `Name: ${name}\nEmail: ${email}\n\n${message}`,
    )
    window.location.href = `mailto:support@lifedrop.lk?subject=${mailSubject}&body=${mailBody}`
    toast('Your email app will open so you can send the message.', 'info')
    form.reset()
  }

  return (
    <PublicLayout>
      <ContactHero />

      <PublicPageSection className="!pt-8">
        <div className="grid gap-5 sm:grid-cols-3">
          {contactChannels.map((channel, i) => (
            <AnimatedCard
              key={channel.title}
              as="article"
              index={i}
              className="flex flex-col items-center rounded-2xl border border-border bg-card p-6 text-center shadow-sm"
            >
              <span className="card-icon flex h-14 w-14 items-center justify-center rounded-full bg-critical-bg text-brand">
                <channel.icon className="h-6 w-6" aria-hidden />
              </span>
              <h2 className="mt-4 text-base font-bold text-navy">{channel.title}</h2>
              {channel.href ? (
                <a
                  href={channel.href}
                  className="mt-2 text-sm font-semibold text-brand hover:underline"
                >
                  {channel.detail}
                </a>
              ) : (
                <p className="mt-2 text-sm font-semibold text-navy">{channel.detail}</p>
              )}
              <p className="mt-1 text-xs text-muted">{channel.hint}</p>
            </AnimatedCard>
          ))}
        </div>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:gap-12">
          <AnimatedCard variant="default" className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
            <h2 className="text-xl font-extrabold text-navy sm:text-2xl">
              We&apos;re here to <span className="text-brand">help</span>
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-muted sm:text-base">
              Our support team is available on weekdays. For urgent blood needs, please use the
              emergency request flow after signing in — it reaches nearby available donors faster
              than email.
            </p>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-critical-bg text-brand">
                  <Clock className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-navy">Office hours</p>
                  <p className="text-sm text-muted">Monday – Friday, 8:00 AM – 6:00 PM (IST)</p>
                </div>
              </li>
              <li className="flex items-start gap-3 rounded-xl border border-border bg-card p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-critical-bg text-brand">
                  <MapPin className="h-5 w-5" aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-navy">Coverage</p>
                  <p className="text-sm text-muted">
                    Serving donors and hospitals across all provinces in Sri Lanka.
                  </p>
                </div>
              </li>
            </ul>

            <div className="mt-6 rounded-xl bg-brand/10 px-4 py-3 text-sm text-navy">
              <span className="font-bold text-brand">Emergency blood need?</span>{' '}
              Sign in and use{' '}
              <span className="font-semibold">Emergency Request</span> for the fastest response.
            </div>
          </AnimatedCard>

          <AnimatedCard
            as="form"
            index={1}
            onSubmit={handleSubmit}
            className="rounded-2xl border border-border bg-card p-6 shadow-sm sm:p-8"
          >
            <h2 className="text-xl font-extrabold text-navy sm:text-2xl">Send a message</h2>
            <p className="mt-2 text-sm text-muted">
              Fill in the form below — your email app will open so you can send the message to our
              team.
            </p>
            <div className="mt-6 space-y-4">
              <Input label="Your name" name="name" required placeholder="Arun Kumar" />
              <Input
                label="Email"
                name="email"
                type="email"
                required
                placeholder="you@example.com"
              />
              <div>
                <label
                  htmlFor="subject"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Subject
                </label>
                <input
                  id="subject"
                  name="subject"
                  required
                  placeholder="How can we help?"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
              <div>
                <label
                  htmlFor="message"
                  className="mb-1.5 block text-sm font-semibold text-foreground"
                >
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  placeholder="Tell us more about your question…"
                  className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-foreground outline-none transition focus:border-brand focus:ring-2 focus:ring-brand/20"
                />
              </div>
            </div>
            <Button type="submit" className="mt-6 w-full gap-2">
              Send message
              <Send className="h-4 w-4" aria-hidden />
            </Button>
          </AnimatedCard>
        </div>
      </PublicPageSection>
    </PublicLayout>
  )
}
