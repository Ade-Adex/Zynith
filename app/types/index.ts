// /app/types/index.ts

export type CourseType = 'Free' | 'Premium'
export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
export type CourseTag = 'Trending' | 'Bestseller' | 'New'
export type LessonContentType = 'video' | 'text' | 'hybrid'

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: string
  explanation?: string
}

export interface Quiz {
  id: string
  title: string
  passingScore: number 
  questions: QuizQuestion[]
}

export interface Lesson {
  id: string
  title: string
  duration: string
  contentType: LessonContentType
  videoUrl?: string
  markdownBody?: string
  isFreePreview: boolean
  summary: string
  isDownloadable: boolean
  downloadUrl?: string
  quiz?: Quiz | null
}

export interface Assignment {
  id: string
  title: string
  problemStatement: string
  submissionTemplateUrl?: string
  peerReviewsRequired: number
  minPeerScoreToPass: number
}

export interface Module {
  id: string
  title: string
  description: string
  lessonsCount: number
  lessons: Lesson[]
  quiz: Quiz | null
  assignment?: Assignment | null
}

export interface Testimony {
  id: string
  studentName: string
  avatar?: string
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
  slug: string
  type: CourseType
  tag?: CourseTag
  price: number
  discountPrice?: number
  currency?: string
  instructor: string
  tutorDetails: TutorDetails
  previewVideo?: string
  rating: number
  color: string 
  image: string
  students: number
  duration: string
  level: CourseLevel
  modules: Module[]
  features?: string[]
  testimonies: Testimony[]
  forumId: string
  chatId: string
  isPublished?: boolean
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
