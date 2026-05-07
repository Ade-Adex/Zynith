// types/index.ts

export type CourseType = 'Free' | 'Premium'
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
export type CourseTag = 'Trending' | 'Bestseller' | 'New'

export interface Module {
  id: string // Essential for tracking progress per module
  title: string
  lessons: number
  hasTest: boolean
  isFinal?: boolean
  // P2P/Assignment Mechanics
  hasAssignment?: boolean
  assignmentPrompt?: string
  peerReviewsRequired?: number // Number of others the user must grade to pass this module
}

export interface Course {
  id: number
  title: string
  type: CourseType
  tag?: CourseTag
  price?: string // Kept as string to support currency symbols or "Free"
  instructor: string
  previewVideo?: string
  rating: number
  color: string // Tailwind gradient classes or Hex
  image: string
  students: number
  duration: string
  level: CourseLevel
  modules: Module[]
  features?: string[]
}

export type FilterType =
  | 'All'
  | CourseType
  | 'Trending'
  | 'Bestseller'
  | 'Top Rated'

export interface StatItem {
  label: string
  val: string
}

export interface NavLink {
  label: string
  href: string
}