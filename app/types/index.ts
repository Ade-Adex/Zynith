// types/index.ts

export type CourseType = 'Free' | 'Premium'

export interface Course {
  id: number
  title: string
  type: CourseType
  price?: string
  instructor: string
  rating: number
  color: string
  image?: string 
  students: number
  duration: string
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
}

export type FilterType = 'All' | CourseType

export interface StatItem {
  label: string
  val: string
}

export interface NavLink {
  label: string
  href: string
}
