// /app/services/dashboardActions.ts

'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import { TransactionModel } from '@/app/models/Transaction'
import { User } from '@/app/models/User'
import { Types } from 'mongoose'

interface CourseLesson {
  id: string
}

interface CourseModule {
  lessons?: CourseLesson[]
}

interface TransactionItem {
  title: string
}

interface UpdateProfileInput {
  userId: string
  firstName: string
  lastName: string
  avatar: string
}

/**
 * Updates a user's editable metadata parameters and handles
 * profile image adjustments securely within database boundaries.
 */
export async function updateProfileSettingsAction(input: UpdateProfileInput) {
  try {
    await connectDB()

    if (!input.userId) {
      return { success: false, error: 'Unauthorized user identifier.' }
    }

    const combinedName = `${input.firstName.trim()} ${input.lastName.trim()}`

    const updatedUser = await User.findByIdAndUpdate(
      new Types.ObjectId(input.userId),
      {
        $set: {
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          name: combinedName || 'Student Node',
          avatar: input.avatar,
        },
      },
      { new: true, runValidators: true },
    ).lean()

    if (!updatedUser) {
      return { success: false, error: 'Target user record could not be found.' }
    }

    // Safely transform document mapping to prevent server-side ObjectId transmission leaks
    const serializedUser = {
      ...updatedUser,
      _id: updatedUser._id.toString(),
      createdAt:
        updatedUser.createdAt instanceof Date
          ? updatedUser.createdAt.toISOString()
          : String(updatedUser.createdAt),
      updatedAt:
        updatedUser.updatedAt instanceof Date
          ? updatedUser.updatedAt.toISOString()
          : String(updatedUser.updatedAt),
    }

    // FIX: Explicitly include the message string property for your client snackbar
    return {
      success: true,
      message: 'Profile configuration updated successfully.',
      data: serializedUser,
    }
  } catch (error: unknown) {
    console.error('Server side database configuration change failure:', error)

    const errorMessage =
      error instanceof Error
        ? error.message
        : 'Failed to update user profile matrix.'

    return {
      success: false,
      error: errorMessage,
    }
  }
}

