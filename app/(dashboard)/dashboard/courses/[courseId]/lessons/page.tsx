// /app/(dashboard)/dashboard/courses/[courseId]/lessons/page.tsx

'use client'

import React, { useState, useEffect, useTransition, useMemo } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { 
  getEnrollmentProgressAction, 
  updateEnrollmentProgressAction, 
  SerializedEnrollment 
} from '@/app/services/enrollmentActions'
import { useAuthStore } from '@/app/store/authStore'
import { useCourses } from '@/app/hooks/useCourses'
import { 
  Module, 
  Lesson, 
  Quiz, 
  QuizQuestion 
} from '@/app/types'

export default function CourseWorkspacePage() {
  const params = useParams()
  const router = useRouter()
  
  // Use your production hooks
  const { user } = useAuthStore()
  const { courses, loading: isCoursesLoading } = useCourses()
  
  const courseId = params.courseId as string
  const course = useMemo(() => courses?.find(c => c._id === courseId), [courses, courseId])

  // State
  const [dbEnrollment, setDbEnrollment] = useState<SerializedEnrollment | null>(null)
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [activeModule, setActiveModule] = useState<Module | null>(null)
  
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'assignment' | 'forum'>('content')
  const [contentTypeToggle, setContentTypeToggle] = useState<'video' | 'text'>('video')
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({})
  const [quizSubmitted, setQuizSubmitted] = useState(false)
  const [quizResult, setQuizResult] = useState<{ score: number; passed: boolean } | null>(null)
  const [assignmentUrl, setAssignmentUrl] = useState('')
  const [assignmentSubmitted, setAssignmentSubmitted] = useState(false)

  const [isPending, startTransition] = useTransition()

  // Sync Enrollment
  useEffect(() => {
    async function syncEnrollment() {
      if (!user?.id || !courseId || !course) return
      
      try {
        const syncBlock = await getEnrollmentProgressAction(user.id, courseId)
        if (syncBlock.success && syncBlock.data) {
          setDbEnrollment(syncBlock.data)
          
          const savedModId = syncBlock.data.currentModuleId
          const savedLesId = syncBlock.data.currentLessonId

          const initialModule = course.modules.find(m => m.id === savedModId) || course.modules[0]
          const initialLesson = initialModule?.lessons.find(l => l.id === savedLesId) || initialModule?.lessons[0]

          setActiveModule(initialModule || null)
          setActiveLesson(initialLesson || null)
          if (initialLesson) {
            setContentTypeToggle(initialLesson.contentType === 'text' ? 'text' : 'video')
          }
        }
      } catch (err) {
        console.error('Workspace sync fault:', err)
      }
    }
    syncEnrollment()
  }, [courseId, user?.id, course])

  const flatLessonsList = useMemo(() => {
    if (!course) return []
    return course.modules.flatMap(m => m.lessons.map(l => ({ ...l, moduleId: m.id })))
  }, [course])

  const isModuleUnlocked = (moduleId: string) => {
    if (!course || !dbEnrollment) return false
    if (course.type === 'Free') return true
    const currentModIndex = course.modules.findIndex(m => m.id === moduleId)
    if (currentModIndex === 0) return true
    const previousModule = course.modules[currentModIndex - 1]
    return dbEnrollment.completedModules.includes(previousModule.id)
  }

  const checkIsLessonUnlocked = (lessonId: string, modId: string) => {
    if (!course || !dbEnrollment) return false
    if (course.type === 'Free') return true
    if (!isModuleUnlocked(modId)) return false
    const positionIndex = flatLessonsList.findIndex(l => l.id === lessonId)
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

    if (!user?.id || !courseId) return
    startTransition(async () => {
      const update = await updateEnrollmentProgressAction(user.id, courseId, {
        currentModuleId: targetModule.id,
        currentLessonId: lesson.id
      })
      if (update.success && update.data) setDbEnrollment(update.data)
    })
  }

  const handleAnswerSelect = (questionId: string, option: string) => {
    if (quizSubmitted && quizResult?.passed) return // Lock down if already cleared
    setSelectedAnswers(prev => ({ ...prev, [questionId]: option }))
  }

  const handleSubmitQuiz = async (quiz: Quiz, isModuleLevel = false) => {
    if (!user?.id || !courseId) return

    let correctCount = 0
    const itemizedAnswers = quiz.questions.slice(0, 3).map(q => {
      const chosen = selectedAnswers[q.id] || ''
      const isCorrect = chosen.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      if (isCorrect) correctCount++
      return {
        questionId: q.id,
        selectedOption: chosen,
        isCorrect
      }
    })

    const calculatedScore = Math.round((correctCount / Math.min(quiz.questions.length, 3)) * 100)
    const passedStatus = calculatedScore >= quiz.passingScore

    setQuizResult({ score: calculatedScore, passed: passedStatus })
    setQuizSubmitted(true)

    startTransition(async () => {
      const updatesPayload: any = {
        quizAttempt: {
          quizId: quiz.id,
          score: calculatedScore,
          passed: passedStatus,
          answers: itemizedAnswers
        }
      }

      if (passedStatus) {
        if (isModuleLevel && activeModule) {
          updatesPayload.newCompletedModuleId = activeModule.id
        } else if (activeLesson) {
          updatesPayload.newCompletedLessonId = activeLesson.id
        }
      }

      const syncResult = await updateEnrollmentProgressAction(user.id, courseId, updatesPayload)
      if (syncResult.success && syncResult.data) {
        setDbEnrollment(syncResult.data)
      }
    })
  }

  if (isCoursesLoading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] text-white">
        <div className="animate-pulse font-mono text-xs tracking-widest text-neutral-400">INITIALIZING CLASSROOM...</div>
      </div>
    )
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-white dark:bg-[#0a0a0a] text-neutral-900 dark:text-[#ededed]">
      
      {/* SIDEBAR NAVIGATION ENGINE */}
      <aside className="w-80 border-r border-neutral-200 dark:border-neutral-800 flex flex-col h-full bg-neutral-50 dark:bg-[#0d0d0d] flex-shrink-0">
        <div className="p-4 border-b border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] uppercase font-mono tracking-wider px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500">{course.level} Workspace</span>
          <h2 className="text-sm font-bold truncate mt-2 tracking-tight">{course.title}</h2>
          
          <div className="mt-4 w-full bg-neutral-200 dark:bg-neutral-800 h-1.5 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${dbEnrollment?.progressPercentage || 0}%` }} />
          </div>
          <div className="flex justify-between text-[10px] mt-1.5 font-mono text-neutral-400">
            <span>Course Progress</span>
            <span>{dbEnrollment?.progressPercentage || 0}%</span>
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 space-y-4">
          {course.modules.map((mod) => {
            const modUnlocked = isModuleUnlocked(mod.id)
            return (
              <div key={mod.id} className={`space-y-1 ${!modUnlocked ? 'opacity-50' : ''}`}>
                <div className="px-2 py-1 flex items-center justify-between">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 font-mono truncate max-w-[80%]">
                    {mod.title}
                  </h3>
                  {!modUnlocked && (
                    <svg className="w-3 h-3 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                  )}
                </div>

                <div className="space-y-0.5">
                  {mod.lessons.map((les) => {
                    const isUnlocked = checkIsLessonUnlocked(les.id, mod.id)
                    const isCurrent = activeLesson?.id === les.id
                    const isFinished = dbEnrollment?.completedLessons.includes(les.id)

                    return (
                      <button
                        key={les.id}
                        disabled={!isUnlocked}
                        onClick={() => handleLessonSelection(les, mod)}
                        className={`w-full text-left px-3 py-2 rounded-lg flex items-start gap-2.5 transition-all ${
                          isCurrent 
                            ? 'bg-neutral-200 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-50 font-medium' 
                            : isUnlocked 
                              ? 'text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-900' 
                              : 'cursor-not-allowed'
                        }`}
                      >
                        <span className="mt-0.5 flex-shrink-0">
                          {isFinished ? (
                            <svg className="w-3.5 h-3.5 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <div className="w-3.5 h-3.5 rounded-full border border-neutral-400 dark:border-neutral-600" />
                          )}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs truncate">{les.title}</p>
                          <span className="text-[9px] font-mono opacity-50 block">{les.contentType.toUpperCase()} • {les.duration}</span>
                        </div>
                      </button>
                    )
                  })}

                  {/* MODULE CAPSTONE ASSESSMENT DECK */}
                  {mod.quiz && modUnlocked && (
                    <button 
                      onClick={() => { setActiveModule(mod); setActiveLesson(null); setActiveTab('quiz'); }}
                      className="w-full text-left px-3 py-2 rounded-lg flex items-center gap-2.5 text-amber-500 dark:text-amber-400/90 font-mono text-[11px] hover:bg-neutral-100 dark:hover:bg-neutral-900"
                    >
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="truncate">{mod.title} Exam Gate</span>
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </nav>
      </aside>

      {/* CORE WORKSPACE VIEWPORT */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        <header className="px-6 border-b border-neutral-200 dark:border-neutral-800 flex items-center justify-between h-16 flex-shrink-0 bg-white dark:bg-[#0a0a0a]">
          <div className="min-w-0">
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-40">{activeModule?.title || 'Capstone Assessment'}</span>
            <h1 className="text-sm font-bold truncate">{activeLesson ? activeLesson.title : 'Module Capstone System Verification'}</h1>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex gap-0.5 bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-lg font-mono text-[11px]">
              <button 
                onClick={() => setActiveTab('content')}
                disabled={!activeLesson}
                className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'content' ? 'bg-white dark:bg-neutral-800 shadow-sm font-bold text-neutral-900 dark:text-white' : 'opacity-60 disabled:hidden'}`}
              >
                Lesson Body
              </button>
              {(activeLesson?.quiz || (!activeLesson && activeModule?.quiz)) && (
                <button 
                  onClick={() => setActiveTab('quiz')}
                  className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'quiz' ? 'bg-white dark:bg-neutral-800 shadow-sm font-bold text-neutral-900 dark:text-white' : 'opacity-60'}`}
                >
                  Assessment Gate
                </button>
              )}
              {activeModule?.assignment && (
                <button 
                  onClick={() => setActiveTab('assignment')}
                  className={`px-2.5 py-1 rounded-md transition-all ${activeTab === 'assignment' ? 'bg-white dark:bg-neutral-800 shadow-sm font-bold text-neutral-900 dark:text-white' : 'opacity-60'}`}
                >
                  Peer Assignment
                </button>
              )}
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-6 bg-white dark:bg-[#0a0a0a]">
          <div className="max-w-3xl mx-auto space-y-6">
            
            {/* TAB WINDOW A: CURRICULUM WORKSPACE PLAYER */}
            {activeTab === 'content' && activeLesson && (
              <div className="space-y-6">
                {/* OPTIONAL HYBRID CONFIGURATION TOGGLE SWITCH */}
                {activeLesson.contentType === 'hybrid' && (
                  <div className="flex justify-end">
                    <div className="flex bg-neutral-100 dark:bg-neutral-900 p-0.5 rounded-md font-mono text-[10px]">
                      <button onClick={() => setContentTypeToggle('video')} className={`px-2 py-0.5 rounded ${contentTypeToggle === 'video' ? 'bg-white dark:bg-neutral-800 font-bold' : 'opacity-50'}`}>Video View</button>
                      <button onClick={() => setContentTypeToggle('text')} className={`px-2 py-0.5 rounded ${contentTypeToggle === 'text' ? 'bg-white dark:bg-neutral-800 font-bold' : 'opacity-50'}`}>Text Document</button>
                    </div>
                  </div>
                )}

                {activeLesson.videoUrl && contentTypeToggle === 'video' && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-black shadow-md border border-neutral-200 dark:border-neutral-800 relative">
                    <iframe src={activeLesson.videoUrl} className="w-full h-full" allowFullScreen />
                  </div>
                )}

                {/* ASYNC SECURE DOWNLOAD ACTION LINE */}
                {activeLesson.isDownloadable && activeLesson.downloadUrl && (
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/20 rounded-xl flex items-center justify-between">
                    <div className="text-xs">
                      <p className="font-bold text-emerald-500">Offline Study Asset Available</p>
                      <p className="text-[10px] text-neutral-400">Download media package directly to local device workspace.</p>
                    </div>
                    <a href={activeLesson.downloadUrl} download className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-mono transition-all">
                      Download
                    </a>
                  </div>
                )}

                {(activeLesson.contentType === 'text' || contentTypeToggle === 'text') && (
                  <article className="prose prose-neutral dark:prose-invert max-w-none text-sm leading-relaxed whitespace-pre-wrap font-sans text-neutral-700 dark:text-neutral-300">
                    {activeLesson.markdownBody || activeLesson.summary}
                  </article>
                )}
              </div>
            )}

            {/* TAB WINDOW B: SYSTEM PERSISTENT VERIFICATION INTERACTIVE QUIZ ASSESSMENT */}
            {activeTab === 'quiz' && (
              <div className="space-y-6 bg-neutral-50 dark:bg-[#0d0d0d] p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                {(() => {
                  const targetQuiz = activeLesson ? activeLesson.quiz : activeModule?.quiz
                  if (!targetQuiz) return null

                  // Cap rendering directly at 3 questions max for strict verification compliance
                  const activeQuestions = targetQuiz.questions.slice(0, 3)

                  return (
                    <>
                      <div className="flex justify-between items-start border-b border-neutral-200 dark:border-neutral-800 pb-4">
                        <div>
                          <h3 className="text-sm font-bold tracking-tight">{targetQuiz.title}</h3>
                          <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Passing Threshold: {targetQuiz.passingScore}%</p>
                        </div>
                        {quizSubmitted && (
                          <span className={`px-2 py-0.5 rounded text-[11px] font-mono ${quizResult?.passed ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}>
                            {quizResult?.passed ? 'GATEWAY UNLOCKED' : 'VERIFICATION FAILED'}
                          </span>
                        )}
                      </div>

                      <div className="space-y-5">
                        {activeQuestions.map((q: QuizQuestion, index: number) => {
                          const userSelected = selectedAnswers[q.id]
                          const isCorrectChoice = userSelected?.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()

                          return (
                            <div key={q.id} className="space-y-2">
                              <label className="text-xs font-bold block text-neutral-400 font-mono">
                                Question 0{index + 1}
                              </label>
                              <p className="text-sm font-medium">{q.question}</p>
                              
                              <div className="grid grid-cols-1 gap-1.5">
                                {q.options.map((option) => {
                                  const isOptionSelected = userSelected === option
                                  return (
                                    <button
                                      key={option}
                                      disabled={quizSubmitted && quizResult?.passed}
                                      onClick={() => handleAnswerSelect(q.id, option)}
                                      className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-all border ${
                                        isOptionSelected 
                                          ? 'border-neutral-900 dark:border-neutral-100 bg-neutral-100 dark:bg-neutral-800' 
                                          : 'border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900'
                                      }`}
                                    >
                                      {option}
                                    </button>
                                  )
                                })}
                              </div>

                              {/* CONDITIONAL RETROSPECTIVE INDUSTRIAL ANSWER REVIEW COMPARTMENT */}
                              {quizSubmitted && (
                                <div className={`p-3 rounded-lg text-xs font-mono mt-2 ${isCorrectChoice ? 'bg-emerald-500/5 text-emerald-600 dark:text-emerald-400' : 'bg-red-500/5 text-red-600 dark:text-red-400'}`}>
                                  <div className="flex items-center gap-1.5 font-bold">
                                    <span>{isCorrectChoice ? '✓ Correct Choice' : '✗ Incorrect Response'}</span>
                                    {!isCorrectChoice && <span className="opacity-60 text-[10px]">(Expected: {q.correctAnswer})</span>}
                                  </div>
                                  <p className="mt-1 opacity-80 text-[11px] leading-relaxed font-sans">{q.explanation}</p>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>

                      {(!quizSubmitted || !quizResult?.passed) && (
                        <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
                          <button
                            onClick={() => handleSubmitQuiz(targetQuiz, !activeLesson)}
                            disabled={Object.keys(selectedAnswers).length < activeQuestions.length || isPending}
                            className="px-4 py-2 bg-neutral-900 dark:bg-neutral-50 text-white dark:text-neutral-950 font-mono text-xs font-bold rounded-lg transition-all hover:opacity-90 disabled:opacity-30"
                          >
                            {isPending ? 'PROCESSING EVALUATION...' : quizSubmitted ? 'RETRY ASSESSMENT GATE' : 'SUBMIT ANSWERS'}
                          </button>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            {/* TAB WINDOW C: PEER REVIEW ASSIGNMENT HUB */}
            {activeTab === 'assignment' && activeModule?.assignment && (
              <div className="space-y-6 bg-neutral-50 dark:bg-[#0d0d0d] p-6 rounded-xl border border-neutral-200 dark:border-neutral-800">
                <div className="border-b border-neutral-200 dark:border-neutral-800 pb-4">
                  <h3 className="text-sm font-bold tracking-tight">{activeModule.assignment.title}</h3>
                  <p className="text-[10px] text-neutral-400 font-mono mt-0.5">Required Peer Approvals: {activeModule.assignment.peerReviewsRequired} • Target Grade: {activeModule.assignment.minPeerScoreToPass}%</p>
                </div>

                <div className="space-y-4">
                  <div className="text-xs space-y-1.5">
                    <span className="font-mono text-neutral-400 font-bold block uppercase">Problem Statement</span>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed font-sans">{activeModule.assignment.problemStatement}</p>
                  </div>

                  {activeModule.assignment.submissionTemplateUrl && (
                    <a href={activeModule.assignment.submissionTemplateUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-mono text-amber-500 hover:underline">
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                      Download Project Starter Template File
                    </a>
                  )}

                  <div className="pt-4 border-t border-neutral-200 dark:border-neutral-800 space-y-3">
                    {/* Fixed tag closing mismatch here from </summary> to </label> */}
                    <label className="text-xs font-mono text-neutral-400 font-bold block uppercase">Submit Workspace Solution URL</label>
                    <input 
                      type="url" 
                      placeholder="https://github.com/... or cloud repository link"
                      value={assignmentUrl}
                      onChange={(e) => setAssignmentUrl(e.target.value)}
                      disabled={assignmentSubmitted}
                      className="w-full bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg px-3 py-2 text-xs font-mono focus:outline-none focus:border-neutral-400 disabled:opacity-40"
                    />
                    {!assignmentSubmitted ? (
                      <button 
                        onClick={() => setAssignmentSubmitted(true)}
                        disabled={!assignmentUrl}
                        className="px-4 py-2 bg-amber-500 text-neutral-950 font-mono text-xs font-bold rounded-lg hover:bg-amber-600 transition-all disabled:opacity-40"
                      >
                        Dispatch Code to Peer Review Queue
                      </button>
                    ) : (
                      <div className="p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg font-mono text-[11px] text-amber-600 dark:text-amber-400">
                        ✓ Solution submitted. Tracking distribution across peers. You must grade 3 other student submissions to expedite your evaluation matrix.
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  )
          }
