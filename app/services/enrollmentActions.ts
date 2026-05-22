// /app/services/enrollmentActions.ts
'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import mongoose from 'mongoose'

export type EnrollmentActionResult = {
  success: boolean
  message: string
}

/**
 * Provisions unique enrollments for a user across one or multiple courses.
 * Can be verified against a paystack reference lookup API if absolute confirmation is desired.
 */
export async function enrollUserAfterPaymentAction(
  userId: string,
  courseIds: string[],
  paymentReference: string,
): Promise<EnrollmentActionResult> {
  if (!userId || !courseIds || courseIds.length === 0) {
    return { success: false, message: 'Missing crucial enrollment parameters.' }
  }

  try {
    await connectDB()

    // 1. Convert structural string IDs to valid ObjectIds
    const userObjectId = new mongoose.Types.ObjectId(userId)

    // 2. Loop through and process matching entities
    const enrollmentPromises = courseIds.map(async (courseId) => {
      const courseObjectId = new mongoose.Types.ObjectId(courseId)

      // Fetch course structure briefly to store entry baseline context if needed
      const course = await CourseModel.findById(courseObjectId)
      const firstModuleId = course?.modules?.[0]?.id || ''
      const firstLessonId = course?.modules?.[0]?.lessons?.[0]?.id || ''

      // Use upsert to prevent duplicate index violation rules if user double clicks
      return EnrollmentModel.findOneAndUpdate(
        { userId: userObjectId, courseId: courseObjectId },
        {
          $setOnInsert: {
            userId: userObjectId,
            courseId: courseObjectId,
            status: 'active',
            progressPercentage: 0,
            currentModuleId: firstModuleId,
            currentLessonId: firstLessonId,
            completedLessons: [],
            enrolledAt: new Date(),
          },
          $set: {
            lastAccessedAt: new Date(),
          },
        },
        { upsert: true, new: true },
      )
    })

    await Promise.all(enrollmentPromises)

    return {
      success: true,
      message: 'Secure workspace access parameters successfully provisioned.',
    }
  } catch (error: unknown) {
    console.error('Enrollment generation system fault:', error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Database orchestration failure.',
    }
  }
}


// Define a type match representing your Lean MongoDB Enrollment document structure
export interface SerializedEnrollment {
  _id: string
  userId: string
  courseId: string
  status: string
  currentModuleId?: string
  currentLessonId?: string
  enrolledAt: string | null
  lastAccessedAt: string | null
  [key: string]: unknown // Gracefully handles additional dynamic schema keys
}

/**
 * Fetches a single active enrollment record for a user to synchronize live progress.
 */
export async function getEnrollmentProgressAction(
  userId: string,
  courseId: string,
): Promise<{
  success: boolean
  data: SerializedEnrollment | null
  message: string
}> {
  // Catch both baseline falsy items and literal stringified 'undefined' drop-ins
  if (
    !userId ||
    userId === 'undefined' ||
    !courseId ||
    courseId === 'undefined'
  ) {
    return {
      success: false,
      data: null,
      message: 'Missing tracking parameters.',
    }
  }

  // Enforce rigid 24-character hex-string checks before passing down to BSON compilers
  const hexRegex = /^[0-9a-fA-F]{24}$/
  if (!hexRegex.test(userId) || !hexRegex.test(courseId)) {
    return {
      success: false,
      data: null,
      message: 'Invalid relational identification sequences.',
    }
  }

  try {
    await connectDB()

    const userObjectId = new mongoose.Types.ObjectId(userId)
    const courseObjectId = new mongoose.Types.ObjectId(courseId)

    const enrollment = await EnrollmentModel.findOne({
      userId: userObjectId,
      courseId: courseObjectId,
      status: 'active',
    }).lean()

    if (!enrollment) {
      return {
        success: false,
        data: null,
        message: 'No active workspace sequence found.',
      }
    }

    // Convert MongoDB ObjectIds cleanly to plain strings for safe Next.js Server Action boundary transit
    const serializedEnrollment: SerializedEnrollment = {
      ...enrollment,
      _id: enrollment._id.toString(),
      userId: enrollment.userId.toString(),
      courseId: enrollment.courseId.toString(),
      enrolledAt: enrollment.enrolledAt
        ? new Date(enrollment.enrolledAt).toISOString()
        : null,
      lastAccessedAt: enrollment.lastAccessedAt
        ? new Date(enrollment.lastAccessedAt).toISOString()
        : null,
      currentModuleId: enrollment.currentModuleId?.toString(),
      currentLessonId: enrollment.currentLessonId?.toString(),
    }

    return {
      success: true,
      data: serializedEnrollment,
      message: 'Workspace progression context successfully synced.',
    }
  } catch (error: unknown) {
    console.error('Enrollment recovery failure:', error)
    return {
      success: false,
      data: null,
      message: 'Database query orchestration fault.',
    }
  }
}