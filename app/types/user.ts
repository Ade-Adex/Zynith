export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN' | 'VENDOR'

export interface Enrollment {
  courseId: number
  courseTitle: string
  status: 'ENROLLED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD'
  progressPercentage: number
  currentModuleId: number
  completedLessons: string[] // Array of lesson IDs
  assignmentsSubmitted: string[] // Array of module IDs
  peerReviewsCount: number // Reviews the user has performed for this course
  enrolledAt: string
  lastAccessedAt: string
}

export interface UserStats {
  coursesCompleted: number
  certificatesEarned: number
  peerReviewsDone: number // Lifetime total
  averagePeerRating: number // Rating received from others (1-5)
  points: number
  streakDays: number
}

export interface UserType {
  id: string
  name: string
  firstName: string
  lastName: string
  email: string
  username: string
  avatar: string
  role: UserRole
  bio?: string
  headline?: string // e.g., "Full-stack Developer & Rust Enthusiast"
  location?: string
  website?: string
  joinedAt: string

  // Professional / Identity
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
  }

  // Platform Metrics
  stats: UserStats

  // Educational Data
  enrollments: Enrollment[]
  certificates: {
    id: string
    courseId: number
    issueDate: string
    url: string
  }[]

  // Financials (For Marketplace & P2P)
  wallet: {
    balance: number
    currency: string // e.g., "NGN"
  }

  // Logic & Settings
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    marketingEmails: boolean
    publicProfile: boolean
  }
}
