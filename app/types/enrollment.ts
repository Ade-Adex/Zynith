// /app/types/enrollment.ts

import mongoose, { Document } from 'mongoose'


export interface DbQuizAttempt {
  quizId: string
  score: number
  passed: boolean
  answers: Array<{
    questionId: string
    selectedOption: string
    isCorrect: boolean
  }>
  attemptedAt: Date
}

export interface DbAssignmentSubmission {
  assignmentId: string
  submissionUrl: string
  status: 'pending_reviews' | 'passed' | 'failed'
  reviewsReceived: Array<{
    reviewerId: mongoose.Types.ObjectId
    score: number
    feedback: string
  }>
  finalScore: number
}

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
  enrolledAt: Date
  lastAccessedAt: Date
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
  attemptedAt: string
}

export interface SerializedAssignmentSubmission {
  assignmentId: string
  submissionUrl: string
  status: 'pending_reviews' | 'passed' | 'failed'
  reviewsReceived: Array<{
    reviewerId: string
    score: number
    feedback: string
  }>
  finalScore: number
}

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
  enrolledAt: string | null
  lastAccessedAt: string | null
}

export interface UpdatePayload {
  currentModuleId?: string
  currentLessonId?: string
  newCompletedLessonId?: string
  newCompletedModuleId?: string
  quizAttempt?: QuizAttemptInput
}