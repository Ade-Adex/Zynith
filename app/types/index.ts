// types/index.ts

export type CourseType = 'Free' | 'Premium'

export type CourseLevel = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'

export type CourseTag = 'Trending' | 'Bestseller' | 'New'

export interface Module {
  title: string
  lessons: number
  hasTest: boolean // For per-module test results
  isFinal?: boolean // For course-wide final exam
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
