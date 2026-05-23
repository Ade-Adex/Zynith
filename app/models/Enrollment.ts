// /app/models/Enrollment.ts

import mongoose, { Schema, Document, Model } from 'mongoose'

// Tracking itemized history of all quizzes taken by the user to securely review answers
interface IQuizAttempt {
  quizId: string
  score: number // Percentage achieved
  passed: boolean
  answers: Array<{ questionId: string; selectedOption: string; isCorrect: boolean }>
  attemptedAt: Date
}

// Tracking assignment files submitted and their active peer marks
interface IAssignmentSubmission {
  assignmentId: string
  submissionUrl: string
  status: 'pending_reviews' | 'passed' | 'failed'
  reviewsReceived: Array<{ reviewerId: mongoose.Types.ObjectId; score: number; feedback: string }>
  finalScore: number
}

export interface IEnrollment extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  status: 'active' | 'completed' | 'suspended'
  progressPercentage: number
  currentModuleId: string
  currentLessonId: string
  completedLessons: string[] // Array of Lesson ID hashes completed
  completedModules: string[] // Array of Module IDs where all gating metrics passed
  quizAttempts: IQuizAttempt[]
  assignmentSubmissions: IAssignmentSubmission[]
  enrolledAt: Date
  lastAccessedAt: Date
}

const EnrollmentSchema = new Schema<IEnrollment>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    courseId: { type: Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
    status: { type: String, enum: ['active', 'completed', 'suspended'], default: 'active' },
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
        status: { type: String, enum: ['pending_reviews', 'passed', 'failed'], default: 'pending_reviews' },
        reviewsReceived: [
          {
            reviewerId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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

export const EnrollmentModel: Model<IEnrollment> =
  mongoose.models.Enrollment || mongoose.model<IEnrollment>('Enrollment', EnrollmentSchema)
