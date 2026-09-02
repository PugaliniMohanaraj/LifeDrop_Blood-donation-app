import { publicImages } from './publicImages'

export type PublicHeroConfig = {
  title: string
  subtitle: string
  image: string
  objectPosition?: string
  eyebrow?: string
}

export const publicPageHeroes: Record<string, PublicHeroConfig> = {
  about: {
    title: 'ABOUT US',
    subtitle: 'Connecting donors. Saving lives. Building a healthier Sri Lanka, together.',
    image: publicImages.hero.about,
    objectPosition: 'center 40%',
  },
  stories: {
    eyebrow: 'Our Stories',
    title: 'STORIES',
    subtitle: 'Real experiences from donors and families — every donation has a story worth sharing.',
    image: publicImages.hero.stories,
    objectPosition: 'center 35%',
  },
  blogs: {
    eyebrow: 'Learn. Inspire. Share',
    title: 'BLOGS',
    subtitle: 'Stay informed, stay inspired — your go-to source for blood donation and impact.',
    image: publicImages.hero.blogs,
    objectPosition: 'center 30%',
  },
  guide: {
    eyebrow: 'Guide',
    title: 'GUIDE',
    subtitle: 'Understand eligibility, preparation, recovery, and becoming a regular donor.',
    image: publicImages.hero.guide,
    objectPosition: 'center 45%',
  },
  faqs: {
    eyebrow: 'FAQs',
    title: 'FAQS',
    subtitle: 'Everything you need to know about donating, eligibility, and how LifeDrop works.',
    image: publicImages.hero.faqs,
    objectPosition: 'center 40%',
  },
  contact: {
    eyebrow: 'Get in Touch',
    title: 'CONTACT US',
    subtitle: 'Questions, feedback, or partnership enquiries — we are here to help.',
    image: publicImages.hero.contact,
    objectPosition: 'center 50%',
  },
  howItWorks: {
    eyebrow: 'How It Works',
    title: 'HOW IT WORKS',
    subtitle: 'Four clear steps from need to donation — designed so you always know what happens next.',
    image: publicImages.hero.howItWorks,
    objectPosition: 'center 40%',
  },
}
