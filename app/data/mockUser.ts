import { UserType } from '../types/user'

export const MOCK_USER: UserType = {
  id: 'user_01J9H2X',
  name: 'Solomon Oluwatosin',
  firstName: 'Solomon',
  lastName: 'Oluwatosin',
  username: 'solomon_codes',
  email: 'solomon@christbcogbomoso.org',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Solomon',
  role: 'STUDENT',
  headline: 'Building the Digital World Through Code',
  bio: 'Passionate about building scalable web applications and mastering systems programming with Rust.',
  location: 'Ogbomoso, Nigeria',
  joinedAt: '2026-01-15',

  socialLinks: {
    github: 'https://github.com/solomon_codes',
    linkedin: 'https://linkedin.com/in/solomon_codes',
    twitter: 'https://x.com/solomon_codes',
  },

  stats: {
    coursesCompleted: 2,
    certificatesEarned: 1,
    peerReviewsDone: 14,
    averagePeerRating: 4.8, // Rating Solomon received from peers
    points: 1250,
    streakDays: 12,
  },

  enrollments: [
    {
      courseId: 5,
      courseTitle: 'Rust for Systems Programming',
      status: 'IN_PROGRESS',
      progressPercentage: 45,
      currentModuleId: 2,
      completedLessons: ['m1_l1', 'm1_l2', 'm1_l3', 'm2_l1'],
      assignmentsSubmitted: ['m1_project'], // ID of module 1 project
      peerReviewsCount: 2, // Needs 1 more review to unlock Module 3 content
      enrolledAt: '2026-03-01T10:00:00Z',
      lastAccessedAt: '2026-05-06T14:30:00Z',
    },
    {
      courseId: 9,
      courseTitle: 'Next.js 15 Masterclass',
      status: 'ENROLLED',
      progressPercentage: 0,
      currentModuleId: 1,
      completedLessons: [],
      assignmentsSubmitted: [],
      peerReviewsCount: 0,
      enrolledAt: '2026-05-01T09:00:00Z',
      lastAccessedAt: '2026-05-01T09:15:00Z',
    },
    {
      courseId: 12,
      courseTitle: 'Advanced Next.js Architecture',
      status: 'COMPLETED',
      progressPercentage: 100,
      currentModuleId: 10,
      completedLessons: ['all'],
      assignmentsSubmitted: ['final_capstone'],
      peerReviewsCount: 5,
      enrolledAt: '2026-01-20T08:00:00Z',
      lastAccessedAt: '2026-02-15T18:20:00Z',
    },
  ],

  certificates: [
    {
      id: 'CERT-9921-X',
      courseId: 12,
      issueDate: '2026-02-16',
      url: '/certificates/nextjs-adv.pdf',
    },
  ],

  wallet: {
    balance: 5500.0,
    currency: 'NGN',
  },

  preferences: {
    theme: 'dark',
    notifications: true,
    marketingEmails: false,
    publicProfile: true,
  },
}
