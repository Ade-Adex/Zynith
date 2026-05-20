// /app/types/index.ts


export const NAV_LINKS: NavLink[] = [
  { label: 'Courses', href: '#courses' },
  { label: 'Certification', href: '#certification' },
  { label: 'Pricing', href: '#pricing' },
]

export const STATS: StatItem[] = [
  { label: 'Active Learners', val: '50K+' },
  { label: 'Course Rating', val: '4.9/5' },
  { label: 'Industry Mentors', val: '120+' },
  { label: 'Global Reach', val: '24/7' },
]

export type CourseType = 'Free' | 'Premium'
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
export type CourseTag = 'Trending' | 'Bestseller' | 'New'
export type LessonContentType = 'video' | 'text' | 'hybrid'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string // For reviewing answers after failing
}

export interface Quiz {
  id: string
  title: string
  passingScore: number // e.g., 100 for lesson quizzes, 80 for module assessments
  questions: QuizQuestion[] // Hard max of 3 questions per constraint
}

export interface Lesson {
  id: string
  title: string
  duration: string
  contentType: LessonContentType
  videoUrl?: string // Optional if text-only
  markdownBody?: string // Optional if video-only, filled if hybrid/text
  isFreePreview: boolean
  summary: string
  isDownloadable: boolean
  downloadUrl?: string
  quiz?: Quiz // Lesson gatekeeping quiz (Max 3 questions)
}

export interface Assignment {
  id: string
  title: string
  problemStatement: string
  submissionTemplateUrl?: string
  peerReviewsRequired: number // How many reviews this user must *give* to pass
  minPeerScoreToPass: number // The score this user must *receive* from peers to pass
}

export interface Module {
  id: string
  title: string
  description: string
  lessonsCount: number
  lessons: Lesson[]
  quiz: Quiz // Mandatory module quiz
  assignment?: Assignment // Optional peer-reviewed assignment
}

export interface Testimony {
  id: string
  studentName: string
  avatarUrl?: string
  rating: number
  reviewText: string
}

export interface TutorDetails {
  name: string
  bio: string
  avatar: string
  expertise: string[]
}

export interface Course {
  _id: string
  title: string
  type: CourseType
  tag?: CourseTag
  price?: string
  instructor: string
  tutorDetails: TutorDetails
  previewVideo?: string
  rating: number
  color: string // Tailwind gradient classes
  image: string
  students: number
  duration: string
  level: CourseLevel
  modules: Module[]
  features?: string[]
  testimonies: Testimony[]
  forumId: string
  chatId: string
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