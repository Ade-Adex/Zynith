'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import { Types } from 'mongoose'

export interface PeerReviewItem {
  enrollmentId: string
  assignmentId: string
  assignmentTitle: string
  problemStatement: string
  submissionUrl: string
  submittedAt: string
  anonymousStudentId: string
}

export type PeerReviewResponse =
  | { success: true; data: PeerReviewItem[] }
  | { success: false; error: string }

/**
 * Fetches pending assignments submitted by other peers that need grading.
 * - Excludes the current user's own submissions.
 * - Excludes assignments the current user has already reviewed.
 * - Excludes completed or resolved assignments (only fetches 'pending_reviews').
 */
export async function getPendingPeerReviewsAction(
  userId: string,
): Promise<PeerReviewResponse> {
  try {
    await connectDB()

    if (!userId) {
      return { success: false, error: 'Unauthorized profile clearance.' }
    }

    const userObjectId = new Types.ObjectId(userId)

    // 1. Query with precise positional element exclusion logic
    const peerEnrollments = await EnrollmentModel.find({
      userId: { $ne: userObjectId }, // Exclude self
      assignmentSubmissions: {
        $elemMatch: {
          status: 'pending_reviews', // Gatekeeper: only active pending reviews
          'reviewsReceived.reviewerId': { $ne: userObjectId }, // Has NOT been reviewed by current user
        },
      },
    }).lean()

    if (!peerEnrollments.length) {
      return { success: true, data: [] }
    }

    // 2. Resolve unique Course details to map metadata properties
    const courseIds = peerEnrollments.map((e) => e.courseId)
    const courses = await CourseModel.find({ _id: { $in: courseIds } }).lean()

    const reviewItems: PeerReviewItem[] = []

    for (const enrollment of peerEnrollments) {
      const targetCourse = courses.find(
        (c) => c._id.toString() === enrollment.courseId.toString(),
      )
      if (!targetCourse) continue

      if (enrollment.assignmentSubmissions) {
        // Filter specifically for the submissions matching the grading pool rules
        const validSubmissions = enrollment.assignmentSubmissions.filter(
          (sub) =>
            sub.status === 'pending_reviews' &&
            !sub.reviewsReceived?.some(
              (rev) => rev.reviewerId.toString() === userId,
            ),
        )

        for (const sub of validSubmissions) {
          let assignmentTitle = 'System Architecture Assignment'
          let problemStatement = ''

          if (targetCourse.modules) {
            for (const mod of targetCourse.modules) {
              if (mod.assignment && mod.assignment.id === sub.assignmentId) {
                assignmentTitle = mod.assignment.title || assignmentTitle
                problemStatement = mod.assignment.problemStatement || ''
                break
              }
            }
          }

          // Generate an elegant localized obfuscated token using last 4 characters
          const cleanStringId = enrollment.userId.toString()
          const obfuscatedSeed = cleanStringId.slice(-4).toUpperCase()

          // FIX: Use the enrollment's updatedAt or a fresh Date object, matching valid fields
          const fallbackDate = enrollment.updatedAt || new Date()

          reviewItems.push({
            enrollmentId: enrollment._id.toString(),
            assignmentId: sub.assignmentId,
            assignmentTitle,
            problemStatement,
            submissionUrl: sub.submissionUrl,
            submittedAt: new Date(fallbackDate).toISOString(),
            anonymousStudentId: `ANONYMOUS_${obfuscatedSeed}`,
          })
        }
      }
    }

    return { success: true, data: reviewItems }
  } catch (error: unknown) {
    console.error('Failed fetching pending peer reviews:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Database review matrix sync fault.',
    }
  }
}
