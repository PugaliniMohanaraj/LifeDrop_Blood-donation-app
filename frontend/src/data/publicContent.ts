import type { LucideIcon } from 'lucide-react'
import {
  Activity,
  Bell,
  BookOpen,
  Building2,
  Calendar,
  CheckCircle2,
  Clock,
  Droplet,
  Heart,
  ShieldCheck,
  Target,
  UserPlus,
  Users,
} from 'lucide-react'
import { publicImages } from './publicImages'

export const howItWorksSteps = [
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

export const whyChooseReasons = [
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

export const faqs = [
  {
    q: 'What is LifeDrop?',
    a: 'LifeDrop is a community-driven platform connecting blood donors, recipients, hospitals, and blood banks across Sri Lanka — with clear status at every step.',
  },
  {
    q: 'Who can register on LifeDrop?',
    a: 'Anyone can register as a donor or recipient. Hospitals and blood banks use Organization Registration and must be verified first.',
  },
  {
    q: 'Who is eligible to donate blood?',
    a: 'Generally donors aged 18–65, weighing at least 50 kg, in good health, and meeting standard screening criteria. LifeDrop guides you through eligibility checks before you donate.',
  },
  {
    q: 'How do emergency requests work?',
    a: 'Emergency requests ask for confirmation first, then notify suitable available donors nearby.',
  },
  {
    q: 'Is the match score a medical guarantee?',
    a: 'No. Match score helps compare options using blood group, eligibility, availability, and location.',
  },
  {
    q: 'How often can I donate blood?',
    a: 'Whole blood donations are typically allowed every 12–16 weeks. LifeDrop tracks your last donation date and reminds you when you may be eligible again.',
  },
  {
    q: 'Is it free to use?',
    a: 'Yes. LifeDrop is free for donors and recipients. Verified hospitals and blood banks use organization tools at no cost during our launch period.',
  },
  {
    q: 'Is my personal information shared publicly?',
    a: 'No. Your contact details are shared only after you accept a request. Your full profile stays private.',
  },
]

export type BlogPost = {
  slug: string
  title: string
  excerpt: string
  date: string
  category: 'Awareness' | 'Platform' | 'Guide'
  readMinutes: number
  image: string
  source: string
  sourceLabel: string
  body: string[]
}

/** Blog facts sourced from NBTS (nbts.health.gov.lk) and WHO Sri Lanka blood service data. */
export const blogPosts: BlogPost[] = [
  {
    slug: 'blood-donation-colombo-guide',
    title: 'Blood Donation in Colombo: A Complete Guide for First-Time Donors',
    excerpt:
      'Visit the National Blood Centre in Narahenpita (8 AM–6 PM daily) or any of 108 island-wide NBTS blood banks — open 8 AM–4 PM, every day of the year.',
    date: '2025-06-14',
    category: 'Awareness',
    readMinutes: 6,
    image: publicImages.blogs.colombo,
    source: 'https://nbts.health.gov.lk/contact-us/',
    sourceLabel: 'NBTS Sri Lanka — Contact & Donation Hours',
    body: [
      'The National Blood Transfusion Service (NBTS), under Sri Lanka\'s Ministry of Health, is the sole provider of blood and blood products to all government hospitals and most private hospitals. Its headquarters — the National Blood Centre (NBC) — is at No. 555/5D, Elvitigala Mawatha, Narahenpita, Colombo 05.',
      'The NBC welcomes donors every day from 8:00 AM to 6:00 PM. All other NBTS blood banks across the island accept donors from 8:00 AM to 4:00 PM, any day of the year — including weekends and public holidays.',
      'NBTS operates more than 108 blood banks island-wide, grouped into 24 clusters. You do not need an online appointment; eligible donors can walk in with a National Identity Card or valid photo ID.',
      'Around 85% of Sri Lanka\'s blood supply is collected through mobile donation campaigns organised by schools, workplaces, and community groups. NBTS publishes upcoming camp schedules on its website — useful if you prefer donating closer to home outside central Colombo.',
      'Before you travel, confirm eligibility on the NBTS donate-blood page: donors must be aged 18–60 (first-time donors up to 55), weigh above 50 kg, and have haemoglobin above 12.5 g/dL. LifeDrop helps you track eligibility and find nearby donors when hospitals need blood urgently.',
    ],
  },
  {
    slug: 'emergency-requests-explained',
    title: 'How Emergency Blood Requests Work on LifeDrop',
    excerpt:
      'Sri Lanka needs roughly 1,100 units of blood every day. When minutes matter, LifeDrop alerts nearby available donors and keeps everyone on clear status updates.',
    date: '2025-06-14',
    category: 'Platform',
    readMinutes: 5,
    image: publicImages.blogs.emergency,
    source: 'https://nbts.health.gov.lk/',
    sourceLabel: 'NBTS Sri Lanka — National Blood Supply',
    body: [
      'NBTS collects between 400,000 and 450,000 units of blood annually — entirely from voluntary, non-remunerated donors. That works out to a daily average of about 1,100 units needed to keep hospitals supplied across all nine provinces.',
      'When a recipient marks a request as an emergency on LifeDrop, the platform first asks for confirmation so accidental alerts are not sent. Once confirmed, matching prioritises donors who are available now, in a compatible blood group, and located nearest to the hospital or recipient.',
      'Donors receive a notification with essential details only — blood group needed, location, and urgency. Your full contact information is shared only if you choose to accept the request, protecting your privacy until you commit.',
      'Recipients and hospitals see real-time status: pending, matching, accepted, in progress, and completed. This mirrors the transparency NBTS maintains in its national collection and distribution system.',
      'For life-threatening situations, always contact the hospital or dial 1990 (Suwa Seriya ambulance) immediately. LifeDrop supplements — but does not replace — hospital blood bank coordination and NBTS supply channels.',
    ],
  },
  {
    slug: 'why-regular-donation-matters',
    title: 'Why Regular Blood Donation Matters',
    excerpt:
      'Sri Lanka maintains a 100% voluntary blood donation system — one of few countries in the region to do so. Regular donors keep the national supply safe and adequate.',
    date: '2025-06-14',
    category: 'Awareness',
    readMinutes: 4,
    image: publicImages.blogs.regular,
    source: 'https://nbts.health.gov.lk/world-blood-donor-day-2025-national-event-at-temple-trees/',
    sourceLabel: 'NBTS — World Blood Donor Day 2025',
    body: [
      'Sri Lanka achieved 100% voluntary non-remunerated blood donation in 2014 and remains one of the few countries in South Asia to maintain this standard. The 2025 World Blood Donor Day national ceremony was held on 14 June at Temple Trees, Colombo, under the theme "Give Blood, Give Hope — Together We Save Lives."',
      'Each donated unit is tested for five transfusion-transmissible infections, then separated into components — red cells, platelets, and plasma — so a single donation can help multiple patients.',
      'Donors must wait a minimum of four months between whole-blood donations. NBTS tracks this interval to protect donor health and maintain haemoglobin levels above 12.5 g/dL.',
      'Mobile campaigns account for roughly 85% of collections nationwide. Regular donors — people who give several times a year — form the backbone of this system, ensuring blood is available for surgeries, accidents, maternity complications, and thalassaemia patients.',
      'NBTS has been redesignated as a WHO Collaborating Centre for Blood Transfusion Services (from 7 September 2024). Becoming a repeat donor means you are part of a nationally recognised life-saving network.',
    ],
  },
  {
    slug: 'first-time-donor-guide',
    title: 'First-Time Donor? Here Is What to Expect',
    excerpt:
      'Age 18–55, weight above 50 kg, haemoglobin above 12.5 g/dL, and a valid NIC — plus what to do before, during, and after your first NBTS donation.',
    date: '2025-06-14',
    category: 'Guide',
    readMinutes: 6,
    image: publicImages.blogs.firstTime,
    source: 'https://nbts.health.gov.lk/donate-blood/',
    sourceLabel: 'NBTS Sri Lanka — Donor Eligibility & Guidelines',
    body: [
      'Basic eligibility (per NBTS): aged 18–60 years (first-time donors up to 55), weight above 50 kg, haemoglobin above 12.5 g/dL, not pregnant, free from serious illness, and free from risk behaviours. Bring your National Identity Card or a valid photo ID.',
      'Before donating: have a main meal within the last four hours, drink plenty of fluids, avoid alcohol, and rest at least six hours the previous night. If you have travelled abroad recently, check deferral rules — three months for most countries, three years for malaria-endemic regions.',
      'At the blood bank, staff will register you, check your haemoglobin with a finger-prick test, review your health questionnaire, and explain the process. The donation itself takes about 10–15 minutes; the entire visit is usually under an hour.',
      'After donating: rest for at least 20 minutes on site, drink more fluids over the next four hours, keep the plaster on for about 12 hours, and avoid heavy lifting for 24 hours. You may feel slight dizziness — this is normal and staff are trained to help.',
      'You cannot donate again for a minimum of four months. LifeDrop can remind you when you are eligible and connect you with patients or camps near you. For questions about your specific health situation, contact NBTS at +94 11 236 9931–4 or info@nbts.health.gov.lk.',
    ],
  },
]

export type DonorStory = {
  id: string
  name: string
  location: string
  bloodGroup: string
  quote: string
  excerpt: string
  photo?: string
  featured?: boolean
  donationCount?: number
}

/** Stories inspired by public Sri Lankan donor experiences (NBTS, WHO Sri Lanka, media reports). */
export const donorStories: DonorStory[] = [
  {
    id: '1',
    name: 'Nimeda Samarasinghe',
    location: 'Colombo',
    bloodGroup: 'O+',
    quote: '21 donations. 21 chances to save a life.',
    excerpt:
      'A civil engineer based in Colombo, Nimeda marked his 21st voluntary donation at the National Blood Transfusion Service. What began as a one-time act became a personal mission — a quiet way to show up for people he may never meet. Blood cannot be manufactured; it only comes from donors willing to give.',
    photo: publicImages.stories.donor1,
    featured: true,
    donationCount: 21,
  },
  {
    id: '2',
    name: 'Chanuka Amarasekara',
    location: 'Colombo',
    bloodGroup: 'A+',
    quote: 'Not just one first experience — but two, on the same day.',
    excerpt:
      'While chairing a university blood donation project at SIST, Chanuka donated for the very first time. Nervous at first, he found the process smooth and caring. With support from NBTS staff and fellow volunteers, the drive became one of the most memorable days of his life.',
    photo: publicImages.stories.donor2,
  },
  {
    id: '3',
    name: 'Tharsika Sivakumar',
    location: 'Jaffna',
    bloodGroup: 'B+',
    quote: 'Our community showed up when the blood bank called.',
    excerpt:
      'When Victoria College OBA organised a camp in Chulipuram, Jaffna, students and alumni answered the National Blood Transfusion Service appeal. Tharsika was among dozens who donated — helping keep northern hospitals supplied during a critical week.',
    photo: publicImages.stories.donor3,
  },
  {
    id: '4',
    name: 'Kasun Mendis',
    location: 'Kandy',
    bloodGroup: 'AB+',
    quote: 'Repeat donors are the backbone of Sri Lanka\'s blood supply.',
    excerpt:
      'Recognised at a regional NBTS felicitation ceremony, Kasun has donated regularly for over a decade. Sri Lanka meets its blood needs through 100% voluntary donation — and repeat donors like him make that possible year after year.',
    photo: publicImages.stories.donor4,
    donationCount: 14,
  },
  {
    id: '5',
    name: 'Sanduni Rajapaksa',
    location: 'Galle',
    bloodGroup: 'O+',
    quote: 'Organising a camp taught me that leadership can save lives too.',
    excerpt:
      'Sanduni coordinates mobile donation drives in the Southern Province. With nearly 5,000 camps held island-wide each year — supplying around 85% of national collections — organisers like her connect willing donors to patients in need.',
    photo: publicImages.stories.donor5,
  },
  {
    id: '6',
    name: 'Rizwan Farook',
    location: 'Batticaloa',
    bloodGroup: 'A−',
    quote: 'Even during curfew, donors found a way to give.',
    excerpt:
      'During the COVID-19 pandemic, Sri Lanka maintained its voluntary blood supply when gatherings were restricted. Rizwan booked an appointment through NBTS and donated safely — part of a national effort WHO Sri Lanka commended for protecting patients when supplies ran low elsewhere.',
    photo: publicImages.stories.donor6,
  },
]

export const featuredStory = donorStories.find((s) => s.featured) ?? donorStories[0]
export const storyGrid = donorStories.filter((s) => !s.featured)

export const upcomingCamps = [
  {
    id: '1',
    title: 'Voluntary Blood Donation Camp',
    date: '2026-03-15',
    venue: 'Colombo General Hospital Blood Centre, Regent Street, Colombo 10',
    phone: '+94 11 269 1111',
    conductedBy: 'National Blood Transfusion Service',
    organizedBy: 'LifeDrop Community Partners',
  },
  {
    id: '2',
    title: 'University Donor Drive',
    date: '2026-03-22',
    venue: 'University of Peradeniya Medical Faculty, Peradeniya',
    phone: '+94 81 238 8000',
    conductedBy: 'Faculty of Medicine',
    organizedBy: 'Peradeniya Teaching Hospital Blood Bank',
  },
]

export const guideModules = [
  {
    id: 'education',
    title: 'Donor Education',
    description:
      'Gain a deeper understanding of blood donation and its life-saving impact. Essential knowledge, updates, and awareness-driven content.',
    modules: 5,
    icon: BookOpen,
  },
  {
    id: 'eligibility',
    title: 'Donor Eligibility',
    description:
      'Find out who can donate and what criteria you need to meet — age, weight, medical conditions, and temporary deferrals.',
    modules: 3,
    icon: CheckCircle2,
  },
  {
    id: 'preparation',
    title: 'Donor Preparation',
    description:
      'How to get ready for donation — what to eat, health checks, and steps for a safe, smooth experience.',
    modules: 5,
    icon: Calendar,
  },
  {
    id: 'recovery',
    title: 'Donor Recovery',
    description:
      'Take care of yourself after donating — rest, hydration, managing minor side effects, and when to seek advice.',
    modules: 4,
    icon: Heart,
  },
  {
    id: 'regular',
    title: 'Regular Donor',
    description:
      'The importance of consistent donation, recommended intervals, and maintaining healthy haemoglobin levels.',
    modules: 3,
    icon: Activity,
  },
]

export const topResourceGuides = [
  {
    id: 'eligibility',
    title: 'Blood Donation Eligibility',
    description:
      'Learn who can donate, age and weight requirements, and when you may need to wait before giving again.',
    icon: CheckCircle2,
    anchor: 'eligibility',
  },
  {
    id: 'preparation',
    title: 'Donor Preparation',
    description:
      'What to eat, drink, and bring before your appointment for a safe, smooth donation experience.',
    icon: Calendar,
    anchor: 'preparation',
  },
  {
    id: 'recovery',
    title: 'Donor Recovery',
    description:
      'Rest, hydration, and after-care tips to help you recover quickly after donating blood.',
    icon: Heart,
    anchor: 'recovery',
  },
  {
    id: 'regular',
    title: 'Regular Donor',
    description:
      'Build a lifelong donation habit with recommended intervals and healthy haemoglobin guidance.',
    icon: Activity,
    anchor: 'regular',
  },
  {
    id: 'emergency',
    title: 'Emergency Requests',
    description:
      'How urgent blood requests work on LifeDrop — confirmation, matching, and notifying nearby donors.',
    icon: Droplet,
    anchor: 'education',
  },
  {
    id: 'organizations',
    title: 'For Organizations',
    description:
      'Hospitals and blood banks can register, get verified, and manage stock and requests.',
    icon: Building2,
    anchor: 'education',
  },
]

export const popularGuides = [
  { title: 'Who can donate blood in Sri Lanka?', anchor: 'eligibility' },
  { title: 'How often can I donate whole blood?', anchor: 'regular' },
  { title: 'What should I eat before donating?', anchor: 'preparation' },
  { title: 'Can I donate if I have a tattoo?', anchor: 'eligibility' },
  { title: 'What happens during a blood donation?', anchor: 'education' },
  { title: 'How do I recover after donating?', anchor: 'recovery' },
]

export type StakeholderKey = 'donors' | 'recipients' | 'organisations' | 'organizers'

export type StakeholderFeature = {
  title: string
  text: string
  icon: LucideIcon
  badge: string
}

export const stakeholderContent: Record<
  StakeholderKey,
  { label: string; headline: string; subhead: string; features: StakeholderFeature[] }
> = {
  donors: {
    label: 'For Donors',
    headline: 'Donate with clarity, not confusion',
    subhead: 'Smart tools that respect your time, protect your privacy, and make every donation count.',
    features: [
      {
        title: 'Dignified Experience',
        text: 'A calm, guided flow from registration to donation — no pressure, no confusion.',
        icon: Heart,
        badge: 'D',
      },
      {
        title: 'Privacy First',
        text: 'Your contact details are shared only after you accept a request.',
        icon: ShieldCheck,
        badge: 'P',
      },
      {
        title: 'Clear Eligibility',
        text: 'Smart reminders when you are eligible again — aligned with NBTS guidelines.',
        icon: Clock,
        badge: 'C',
      },
      {
        title: 'Relevant Requests',
        text: 'Alerts filtered by blood group and location — no spam, no irrelevant calls.',
        icon: Target,
        badge: 'R',
      },
      {
        title: 'Donation History',
        text: 'Track past donations and see the impact of your contributions over time.',
        icon: Activity,
        badge: 'H',
      },
      {
        title: 'Camp Discovery',
        text: 'Find voluntary donation camps near you across all provinces in Sri Lanka.',
        icon: Calendar,
        badge: 'A',
      },
    ],
  },
  recipients: {
    label: 'For Hospitals',
    headline: 'Coordinate requests with confidence',
    subhead: 'Help patients find matched donors faster — with clear status at every step.',
    features: [
      {
        title: 'Smart Matching',
        text: 'Compare donors by blood group, distance, and availability with transparent scores.',
        icon: Target,
        badge: 'S',
      },
      {
        title: 'Emergency Mode',
        text: 'Flag urgent needs and notify nearby available donors after confirmation.',
        icon: Droplet,
        badge: 'E',
      },
      {
        title: 'Live Status',
        text: 'See every step from matching to completion — no anxious phone calls.',
        icon: Activity,
        badge: 'L',
      },
      {
        title: 'Verified Access',
        text: 'Every request is linked to registered hospitals and blood centres for trust.',
        icon: ShieldCheck,
        badge: 'V',
      },
      {
        title: 'Digital Requests',
        text: 'Replace informal messages with structured, trackable blood requests.',
        icon: CheckCircle2,
        badge: 'D',
      },
      {
        title: 'Patient Privacy',
        text: 'Sensitive details stay protected until a donor accepts the request.',
        icon: ShieldCheck,
        badge: 'P',
      },
    ],
  },
  organisations: {
    label: 'For Organizations',
    headline: 'Coordinate donations at scale',
    subhead: 'Hospitals and blood banks manage stock, requests, and reports in one place.',
    features: [
      {
        title: 'Real-Time Inventory',
        text: 'Track blood stock levels and update availability across your facility.',
        icon: Droplet,
        badge: 'R',
      },
      {
        title: 'Verified Access',
        text: 'Admin-reviewed registration protects patients and builds donor confidence.',
        icon: ShieldCheck,
        badge: 'V',
      },
      {
        title: 'Request Management',
        text: 'View and coordinate incoming requests with shared status labels.',
        icon: CheckCircle2,
        badge: 'M',
      },
      {
        title: 'Reports & Insights',
        text: 'Download donation and inventory reports for planning and compliance.',
        icon: Building2,
        badge: 'I',
      },
      {
        title: 'Camp Coordination',
        text: 'Plan mobile drives and connect with community organisers island-wide.',
        icon: Users,
        badge: 'C',
      },
      {
        title: 'Stock Alerts',
        text: 'Get notified when critical blood groups run low at your centre.',
        icon: Bell,
        badge: 'S',
      },
    ],
  },
  organizers: {
    label: 'For Organizers',
    headline: 'Host camps that keep Sri Lanka supplied',
    subhead:
      'Schools, universities, workplaces, and community groups — plan voluntary drives with NBTS and reach donors through LifeDrop.',
    features: [
      {
        title: 'Camp Planning',
        text: 'Schedule mobile donation drives and share venue details with donors across your district.',
        icon: Calendar,
        badge: 'P',
      },
      {
        title: 'NBTS Coordination',
        text: 'Connect with the National Blood Transfusion Service for staff, equipment, and collection support.',
        icon: Building2,
        badge: 'N',
      },
      {
        title: 'Donor Outreach',
        text: 'Promote your camp on LifeDrop so eligible donors nearby can register and attend.',
        icon: Users,
        badge: 'O',
      },
      {
        title: 'Volunteer Teams',
        text: 'Assign roles for registration, refreshments, and donor care on camp day.',
        icon: UserPlus,
        badge: 'V',
      },
      {
        title: 'Real-Time Updates',
        text: 'Track registrations and share live updates with hospital blood banks when units are collected.',
        icon: Activity,
        badge: 'R',
      },
      {
        title: 'Impact Reports',
        text: 'See how many units your community contributed — mobile camps supply ~85% of national collections.',
        icon: Target,
        badge: 'I',
      },
    ],
  },
}

export type GuideSection = {
  title: string
  icon: LucideIcon
  items: string[]
}

export const guideSections: GuideSection[] = [
  {
    title: 'For Donors',
    icon: Heart,
    items: [
      'Register with your blood group and location.',
      'Set your availability when you are ready to donate.',
      'Review incoming requests and accept or decline with one tap.',
      'Track accepted donations and history from your dashboard.',
    ],
  },
  {
    title: 'For Recipients',
    icon: Droplet,
    items: [
      'Create a blood request with group, units, and urgency.',
      'Browse matched donors and send invites.',
      'Follow request status from matching through completion.',
      'Use emergency mode only when time-critical — confirmation is required.',
    ],
  },
  {
    title: 'For Hospitals & Blood Banks',
    icon: Building2,
    items: [
      'Submit organization registration for admin verification.',
      'Manage stock levels and incoming requests after approval.',
      'Coordinate with donors and recipients using shared status labels.',
      'Download reports for inventory and donation activity.',
    ],
  },
]

export const aboutValues = [
  {
    icon: Activity,
    title: 'Speed with clarity',
    text: 'Urgent needs should not mean confusing interfaces. Every screen shows where you are in the process.',
  },
  {
    icon: ShieldCheck,
    title: 'Trust by design',
    text: 'Verified organizations, explicit confirmations, and plain-language errors build confidence.',
  },
  {
    icon: BookOpen,
    title: 'Education first',
    text: 'We explain match scores, eligibility, and next steps so users can make informed choices.',
  },
]

export const guideModuleDetails: Record<
  string,
  { title: string; topics: string[] }
> = {
  education: {
    title: 'Donor Education',
    topics: [
      'Why blood donation saves lives',
      'Types of blood donations explained',
      'What happens during a donation',
      'Myths vs facts about donating',
      'How LifeDrop keeps you informed',
    ],
  },
  eligibility: {
    title: 'Donor Eligibility',
    topics: [
      'Age, weight, and general health requirements',
      'Medical conditions and temporary deferrals',
      'Travel, tattoos, and recent procedures',
    ],
  },
  preparation: {
    title: 'Donor Preparation',
    topics: [
      'What to eat and drink before donating',
      'Sleep and rest recommendations',
      'Documents and ID to bring',
      'Health screening at the centre',
      'What to avoid on donation day',
    ],
  },
  recovery: {
    title: 'Donor Recovery',
    topics: [
      'Rest and hydration after donating',
      'Managing minor side effects',
      'Activities to avoid for 24 hours',
      'When to contact a doctor',
    ],
  },
  regular: {
    title: 'Regular Donor',
    topics: [
      'Recommended donation intervals',
      'Maintaining healthy haemoglobin',
      'Building a lifelong donation habit',
    ],
  },
}

export const aboutMission =
  'To connect every willing donor with every person in need — through a platform that is fast, transparent, and built on trust. We believe no family should lose precious time searching for blood when technology can bring clarity to crisis.'

export const aboutVision =
  'A Sri Lanka where blood scarcity no longer costs lives — where donors, recipients, and hospitals coordinate seamlessly, and every citizen knows exactly where to turn in their hour of need.'

export const aboutJourney = [
  {
    tag: 'The Idea',
    title: 'A Personal Beginning',
    text: 'LifeDrop started when our founders watched a neighbour spend an entire night calling contacts for O+ blood. The need was urgent; the process was chaotic. That night planted a question: why is finding blood still so fragmented?',
    image: publicImages.about.journey.idea,
    side: 'left' as const,
  },
  {
    tag: 'The Obstacle',
    title: "The Question That Won't Go Away",
    text: 'We spoke with donors, recipients, and hospital staff across Colombo, Kandy, and Jaffna. The same pattern emerged: WhatsApp chains, missed calls, duplicate requests, and no shared status.',
    image: publicImages.about.journey.obstacle,
    side: 'right' as const,
  },
  {
    tag: 'The Crisis',
    title: 'When the Gaps Felt Wider',
    text: 'During critical shortages, voluntary donation drives dropped while hospital demand remained high. Families posted on social media at midnight. Donors received irrelevant alerts. The gap between compassion and action had never felt wider.',
    image: publicImages.about.journey.crisis,
    side: 'left' as const,
  },
  {
    tag: 'The Catalyst',
    title: 'Emotional Trigger',
    text: 'A young father in Kandy waited hours for a compatible donor while his child was in surgery. Volunteers did everything they could — but without a shared platform, coordination broke down.',
    image: publicImages.about.journey.catalyst,
    side: 'right' as const,
  },
  {
    tag: 'The Solution',
    title: 'Why This Platform, Why Now?',
    text: 'LifeDrop brings donors, recipients, hospitals, and blood banks onto one trusted network — with clear matching, real-time status, and HCI-first design.',
    bullets: [
      'Verified hospitals and blood banks',
      'Smart matching by group, location, and availability',
      'Emergency requests with confirmation safeguards',
      'Transparent status from request to completion',
    ],
    logo: true,
    side: 'left' as const,
  },
]

export const aboutPurpose = {
  eyebrow: 'Our Purpose',
  headline: 'A future where',
  highlight: 'blood scarcity',
  headlineEnd: 'no longer costs lives',
  text: 'We are building the infrastructure Sri Lanka needs — not another messaging group, but a reliable network that respects donors, supports recipients, and empowers healthcare partners.',
  points: [
    'Every request tracked with clear, human-readable status',
    'Donors receive only relevant, compatible invitations',
    'Hospitals and blood banks manage stock in real time',
    'Emergency flows designed to prevent panic and misuse',
    'Education and guides so first-time donors feel confident',
  ],
  image: publicImages.about.purpose,
}

/** @deprecated use aboutPurpose */
export const aboutImpact = aboutPurpose

export const aboutTestimonials = [
  {
    name: 'Nisha Peramuna',
    role: 'Founder',
    quote:
      'LifeDrop was born from a simple belief — technology should remove barriers to compassion, not add to them. Every feature we build asks: does this help someone in crisis feel less alone?',
    photo: publicImages.about.testimonial1,
    rating: 5,
  },
  {
    name: 'Arun Kumar',
    role: 'Advisor',
    quote:
      'I have seen too many families lose precious hours searching for blood. LifeDrop gives donors and hospitals a shared language — clear, fast, and dignified for everyone involved.',
    photo: publicImages.about.testimonial2,
    rating: 5,
  },
]

export const aboutGallery = {
  mission: publicImages.about.mission,
  vision: publicImages.about.vision,
  hero: publicImages.hero.about,
}
