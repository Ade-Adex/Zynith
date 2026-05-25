// /app/services/enrollmentActions.ts

'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import { Course, Lesson, Module } from '@/app/types'
import { Types, UpdateQuery } from 'mongoose'
import {
  IDbEnrollment,
  SerializedEnrollment,
  UpdatePayload,
} from '@/app/types/enrollment'

export type EnrollmentActionResult = {
  success: boolean
  message: string
  data?: SerializedEnrollment
}

/**
 * Helper: Converts the Mongoose Database Document to the Frontend-ready SerializedEnrollment type.
 */
const serializeEnrollment = (doc: IDbEnrollment): SerializedEnrollment => ({
  _id: doc._id.toString(),
  userId: doc.userId.toString(),
  courseId: doc.courseId.toString(),
  status: doc.status,
  progressPercentage: doc.progressPercentage ?? 0,
  currentModuleId: doc.currentModuleId || '',
  currentLessonId: doc.currentLessonId || '',
  completedLessons: doc.completedLessons || [],
  completedModules: doc.completedModules || [],

  quizAttempts: (doc.quizAttempts || []).map((q) => ({
    quizId: q.quizId,
    score: q.score,
    passed: q.passed,
    attemptedAt: (q.attemptedAt instanceof Date
      ? q.attemptedAt
      : new Date(q.attemptedAt)
    ).toISOString(),
    answers: (q.answers || []).map((ans) => ({
      questionId: ans.questionId,
      selectedOption: ans.selectedOption,
      isCorrect: ans.isCorrect,
    })),
  })),

  assignmentSubmissions: (doc.assignmentSubmissions || []).map((a) => ({
    assignmentId: a.assignmentId,
    submissionUrl: a.submissionUrl,
    status: a.status,
    finalScore: a.finalScore,
    reviewsReceived: (a.reviewsReceived || []).map((r) => ({
      reviewerId: r.reviewerId.toString(),
      score: r.score,
      feedback: r.feedback,
    })),
  })),

  enrolledAt: doc.enrolledAt
    ? (doc.enrolledAt instanceof Date
        ? doc.enrolledAt
        : new Date(doc.enrolledAt)
      ).toISOString()
    : null,
  lastAccessedAt: doc.lastAccessedAt
    ? (doc.lastAccessedAt instanceof Date
        ? doc.lastAccessedAt
        : new Date(doc.lastAccessedAt)
      ).toISOString()
    : null,
})

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

    const userObjectId = new Types.ObjectId(userId)

    const enrollmentPromises = courseIds.map(async (courseId) => {
      const courseObjectId = new Types.ObjectId(courseId)

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

    const enrollment = await EnrollmentModel.findOne({
      userId: new Types.ObjectId(userId),
      courseId: new Types.ObjectId(courseId),
      status: 'active',
    }).lean()

    if (!enrollment) {
      return {
        success: false,
        data: null,
        message: 'No active workspace sequence found.',
      }
    }

    return {
      success: true,
      data: serializeEnrollment(enrollment),
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
//   updates: UpdatePayload,
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

//     const updateQuery: UpdateQuery<IDbEnrollment> = {
//       $set: { lastAccessedAt: new Date() },
//     }

//     if (updates.currentModuleId)
//       updateQuery.$set!.currentModuleId = updates.currentModuleId
//     if (updates.currentLessonId)
//       updateQuery.$set!.currentLessonId = updates.currentLessonId

//     if (updates.newCompletedLessonId) {
//       if (!updateQuery.$addToSet) updateQuery.$addToSet = {}
//       updateQuery.$addToSet.completedLessons = updates.newCompletedLessonId
//     }

//     if (updates.quizAttempt) {
//       // We cast the object push to match the schema structure expected by IEnrollment
//       updateQuery.$push = {
//         quizAttempts: {
//           ...updates.quizAttempt,
//           attemptedAt: new Date(),
//         },
//       }
//     }

//     const updatedEnrollment = await EnrollmentModel.findOneAndUpdate(
//       { userId: userObjectId, courseId: courseObjectId },
//       updateQuery,
//       { returnDocument: 'after' },
//     )

//     if (!updatedEnrollment) {
//       return { success: false, data: null, message: 'Enrollment not found.' }
//     }

//     // 3. Server-Side Completion Logic (Using imported Course type)
//     const course = await CourseModel.findById(
//       courseObjectId,
//     ).lean<Course | null>()

//     if (course) {
//       const { completedLessons, quizAttempts, assignmentSubmissions } =
//         updatedEnrollment
//       const newCompletedModules = new Set(
//         updatedEnrollment.completedModules || [],
//       )

//       for (const mod of course.modules) {
//         // Correctly typed iteration over Module and Lesson
//         const allModuleLessonsDone = mod.lessons.every((lesson: Lesson) =>
//           completedLessons?.includes(lesson.id),
//         )

//         const quizPassed =
//           !mod.quiz ||
//           quizAttempts?.some((q) => q.quizId === mod.quiz!.id && q.passed)
//         const assignmentSubmitted =
//           !mod.assignment ||
//           assignmentSubmissions?.some(
//             (s) => s.assignmentId === mod.assignment!.id,
//           )

//         if (allModuleLessonsDone && quizPassed && assignmentSubmitted) {
//           newCompletedModules.add(mod.id)
//         }
//       }

//       // Calculate Progress Percentage using typed Module array
//       const totalLessons = course.modules.reduce(
//         (acc: number, m: Module) => acc + m.lessons.length,
//         0,
//       )

//       const finalPercentage =
//         totalLessons > 0
//           ? Math.round(((completedLessons?.length || 0) / totalLessons) * 100)
//           : 0

//       const newStatus =
//         newCompletedModules.size === course.modules.length
//           ? 'completed'
//           : 'active'

//       // 4. Conditional Sync
//       const completedModulesArray = Array.from(newCompletedModules)

//       if (
//         finalPercentage !== updatedEnrollment.progressPercentage ||
//         completedModulesArray.length !==
//           (updatedEnrollment.completedModules?.length || 0) ||
//         updatedEnrollment.status !== newStatus
//       ) {
//         await EnrollmentModel.updateOne(
//           { _id: updatedEnrollment._id },
//           {
//             $set: {
//               progressPercentage: finalPercentage,
//               status: newStatus,
//               completedModules: completedModulesArray,
//             },
//           },
//         )
//         updatedEnrollment.progressPercentage = finalPercentage
//         updatedEnrollment.status = newStatus
//         updatedEnrollment.completedModules = completedModulesArray
//       }
//     }

//     return {
//       success: true,
//       data: serializeEnrollment(updatedEnrollment as IDbEnrollment),
//       message: 'Progress updated successfully.',
//     }
//   } catch (error) {
//     console.error('System error:', error)
//     return {
//       success: false,
//       data: null,
//       message: 'System error updating progress.',
//     }
//   }
// }

export async function updateEnrollmentProgressAction(
  userId: string,
  courseId: string,
  payload: UpdatePayload,
): Promise<EnrollmentActionResult> {
  try {
    await connectDB()

    // 1. Verify alignment variables
    if (!userId || !courseId) {
      return { success: false, message: 'Missing user ID or course ID.' }
    }

    // 2. Check if this assignment submission already exists to decide between update or push
    if (payload.assignmentSubmission) {
      const { assignmentId, url } = payload.assignmentSubmission

      const existingEnrollment = await EnrollmentModel.findOne({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        'assignmentSubmissions.assignmentId': assignmentId,
      })

      if (existingEnrollment) {
        // Option A: Update existing assignment submission url
        const updatedDoc = await EnrollmentModel.findOneAndUpdate(
          {
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId),
            'assignmentSubmissions.assignmentId': assignmentId,
          },
          {
            $set: {
              'assignmentSubmissions.$.submissionUrl': url,
              'assignmentSubmissions.$.status': 'pending_reviews', // Reset state if re-submitted
              lastAccessedAt: new Date(),
            },
          },
          { new: true },
        )

        if (!updatedDoc)
          return { success: false, message: 'Enrollment record not found.' }
        return {
          success: true,
          message: 'Assignment updated successfully!',
          data: serializeEnrollment(updatedDoc),
        }
      } else {
        // Option B: Push a new assignment submission entry
        const updatedDoc = await EnrollmentModel.findOneAndUpdate(
          {
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId),
          },
          {
            $push: {
              assignmentSubmissions: {
                assignmentId,
                submissionUrl: url,
                status: 'pending_reviews',
                reviewsReceived: [],
                finalScore: 0,
              },
            },
            $set: { lastAccessedAt: new Date() },
          },
          { new: true },
        )

        if (!updatedDoc)
          return { success: false, message: 'Enrollment record not found.' }
        return {
          success: true,
          message: 'Assignment submitted successfully!',
          data: serializeEnrollment(updatedDoc),
        }
      }
    }

    // Handle generic lesson progress updates (Fallback if no assignment payload provided)
    const genericUpdate: UpdateQuery<IDbEnrollment> = {
      $set: { lastAccessedAt: new Date() },
    }

    if (payload.currentModuleId)
      genericUpdate.$set!.currentModuleId = payload.currentModuleId
    if (payload.currentLessonId)
      genericUpdate.$set!.currentLessonId = payload.currentLessonId
    if (payload.newCompletedLessonId)
      genericUpdate.$addToSet = {
        completedLessons: payload.newCompletedLessonId,
      }
    if (payload.newCompletedModuleId)
      genericUpdate.$addToSet = {
        ...genericUpdate.$addToSet,
        completedModules: payload.newCompletedModuleId,
      }
    if (payload.quizAttempt)
      genericUpdate.$push = {
        quizAttempts: { ...payload.quizAttempt, attemptedAt: new Date() },
      }

    const updatedDoc = await EnrollmentModel.findOneAndUpdate(
      {
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
      },
      genericUpdate,
      { new: true },
    )

    if (!updatedDoc) {
      return { success: false, message: 'Enrollment record not found.' }
    }

    return {
      success: true,
      message: 'Progress updated successfully.',
      data: serializeEnrollment(updatedDoc),
    }
  } catch (error: unknown) {
    console.error('Failed to update progress status:', error)
    return {
      success: false,
      message: (error as Error).message || 'Server error tracking progress.',
    }
  }
}