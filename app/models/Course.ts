// /app/models/Course.ts

import mongoose, { Schema, Document } from 'mongoose'

const QuizQuestionSchema = new Schema({
  id: { type: String, required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String, required: true },
})

const QuizSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  passingScore: { type: Number, required: true, default: 80 }, // Percentage out of 100
  questions: [QuizQuestionSchema], // Client code handles checking max 3 questions validation limit
})

const LessonSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true }, // e.g., "12:45"
  contentType: {
    type: String,
    enum: ['video', 'text', 'hybrid'],
    required: true,
  },
  videoUrl: { type: String }, // Used if video or hybrid
  markdownBody: { type: String }, // Used if text or hybrid
  isFreePreview: { type: Boolean, default: false },
  isDownloadable: { type: Boolean, default: false },
  downloadUrl: { type: String },
  summary: { type: String, required: true },
  quiz: { type: QuizSchema, default: null }, // Optional per-lesson verification quiz
})

const AssignmentSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  problemStatement: { type: String, required: true },
  submissionTemplateUrl: { type: String },
  peerReviewsRequired: { type: Number, default: 3 },
  minPeerScoreToPass: { type: Number, default: 80 },
})

const CourseModuleSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  lessonsCount: { type: Number, required: true },
  lessons: [LessonSchema],
  quiz: { type: QuizSchema, default: null }, // Core Module Completion Gate Quiz
  assignment: { type: AssignmentSchema, default: null },
})

const TestimonySchema = new Schema({
  id: { type: String, required: true },
  studentName: { type: String, required: true },
  avatar: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
}, { timestamps: true })

const CourseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true },
    type: { type: String, enum: ['Free', 'Premium'], required: true },
    tag: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number, default: 0 },
    currency: { type: String, default: 'USD' },
    instructor: { type: String, required: true },
    tutorDetails: {
      name: { type: String, required: true },
      bio: { type: String, required: true },
      avatar: { type: String, required: true },
      expertise: [{ type: String }],
    },
    rating: { type: Number, default: 5.0 },
    students: { type: Number, default: 0 },
    duration: { type: String, required: true },
    level: {
      type: String,
      enum: ['Beginner', 'Intermediate', 'Expert'],
      required: true,
    },
    color: { type: String, required: true }, 
    image: { type: String, required: true },
    previewVideo: { type: String, required: true },
    forumId: { type: String, required: true },
    chatId: { type: String, required: true },
    learningObjectives: [{ type: String }], // What the student will learn
    requirements: [{ type: String }], 
    features: [{ type: String }],
    testimonies: [TestimonySchema],
    modules: [CourseModuleSchema],
    isPublished: { type: Boolean, default: false },
  },
  { timestamps: true },
)

export const CourseModel = mongoose.models.Course || mongoose.model('Course', CourseSchema)
