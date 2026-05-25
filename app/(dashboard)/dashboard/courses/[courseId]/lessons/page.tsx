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
import { Drawer, Progress } from '@mantine/core'
import { BookOpen, CheckCircle2 } from 'lucide-react'

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

  const [dbEnrollment, setDbEnrollment] = useState<SerializedEnrollment | null>(
    null,
  )

  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [activeModule, setActiveModule] = useState<Module | null>(null)

  const [activeTab, setActiveTab] = useState<
    'content' | 'quiz' | 'assignment' | 'forum'
  >('content')

  const [contentTypeToggle, setContentTypeToggle] = useState<'video' | 'text'>(
    'video',
  )

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
      // if (!user?._id || !courseId || !course) return
      if (dbEnrollment || !user?._id || !courseId || !course) return

      try {
        const syncBlock = await getEnrollmentProgressAction(user._id, courseId)

        if (syncBlock.success && syncBlock.data) {
          setDbEnrollment(syncBlock.data)

          const savedModId = syncBlock.data.currentModuleId
          const savedLesId = syncBlock.data.currentLessonId

          const initialModule =
            course.modules.find((m) => m.id === savedModId) || course.modules[0]

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
  }, [courseId, user?._id, dbEnrollment])

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

    const currentModIndex = course.modules.findIndex((m) => m.id === moduleId)

    if (currentModIndex === 0) return true

    const previousModule = course.modules[currentModIndex - 1]

    return dbEnrollment.completedModules.includes(previousModule.id)
  }

  const checkIsLessonUnlocked = (lessonId: string, modId: string) => {
    if (!course || !dbEnrollment) return false
    if (course.type === 'Free') return true
    if (!isModuleUnlocked(modId)) return false

    const positionIndex = flatLessonsList.findIndex((l) => l.id === lessonId)

    if (positionIndex === 0) return true

    const previousLessonItem = flatLessonsList[positionIndex - 1]

    return dbEnrollment.completedLessons.includes(previousLessonItem.id)
  }

  const handleLessonSelection = (lesson: Lesson, targetModule: Module) => {
    if (!checkIsLessonUnlocked(lesson.id, targetModule.id)) return

    setActiveLesson(lesson)
    setActiveModule(targetModule)

    setSelectedAnswers({})
    setQuizSubmitted(false)
    setQuizResult(null)

    setActiveTab('content')

    setContentTypeToggle(lesson.contentType === 'text' ? 'text' : 'video')

    // CLOSE SIDEBAR MOBILE
    setSidebarOpen(false)

    if (!user?._id || !courseId) return

    startTransition(async () => {
      const update = await updateEnrollmentProgressAction(user._id, courseId, {
        currentModuleId: targetModule.id,
        currentLessonId: lesson.id,
      })

      if (update.success && update.data) {
        setDbEnrollment(update.data)
      }
    })
  }

  const handleAnswerSelect = (questionId: string, option: string) => {
    if (quizSubmitted && quizResult?.passed) return

    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: option,
    }))
  }

  const handleSubmitQuiz = async (quiz: Quiz, isModuleLevel = false) => {
    if (!user?._id || !courseId) return

    let correctCount = 0

    const itemizedAnswers = quiz.questions.slice(0, 3).map((q) => {
      const chosen = selectedAnswers[q.id] || ''

      const isCorrect =
        chosen.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()

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

    const passedStatus = calculatedScore >= quiz.passingScore

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
          updatesPayload.newCompletedModuleId = activeModule.id
        } else if (activeLesson) {
          updatesPayload.newCompletedLessonId = activeLesson.id
        }
      }

      const syncResult = await updateEnrollmentProgressAction(
        user._id,
        courseId,
        updatesPayload,
      )

      if (syncResult.success && syncResult.data) {
        setDbEnrollment(syncResult.data)
      }
    })
  }

  const handleMarkComplete = async () => {
    if (!user?._id || !courseId || !activeLesson) return

    startTransition(async () => {
      const result = await updateEnrollmentProgressAction(user._id, courseId, {
        newCompletedLessonId: activeLesson.id,
      })

      if (result.success && result.data) {
        setDbEnrollment(result.data)
        // Optional: Trigger a celebration or auto-advance to next lesson
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
    <div className="flex flex-col h-[calc(100dvh-70px)] overflow-hidden bg-background text-foreground">
      {/* DRAWER */}
      <Drawer
        opened={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        title={
          <div className="flex flex-col px-5 py-3">
            <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-black">
              Course Outline
            </span>

            <span className="text-sm font-black line-clamp-2 mt-2">
              {course.title}
            </span>
          </div>
        }
        padding={0}
        size={340}
        overlayProps={{
          backgroundOpacity: 0.55,
          blur: 4,
        }}
        classNames={{
          content:
            'bg-white dark:bg-[#0a0a0a] border-r border-neutral-200 dark:border-neutral-800',
          header:
            'border-b border-neutral-200 dark:border-neutral-800 px-5 py-4',
          body: 'p-0 h-full',
        }}
      >
        <div className="h-full flex flex-col overflow-hidden">
          {/* PROGRESS */}
          <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
                Progress
              </span>

              <span className="text-xs font-black text-blue-600">
                {dbEnrollment?.progressPercentage || 0}%
              </span>
            </div>

            <Progress
              value={dbEnrollment?.progressPercentage || 0}
              radius="xl"
              size="md"
            />
          </div>

          {/* MODULES */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {course.modules.map((mod) => {
              const modUnlocked = isModuleUnlocked(mod.id)

              return (
                <div
                  key={mod.id}
                  className={`${!modUnlocked ? 'opacity-50' : ''}`}
                >
                  <div className="px-2 mb-2">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                      {mod.title}
                    </h3>
                  </div>

                  <div className="space-y-1.5">
                    {mod.lessons.map((les) => {
                      const isUnlocked = checkIsLessonUnlocked(les.id, mod.id)

                      const isCurrent = activeLesson?.id === les.id

                      const isFinished =
                        dbEnrollment?.completedLessons.includes(les.id)

                      return (
                        <button
                          key={les.id}
                          disabled={!isUnlocked}
                          onClick={() => {
                            handleLessonSelection(les, mod)
                            setSidebarOpen(false)
                          }}
                          className={`w-full text-left rounded-2xl p-3 transition-all duration-200 border ${
                            isCurrent
                              ? 'bg-blue-100 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
                              : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
                          }`}
                        >
                          <div className="flex gap-3 items-start">
                            <div className="mt-0.5 shrink-0">
                              {isFinished ? (
                                <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />
                              ) : (
                                <div className="w-4 h-4 rounded-full border border-neutral-400 dark:border-neutral-700" />
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <p className="text-sm font-semibold line-clamp-2">
                                {les.title}
                              </p>

                              <span className="block mt-1 text-[10px] font-black uppercase tracking-wider text-neutral-400">
                                {les.contentType} • {les.duration}
                              </span>
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </Drawer>

      {/* WORKSPACE HEADER */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-4 px-0 lg:px-8 py-4">
          {/* TITLE */}
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-black truncate">
              {activeModule?.title || 'Course Workspace'}
            </p>

            <h1 className="text-base sm:text-lg lg:text-2xl font-black tracking-tight truncate">
              {activeLesson?.title || 'Learning Workspace'}
            </h1>
          </div>

          {/* ACTIONS */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setSidebarOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all cursor-pointer"
            >
              <BookOpen className="w-4 h-4" />

              <span className="text-sm font-bold hidden sm:block">Lessons</span>
            </button>
          </div>
        </div>

        {/* TABS */}
        <div className="px-0 lg:px-8 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-5 py-2 rounded-2xl text-sm! font-bold whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'content'
                  ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                  : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
              }`}
            >
              Lesson
            </button>

            {(activeLesson?.quiz || (!activeLesson && activeModule?.quiz)) && (
              <button
                onClick={() => setActiveTab('quiz')}
                className={`px-5 py-2 rounded-2xl text-sm! font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'quiz'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                Quiz
              </button>
            )}

            {activeModule?.assignment && (
              <button
                onClick={() => setActiveTab('assignment')}
                className={`px-5 py-2 rounded-2xl text-sm! font-bold whitespace-nowrap transition-all cursor-pointer ${
                  activeTab === 'assignment'
                    ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
                    : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
                }`}
              >
                Assignment
              </button>
            )}
          </div>
        </div>
      </header>

      {/* BODY */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto">
          <div className="max-w-5xl mx-auto py-5 lg:py-8">
            {/* CONTENT TAB */}
            {activeTab === 'content' && activeLesson && (
              <div className="space-y-6 lg:space-y-8">
                {/* VIDEO */}
                {activeLesson.videoUrl && (
                  <div className="overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-2xl">
                    <div className="aspect-video w-full">
                      {activeLesson.videoUrl.endsWith('.mp4') ||
                      activeLesson.videoUrl.endsWith('.webm') ? (
                        <video
                          src={activeLesson.videoUrl}
                          controls
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <iframe
                          src={activeLesson.videoUrl}
                          className="w-full h-full"
                          allowFullScreen
                        />
                      )}
                    </div>
                  </div>
                )}

                {/* LESSON CONTENT */}
                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-sm">
                  <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
                    {activeLesson.markdownBody || activeLesson.summary}
                  </article>
                </div>

                {/* COMPLETE BUTTON */}
                {!dbEnrollment?.completedLessons.includes(activeLesson.id) && (
                  <div className="flex justify-end">
                    <button
                      onClick={handleMarkComplete}
                      disabled={isPending}
                      className="w-full sm:w-auto px-8 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-sm! text-white font-black transition-all disabled:opacity-50 active:scale-[0.98]"
                    >
                      {isPending ? 'Updating...' : 'Mark Lesson Complete'}
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* QUIZ TAB */}
            {activeTab === 'quiz' && (
              <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-sm">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black tracking-tight">
                      Assessment Quiz
                    </h2>

                    <p className="mt-2 text-sm text-neutral-500">
                      Complete the following quiz questions.
                    </p>
                  </div>

                  {(() => {
                    const targetQuiz = activeLesson
                      ? activeLesson.quiz
                      : activeModule?.quiz

                    if (!targetQuiz) return null

                    return (
                      <div className="space-y-8">
                        {targetQuiz.questions.slice(0, 3).map((q, index) => (
                          <div key={q.id} className="space-y-4">
                            <h3 className="font-bold text-base lg:text-lg leading-relaxed">
                              {index + 1}. {q.question}
                            </h3>

                            <div className="grid gap-3">
                              {q.options.map((option) => (
                                <button
                                  key={option}
                                  onClick={() =>
                                    handleAnswerSelect(q.id, option)
                                  }
                                  className={`text-left p-4 rounded-2xl border transition-all ${
                                    selectedAnswers[q.id] === option
                                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/20'
                                      : 'border-neutral-200 dark:border-neutral-800 hover:border-neutral-400'
                                  }`}
                                >
                                  <span className="text-sm font-medium">
                                    {option}
                                  </span>
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          onClick={() =>
                            handleSubmitQuiz(targetQuiz, !activeLesson)
                          }
                          className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-neutral-900 dark:bg-white text-white dark:text-black font-black transition-all active:scale-[0.98]"
                        >
                          Submit Quiz
                        </button>
                      </div>
                    )
                  })()}
                </div>
              </div>
            )}

            {/* ASSIGNMENT TAB */}
            {activeTab === 'assignment' && activeModule?.assignment && (
              <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-sm">
                <div className="space-y-8">
                  <div>
                    <h2 className="text-xl lg:text-2xl font-black tracking-tight">
                      {activeModule.assignment.title}
                    </h2>

                    <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
                      {activeModule.assignment.problemStatement}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <input
                      type="url"
                      placeholder="https://github.com/..."
                      value={assignmentUrl}
                      onChange={(e) => setAssignmentUrl(e.target.value)}
                      className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-black transition-all active:scale-[0.98]">
                      Submit Assignment
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
