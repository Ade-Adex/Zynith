// /app/(dashboard)/dashboard/courses/[courseId]/lessons/page.tsx

'use client'

import React, { useState, useEffect, useTransition, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getEnrollmentProgressAction,
  updateEnrollmentProgressAction,
  SerializedEnrollment,
} from '@/app/services/enrollmentActions'
import { useAuthStore } from '@/app/store/authStore'
import { useCourses } from '@/app/hooks/useCourses'
import { Module, Lesson, Quiz, QuizQuestion } from '@/app/types'

interface ProgressUpdatePayload {
  quizAttempt?: {
    quizId: string
    score: number
    passed: boolean
    answers: Array<{
      questionId: string
      selectedOption: string
      isCorrect: boolean
    }>
  }
  newCompletedModuleId?: string
  newCompletedLessonId?: string
  currentModuleId?: string
  currentLessonId?: string
}

export default function CourseWorkspacePage() {
  const params = useParams()
  const router = useRouter()

  const { user } = useAuthStore()
  const { courses, loading: isCoursesLoading } = useCourses()

  const courseId = params.courseId as string

  const course = useMemo(
    () => courses?.find((c) => c._id === courseId),
    [courses, courseId],
  )

  const [dbEnrollment, setDbEnrollment] =
    useState<SerializedEnrollment | null>(null)

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [activeModule, setActiveModule] = useState<Module | null>(null)

  const [activeTab, setActiveTab] = useState<
    'content' | 'quiz' | 'assignment' | 'forum'
  >('content')

  const [contentTypeToggle, setContentTypeToggle] = useState<
    'video' | 'text'
  >('video')

  const [selectedAnswers, setSelectedAnswers] = useState<
    Record<string, string>
  >({})

  const [quizSubmitted, setQuizSubmitted] = useState(false)

  const [quizResult, setQuizResult] = useState<{
    score: number
    passed: boolean
  } | null>(null)

  const [assignmentUrl, setAssignmentUrl] = useState('')
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false)

  // MOBILE SIDEBAR
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function syncEnrollment() {
      if (!user?._id || !courseId || !course) return

      try {
        const syncBlock = await getEnrollmentProgressAction(
          user._id,
          courseId,
        )

        if (syncBlock.success && syncBlock.data) {
          setDbEnrollment(syncBlock.data)

          const savedModId = syncBlock.data.currentModuleId
          const savedLesId = syncBlock.data.currentLessonId

          const initialModule =
            course.modules.find((m) => m.id === savedModId) ||
            course.modules[0]

          const initialLesson =
            initialModule?.lessons.find((l) => l.id === savedLesId) ||
            initialModule?.lessons[0]

          setActiveModule(initialModule || null)
          setActiveLesson(initialLesson || null)

          if (initialLesson) {
            setContentTypeToggle(
              initialLesson.contentType === 'text' ? 'text' : 'video',
            )
          }
        }
      } catch (err) {
        console.error('Workspace tracking sync fault:', err)
      }
    }

    syncEnrollment()
  }, [courseId, user?._id, course])

  const flatLessonsList = useMemo(() => {
    if (!course) return []

    return course.modules.flatMap((m) =>
      m.lessons.map((l) => ({
        ...l,
        moduleId: m.id,
      })),
    )
  }, [course])

  const isModuleUnlocked = (moduleId: string) => {
    if (!course || !dbEnrollment) return false
    if (course.type === 'Free') return true

    const currentModIndex = course.modules.findIndex(
      (m) => m.id === moduleId,
    )

    if (currentModIndex === 0) return true

    const previousModule = course.modules[currentModIndex - 1]

    return dbEnrollment.completedModules.includes(previousModule.id)
  }

  const checkIsLessonUnlocked = (lessonId: string, modId: string) => {
    if (!course || !dbEnrollment) return false
    if (course.type === 'Free') return true
    if (!isModuleUnlocked(modId)) return false

    const positionIndex = flatLessonsList.findIndex(
      (l) => l.id === lessonId,
    )

    if (positionIndex === 0) return true

    const previousLessonItem = flatLessonsList[positionIndex - 1]

    return dbEnrollment.completedLessons.includes(previousLessonItem.id)
  }

  const handleLessonSelection = (
    lesson: Lesson,
    targetModule: Module,
  ) => {
    if (!checkIsLessonUnlocked(lesson.id, targetModule.id)) return

    setActiveLesson(lesson)
    setActiveModule(targetModule)

    setSelectedAnswers({})
    setQuizSubmitted(false)
    setQuizResult(null)

    setActiveTab('content')

    setContentTypeToggle(
      lesson.contentType === 'text' ? 'text' : 'video',
    )

    // CLOSE SIDEBAR MOBILE
    setSidebarOpen(false)

    if (!user?._id || !courseId) return

    startTransition(async () => {
      const update = await updateEnrollmentProgressAction(
        user._id,
        courseId,
        {
          currentModuleId: targetModule.id,
          currentLessonId: lesson.id,
        },
      )

      if (update.success && update.data) {
        setDbEnrollment(update.data)
      }
    })
  }

  const handleAnswerSelect = (
    questionId: string,
    option: string,
  ) => {
    if (quizSubmitted && quizResult?.passed) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const handleSubmitQuiz = async (
    quiz: Quiz,
    isModuleLevel = false,
  ) => {
    if (!user?._id || !courseId) return

    let correctCount = 0

    const itemizedAnswers = quiz.questions.slice(0, 3).map((q) => {
      const chosen = selectedAnswers[q.id] || ''

      const isCorrect =
        chosen.trim().toLowerCase() ===
        q.correctAnswer.trim().toLowerCase()

      if (isCorrect) correctCount++

      return {
        questionId: q.id,
        selectedOption: chosen,
        isCorrect,
      }
    })

    const calculatedScore = Math.round(
      (correctCount / Math.min(quiz.questions.length, 3)) * 100,
    )

    const passedStatus =
      calculatedScore >= quiz.passingScore

    setQuizResult({
      score: calculatedScore,
      passed: passedStatus,
    })

    setQuizSubmitted(true)

    startTransition(async () => {
      const updatesPayload: ProgressUpdatePayload = {
        quizAttempt: {
          quizId: quiz.id,
          score: calculatedScore,
          passed: passedStatus,
          answers: itemizedAnswers,
        },
      }

      if (passedStatus) {
        if (isModuleLevel && activeModule) {
          updatesPayload.newCompletedModuleId =
            activeModule.id
        } else if (activeLesson) {
          updatesPayload.newCompletedLessonId =
            activeLesson.id
        }
      }

      const syncResult =
        await updateEnrollmentProgressAction(
          user._id,
          courseId,
          updatesPayload,
        )

      if (syncResult.success && syncResult.data) {
        setDbEnrollment(syncResult.data)
      }
    })
  }

  if (isCoursesLoading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="animate-pulse font-mono text-xs tracking-widest text-neutral-400">
          INITIALIZING CLASSROOM...
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-dvh w-full overflow-hidden bg-background relative">
      {/* MOBILE OVERLAY */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`
          fixed lg:relative z-50 lg:z-auto
          top-0 left-0 h-full
          w-[85%] max-w-[320px]
          lg:w-80
          border-r border-neutral-200 dark:border-neutral-800
          bg-background
          flex flex-col flex-shrink-0
          transition-transform duration-300
          ${
            sidebarOpen
              ? 'translate-x-0'
              : '-translate-x-full'
          }
          lg:translate-x-0
        `}
      >
        <div className="py-8 border-b border-neutral-200 dark:border-neutral-800">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">
                {course.level} Workspace
              </span>

              <h2 className="text-sm font-bold mt-2 tracking-tight line-clamp-2">
                {course.title}
              </h2>
            </div>

            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-800"
            >
              ✕
            </button>
          </div>

          <div className="mt-4 w-[93%] bg-neutral-200 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
            <div
              className="h-full bg-emerald-500 transition-all duration-500"
              style={{
                width: `${
                  dbEnrollment?.progressPercentage || 0
                }%`,
              }}
            />
          </div>

          <div className="flex justify-between text-[10px] pr-5 mt-1.5 font-mono text-neutral-400">
            <span>Course Progress</span>
            <span className="">
              {dbEnrollment?.progressPercentage || 0}%
            </span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          {course.modules.map((mod) => {
            const modUnlocked = isModuleUnlocked(mod.id)

            return (
              <div
                key={mod.id}
                className={`space-y-1 ${
                  !modUnlocked ? 'opacity-50' : ''
                }`}
              >
                <div className="px-2 py-1 flex items-center justify-between gap-2">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono truncate">
                    {mod.title}
                  </h3>
                </div>

                <div className="space-y-1">
                  {mod.lessons.map((les) => {
                    const isUnlocked =
                      checkIsLessonUnlocked(
                        les.id,
                        mod.id,
                      )

                    const isCurrent =
                      activeLesson?.id === les.id

                    const isFinished =
                      dbEnrollment?.completedLessons.includes(
                        les.id,
                      )

                    return (
                      <button
                        key={les.id}
                        disabled={!isUnlocked}
                        onClick={() =>
                          handleLessonSelection(les, mod)
                        }
                        className={`w-full text-left px-3 py-3 rounded-xl flex items-start gap-3 transition-all ${
                          isCurrent
                            ? 'bg-neutral-200 dark:bg-surface font-medium'
                            : isUnlocked
                              ? 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                              : 'cursor-not-allowed'
                        }`}
                      >
                        <span className="mt-1 flex-shrink-0">
                          {isFinished ? (
                            <svg
                              className="w-4 h-4 text-emerald-500"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <div className="w-4 h-4 rounded-full border border-neutral-400 dark:border-neutral-600" />
                          )}
                        </span>

                        <div className="flex-1 min-w-0">
                          <p className="text-xs sm:text-sm truncate">
                            {les.title}
                          </p>

                          <span className="text-[10px] font-mono opacity-50 block mt-1">
                            {les.contentType.toUpperCase()} •{' '}
                            {les.duration}
                          </span>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* MAIN */}
      <main className="flex-1 flex flex-col h-full overflow-hidden min-w-0">
        {/* HEADER */}
        <header className="px-3 sm:px-4 lg:px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between gap-3 min-h-16 flex-shrink-0 bg-white dark:bg-[#0a0a0a]">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-neutral-200 dark:border-neutral-800"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="min-w-0">
              <span className="text-[10px] font-mono tracking-widest uppercase opacity-40 line-clamp-1">
                {activeModule?.title ||
                  'Capstone Assessment'}
              </span>

              <h1 className="text-sm sm:text-base font-bold truncate">
                {activeLesson
                  ? activeLesson.title
                  : 'Module Capstone System Verification'}
              </h1>
            </div>
          </div>

          {/* DESKTOP TABS */}
          <div className="hidden md:flex items-center gap-2">
            <div className="flex flex-wrap gap-1 bg-neutral-100 dark:bg-neutral-900 p-1 rounded-xl font-mono text-[11px]">
              <button
                onClick={() => setActiveTab('content')}
                disabled={!activeLesson}
                className={`px-3 py-2 rounded-lg transition-all ${
                  activeTab === 'content'
                    ? 'bg-white dark:bg-neutral-800 shadow-sm font-bold'
                    : 'opacity-60'
                }`}
              >
                Lesson
              </button>

              {(activeLesson?.quiz ||
                (!activeLesson &&
                  activeModule?.quiz)) && (
                <button
                  onClick={() => setActiveTab('quiz')}
                  className={`px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'quiz'
                      ? 'bg-white dark:bg-neutral-800 shadow-sm font-bold'
                      : 'opacity-60'
                  }`}
                >
                  Quiz
                </button>
              )}

              {activeModule?.assignment && (
                <button
                  onClick={() =>
                    setActiveTab('assignment')
                  }
                  className={`px-3 py-2 rounded-lg transition-all ${
                    activeTab === 'assignment'
                      ? 'bg-white dark:bg-neutral-800 shadow-sm font-bold'
                      : 'opacity-60'
                  }`}
                >
                  Assignment
                </button>
              )}
            </div>
          </div>
        </header>

        {/* MOBILE TABS */}
        <div className="md:hidden border-b border-neutral-200 dark:border-neutral-800 p-2 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap ${
                activeTab === 'content'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-900'
              }`}
            >
              Lesson
            </button>

            <button
              onClick={() => setActiveTab('quiz')}
              className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap ${
                activeTab === 'quiz'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-900'
              }`}
            >
              Quiz
            </button>

            {activeModule?.assignment && (
              <button
                onClick={() =>
                  setActiveTab('assignment')
                }
                className={`px-3 py-2 rounded-lg text-xs font-mono whitespace-nowrap ${
                  activeTab === 'assignment'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-900'
                }`}
              >
                Assignment
              </button>
            )}
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex-1 overflow-y-auto px-3 py-4 sm:px-5 sm:py-5 lg:p-6 bg-white dark:bg-[#0a0a0a]">
          <div className="w-full max-w-4xl mx-auto space-y-4 sm:space-y-6">
            {/* CONTENT */}
            {activeTab === 'content' &&
              activeLesson && (
                <div className="space-y-4 sm:space-y-6">
                  {activeLesson.videoUrl && (
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-black border border-neutral-200 dark:border-neutral-800">
                      <iframe
                        src={activeLesson.videoUrl}
                        className="w-full h-full"
                        allowFullScreen
                      />
                    </div>
                  )}

                  <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">
                    {activeLesson.markdownBody ||
                      activeLesson.summary}
                  </article>
                </div>
              )}

            {/* QUIZ */}
            {activeTab === 'quiz' && (
              <div className="space-y-6 bg-neutral-50 dark:bg-[#0d0d0d] p-4 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                <h3 className="text-base sm:text-lg font-bold">
                  Assessment Quiz
                </h3>

                {(() => {
                  const targetQuiz = activeLesson
                    ? activeLesson.quiz
                    : activeModule?.quiz

                  if (!targetQuiz) return null

                  return (
                    <div className="space-y-5">
                      {targetQuiz.questions
                        .slice(0, 3)
                        .map((q, index) => (
                          <div
                            key={q.id}
                            className="space-y-3"
                          >
                            <p className="font-medium text-sm sm:text-base">
                              {index + 1}. {q.question}
                            </p>

                            <div className="grid gap-2">
                              {q.options.map((option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleAnswerSelect(
                                      q.id,
                                      option,
                                    )
                                  }
                                  className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                                    selectedAnswers[q.id] ===
                                    option
                                      ? 'border-neutral-900 dark:border-white bg-neutral-100 dark:bg-neutral-800'
                                      : 'border-neutral-200 dark:border-neutral-700'
                                  }`}
                                >
                                  {option}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                      <button
                        onClick={() =>
                          handleSubmitQuiz(
                            targetQuiz,
                            !activeLesson,
                          )
                        }
                        className="w-full sm:w-auto px-5 py-3 rounded-xl bg-neutral-900 dark:bg-white text-white dark:text-black font-medium"
                      >
                        Submit Quiz
                      </button>
                    </div>
                  )
                })()}
              </div>
            )}

            {/* ASSIGNMENT */}
            {activeTab === 'assignment' &&
              activeModule?.assignment && (
                <div className="space-y-6 bg-neutral-50 dark:bg-[#0d0d0d] p-4 sm:p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800">
                  <h3 className="text-base sm:text-lg font-bold">
                    {activeModule.assignment.title}
                  </h3>

                  <p className="text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                    {
                      activeModule.assignment
                        .problemStatement
                    }
                  </p>

                  <div className="space-y-3">
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={assignmentUrl}
                      onChange={(e) =>
                        setAssignmentUrl(
                          e.target.value,
                        )
                      }
                      className="w-full rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 px-4 py-3 text-sm outline-none"
                    />

                    <button className="w-full sm:w-auto px-5 py-3 rounded-xl bg-amber-500 text-black font-medium">
                      Submit Assignment
                    </button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  )
}