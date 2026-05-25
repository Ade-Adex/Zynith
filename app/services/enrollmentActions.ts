// /app/services/enrollmentActions.ts

'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel, IEnrollment } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import { Module } from '@/app/types'
import mongoose, { UpdateQuery, Types } from 'mongoose'

export type EnrollmentActionResult = {
  success: boolean
  message: string
}

// Explicit structures for child document types instead of any arrays
export interface SerializedQuizAttempt {
  quizId: string
  score: number
  passed: boolean
  answers: Array<{
    questionId: string
    selectedOption: string
    isCorrect: boolean
  }>
  attemptedAt: string
}

export interface SerializedAssignmentSubmission {
  assignmentId: string
  submissionUrl: string
  status: 'pending_reviews' | 'passed' | 'failed'
  reviewsReceived: Array<{
    reviewerId: string
    score: number
    feedback: string
  }>
  finalScore: number
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
  quizAttempts: SerializedQuizAttempt[]
  assignmentSubmissions: SerializedAssignmentSubmission[]
  enrolledAt: string | null
  lastAccessedAt: string | null
}

// Interfaces to type-safe the atomic MongoDB operational objects dynamically
interface EnrollmentUpdateFields {
  lastAccessedAt: Date
  currentModuleId?: string
  currentLessonId?: string
}

interface EnrollmentArrayOperators {
  completedLessons?: string
  completedModules?: string
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

      // Cast the lean query or fallback to a typed structural shape
      const course = (await CourseModel.findById(courseObjectId).lean()) as {
        modules?: Module[]
      } | null
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
      message:
        error instanceof Error
          ? error.message
          : 'Database orchestration failure.',
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

