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

export interface SerializedEnrollment {
  _id: string
  userId: string
  courseId: string
  status: string
  progressPercentage: number
  currentModuleId: string
  currentLessonId: string
  completedLessons: string[]
  completedModules: string[]
  quizAttempts: any[]
  assignmentSubmissions: any[]
  enrolledAt: string | null
  lastAccessedAt: string | null
}

/**
 * Provisions unique enrollments for a user across one or multiple courses.
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

    const userObjectId = new mongoose.Types.ObjectId(userId)

    const enrollmentPromises = courseIds.map(async (courseId) => {
      const courseObjectId = new mongoose.Types.ObjectId(courseId)
      const course = await CourseModel.findById(courseObjectId)
      const firstModuleId = course?.modules?.[0]?.id || ''
      const firstLessonId = course?.modules?.[0]?.lessons?.[0]?.id || ''

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
            completedModules: [],
            quizAttempts: [],
            assignmentSubmissions: [],
            enrolledAt: new Date(),
          },
          $set: {
            lastAccessedAt: new Date(),
          },
        },
        { upsert: true, returnDocument: 'after' },
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
      message: error instanceof Error ? error.message : 'Database orchestration failure.',
    }
  }
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
  if (!userId || userId === 'undefined' || !courseId || courseId === 'undefined') {
    return { success: false, data: null, message: 'Missing tracking parameters.' }
  }

  const hexRegex = /^[0-9a-fA-F]{24}$/
  if (!hexRegex.test(userId) || !hexRegex.test(courseId)) {
    return { success: false, data: null, message: 'Invalid relational identification sequences.' }
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
      return { success: false, data: null, message: 'No active workspace sequence found.' }
    }

    const serializedEnrollment: SerializedEnrollment = {
      ...enrollment,
      _id: enrollment._id.toString(),
      userId: enrollment.userId.toString(),
      courseId: enrollment.courseId.toString(),
      progressPercentage: enrollment.progressPercentage ?? 0,
      currentModuleId: enrollment.currentModuleId || '',
      currentLessonId: enrollment.currentLessonId || '',
      completedLessons: enrollment.completedLessons || [],
      completedModules: enrollment.completedModules || [],
      quizAttempts: JSON.parse(JSON.stringify(enrollment.quizAttempts || [])),
      assignmentSubmissions: JSON.parse(JSON.stringify(enrollment.assignmentSubmissions || [])),
      enrolledAt: enrollment.enrolledAt ? new Date(enrollment.enrolledAt).toISOString() : null,
      lastAccessedAt: enrollment.lastAccessedAt ? new Date(enrollment.lastAccessedAt).toISOString() : null,
    }

    return { success: true, data: serializedEnrollment, message: 'Workspace progression context successfully synced.' }
  } catch (error: unknown) {
    console.error('Enrollment recovery failure:', error)
    return { success: false, data: null, message: 'Database query orchestration fault.' }
  }
}

/**
 * Fixes Bug A & C: Atomic persistence handler for progression updates, navigation states, and quiz attempts.
 */
export async function updateEnrollmentProgressAction(
  userId: string,
  courseId: string,
  updates: {
    currentModuleId?: string
    currentLessonId?: string
    newCompletedLessonId?: string
    newCompletedModuleId?: string
    quizAttempt?: {
      quizId: string
      score: number
      passed: boolean
      answers: Array<{ questionId: string; selectedOption: string; isCorrect: boolean }>
    }
  }
): Promise<{ success: boolean; data: SerializedEnrollment | null; message: string }> {
  if (!userId || !courseId) {
    return { success: false, data: null, message: 'Missing validation params.' }
  }

  try {
    await connectDB()

    const userObjectId = new mongoose.Types.ObjectId(userId)
    const courseObjectId = new mongoose.Types.ObjectId(courseId)

    // Build standard fields
    const updateFields: any = {
      lastAccessedAt: new Date()
    }
    if (updates.currentModuleId) updateFields.currentModuleId = updates.currentModuleId
    if (updates.currentLessonId) updateFields.currentLessonId = updates.currentLessonId

    const arrayOperators: any = {}
    if (updates.newCompletedLessonId) {
      arrayOperators.completedLessons = updates.newCompletedLessonId
    }
    if (updates.newCompletedModuleId) {
      arrayOperators.completedModules = updates.newCompletedModuleId
    }

    const updateQuery: any = { $set: updateFields }
    if (Object.keys(arrayOperators).length > 0) {
      updateQuery.$addToSet = arrayOperators
    }
    if (updates.quizAttempt) {
      updateQuery.$push = { quizAttempts: { ...updates.quizAttempt, attemptedAt: new Date() } }
    }

    // Perform operational updates
    let enrollment = await EnrollmentModel.findOneAndUpdate(
      { userId: userObjectId, courseId: courseObjectId },
      updateQuery,
      { new: true }
    )

    if (!enrollment) {
      return { success: false, data: null, message: 'Enrollment sequence missing.' }
    }

    // Recalculate global progression dynamically based on total course lesson configuration counts
    const course = await CourseModel.findById(courseObjectId).lean()
    if (course) {
      const totalLessonsCount = course.modules.reduce((acc: number, curr: any) => acc + (curr.lessonsCount || curr.lessons?.length || 0), 0)
      if (totalLessonsCount > 0) {
        const uniqueCompletedCount = enrollment.completedLessons.length
        const rawPercentage = (uniqueCompletedCount / totalLessonsCount) * 100
        enrollment.progressPercentage = Math.min(Math.round(rawPercentage), 100)
        if (enrollment.progressPercentage === 100) {
          enrollment.status = 'completed'
        }
        await enrollment.save()
      }
    }

    const serializedEnrollment: SerializedEnrollment = {
      ...enrollment.toObject(),
      _id: enrollment._id.toString(),
      userId: enrollment.userId.toString(),
      courseId: enrollment.courseId.toString(),
      progressPercentage: enrollment.progressPercentage || 0,
      currentModuleId: enrollment.currentModuleId || '',
      currentLessonId: enrollment.currentLessonId || '',
      completedLessons: enrollment.completedLessons || [],
      completedModules: enrollment.completedModules || [],
      quizAttempts: JSON.parse(JSON.stringify(enrollment.quizAttempts || [])),
      assignmentSubmissions: JSON.parse(JSON.stringify(enrollment.assignmentSubmissions || [])),
      enrolledAt: enrollment.enrolledAt ? enrollment.enrolledAt.toISOString() : null,
      lastAccessedAt: enrollment.lastAccessedAt ? enrollment.lastAccessedAt.toISOString() : null,
    }

    return { success: true, data: serializedEnrollment, message: 'Database saved.' }
  } catch (error: unknown) {
    console.error('Failed progression sync block:', error)
    return { success: false, data: null, message: 'Internal server updating engine breakdown.' }
  }
}
