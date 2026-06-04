// /app/services/peerReviewActions.ts


'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import { Types } from 'mongoose'
import { User } from '@/app/models/User'

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


  export interface ReceivedReviewDetails {
    reviewerId: string
    score: number
    feedback: string
  }

  export interface ReceivedReviewItem {
    assignmentId: string
    assignmentTitle: string
    submissionUrl: string
    status: 'pending_reviews' | 'passed' | 'failed'
    finalScore?: number
    reviewsReceived: ReceivedReviewDetails[]
  }

  export type ReceivedReviewsResponse =
    | { success: true; data: ReceivedReviewItem[] }
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




/**
 * Submits a score and commentary feedback context for an individual peer assignment submission.
 */
// export async function submitPeerReviewAction(
//   reviewerId: string,
//   enrollmentId: string,
//   assignmentId: string,
//   payload: { score: number; feedback: string }
// ): Promise<{ success: boolean; message: string }> {
//   try {
//     await connectDB()

//     if (!reviewerId || !enrollmentId || !assignmentId) {
//       return { success: false, message: 'Missing structural validation IDs.' }
//     }

//     const reviewerObjectId = new Types.ObjectId(reviewerId)
//     const enrollmentObjectId = new Types.ObjectId(enrollmentId)

//     // 1. Append the feedback block directly into the array using positional filtering criteria
//     const updatedEnrollment = await EnrollmentModel.findOneAndUpdate(
//       {
//         _id: enrollmentObjectId,
//         'assignmentSubmissions.assignmentId': assignmentId,
//         'assignmentSubmissions.reviewsReceived.reviewerId': { $ne: reviewerObjectId }, // Double check safety guard
//       },
//       {
//         $push: {
//           'assignmentSubmissions.$.reviewsReceived': {
//             reviewerId: reviewerObjectId,
//             score: payload.score,
//             feedback: payload.feedback,
//           },
//         },
//       },
//       { new: true }
//     )

//     if (!updatedEnrollment) {
//       return {
//         success: false,
//         message: 'Assignment entry was missing or you have already processed this review sequence.',
//       }
//     }

//     // 2. Fetch course structure requirements to calculate threshold configurations
//     const courseDoc = await CourseModel.findById(updatedEnrollment.courseId).lean()
//     const targetSubmission = updatedEnrollment.assignmentSubmissions.find(
//       (sub) => sub.assignmentId === assignmentId
//     )

//     if (courseDoc && targetSubmission) {
//       const reviews = targetSubmission.reviewsReceived || []
      
//       // Let's assume a standard structural requirement baseline (e.g., 2 reviews) if not set inside Course model
//       const reviewsRequired = 2 
//       const passingScoreThreshold = 70

//       if (reviews.length >= reviewsRequired) {
//         const totalScore = reviews.reduce((sum, rev) => sum + rev.score, 0)
//         const computedAverage = totalScore / reviews.length

//         targetSubmission.finalScore = Math.round(computedAverage)
//         targetSubmission.status = computedAverage >= passingScoreThreshold ? 'passed' : 'failed'

//         // Explicitly trigger parent update persistence
//         await EnrollmentModel.updateOne(
//           { _id: enrollmentObjectId, 'assignmentSubmissions.assignmentId': assignmentId },
//           {
//             $set: {
//               'assignmentSubmissions.$.finalScore': targetSubmission.finalScore,
//               'assignmentSubmissions.$.status': targetSubmission.status,
//             },
//           }
//         )
//       }
//     }

//     return { success: true, message: 'Peer validation parameters securely synchronized.' }
//   } catch (error) {
//     console.error('Peer grading execution structural failure:', error)
//     return { success: false, message: 'Database query orchestration matrix fault.' }
//   }
// }





/**
 * Submits a score and commentary feedback context for an individual peer assignment submission.
 */
