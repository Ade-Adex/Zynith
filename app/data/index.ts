import { Course, NavLink, StatItem } from '@/app/types'

export const NAV_LINKS: NavLink[] = [
  { label: 'Curriculum', href: '#curriculum' },
  { label: 'Mentors', href: '#mentors' },
  { label: 'Enterprise', href: '#enterprise' },
  { label: 'Pricing', href: '#pricing' },
]

export const COURSES: Course[] = [
  {
    id: 1,
    title: 'High-Performance System Architecture',
    type: 'Premium',
    price: '$149',
    instructor: 'Alex Rivera',
    rating: 4.9,
    students: 1240,
    duration: '12h 45m',
    level: 'Advanced',
    color: 'from-blue-600/20 to-indigo-600/20',
    image:
      'https://images.unsplash.com/photo-1558494949-ef010cbdcc51?q=80&w=800',
  },
  {
    id: 2,
    title: 'Neural Networks & Deep Learning',
    type: 'Premium',
    price: '$199',
    instructor: 'Dr. Sarah Chen',
    rating: 5.0,
    students: 850,
    duration: '18h 20m',
    level: 'Expert',
    color: 'from-purple-600/20 to-pink-600/20',
    image:
      'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800',
  },
  {
    id: 3,
    title: 'Advanced Frontend Patterns',
    type: 'Free',
    instructor: 'Marcus Volkov',
    rating: 4.8,
    students: 5600,
    duration: '4h 15m',
    level: 'Intermediate',
    color: 'from-emerald-600/20 to-teal-600/20',
    image:
      'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=800',
  },
  {
    id: 4,
    title: 'Product-Led Growth Strategy and Market Dominance',
    type: 'Free',
    instructor: 'Elena Rodriguez',
    rating: 4.7,
    students: 3200,
    duration: '2h 50m',
    level: 'Beginner',
    color: 'from-orange-600/20 to-red-600/20',
    image:
      'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800',
  },
]

export const STATS: StatItem[] = [
  { label: 'Active Learners', val: '50K+' },
  { label: 'Course Rating', val: '4.9/5' },
  { label: 'Industry Mentors', val: '120+' },
  { label: 'Global Reach', val: '24/7' },
]
