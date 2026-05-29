'use server'

import connectDB from '@/app/lib/db'
import { EnrollmentModel } from '@/app/models/Enrollment'
import { CourseModel } from '@/app/models/Course'
import { User } from '@/app/models/User'

export interface VerificationResult {
  success: boolean
  message: string
  data?: {
    certificateId: string
    issuedAt: string
    verificationUrl: string
    recipient: {
      name: string
      firstName: string
      lastName: string
      avatar: string | null
    }
    course: {
      title: string
      slug: string
      instructor: string
      level: string
      duration: string
    }
  }
}

/**
 * Validates a public certificate ID against student enrollments
 * @param certificateId Unique cryptographic string identifier assigned to an enrollment profile
 */
export async function verifyCertificateAction(
  certificateId: string,
): Promise<VerificationResult> {
  try {
    if (!certificateId || typeof certificateId !== 'string') {
      return {
        success: false,
        message: 'Invalid or missing certificate ID query string.',
      }
    }

    await connectDB()

    // 1. Locate the exact enrollment containing this unique identifier string within the sparse index field
    const enrollment = await EnrollmentModel.findOne({
      'certificate.certificateId': certificateId,
    }).lean()

    // If the record doesn't exist, fallback or handle error securely
    if (!enrollment || !enrollment.certificate) {
      return {
        success: false,
        message:
          'No certificate matching this credential ID was located in our repository systems.',
      }
    }

    // 2. Validate overall track status conditions
    if (enrollment.status === 'suspended') {
      return {
        success: false,
        message:
          'This credential trace is attached to an enrollment that is currently suspended.',
      }
    }

    // 3. Populate recipient profile dependencies
    const student = await User.findById(enrollment.userId).lean()
    if (!student) {
      return {
        success: false,
        message:
          'The original student profile associated with this credential no longer exists.',
      }
    }

    // 4. Populate course track specification metadata definitions
    const course = await CourseModel.findById(enrollment.courseId).lean()
    if (!course) {
      return {
        success: false,
        message:
          'The core course engineering track structure cannot be determined or resolved.',
      }
    }

    // 5. Construct structural validated payload
    return {
      success: true,
      message: 'Credential verified successfully.',
      data: {
        certificateId: enrollment.certificate.certificateId,
        issuedAt:
          enrollment.certificate.issuedAt instanceof Date
            ? enrollment.certificate.issuedAt.toISOString()
            : String(enrollment.certificate.issuedAt),
        verificationUrl: enrollment.certificate.verificationUrl,
        recipient: {
          name: student.name,
          firstName: student.firstName || '',
          lastName: student.lastName || '',
          avatar: student.avatar || null,
        },
        course: {
          title: course.title,
          slug: course.slug,
          instructor: course.instructor,
          level: course.level,
          duration: course.duration,
        },
      },
    }
  } catch (error) {
    console.error(
      'Certificate verification internal system pipeline exception triggered:',
      error,
    )
    return {
      success: false,
      message:
        'A critical processing framework exception occurred while validating credentials.',
    }
  }
}
