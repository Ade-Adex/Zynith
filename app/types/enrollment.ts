// /app/types/enrollment.ts


import mongoose, { Document } from 'mongoose'

// --- CERTIFICATE SUB-INTERFACES ---
export interface DbCertificate {
  certificateId: string
  issuedAt: Date
  verificationUrl: string
}

export interface SerializedCertificate {
  certificateId: string
  issuedAt: string
  verificationUrl: string
}

// --- DATABASE SUB-INTERFACES ---
export interface DbQuizAttempt {
  _id?: mongoose.Types.ObjectId // Mongoose automatically assigns subdocument IDs
  quizId: string
  score: number
  passed: boolean
  answers: Array<{
    _id?: mongoose.Types.ObjectId
    questionId: string
    selectedOption: string
    isCorrect: boolean
  }>
  attemptedAt: Date
}

export interface DbAssignmentSubmission {
  _id?: mongoose.Types.ObjectId // Mongoose automatically assigns subdocument IDs
  assignmentId: string
  submissionUrl: string
  status: 'pending_reviews' | 'passed' | 'failed'
  reviewsReceived: Array<{
    _id?: mongoose.Types.ObjectId
    reviewerId: mongoose.Types.ObjectId
    score: number
    feedback: string
  }>
  finalScore: number
}

// --- MAIN DATABASE ENROLLMENT INTERFACE ---
export interface IDbEnrollment extends Document {
  userId: mongoose.Types.ObjectId
  courseId: mongoose.Types.ObjectId
  status: 'active' | 'completed' | 'suspended'
  progressPercentage: number
  currentModuleId: string
  currentLessonId: string
  completedLessons: string[]
  completedModules: string[]
  quizAttempts: DbQuizAttempt[]
  assignmentSubmissions: DbAssignmentSubmission[]
  certificate: DbCertificate | null // Added certificate support
  enrolledAt: Date
  lastAccessedAt: Date
  createdAt: Date
  updatedAt: Date
}

// --- FRONTEND TYPES (Used by UI components) ---

export interface QuizAttemptInput {
  quizId: string
  score: number
  passed: boolean
  answers: Array<{
    questionId: string
    selectedOption: string
    isCorrect: boolean
  }>
}

export interface SerializedQuizAttempt extends QuizAttemptInput {
  _id?: string
  attemptedAt: string
}

export interface SerializedReview {
  _id?: string
  reviewerId: string
  score: number
  feedback: string
}

export interface SerializedAssignmentSubmission {
  _id?: string
  assignmentId: string
  submissionUrl: string
  status: 'pending_reviews' | 'passed' | 'failed'
  reviewsReceived: SerializedReview[]
  finalScore: number
}

// --- MAIN SERIALIZED FRONTEND ENROLLMENT INTERFACE ---
export interface SerializedEnrollment {
  _id: string
  userId: string
  courseId: string
  status: 'active' | 'completed' | 'suspended'
  progressPercentage: number
  currentModuleId: string
  currentLessonId: string
  completedLessons: string[]
  completedModules: string[]
  quizAttempts: SerializedQuizAttempt[]
  assignmentSubmissions: SerializedAssignmentSubmission[]
  certificate: SerializedCertificate | null // Added certificate support
  enrolledAt: string | null
  lastAccessedAt: string | null
  createdAt?: string
  updatedAt?: string
}

export interface UpdatePayload {
  currentModuleId?: string
  currentLessonId?: string
  newCompletedLessonId?: string
  newCompletedModuleId?: string
  quizAttempt?: QuizAttemptInput
  assignmentSubmission?: {
    assignmentId: string
    url: string
  }
}