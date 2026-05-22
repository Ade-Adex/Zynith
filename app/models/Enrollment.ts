// /app/models/Enrollment.ts
import mongoose, { Schema, Document, Model } from 'mongoose'

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  status: 'active' | 'completed' | 'suspended'
  progressPercentage: number
  currentModuleId: string
  currentLessonId: string
  completedLessons: string[] // Array of Lesson IDs
  enrolledAt: Date
  lastAccessedAt: Date
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    courseId: {
      type: Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ['active', 'completed', 'suspended'],
      default: 'active',
    },
    progressPercentage: { type: Number, default: 0, min: 0, max: 100 },
    currentModuleId: { type: String, default: '' },
    currentLessonId: { type: String, default: '' },
    completedLessons: [{ type: String }],
    enrolledAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

// Prevent duplicate enrollments for the same user + course combo
EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export const EnrollmentModel: Model<IEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema)
