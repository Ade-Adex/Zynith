// types/index.ts

export type CourseType = 'Free' | 'Premium'

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export type CourseTag = 'Trending' | 'Bestseller' | 'New'

export interface Module {
  title: string
  lessons: number
  hasTest: boolean
  isFinal?: boolean
  // NEW: P2P Fields
  hasAssignment?: boolean
  assignmentPrompt?: string
  peerReviewsRequired?: number // Usually 3
}

export interface PeerReview {
  id: string
  submissionId: string
  reviewerId: string
  scores: {
    technical: number // 1-5
    clarity: number // 1-5
    execution: number // 1-5
  }
  feedback: string
  status: 'pending' | 'completed' | 'flagged'
}

export interface Course {
  id: number
  title: string
  type: CourseType
  tag?: CourseTag // For QuickNav filtering (Trending/Bestseller)
  price?: string
  instructor: string
  rating: number
  color: string
  image: string
  students: number
  duration: string
  level: CourseLevel
  modules: Module[] // The modular learning structure
  features?: string[] // Optional: for the certificate/results writeup
}

export type FilterType = 'All' | CourseType | 'Trending' | 'Bestseller' | 'Top Rated'

export interface StatItem {
  label: string
  val: string
}

export interface NavLink {
  label: string
  href: string
}
