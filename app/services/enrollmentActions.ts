// /app/services/enrollmentActions.ts

'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import { Course } from '@/app/types'
import { Types, UpdateQuery } from 'mongoose'
import {
  SerializedEnrollment,
  IDbEnrollment,
  UpdatePayload,
} from '@/app/types/enrollment'
import { TransactionModel } from '@/app/models/Transaction'

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
  gatewayDetails?: {
    gateway: 'PAYSTACK' | 'WALLET' | 'STRIPE'
    cardType?: string
    last4?: string
    bank?: string
  },
) {
  if (!userId || !courseIds || courseIds.length === 0) {
    return { success: false, message: 'Missing crucial enrollment parameters.' }
  }

  try {
    await connectDB()
    const userObjectId = new Types.ObjectId(userId)
    const courseObjectIds = courseIds.map((id) => new Types.ObjectId(id))

    const existingEnrollments = await EnrollmentModel.find({
      userId: userObjectId,
      courseId: { $in: courseObjectIds },
      status: 'active',
    }).lean()

    if (existingEnrollments.length > 0) {
      return {
        success: false,
        message:
          'You are already enrolled in one or more of the selected courses.',
      }
    }

    // Resolve exactly fallback value and force UpperCase for structural math check safety
    const determinedGateway = (
      gatewayDetails?.gateway || 'PAYSTACK'
    ).toUpperCase() as 'PAYSTACK' | 'WALLET' | 'STRIPE'

    // 1. Resolve exact price details across all selected courses
    const verifiedCourses = await CourseModel.find({
      _id: { $in: courseObjectIds },
    }).lean<Course[]>()

    const isSubunitGateway =
      determinedGateway === 'PAYSTACK' || determinedGateway === 'STRIPE'

    let totalSubtotalKobo = 0
    let totalTaxKobo = 0
    let totalCombinedKobo = 0

    const transactionItems = verifiedCourses.map((course) => {
      const standardItemSubtotal = Number(course.price)
      const standardItemTax = standardItemSubtotal * 0.075
      const standardItemTotal = standardItemSubtotal + standardItemTax

      // Convert to Subunits (Kobo/Cents) accurately if gateway structural layout matches
      const finalItemPrice = isSubunitGateway
        ? Math.round(standardItemSubtotal * 100)
        : standardItemSubtotal
      const finalItemTax = isSubunitGateway
        ? Math.round(standardItemTax * 100)
        : standardItemTax
      const finalItemTotal = isSubunitGateway
        ? Math.round(standardItemTotal * 100)
        : standardItemTotal

      totalSubtotalKobo += finalItemPrice
      totalTaxKobo += finalItemTax
      totalCombinedKobo += finalItemTotal

      return {
        courseId: course._id,
        title: course.title,
        price: finalItemPrice,
      }
    })

    // 2. Core Fix: Explicit updates targeting matching fields
    await TransactionModel.findOneAndUpdate(
      { reference: paymentReference },
      {
        $set: {
          userId: userObjectId,
          gateway: determinedGateway,
          items: transactionItems,
          subtotal: totalSubtotalKobo,
          tax: totalTaxKobo,
          total: totalCombinedKobo,
          status: 'SUCCESS',
          paymentDetails: {
            cardType: gatewayDetails?.cardType || 'N/A',
            last4: gatewayDetails?.last4 || 'N/A',
            bank: gatewayDetails?.bank || 'N/A',
          },
        },
      },
      { upsert: true, new: true },
    )

    // 3. Provision workspace access items
    const enrollmentPromises = verifiedCourses.map(async (course) => {
      const firstModuleId = course.modules?.[0]?.id || ''
      const firstLessonId = course.modules?.[0]?.lessons?.[0]?.id || ''

      return EnrollmentModel.findOneAndUpdate(
        { userId: userObjectId, courseId: course._id },
        {
          $setOnInsert: {
            userId: userObjectId,
            courseId: course._id,
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
          $set: { lastAccessedAt: new Date() },
        },
        { upsert: true, returnDocument: 'after' },
      )
    })

    await Promise.all(enrollmentPromises)

    return {
      success: true,
      message: 'Secure workspace access parameters successfully provisioned.',
    }
  } catch (error) {
    console.error('Enrollment generation system fault:', error)
    return { success: false, message: 'Database orchestration failure.' }
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

export async function updateEnrollmentProgressAction(
  userId: string,
  courseId: string,
  payload: UpdatePayload,
): Promise<EnrollmentActionResult> {
  try {
    await connectDB()

    if (!userId || !courseId) {
      return { success: false, message: 'Missing user ID or course ID.' }
    }

    if (payload.assignmentSubmission) {
      const { assignmentId, url } = payload.assignmentSubmission

      const existingEnrollment = await EnrollmentModel.findOne({
        userId: new Types.ObjectId(userId),
        courseId: new Types.ObjectId(courseId),
        'assignmentSubmissions.assignmentId': assignmentId,
      })

      if (existingEnrollment) {
        const updatedDoc = await EnrollmentModel.findOneAndUpdate(
          {
            userId: new Types.ObjectId(userId),
            courseId: new Types.ObjectId(courseId),
            'assignmentSubmissions.assignmentId': assignmentId,
          },
          {
            $set: {
              'assignmentSubmissions.$.submissionUrl': url,
              'assignmentSubmissions.$.status': 'pending_reviews',
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

/**
 * Checks if a user is already enrolled in a list of course IDs.
 */
export async function checkExistingEnrollmentsAction(
  userId: string,
  courseIds: string[],
): Promise<{ hasDuplicates: boolean; duplicateTitles: string[] }> {
  if (!userId || !courseIds || courseIds.length === 0) {
    return { hasDuplicates: false, duplicateTitles: [] }
  }

  try {
    await connectDB()
    const userObjectId = new Types.ObjectId(userId)
    const courseObjectIds = courseIds.map((id) => new Types.ObjectId(id))

    const existingEnrollments = await EnrollmentModel.find({
      userId: userObjectId,
      courseId: { $in: courseObjectIds },
      status: 'active',
    }).lean()

    if (existingEnrollments.length > 0) {
      const duplicateCourseIds = existingEnrollments.map((e) =>
        e.courseId.toString(),
      )

      const duplicateCourses = await CourseModel.find(
        {
          _id: { $in: duplicateCourseIds.map((id) => new Types.ObjectId(id)) },
        },
        'title',
      ).lean()

      return {
        hasDuplicates: true,
        duplicateTitles: duplicateCourses.map((c) => c.title),
      }
    }

    return { hasDuplicates: false, duplicateTitles: [] }
  } catch (error) {
    console.error('Error validating unique checkout constraints:', error)
    return { hasDuplicates: false, duplicateTitles: [] }
  }
}
