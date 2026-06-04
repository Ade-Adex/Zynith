// /app/types/user.ts

import { Course } from '@/app/types'
import { SerializedEnrollment } from '@/app/types/enrollment'
import { IDbTransaction } from '@/app/types/transaction'

export type UserRole = 'STUDENT' | 'MENTOR' | 'ADMIN' | ''
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
  currentModuleId: string | number
  completedLessons: string[]
  assignmentsSubmitted: string[]
  peerReviewsCount: number
  enrolledAt: string
  lastAccessedAt: string
}

export interface UserStats {
  coursesCompleted: number
  certificatesEarned: number
  peerReviewsDone: number
  averagePeerRating: number
  points: number
  streakDays: number
}

export interface DashboardCertificate {
  id: string
  courseId: string | number
  courseTitle?: string
  title?: string
  issueDate: string
  url: string
}

export interface UserType {
  _id: string
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
  wishlist?: []
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

  createdAt: Date
  updatedAt: Date
}

export interface DashboardData {
  user: Omit<
    Pick<
      UserType,
      | 'firstName'
      | 'lastName'
      | 'email'
      | 'name'
      | 'avatar'
      | 'wallet'
      | 'stats'
      | 'createdAt'
    >,
    'createdAt'
  > & {
    createdAt: string
  }

  metrics: {
    enrolledCourses: number
    activeCourses: number
    completedCourses: number
    certificates: number
    totalSpent: number
    completedLessons: number
    totalLessons: number
    completionRate: number
    streakDays: number
    points: number
    peerReviews: number
    peerReviewsPending: number
  }

  activeCourse: null | {
    enrollment: SerializedEnrollment
    course: Course
  }

  recentTransactions: Array<{
    reference: string
    gateway: IDbTransaction['gateway']
    amount: number
    createdAt: string
    titles: string[]
  }>

  recentEnrollments: Array<{
    enrollmentId: string
    progressPercentage: number
    updatedAt: string
    course: Pick<Course, '_id' | 'title' | 'image' | 'slug'> | null
  }>

  certificates?: DashboardCertificate[]
}