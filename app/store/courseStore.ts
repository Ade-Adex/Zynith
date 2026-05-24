  // /app/store/courseStore.ts
  import { create } from 'zustand'
  import { Course } from '@/app/types'

  interface CourseState {
    courses: Course[]
    activeCourse: Course | null
    isLoading: boolean
    error: string | null
    setCourses: (courses: Course[]) => void
    setActiveCourse: (course: Course | null) => void
    addCourseToStore: (course: Course) => void
    setLoadingState: (loading: boolean) => void
  }

  export const useCourseStore = create<CourseState>((set) => ({
    courses: [],
    activeCourse: null,
    isLoading: false,
    error: null,
    setCourses: (courses) => set({ courses, isLoading: false }),
    setActiveCourse: (course) => set({ activeCourse: course }),
    addCourseToStore: (course) =>
      set((state) => ({ courses: [...state.courses, course] })),
    setLoadingState: (loading) => set({ isLoading: loading }),
  }))
