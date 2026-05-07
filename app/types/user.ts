export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN' | 'VENDOR'
export type EnrollmentStatus =
  | 'ENROLLED'
  | 'IN_PROGRESS'
  | 'COMPLETED'
  | 'ON_HOLD'

export interface Enrollment {
  courseId: number
  courseTitle: string
  status: EnrollmentStatus
  progressPercentage: number
  currentModuleId: string | number // Linked to Module.id
  completedLessons: string[]
  assignmentsSubmitted: string[]
  peerReviewsCount: number // How many peer assignments the user has graded for this specific course
  enrolledAt: string
  lastAccessedAt: string
}

export interface UserStats {
  coursesCompleted: number
  certificatesEarned: number
  peerReviewsDone: number // Lifetime total across all courses
  averagePeerRating: number // The average score Solomon received from other students
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
  headline?: string
  location?: string
  website?: string
  joinedAt: string
  socialLinks: {
    github?: string
    linkedin?: string
    twitter?: string
  }
  stats: UserStats
  enrollments: Enrollment[]
  certificates: {
    id: string
    courseId: number
    issueDate: string
    url: string
  }[]
  wallet: {
    balance: number
    currency: string
  }
  preferences: {
    theme: 'light' | 'dark' | 'system'
    notifications: boolean
    marketingEmails: boolean
    publicProfile: boolean
  }
}