export async function submitPeerReviewAction(
  reviewerId: string,
  enrollmentId: string,
  assignmentId: string,
  payload: { score: number; feedback: string }
): Promise<{ success: boolean; message: string }> {
  try {
    await connectDB()

    if (!reviewerId || !enrollmentId || !assignmentId) {
      return { success: false, message: 'Missing structural validation IDs.' }
    }

    const reviewerObjectId = new Types.ObjectId(reviewerId)
    const enrollmentObjectId = new Types.ObjectId(enrollmentId)

    // 1. Append the feedback block directly into the array using positional filtering criteria
    const updatedEnrollment = await EnrollmentModel.findOneAndUpdate(
      {
        _id: enrollmentObjectId,
        'assignmentSubmissions.assignmentId': assignmentId,
        'assignmentSubmissions.reviewsReceived.reviewerId': { $ne: reviewerObjectId }, // Double check safety guard
      },
      {
        $push: {
          'assignmentSubmissions.$.reviewsReceived': {
            reviewerId: reviewerObjectId,
            score: payload.score,
            feedback: payload.feedback,
          },
        },
      },
      { new: true }
    )

    if (!updatedEnrollment) {
      return {
        success: false,
        message: 'Assignment entry was missing or you have already processed this review sequence.',
      }
    }

    // 2. Update the reviewer's profile statistics to track completed reviews
    await User.findByIdAndUpdate(reviewerObjectId, {
      $inc: { 'stats.peerReviewsDone': 1 }
    })

    // 3. Fetch course structure requirements to calculate threshold configurations
    const courseDoc = await CourseModel.findById(updatedEnrollment.courseId).lean()
    const targetSubmission = updatedEnrollment.assignmentSubmissions.find(
      (sub) => sub.assignmentId === assignmentId
    )

    if (courseDoc && targetSubmission) {
      const reviews = targetSubmission.reviewsReceived || []
      const reviewsRequired = 2 
      const passingScoreThreshold = 70

      if (reviews.length >= reviewsRequired) {
        const totalScore = reviews.reduce((sum, rev) => sum + rev.score, 0)
        const computedAverage = totalScore / reviews.length

        targetSubmission.finalScore = Math.round(computedAverage)
        targetSubmission.status = computedAverage >= passingScoreThreshold ? 'passed' : 'failed'

        // Explicitly trigger parent update persistence
        await EnrollmentModel.updateOne(
          { _id: enrollmentObjectId, 'assignmentSubmissions.assignmentId': assignmentId },
          {
            $set: {
              'assignmentSubmissions.$.finalScore': targetSubmission.finalScore,
              'assignmentSubmissions.$.status': targetSubmission.status,
            },
          }
        )
      }
    }

    return { success: true, message: 'Peer validation parameters securely synchronized.' }
  } catch (error) {
    console.error('Peer grading execution structural failure:', error)
    return { success: false, message: 'Database query orchestration matrix fault.' }
  }
}


/**
 * Fetches assignments submitted by the current user along with their 
 * evaluation status, accumulated peer scores, and textual commentary matrices.
 */
export async function getReceivedReviewsAction(
  userId: string
): Promise<ReceivedReviewsResponse> {
  try {
    await connectDB()

    if (!userId) {
      return { success: false, error: 'Unauthorized profile verification.' }
    }

    const userObjectId = new Types.ObjectId(userId)

    // 1. Fetch all enrollments belonging to this student
    const studentEnrollments = await EnrollmentModel.find({
      userId: userObjectId,
    }).lean()

    if (!studentEnrollments.length) {
      return { success: true, data: [] }
    }

    // 2. Map course metadata references to resolve explicit assignment titles
    const courseIds = studentEnrollments.map((e) => e.courseId)
    const courses = await CourseModel.find({ _id: { $in: courseIds } }).lean()

    const receivedItems: ReceivedReviewItem[] = []

    for (const enrollment of studentEnrollments) {
      const targetCourse = courses.find(
        (c) => c._id.toString() === enrollment.courseId.toString()
      )
      if (!targetCourse || !enrollment.assignmentSubmissions) continue

      for (const sub of enrollment.assignmentSubmissions) {
        let assignmentTitle = 'System Architecture Assignment'

        // Scan course modules to pull matching user-facing title variants
        if (targetCourse.modules) {
          for (const mod of targetCourse.modules) {
            if (mod.assignment && mod.assignment.id === sub.assignmentId) {
              assignmentTitle = mod.assignment.title || assignmentTitle
              break
            }
          }
        }

        // Map internal MongoDB review sub-documents cleanly to the interface contract
        const mappedReviews = (sub.reviewsReceived || []).map((rev) => ({
          reviewerId: rev.reviewerId.toString(),
          score: rev.score,
          feedback: rev.feedback,
        }))

        receivedItems.push({
          assignmentId: sub.assignmentId,
          assignmentTitle,
          submissionUrl: sub.submissionUrl,
          status: sub.status as 'pending_reviews' | 'passed' | 'failed',
          finalScore: sub.finalScore,
          reviewsReceived: mappedReviews,
        })
      }
    }

    return { success: true, data: receivedItems }
  } catch (error: unknown) {
    console.error('Failed fetching received peer reviews:', error)
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : 'Database grade matrix pipeline compilation error.',
    }
  }
}