// /app/services/dashboardActions.ts

'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import { TransactionModel } from '@/app/models/Transaction'
import { User } from '@/app/models/User'
import { Types } from 'mongoose'

interface CourseModule {
  lessons?: unknown[]
}

interface TransactionItem {
  title: string
}

export async function getDashboardOverviewAction(userId: string) {
  try {
    await connectDB()

    const userObjectId = new Types.ObjectId(userId)

    // USER
    const user = await User.findById(userObjectId).lean()

    if (!user) {
      return {
        success: false,
        message: 'User not found.',
      }
    }

    // ENROLLMENTS
    const enrollments = await EnrollmentModel.find({
      userId: userObjectId,
    })
      .sort({ updatedAt: -1 })
      .lean()

    const activeEnrollments = enrollments.filter((e) => e.status === 'active')

    const courseIds = enrollments.map((e) => e.courseId)

    // COURSES
    const courses = await CourseModel.find({
      _id: { $in: courseIds },
    }).lean()

    // TRANSACTIONS
    const transactions = await TransactionModel.find({
      userId: userObjectId,
      status: 'SUCCESS',
    })
      .sort({ createdAt: -1 })
      .lean()

    // TOTAL SPENT
    const totalSpent = transactions.reduce((acc: number, tx) => {
      const isSubunit = tx.gateway === 'PAYSTACK' || tx.gateway === 'STRIPE'
      return acc + (isSubunit ? tx.total / 100 : tx.total)
    }, 0)

    // ACTIVE COURSE
    const latestEnrollment = activeEnrollments[0]

    const activeCourse = latestEnrollment
      ? courses.find((c) => String(c._id) === String(latestEnrollment.courseId))
      : null

    // TOTAL LESSONS
    const totalLessons = activeCourse
      ? activeCourse.modules.reduce(
          (acc: number, mod: CourseModule) => acc + (mod.lessons?.length || 0),
          0,
        )
      : 0

    // COMPLETED LESSONS
    const completedLessons = latestEnrollment?.completedLessons?.length || 0

    // COMPLETION RATE
    const completionRate =
      totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // RECENT TRANSACTIONS
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

    // RECENT ENROLLMENTS
    const recentEnrollments = enrollments.slice(0, 5).map((enrollment) => {
      const course = courses.find(
        (c) => String(c._id) === String(enrollment.courseId),
      )

      return {
        enrollmentId: enrollment._id.toString(),
        progressPercentage: enrollment.progressPercentage || 0,
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
              _id: latestEnrollment._id.toString(),
              userId: latestEnrollment.userId.toString(),
              courseId: latestEnrollment.courseId.toString(),
              status: latestEnrollment.status,
              progressPercentage: latestEnrollment.progressPercentage || 0,
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
          createdAt:
            user.createdAt instanceof Date
              ? user.createdAt.toISOString()
              : String(user.createdAt),
        },
        metrics: {
          enrolledCourses: enrollments.length,
          activeCourses: activeEnrollments.length,
          completedCourses: user.stats?.coursesCompleted || 0,
          certificates: user.stats?.certificatesEarned || 0,
          totalSpent,
          completedLessons,
          totalLessons,
          completionRate,
          streakDays: user.stats?.streakDays || 0,
          points: user.stats?.points || 0,
          peerReviews: user.stats?.peerReviewsDone || 0,
        },
        activeCourse: serializedActiveCourse,
        recentTransactions,
        recentEnrollments,
      },
    }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      message: 'Dashboard synchronization failed.',
    }
  }
}