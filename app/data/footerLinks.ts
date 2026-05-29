// /app/data/footerLinks.ts


export interface FooterLink {
  label: string
  href: string
}

export interface SocialLink {
  name: string
  href: string
  iconName: 'X' | 'Github' | 'Linkedin'
}

export const PLATFORM_LINKS: FooterLink[] = [
  { label: 'Curriculum', href: '#courses' },
  { label: 'Mentorship', href: '#' },
  { label: 'Enterprise', href: '#' },
  { label: 'Pricing', href: '#pricing' },
]

export const COMPANY_LINKS: FooterLink[] = [
  { label: 'About', href: '#' },
  { label: 'Careers', href: '#' },
  { label: 'Verify Certificate', href: '/verify' },
  { label: 'Terms & Conditions', href: '#' },
  { label: 'Privacy Policy', href: '#' },
]

export const SOCIAL_LINKS: SocialLink[] = [
  { name: 'X', href: '#', iconName: 'X' },
  { name: 'Github', href: '#', iconName: 'Github' },
  { name: 'Linkedin', href: '#', iconName: 'Linkedin' },
]
