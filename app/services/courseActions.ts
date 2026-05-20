// /app/services/courseActions.ts
'use server'

import connectDB from '@/app/lib/db'
import { CourseModel } from '@/app/models/Course'
import { Course } from '@/app/types'

export type CourseActionResult = {
  success: boolean
  message: string
  data?: Course
}

export async function createCourseAction(
  payload: Partial<Course>,
): Promise<CourseActionResult> {
  try {
    await connectDB()

    if (!payload.title || !payload.price || !payload.modules) {
      return { success: false, message: 'Missing structural parameters.' }
    }

    const newCourse = new CourseModel(payload)
    const savedCourse = await newCourse.save()

    return {
      success: true,
      message: 'Course saved through Hybrid Server Context.',
      data: JSON.parse(JSON.stringify(savedCourse)) as Course,
    }
  } catch (error: unknown) {
    console.error('Action creation error:', error)
    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Server action runtime transaction failure.'

    return {
      success: false,
      message: errorMessage,
    }
  }
}
