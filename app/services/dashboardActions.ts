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
    const latestEnrollment = activeEnrollments[0] || enrollments[0] // fallback to any track if none are active
    const activeCourse = latestEnrollment
      ? courses.find((c) => String(c._id) === String(latestEnrollment.courseId))
      : null

    // 6. CALCULATE ACTIVE COURSE METRICS ACCURATELY
    let activeCourseTotalLessons = 0
    let activeCourseCompletedLessons = 0

    if (activeCourse && latestEnrollment) {
      // Extract unique lesson identifiers belonging explicitly to this active course configuration
      const validLessonIds = new Set<string>()
      activeCourse.modules?.forEach((mod: CourseModule) => {
        mod.lessons?.forEach((les: CourseLesson) => {
          if (les.id) validLessonIds.add(String(les.id))
        })
      })

      activeCourseTotalLessons = validLessonIds.size

      // Filter out any IDs that don't match this course structure layout
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

    // DYNAMICALLY RE-CALCULATE ENROLLMENT PROGRESS PERCENTAGE (if DB field is stale)
    const recentEnrollments = enrollments.slice(0, 5).map((enrollment) => {
      const course = courses.find(
        (c) => String(c._id) === String(enrollment.courseId),
      )

      // Calculate runtime absolute safe progress percentage per row
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
        progressPercentage: runtimeProgress, // Stale-proof calculated data
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
        metrics: {
          enrolledCourses: enrollments.length,
          activeCourses: activeEnrollments.length,
          completedCourses: completedCoursesCount,
          completedLessons: activeCourseCompletedLessons, // Fixed shorthand mapping
          totalLessons: activeCourseTotalLessons, // Fixed shorthand mapping
          completionRate,
          points: user.stats?.points || 0,
          peerReviews: user.stats?.peerReviewsDone || 0, // Remapped to match schema key
          streakDays: user.stats?.streakDays || 0,
          certificates: user.stats?.certificatesEarned || 0, // Adjusted safely if needed
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