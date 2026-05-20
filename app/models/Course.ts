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
  passingScore: { type: Number, required: true },
  questions: [QuizQuestionSchema],
})

const LessonSchema = new Schema({
  id: { type: String, required: true },
  title: { type: String, required: true },
  duration: { type: String, required: true },
  contentType: {
    type: String,
    enum: ['video', 'text', 'hybrid'],
    required: true,
  },
  videoUrl: { type: String },
  markdownBody: { type: String },
  isFreePreview: { type: Boolean, default: false },
  isDownloadable: { type: Boolean, default: false },
  downloadUrl: { type: String },
  summary: { type: String, required: true },
  quiz: QuizSchema,
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
  quiz: QuizSchema,
  assignment: AssignmentSchema,
})

const TestimonySchema = new Schema({
  id: { type: String, required: true },
  studentName: { type: String, required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  reviewText: { type: String, required: true },
})

const CourseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Free', 'Premium'], required: true },
    tag: { type: String, required: true },
    price: { type: String, required: true },
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
    features: [{ type: String }],
    testimonies: [TestimonySchema],
    modules: [CourseModuleSchema],
  },
  { timestamps: true },
)

export const CourseModel =
  mongoose.models.Course || mongoose.model('Course', CourseSchema)