export async function getDashboardOverviewAction(userId: string) {
  try {
    await connectDB()

    const userObjectId = new Types.ObjectId(userId)

    // 1. FETCH USER
    const user = await User.findById(userObjectId).lean()
    if (!user) {
      return { success: false, message: 'User not found.' }
    }

    // 2. FETCH ENROLLMENTS
    const enrollments = await EnrollmentModel.find({ userId: userObjectId })
      .sort({ updatedAt: -1 })
      .lean()

    const activeEnrollments = enrollments.filter((e) => e.status === 'active')

    const courseIds = enrollments.map((e) => e.courseId)

    // 3. FETCH ALL ENROLLED COURSES STRUCT
    const courses = await CourseModel.find({ _id: { $in: courseIds } }).lean()

    // 4. TRANSACTIONS & TOTAL SPENT
    const transactions = await TransactionModel.find({
      userId: userObjectId,
      status: 'SUCCESS',
    })
      .sort({ createdAt: -1 })
      .lean()

    // 5. DETERMINE CURRENT ACTIVE COURSE CONTAINER
    const latestEnrollment = activeEnrollments[0] || enrollments[0]
    const activeCourse = latestEnrollment
      ? courses.find((c) => String(c._id) === String(latestEnrollment.courseId))
      : null

    // 6. CALCULATE ACTIVE COURSE METRICS ACCURATELY
    let activeCourseTotalLessons = 0
    let activeCourseCompletedLessons = 0

    if (activeCourse && latestEnrollment) {
      const validLessonIds = new Set<string>()
      activeCourse.modules?.forEach((mod: CourseModule) => {
        mod.lessons?.forEach((les: CourseLesson) => {
          if (les.id) validLessonIds.add(String(les.id))
        })
      })

      activeCourseTotalLessons = validLessonIds.size

      const matchingCompleted = (
        latestEnrollment.completedLessons || []
      ).filter((id) => validLessonIds.has(String(id)))
      activeCourseCompletedLessons = matchingCompleted.length
    }

    const completionRate =
      activeCourseTotalLessons > 0
        ? Math.round(
            (activeCourseCompletedLessons / activeCourseTotalLessons) * 100,
          )
        : 0

    // 7. MAP RECENT TRANSACTIONS CONTAINER
    const recentTransactions = transactions.slice(0, 5).map((tx) => ({
      reference: tx.reference,
      gateway: tx.gateway,
      amount:
        tx.gateway === 'PAYSTACK' || tx.gateway === 'STRIPE'
          ? tx.total / 100
          : tx.total,
      createdAt:
        tx.createdAt instanceof Date
          ? tx.createdAt.toISOString()
          : String(tx.createdAt),
      titles: tx.items.map((i: TransactionItem) => i.title),
    }))

    // DYNAMICALLY CALCULATE COMPLETED COURSES
    const completedCoursesCount = enrollments.filter(
      (e) => e.status === 'completed',
    ).length

    // Calculate enrollments that contain a valid certificate profile configuration layout
    const dynamicCertificatesCount = enrollments.filter(
      (e) => e.certificate && e.certificate.certificateId,
    ).length

    // Build the collection array cleanly while informing the compiler of explicit null safety checks
    const populatedCertificates = enrollments
      .filter((e) => e.certificate && e.certificate.certificateId)
      .map((e) => {
        const cert = e.certificate

        // Safeguard fallback verification layer
        if (!cert || !cert.certificateId) {
          return null
        }

        const matchingCourse = courses.find(
          (c) => String(c._id) === String(e.courseId),
        )

        return {
          id: cert.certificateId,
          courseId: String(e.courseId),
          courseTitle: matchingCourse
            ? matchingCourse.title
            : 'Course Certificate',
          title: matchingCourse
            ? `${matchingCourse.title} - Verification`
            : 'Verified Certificate',
          issueDate:
            cert.issuedAt instanceof Date
              ? cert.issuedAt.toISOString()
              : String(cert.issuedAt),
          url:
            cert.verificationUrl ||
            `/verify/certificates/${cert.certificateId}`,
        }
      })
      .filter((c): c is NonNullable<typeof c> => c !== null) // Filters down typing array array explicitly

    // DYNAMICALLY RE-CALCULATE ENROLLMENT PROGRESS PERCENTAGE
    const recentEnrollments = enrollments.slice(0, 5).map((enrollment) => {
      const course = courses.find(
        (c) => String(c._id) === String(enrollment.courseId),
      )

      const currentCourseTotalLessons = course
        ? course.modules.reduce(
            (acc: number, mod: CourseModule) =>
              acc + (mod.lessons?.length || 0),
            0,
          )
        : 0
      const currentCourseCompletedLessons =
        enrollment.completedLessons?.length || 0
      const runtimeProgress =
        currentCourseTotalLessons > 0
          ? Math.round(
              (currentCourseCompletedLessons / currentCourseTotalLessons) * 100,
            )
          : enrollment.progressPercentage || 0

      return {
        enrollmentId: enrollment._id.toString(),
        progressPercentage: runtimeProgress,
        updatedAt:
          enrollment.updatedAt instanceof Date
            ? enrollment.updatedAt.toISOString()
            : String(enrollment.updatedAt),
        course: course
          ? {
              _id: course._id.toString(),
              title: course.title,
              image: course.image || '',
              slug: course.slug,
            }
          : null,
      }
    })

    // DYNAMICALLY CALCULATE PENDING PEER REVIEWS FOR ASSIGNMENTS SUBMITTED BY OTHERS
    const explicitUserEnrollment =
      enrollments.find((e) => e.status === 'active') || enrollments[0]

    // 2. Extract the relevant assignment structure from the active course if it exists
    let receivedReviewsCompleted = 0
    let receivedReviewsWaiting = 0

    if (
      explicitUserEnrollment &&
      explicitUserEnrollment.assignmentSubmissions?.length > 0
    ) {
      // Get the most recent submission
      const currentSubmission =
        explicitUserEnrollment.assignmentSubmissions[
          explicitUserEnrollment.assignmentSubmissions.length - 1
        ]

      const targetReviewsRequired = 2 // Match standard threshold configuration
      const reviewsReceivedCount =
        currentSubmission?.reviewsReceived?.length || 0

      // "Done" is the number of reviews this assignment has accumulated
      receivedReviewsCompleted = reviewsReceivedCount

      // "Waiting" is the remaining number of reviews needed (clamped to 0 if fulfilled)
      receivedReviewsWaiting =
        currentSubmission.status === 'pending_reviews'
          ? Math.max(0, targetReviewsRequired - reviewsReceivedCount)
          : 0
    }


    // SERIALIZE ACTIVE COURSE CONTAINER TO AVOID OBJECTID LEAKAGE
    const serializedActiveCourse =
      latestEnrollment && activeCourse
        ? {
            enrollment: {
              ...latestEnrollment,
              _id: latestEnrollment._id.toString(),
              userId: latestEnrollment.userId.toString(),
              courseId: latestEnrollment.courseId.toString(),
              status: latestEnrollment.status,
              progressPercentage:
                latestEnrollment.progressPercentage || completionRate,
              currentModuleId: latestEnrollment.currentModuleId || '',
              currentLessonId: latestEnrollment.currentLessonId || '',
              completedLessons: latestEnrollment.completedLessons || [],
              completedModules: latestEnrollment.completedModules || [],
              certificate:
                latestEnrollment.certificate &&
                latestEnrollment.certificate.certificateId
                  ? {
                      certificateId: latestEnrollment.certificate.certificateId,
                      verificationUrl:
                        latestEnrollment.certificate.verificationUrl,
                      issuedAt:
                        latestEnrollment.certificate.issuedAt instanceof Date
                          ? latestEnrollment.certificate.issuedAt.toISOString()
                          : String(latestEnrollment.certificate.issuedAt),
                    }
                  : null,
              enrolledAt:
                latestEnrollment.enrolledAt instanceof Date
                  ? latestEnrollment.enrolledAt.toISOString()
                  : String(latestEnrollment.enrolledAt),
              lastAccessedAt:
                latestEnrollment.lastAccessedAt instanceof Date
                  ? latestEnrollment.lastAccessedAt.toISOString()
                  : String(latestEnrollment.lastAccessedAt),
            },
            course: {
              ...activeCourse,
              _id: activeCourse._id.toString(),
              createdAt:
                activeCourse.createdAt instanceof Date
                  ? activeCourse.createdAt.toISOString()
                  : String(activeCourse.createdAt),
              updatedAt:
                activeCourse.updatedAt instanceof Date
                  ? activeCourse.updatedAt.toISOString()
                  : String(activeCourse.updatedAt),
            },
          }
        : null

    return {
      success: true,
      data: {
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          avatar: user.avatar || null,
          wallet: user.wallet,
          stats: user.stats,
        },
        activeCourse: serializedActiveCourse,
        recentTransactions,
        recentEnrollments,
        certificates: populatedCertificates,
        metrics: {
          enrolledCourses: enrollments.length,
          activeCourses: activeEnrollments.length,
          completedCourses: completedCoursesCount,
          completedLessons: activeCourseCompletedLessons,
          totalLessons: activeCourseTotalLessons,
          completionRate,
          points: user.stats?.points || 0,
          peerReviews: receivedReviewsCompleted,
          peerReviewsPending: receivedReviewsWaiting,
          streakDays: user.stats?.streakDays || 0,
          certificates: dynamicCertificatesCount,
        },
      },
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'An error occurred while tracking metric configurations.',
    }
  }
}