    const serializedEnrollment: SerializedEnrollment = {
      _id: enrollment._id.toString(),
      userId: enrollment.userId.toString(),
      courseId: enrollment.courseId.toString(),
      status: enrollment.status,
      progressPercentage: enrollment.progressPercentage ?? 0,
      currentModuleId: enrollment.currentModuleId || '',
      currentLessonId: enrollment.currentLessonId || '',
      completedLessons: enrollment.completedLessons || [],
      completedModules: enrollment.completedModules || [],
      quizAttempts: JSON.parse(
        JSON.stringify(enrollment.quizAttempts || []),
      ) as SerializedQuizAttempt[],
      assignmentSubmissions: JSON.parse(
        JSON.stringify(enrollment.assignmentSubmissions || []),
      ) as SerializedAssignmentSubmission[],
      enrolledAt: enrollment.enrolledAt
        ? new Date(enrollment.enrolledAt).toISOString()
        : null,
      lastAccessedAt: enrollment.lastAccessedAt
        ? new Date(enrollment.lastAccessedAt).toISOString()
        : null,
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

// export async function updateEnrollmentProgressAction(
//   userId: string,
//   courseId: string,
//   updates: {
//     currentModuleId?: string
//     currentLessonId?: string
//     newCompletedLessonId?: string
//     newCompletedModuleId?: string
//     quizAttempt?: {
//       quizId: string
//       score: number
//       passed: boolean
//       answers: Array<{
//         questionId: string
//         selectedOption: string
//         isCorrect: boolean
//       }>
//     }
//   },
// ): Promise<{
//   success: boolean
//   data: SerializedEnrollment | null
//   message: string
// }> {
//   if (!userId || !courseId) {
//     return { success: false, data: null, message: 'Missing validation params.' }
//   }

//   try {
//     await connectDB()

//     const userObjectId = new Types.ObjectId(userId)
//     const courseObjectId = new Types.ObjectId(courseId)

//     // 1. Properly Typed Update Fields (Using Partial<IEnrollment>)
//     const updateFields: Partial<IEnrollment> = { lastAccessedAt: new Date() }
//     if (updates.currentModuleId) updateFields.currentModuleId = updates.currentModuleId
//     if (updates.currentLessonId) updateFields.currentLessonId = updates.currentLessonId

//     const updateQuery: UpdateQuery<IEnrollment> = { $set: updateFields }

//     // 2. Properly Typed Array Operators (Using Record<string, string>)
//     const arrayOperators: Record<string, string> = {}
//     if (updates.newCompletedLessonId) arrayOperators.completedLessons = updates.newCompletedLessonId
//     if (updates.newCompletedModuleId) arrayOperators.completedModules = updates.newCompletedModuleId

//     if (Object.keys(arrayOperators).length > 0) {
//       updateQuery.$addToSet = arrayOperators
//     }

//     if (updates.quizAttempt) {
//       updateQuery.$push = {
//         quizAttempts: { ...updates.quizAttempt, attemptedAt: new Date() },
//       }
//     }

//     // 3. Update & Retrieve
//     const enrollment = await EnrollmentModel.findOneAndUpdate(
//       { userId: userObjectId, courseId: courseObjectId },
//       updateQuery,
//       { new: true }
//     )

//     if (!enrollment) return { success: false, data: null, message: 'Enrollment missing.' }

//     // 4. Calculate Progression
//     const course = await CourseModel.findById(courseObjectId).lean<{ modules: Module[] }>()
//     if (course && course.modules) {
//       const totalLessons = course.modules.reduce((acc: number, m: Module) => acc + (m.lessons?.length || 0), 0)
//       const completedCount = enrollment.completedLessons?.length || 0

//       const newPercentage = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

//       enrollment.progressPercentage = newPercentage
//       await enrollment.save()
//     }

//     // 5. Construct Serialized Data Manually (No "as" cast)
//     const serializedData: SerializedEnrollment = {
//       _id: enrollment._id.toString(),
//       userId: enrollment.userId.toString(),
//       courseId: enrollment.courseId.toString(),
//       status: enrollment.status,
//       progressPercentage: enrollment.progressPercentage ?? 0,
//       currentModuleId: enrollment.currentModuleId || '',
//       currentLessonId: enrollment.currentLessonId || '',
//       completedLessons: enrollment.completedLessons || [],
//       completedModules: enrollment.completedModules || [],

//       // Explicitly map nested arrays to fix the "Types are incompatible" error
//       quizAttempts: (enrollment.quizAttempts || []).map((q) => ({
//         quizId: q.quizId,
//         score: q.score,
//         passed: q.passed,
//         answers: q.answers,
//         attemptedAt:
//           q.attemptedAt instanceof Date
//             ? q.attemptedAt.toISOString()
//             : new Date(q.attemptedAt).toISOString(),
//       })),

//       assignmentSubmissions: (enrollment.assignmentSubmissions || []).map(
//         (sub) => ({
//           assignmentId: sub.assignmentId,
//           submissionUrl: sub.submissionUrl,
//           status: sub.status,
//           // Fix: Explicitly map the inner array to convert ObjectId to string
//           reviewsReceived: (sub.reviewsReceived || []).map((review) => ({
//             reviewerId: review.reviewerId.toString(),
//             score: review.score,
//             feedback: review.feedback,
//           })),
//           finalScore: sub.finalScore,
//         }),
//       ),

//       enrolledAt:
//         enrollment.enrolledAt instanceof Date
//           ? enrollment.enrolledAt.toISOString()
//           : null,
//       lastAccessedAt:
//         enrollment.lastAccessedAt instanceof Date
//           ? enrollment.lastAccessedAt.toISOString()
//           : null,
//     }

//     return {
//       success: true,
//       data: serializedData,
//       message: 'Progression updated.',
//     }
//   } catch (error) {
//     console.error(error)
//     return { success: false, data: null, message: 'System error updating progress.' }
//   }
// }

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
      answers: Array<{
        questionId: string
        selectedOption: string
        isCorrect: boolean
      }>
    }
  },
): Promise<{
  success: boolean
  data: SerializedEnrollment | null
  message: string
}> {
  if (!userId || !courseId) {
    return { success: false, data: null, message: 'Missing validation params.' }
  }

  try {
    await connectDB()

    const userObjectId = new Types.ObjectId(userId)
    const courseObjectId = new Types.ObjectId(courseId)

    // 1. Build Update Query safely
    const updateQuery: UpdateQuery<IEnrollment> = {
      $set: { lastAccessedAt: new Date() },
    }

    if (updates.currentModuleId)
      updateQuery.$set!.currentModuleId = updates.currentModuleId
    if (updates.currentLessonId)
      updateQuery.$set!.currentLessonId = updates.currentLessonId

    // Handle Set Operators (must be initialized if keys exist)
    const addToSet: Record<string, string> = {}
    if (updates.newCompletedLessonId)
      addToSet.completedLessons = updates.newCompletedLessonId
    if (updates.newCompletedModuleId)
      addToSet.completedModules = updates.newCompletedModuleId

    if (Object.keys(addToSet).length > 0) {
      updateQuery.$addToSet = addToSet
    }

    if (updates.quizAttempt) {
      updateQuery.$push = {
        quizAttempts: { ...updates.quizAttempt, attemptedAt: new Date() },
      }
    }

    // 2. Perform Atomic Update
    // Using lean() here to get a POJO directly, avoiding heavy Mongoose Document overhead
    const updatedEnrollment = await EnrollmentModel.findOneAndUpdate(
      { userId: userObjectId, courseId: courseObjectId },
      updateQuery,
      { returnDocument: 'after' },
    ).lean<IEnrollment | null>()

    if (!updatedEnrollment) {
      return { success: false, data: null, message: 'Enrollment missing.' }
    }

    // 3. Calculate Progression
    // Fetch lean course to get module data
    const course = await CourseModel.findById(courseObjectId).lean<{
      modules: Module[]
    }>()

    let finalPercentage = updatedEnrollment.progressPercentage

    if (course?.modules) {
      const totalLessons = course.modules.reduce(
        (acc: number, m: Module) => acc + (m.lessons?.length || 0),
        0,
      )
      const completedCount = updatedEnrollment.completedLessons?.length || 0

      finalPercentage =
        totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0

      // Update progress in DB if it changed
      if (finalPercentage !== updatedEnrollment.progressPercentage) {
        await EnrollmentModel.updateOne(
          { _id: updatedEnrollment._id },
          { $set: { progressPercentage: finalPercentage } },
        )
        updatedEnrollment.progressPercentage = finalPercentage
      }
    }

    // 4. Return strictly typed Serialized Data (No type assertions needed)
    return {
      success: true,
      data: {
        _id: updatedEnrollment._id.toString(),
        userId: updatedEnrollment.userId.toString(),
        courseId: updatedEnrollment.courseId.toString(),
        status: updatedEnrollment.status,
        progressPercentage: updatedEnrollment.progressPercentage,
        currentModuleId: updatedEnrollment.currentModuleId,
        currentLessonId: updatedEnrollment.currentLessonId,
        completedLessons: updatedEnrollment.completedLessons,
        completedModules: updatedEnrollment.completedModules,

        quizAttempts: (updatedEnrollment.quizAttempts || []).map((q) => ({
          quizId: q.quizId,
          score: q.score,
          passed: q.passed,
          answers: q.answers,
          attemptedAt:
            q.attemptedAt instanceof Date
              ? q.attemptedAt.toISOString()
              : new Date(q.attemptedAt).toISOString(),
        })),

        assignmentSubmissions: (
          updatedEnrollment.assignmentSubmissions || []
        ).map((sub) => ({
          assignmentId: sub.assignmentId,
          submissionUrl: sub.submissionUrl,
          status: sub.status,
          reviewsReceived: (sub.reviewsReceived || []).map((r) => ({
            reviewerId: r.reviewerId.toString(),
            score: r.score,
            feedback: r.feedback,
          })),
          finalScore: sub.finalScore,
        })),

        enrolledAt:
          updatedEnrollment.enrolledAt instanceof Date
            ? updatedEnrollment.enrolledAt.toISOString()
            : null,
        lastAccessedAt:
          updatedEnrollment.lastAccessedAt instanceof Date
            ? updatedEnrollment.lastAccessedAt.toISOString()
            : null,
      },
      message: 'Progression updated.',
    }
  } catch (error) {
    console.error('System error:', error)
    return {
      success: false,
      data: null,
      message: 'System error updating progress.',
    }
  }
}