// /app/models/Enrollment.ts


import mongoose, { Schema, Model } from 'mongoose'
import { IDbEnrollment } from '@/app/types/enrollment'

const EnrollmentSchema = new Schema<IDbEnrollment>(
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
    completedModules: [{ type: String }],
    quizAttempts: [
      {
        quizId: { type: String, required: true },
        score: { type: Number, required: true },
        passed: { type: Boolean, required: true },
        answers: [
          {
            questionId: { type: String, required: true },
            selectedOption: { type: String, required: true },
            isCorrect: { type: Boolean, required: true },
          },
        ],
        attemptedAt: { type: Date, default: Date.now },
      },
    ],
    assignmentSubmissions: [
      {
        assignmentId: { type: String, required: true },
        submissionUrl: { type: String, required: true },
        status: {
          type: String,
          enum: ['pending_reviews', 'passed', 'failed'],
          default: 'pending_reviews',
        },
        reviewsReceived: [
          {
            reviewerId: {
              type: Schema.Types.ObjectId,
              ref: 'User',
              required: true,
            },
            score: { type: Number, required: true },
            feedback: { type: String, required: true },
          },
        ],
        finalScore: { type: Number, default: 0 },
      },
    ],
    enrolledAt: { type: Date, default: Date.now },
    lastAccessedAt: { type: Date, default: Date.now },
  },
  { timestamps: true },
)

EnrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true })

export const EnrollmentModel: Model<IDbEnrollment> =
  mongoose.models.Enrollment ||
  mongoose.model<IDbEnrollment>('Enrollment', EnrollmentSchema)