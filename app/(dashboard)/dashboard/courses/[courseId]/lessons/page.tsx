// // /app/(dashboard)/dashboard/courses/[courseId]/lessons/page.tsx

// 'use client'

// import React, {
//   useState,
//   useEffect,
//   useTransition,
//   useMemo,
//   useRef,
// } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import {
//   getEnrollmentProgressAction,
//   updateEnrollmentProgressAction,
// } from '@/app/services/enrollmentActions'
// import { useAuthStore } from '@/app/store/authStore'
// import { useCourses } from '@/app/hooks/useCourses'
// import { Module, Lesson, Quiz } from '@/app/types'
// import { Drawer, Progress } from '@mantine/core'
// import { BookOpen, CheckCircle2 } from 'lucide-react'
// import { useQuizStore } from '@/app/store/quizStore'
// import {
//   QuizAttemptInput,
//   SerializedEnrollment,
//   UpdatePayload,
// } from '@/app/types/enrollment'
// import { Types } from 'mongoose'
// import { useSnackbar } from 'notistack'

// export default function CourseWorkspacePage() {
//   const params = useParams()
//   const router = useRouter()

//   const { user } = useAuthStore()
//   const { courses, loading: isCoursesLoading } = useCourses()

//   const { enqueueSnackbar } = useSnackbar()

//   // Inside CourseWorkspacePage
//   const {
//     selectedAnswers,
//     quizResult,
//     setAnswer,
//     setQuizResult,
//     resetQuizState,
//     setSelectedAnswers,
//     setQuizSubmitted,
//   } = useQuizStore()

//   const isQuizSubmitted = !!quizResult

//   const courseId = params.courseId as string

//   const course = useMemo(
//     () => courses?.find((c) => c._id === courseId),
//     [courses, courseId],
//   )

//   const [dbEnrollment, setDbEnrollment] = useState<SerializedEnrollment | null>(
//     null,
//   )
//   const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
//   const [activeModule, setActiveModule] = useState<Module | null>(null)
//   const [activeTab, setActiveTab] = useState<
//     'content' | 'quiz' | 'assignment' | 'forum'
//   >('content')
//   const [contentTypeToggle, setContentTypeToggle] = useState<'video' | 'text'>(
//     'video',
//   )

//   const [sidebarOpen, setSidebarOpen] = useState(false)
//   const [isPending, startTransition] = useTransition()
//   const [isAssignmentSubmitting, setIsAssignmentSubmitting] = useState(false)

//   const [videoEnded, setVideoEnded] = useState(false)
//   const [textRead, setTextRead] = useState(false)
//   const observerTarget = useRef(null)

//   // Local draft for input text handling before submission
//   const [assignmentInputBuffer, setAssignmentInputBuffer] = useState('')

//   // 1. Dynamically derive if the current module's assignment has been submitted
//   const assignmentSubmissionInfo = useMemo(() => {
//     if (!dbEnrollment || !activeModule?.assignment) return null

//     return (
//       dbEnrollment.assignmentSubmissions?.find(
//         (s) => s.assignmentId === activeModule.assignment?.id,
//       ) || null
//     )
//   }, [dbEnrollment, activeModule])

//   const assignmentSubmitted = !!assignmentSubmissionInfo

//   // 2. Compute what to show in the URL box dynamically
//   const assignmentUrl = useMemo(() => {
//     if (assignmentSubmitted && assignmentSubmissionInfo) {
//       return assignmentSubmissionInfo.submissionUrl
//     }
//     return assignmentInputBuffer
//   }, [assignmentSubmitted, assignmentSubmissionInfo, assignmentInputBuffer])

//   // Tracking Text Read State
//   useEffect(() => {
//     if (activeLesson?.contentType !== 'text') return

//     const observer = new IntersectionObserver(
//       (entries) => {
//         if (entries[0].isIntersecting) setTextRead(true)
//       },
//       { threshold: 1.0 },
//     )

//     if (observerTarget.current) observer.observe(observerTarget.current)
//     return () => observer.disconnect()
//   }, [activeLesson])

//   // 3. Update useEffect sync
//   useEffect(() => {
//     async function syncEnrollment() {
//       if (dbEnrollment || !user?._id || !courseId || !course) return
//       try {
//         const syncBlock = await getEnrollmentProgressAction(user._id, courseId)
//         if (syncBlock.success && syncBlock.data) {
//           setDbEnrollment(syncBlock.data)

//           const savedModId = syncBlock.data.currentModuleId
//           const savedLesId = syncBlock.data.currentLessonId
//           const initialModule =
//             course.modules.find((m) => m.id === savedModId) || course.modules[0]
//           const initialLesson =
//             initialModule?.lessons.find((l) => l.id === savedLesId) ||
//             initialModule?.lessons[0]

//           setActiveModule(initialModule || null)
//           setActiveLesson(initialLesson || null)

//           // Safely wipe the local buffer on initial view load
//           setAssignmentInputBuffer('')
//         }
//       } catch (err) {
//         console.error('Workspace tracking sync fault:', err)
//       }
//     }
//     syncEnrollment()
//   }, [courseId, user?._id, dbEnrollment, course])

//   // Hydrate quiz state from dbEnrollment records on page refresh or active lesson shifts
//   useEffect(() => {
//     // Determine which quiz we care about based on what's active
//     const activeQuizId = activeLesson?.quiz?.id || activeModule?.quiz?.id

//     if (!dbEnrollment || !activeQuizId) {
//       // If there's no active quiz context, clean up the local store state safely
//       resetQuizState()
//       return
//     }

//     // Find all previous attempts for this specific quiz, sorted by most recent
//     const history =
//       dbEnrollment.quizAttempts?.filter(
//         (attempt) => attempt.quizId === activeQuizId,
//       ) || []

//     if (history.length > 0) {
//       // Nab the most recent attempt
//       const latestAttempt = history[history.length - 1]

//       // Turn the itemized array back into a key/value state matching the store format: { [questionId]: selectedOption }
//       const answersMap: Record<string, string> = {}
//       latestAttempt.answers.forEach((ans) => {
//         answersMap[ans.questionId] = ans.selectedOption
//       })

//       // Repopulate Zustand store variables so the UI reacts instantly
//       setSelectedAnswers(answersMap)
//       setQuizResult({
//         score: latestAttempt.score,
//         passed: latestAttempt.passed,
//       })
//       setQuizSubmitted(true)
//     } else {
//       // If they have never tried this specific quiz, wipe any residual state out of the workspace view
//       resetQuizState()
//     }
//   }, [
//     activeLesson?.id,
//     activeModule?.id,
//     dbEnrollment,
//     setSelectedAnswers,
//     setQuizResult,
//     setQuizSubmitted,
//     resetQuizState,
//   ])

//   // Computed: Is the current lesson requirements met?
//   const requirementsMet = useMemo(() => {
//     const isVideoDone =
//       activeLesson?.contentType === 'video' ? videoEnded : true
//     const isTextDone = activeLesson?.contentType === 'text' ? textRead : true
//     const isQuizPassed = activeLesson?.quiz
//       ? (quizResult?.passed ?? false)
//       : true
//     const isAssignmentDone = activeModule?.assignment
//       ? assignmentSubmitted
//       : true

//     return isVideoDone && isTextDone && isQuizPassed && isAssignmentDone
//   }, [
//     videoEnded,
//     textRead,
//     quizResult,
//     assignmentSubmitted,
//     activeLesson,
//     activeModule,
//   ])

//   const isModuleUnlocked = (moduleId: string) => {
//     if (!course || !dbEnrollment) return false
//     if (course.type === 'Free') return true

//     const currentModIndex = course.modules.findIndex((m) => m.id === moduleId)

//     if (currentModIndex === 0) return true

//     const previousModule = course.modules[currentModIndex - 1]

//     return dbEnrollment.completedModules.includes(previousModule.id)
//   }

//   const handleLessonSelection = (lesson: Lesson, targetModule: Module) => {
//     setActiveLesson(lesson)
//     setActiveModule(targetModule)

//     // Clear the assignment input buffer immediately on user switch
//     setAssignmentInputBuffer('')

//     setSelectedAnswers({})
//     setQuizSubmitted(false)
//     setQuizResult(null)
//     setActiveTab('content')
//     setContentTypeToggle(lesson.contentType === 'text' ? 'text' : 'video')
//     setSidebarOpen(false)

//     if (!user?._id || !courseId) return

//     startTransition(async () => {
//       const update = await updateEnrollmentProgressAction(user._id, courseId, {
//         currentModuleId: targetModule.id,
//         currentLessonId: lesson.id,
//       })

//       if (update.success && update.data) {
//         setDbEnrollment(update.data)
//       }
//     })
//   }

//   const handleAnswerSelect = (questionId: string, option: string) => {
//     // Use the new derived variable
//     if (isQuizSubmitted && quizResult?.passed) return

//     setAnswer(questionId, option)
//   }

//   const handleSubmitQuiz = async (quiz: Quiz, isModuleLevel = false) => {
//     if (!user?._id || !courseId) return

//     let correctCount = 0
//     const itemizedAnswers = quiz.questions.map((q) => {
//       const chosen = selectedAnswers[q.id] || ''
//       const isCorrect =
//         chosen.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
//       if (isCorrect) correctCount++
//       return { questionId: q.id, selectedOption: chosen, isCorrect }
//     })

//     const calculatedScore = Math.round(
//       (correctCount / quiz.questions.length) * 100,
//     )
//     const passedStatus = calculatedScore >= quiz.passingScore

//     // NEW: Update persistent store
//     setQuizResult({ score: calculatedScore, passed: passedStatus })

//     startTransition(async () => {
//       const updatesPayload: UpdatePayload = {
//         quizAttempt: {
//           quizId: quiz.id,
//           score: calculatedScore,
//           passed: passedStatus,
//           answers: itemizedAnswers.map((ans) => ({
//             questionId: ans.questionId,
//             selectedOption: ans.selectedOption,
//             isCorrect: ans.isCorrect,
//           })),
//         },
//       }

//       if (passedStatus) {
//         if (isModuleLevel && activeModule) {
//           updatesPayload.newCompletedModuleId = activeModule.id
//         } else if (activeLesson) {
//           updatesPayload.newCompletedLessonId = activeLesson.id
//         }
//       }

//       // Use the sanitized object
//       const syncResult = await updateEnrollmentProgressAction(
//         user._id,
//         courseId,
//         updatesPayload,
//       )
//       if (syncResult.success && syncResult.data) {
//         setDbEnrollment(syncResult.data)
//       }
//     })
//   }

//   const handleAssignmentSubmit = async () => {
//     // Read from assignmentInputBuffer instead of assignmentUrl state
//     if (!assignmentInputBuffer || !activeModule?.assignment || !user?._id) {
//       enqueueSnackbar('Please provide a valid assignment URL.', {
//         variant: 'warning',
//       })
//       return
//     }

//     const assignmentId = activeModule.assignment.id
//     const userId = user._id

//     setIsAssignmentSubmitting(true)

//     startTransition(async () => {
//       try {
//         const result = await updateEnrollmentProgressAction(userId, courseId, {
//           assignmentSubmission: {
//             assignmentId,
//             url: assignmentInputBuffer, // Use input buffer
//           },
//         })

//         if (result.success && result.data) {
//           setDbEnrollment(result.data)
//           setAssignmentInputBuffer('') // Reset local input buffer
//           enqueueSnackbar('Assignment submitted successfully!', {
//             variant: 'success',
//           })
//         } else {
//           throw new Error(result.message || 'Submission failed')
//         }
//       } catch (error) {
//         console.error('Assignment submission error:', error)
//         enqueueSnackbar('Failed to submit assignment. Please try again.', {
//           variant: 'error',
//         })
//       } finally {
//         setIsAssignmentSubmitting(false)
//       }
//     })
//   }

//   const handleMarkComplete = async () => {
//     if (!user?._id || !courseId || !activeLesson || !requirementsMet) return

//     startTransition(async () => {
//       const result = await updateEnrollmentProgressAction(user._id, courseId, {
//         newCompletedLessonId: activeLesson.id,
//       })

//       if (result.success && result.data) {
//         setDbEnrollment(result.data)
//       }
//     })
//   }

//   if (isCoursesLoading || !course) {
//     return (
//       <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
//         <div className="animate-pulse font-mono text-xs tracking-widest text-neutral-400">
//           INITIALIZING CLASSROOM...
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="flex flex-col h-[calc(100dvh-70px)] overflow-hidden bg-background text-foreground">
//       {/* DRAWER */}
//       <Drawer
//         opened={sidebarOpen}
//         onClose={() => setSidebarOpen(false)}
//         title={
//           <div className="flex flex-col px-5 py-3">
//             <span className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-black">
//               Course Outline
//             </span>

//             <span className="text-sm font-black line-clamp-2 mt-2">
//               {course.title}
//             </span>
//           </div>
//         }
//         padding={0}
//         size={340}
//         overlayProps={{
//           backgroundOpacity: 0.55,
//           blur: 4,
//         }}
//         classNames={{
//           content:
//             'bg-white dark:bg-[#0a0a0a] border-r border-neutral-200 dark:border-neutral-800',
//           header:
//             'border-b border-neutral-200 dark:border-neutral-800 px-5 py-4',
//           body: 'p-0 h-full',
//         }}
//       >
//         <div className="h-full flex flex-col overflow-hidden">
//           {/* PROGRESS */}
//           <div className="px-5 py-4 border-b border-neutral-200 dark:border-neutral-800">
//             <div className="flex items-center justify-between mb-2">
//               <span className="text-[11px] font-black uppercase tracking-widest text-neutral-400">
//                 Progress
//               </span>

//               <span className="text-xs font-black text-blue-600">
//                 {dbEnrollment?.progressPercentage || 0}%
//               </span>
//             </div>

//             <Progress
//               value={dbEnrollment?.progressPercentage || 0}
//               radius="xl"
//               size="md"
//             />
//           </div>

//           {/* MODULES */}
//           <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
//             {course.modules.map((mod) => {
//               const modUnlocked = isModuleUnlocked(mod.id)

//               return (
//                 <div
//                   key={mod.id}
//                   className={`${!modUnlocked ? 'opacity-50' : ''}`}
//                 >
//                   <div className="px-2 mb-2">
//                     <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
//                       {mod.title}
//                     </h3>
//                   </div>

//                   <div className="space-y-1.5">
//                     {mod.lessons.map((les) => {
//                       // const isUnlocked = checkIsLessonUnlocked(les.id, mod.id)

//                       const isCurrent = activeLesson?.id === les.id

//                       const isFinished =
//                         dbEnrollment?.completedLessons.includes(les.id)

//                       return (
//                         <button
//                           key={les.id}
//                           // disabled={!isUnlocked}
//                           onClick={() => {
//                             handleLessonSelection(les, mod)
//                             setSidebarOpen(false)
//                           }}
//                           className={`w-full text-left rounded-2xl p-3 transition-all duration-200 border ${
//                             isCurrent
//                               ? 'bg-blue-100 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900'
//                               : 'border-transparent hover:border-neutral-200 dark:hover:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900'
//                           }`}
//                         >
//                           <div className="flex gap-3 items-start">
//                             <div className="mt-0.5 shrink-0">
//                               {isFinished ? (
//                                 <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-500" />
//                               ) : (
//                                 <div className="w-4 h-4 rounded-full border border-neutral-400 dark:border-neutral-700" />
//                               )}
//                             </div>

//                             <div className="min-w-0 flex-1">
//                               <p className="text-sm font-semibold line-clamp-2">
//                                 {les.title}
//                               </p>

//                               <span className="block mt-1 text-[10px] font-black uppercase tracking-wider text-neutral-400">
//                                 {les.contentType} • {les.duration}
//                               </span>
//                             </div>
//                           </div>
//                         </button>
//                       )
//                     })}
//                   </div>
//                 </div>
//               )
//             })}
//           </div>
//         </div>
//       </Drawer>

//       {/* WORKSPACE HEADER */}
//       <header className="sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-800 bg-white/80 dark:bg-[#0a0a0a]/80 backdrop-blur-xl">
//         <div className="flex items-center justify-between gap-4 px-0 lg:px-8 py-4">
//           {/* TITLE */}
//           <div className="min-w-0">
//             <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-black truncate">
//               {activeModule?.title || 'Course Workspace'}
//             </p>

//             <h1 className="text-base sm:text-lg lg:text-2xl font-black tracking-tight truncate">
//               {activeLesson?.title || 'Learning Workspace'}
//             </h1>
//           </div>

//           {/* ACTIONS */}
//           <div className="flex items-center gap-2 shrink-0">
//             <button
//               onClick={() => setSidebarOpen(true)}
//               className="flex items-center gap-2 px-4 py-2 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 hover:bg-neutral-50 dark:hover:bg-neutral-900 transition-all cursor-pointer"
//             >
//               <BookOpen className="w-4 h-4" />

//               <span className="text-sm font-bold hidden sm:block">Lessons</span>
//             </button>
//           </div>
//         </div>

//         {/* TABS */}
//         <div className="px-0 lg:px-8 pb-4">
//           <div className="flex gap-2 overflow-x-auto scrollbar-none">
//             <button
//               onClick={() => setActiveTab('content')}
//               className={`px-5 py-2 rounded-2xl text-sm! font-bold whitespace-nowrap transition-all cursor-pointer ${
//                 activeTab === 'content'
//                   ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
//                   : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
//               }`}
//             >
//               Lesson
//             </button>

//             {(activeLesson?.quiz || (!activeLesson && activeModule?.quiz)) && (
//               <button
//                 onClick={() => setActiveTab('quiz')}
//                 className={`px-5 py-2 rounded-2xl text-sm! font-bold whitespace-nowrap transition-all cursor-pointer ${
//                   activeTab === 'quiz'
//                     ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
//                     : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
//                 }`}
//               >
//                 Quiz
//               </button>
//             )}

//             {activeModule?.assignment && (
//               <button
//                 onClick={() => setActiveTab('assignment')}
//                 className={`px-5 py-2 rounded-2xl text-sm! font-bold whitespace-nowrap transition-all cursor-pointer ${
//                   activeTab === 'assignment'
//                     ? 'bg-neutral-900 text-white dark:bg-white dark:text-black'
//                     : 'bg-neutral-100 dark:bg-neutral-900 hover:bg-neutral-200 dark:hover:bg-neutral-800'
//                 }`}
//               >
//                 Assignment
//               </button>
//             )}
//           </div>
//         </div>
//       </header>

//       {/* BODY */}
//       <div className="flex-1 overflow-hidden">
//         <div className="h-full overflow-y-auto">
//           <div className="max-w-5xl mx-auto py-5 lg:py-8">
//             {/* CONTENT TAB */}
//             {activeTab === 'content' && activeLesson && (
//               <div className="space-y-6 lg:space-y-8">
//                 {/* VIDEO */}
//                 {activeLesson.videoUrl && (
//                   <div className="overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-2xl">
//                     <div className="aspect-video w-full">
//                       {activeLesson.videoUrl.endsWith('.mp4') ||
//                       activeLesson.videoUrl.endsWith('.webm') ? (
//                         <video
//                           src={activeLesson.videoUrl}
//                           controls
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <iframe
//                           src={activeLesson.videoUrl}
//                           className="w-full h-full"
//                           allowFullScreen
//                         />
//                       )}
//                     </div>
//                   </div>
//                 )}

//                 {/* LESSON CONTENT */}
//                 <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-sm">
//                   <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
//                     {activeLesson.markdownBody || activeLesson.summary}
//                   </article>
//                 </div>

//                 {/* COMPLETE BUTTON */}
//                 {!dbEnrollment?.completedLessons.includes(activeLesson.id) && (
//                   <div className="flex justify-end">
//                     <button
//                       onClick={handleMarkComplete}
//                       disabled={isPending || !requirementsMet}
//                       className="w-full sm:w-auto px-8 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-sm! text-white font-black transition-all disabled:opacity-50 active:scale-[0.98]"
//                     >
//                       {isPending ? 'Updating...' : 'Mark Lesson Complete'}
//                     </button>
//                   </div>
//                 )}
//               </div>
//             )}

//             {/* QUIZ TAB */}
//             {activeTab === 'quiz' && (
//               <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-sm">
//                 {/* QUESTIONS */}
//                 <div className="space-y-8">
//                   {(activeLesson?.quiz || activeModule?.quiz)?.questions.map(
//                     (q, index) => {
//                       return (
//                         <div key={q.id} className="space-y-4">
//                           <h3 className="font-bold text-base lg:text-lg">
//                             {index + 1}. {q.question}
//                           </h3>
//                           <div className="grid gap-3">
//                             {q.options.map((option) => {
//                               const isSelected =
//                                 selectedAnswers[q.id] === option
//                               const isCorrectAnswer = option === q.correctAnswer

//                               // Visual Logic: Clear fallbacks
//                               let borderClass =
//                                 'border-neutral-200 dark:border-neutral-800'
//                               let bgClass = 'bg-white dark:bg-neutral-900'

//                               if (isQuizSubmitted) {
//                                 if (isCorrectAnswer) {
//                                   // Always paint the correct answer Green once submitted
//                                   borderClass = 'border-emerald-500'
//                                   bgClass =
//                                     'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
//                                 } else if (isSelected && !isCorrectAnswer) {
//                                   // If the user picked this option and it was wrong, paint it Red
//                                   borderClass = 'border-red-500'
//                                   bgClass =
//                                     'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200'
//                                 }
//                               } else if (isSelected) {
//                                 // Pre-submission active state blue accent border
//                                 borderClass = 'border-blue-500'
//                                 bgClass = 'bg-blue-50 dark:bg-blue-950/20'
//                               }

//                               return (
//                                 <button
//                                   key={option}
//                                   disabled={
//                                     isQuizSubmitted && quizResult?.passed
//                                   }
//                                   onClick={() =>
//                                     handleAnswerSelect(q.id, option)
//                                   }
//                                   className={`flex items-center justify-between p-4 rounded-2xl border ${borderClass} ${bgClass} transition-all`}
//                                 >
//                                   <span className="text-sm">{option}</span>
//                                 </button>
//                               )
//                             })}
//                           </div>
//                         </div>
//                       )
//                     },
//                   )}
//                 </div>
//                 {/* FOOTER ACTIONS */}
//                 {(!quizResult?.passed || !quizResult) && (
//                   <button
//                     onClick={() => {
//                       if (isQuizSubmitted && !quizResult?.passed) {
//                         // RETRY LOGIC: Clears local Zustand state so they can pick options again
//                         resetQuizState()
//                       } else {
//                         handleSubmitQuiz(
//                           (activeLesson?.quiz || activeModule?.quiz)!,
//                           !activeLesson,
//                         )
//                       }
//                     }}
//                     className={`w-full sm:w-auto px-8 py-2.5! text-sm! mt-5 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black font-black transition-all active:scale-[0.98] ${isQuizSubmitted && !quizResult?.passed ? 'hover:bg-neutral-700 dark:hover:bg-neutral-200 cursor-pointer' : 'hover:bg-neutral-700 dark:hover:bg-neutral-200 cursor-pointer'}`}
//                   >
//                     {isQuizSubmitted && !quizResult?.passed
//                       ? 'Try Again'
//                       : 'Submit Quiz'}
//                   </button>
//                 )}
//               </div>
//             )}
//             {/* ASSIGNMENT TAB */}
//             {activeTab === 'assignment' && activeModule?.assignment && (
//               <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-sm">
//                 <div className="space-y-8">
//                   <div>
//                     <h2 className="text-xl lg:text-2xl font-black tracking-tight">
//                       {activeModule.assignment.title}
//                     </h2>
//                     <p className="mt-4 text-sm sm:text-base leading-relaxed text-neutral-600 dark:text-neutral-300">
//                       {activeModule.assignment.problemStatement}
//                     </p>
//                   </div>

//                   <div className="space-y-4">
//                     <input
//                       type="url"
//                       placeholder="https://github.com/..."
//                       value={assignmentUrl} // Stays assignmentUrl (it's derived now!)
//                       onChange={(e) => setAssignmentInputBuffer(e.target.value)} // Changes buffer
//                       disabled={isAssignmentSubmitting || assignmentSubmitted}
//                       className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500"
//                     />

//                     <button
//                       onClick={handleAssignmentSubmit}
//                       disabled={isAssignmentSubmitting || assignmentSubmitted}
//                       className={`w-full sm:w-auto px-8 py-2.5 rounded-2xl text-sm! bg-amber-500 hover:bg-amber-400 text-black font-black transition-all active:scale-[0.98] disabled:opacity-50 ${assignmentSubmitted ? 'cursor-default' : 'cursor-pointer'}`}
//                     >
//                       {isAssignmentSubmitting
//                         ? 'Submitting Assignment...'
//                         : assignmentSubmitted
//                           ? 'Submitted'
//                           : 'Submit Assignment'}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }





// /app/(dashboard)/dashboard/courses/[courseId]/lessons/page.tsx

'use client'

import React, {
  useState,
  useEffect,
  useTransition,
  useMemo,
  useRef,
} from 'react'
import { useParams, useRouter } from 'next/navigation'
import {
  getEnrollmentProgressAction,
  updateEnrollmentProgressAction,
} from '@/app/services/enrollmentActions'
import { useAuthStore } from '@/app/store/authStore'
import { useCourses } from '@/app/hooks/useCourses'
import { Module, Lesson, Quiz } from '@/app/types'
import { Drawer, Progress } from '@mantine/core'
import { BookOpen, CheckCircle2, Lock, AlertCircle } from 'lucide-react'
import { useQuizStore } from '@/app/store/quizStore'
import {
  QuizAttemptInput,
  SerializedEnrollment,
  UpdatePayload,
} from '@/app/types/enrollment'
import { useSnackbar } from 'notistack'

export default function CourseWorkspacePage() {
  const params = useParams()
  const router = useRouter()

  const { user } = useAuthStore()
  const { courses, loading: isCoursesLoading } = useCourses()
  const { enqueueSnackbar } = useSnackbar()

  const {
    selectedAnswers,
    quizResult,
    setAnswer,
    setQuizResult,
    resetQuizState,
    setSelectedAnswers,
    setQuizSubmitted,
  } = useQuizStore()

  const isQuizSubmitted = !!quizResult
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
  const [activeTab, setActiveTab] = useState<'content' | 'quiz' | 'assignment'>(
    'content',
  )

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [isAssignmentSubmitting, setIsAssignmentSubmitting] = useState(false)

  const [videoEnded, setVideoEnded] = useState(false)
  const [textRead, setTextRead] = useState(false)
  const observerTarget = useRef(null)

  const [assignmentInputBuffer, setAssignmentInputBuffer] = useState('')

  // Derive if the current module's assignment has been submitted
  const assignmentSubmissionInfo = useMemo(() => {
    if (!dbEnrollment || !activeModule?.assignment) return null
    return (
      dbEnrollment.assignmentSubmissions?.find(
        (s) => s.assignmentId === activeModule.assignment?.id,
      ) || null
    )
  }, [dbEnrollment, activeModule])

  const assignmentSubmitted = !!assignmentSubmissionInfo

  const assignmentUrl = useMemo(() => {
    if (assignmentSubmitted && assignmentSubmissionInfo) {
      return assignmentSubmissionInfo.submissionUrl
    }
    return assignmentInputBuffer
  }, [assignmentSubmitted, assignmentSubmissionInfo, assignmentInputBuffer])

  // Track Text Read State
  useEffect(() => {
    if (activeLesson?.contentType !== 'text') return

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) setTextRead(true)
      },
      { threshold: 1.0 },
    )

    if (observerTarget.current) observer.observe(observerTarget.current)
    return () => observer.disconnect()
  }, [activeLesson])

  // Sync initial enrollment position data
  useEffect(() => {
    async function syncEnrollment() {
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
          setAssignmentInputBuffer('')
        }
      } catch (err) {
        console.error('Workspace tracking sync fault:', err)
      }
    }
    syncEnrollment()
  }, [courseId, user?._id, dbEnrollment, course])

  // Hydrate quiz state from dbEnrollment records
  useEffect(() => {
    const activeQuizId = activeLesson?.quiz?.id || activeModule?.quiz?.id

    if (!dbEnrollment || !activeQuizId) {
      resetQuizState()
      return
    }

    const history =
      dbEnrollment.quizAttempts?.filter(
        (attempt) => attempt.quizId === activeQuizId,
      ) || []

    if (history.length > 0) {
      const latestAttempt = history[history.length - 1]
      const answersMap: Record<string, string> = {}
      latestAttempt.answers.forEach((ans) => {
        answersMap[ans.questionId] = ans.selectedOption
      })

      setSelectedAnswers(answersMap)
      setQuizResult({
        score: latestAttempt.score,
        passed: latestAttempt.passed,
      })
      setQuizSubmitted(true)
    } else {
      resetQuizState()
    }
  }, [
    activeLesson?.id,
    activeModule?.id,
    dbEnrollment,
    setSelectedAnswers,
    setQuizResult,
    setQuizSubmitted,
    resetQuizState,
  ])

  // Verify if ALL lessons in the current module are marked as completed
  const isModuleLessonsComplete = useMemo(() => {
    if (!activeModule || !dbEnrollment) return false
    return activeModule.lessons.every((lesson) =>
      dbEnrollment.completedLessons.includes(lesson.id),
    )
  }, [activeModule, dbEnrollment])

  // Check if current lesson elements are ready
  const requirementsMet = useMemo(() => {
    const isVideoDone =
      activeLesson?.contentType === 'video' ? videoEnded : true
    const isTextDone = activeLesson?.contentType === 'text' ? textRead : true
    const isQuizPassed = activeLesson?.quiz
      ? (quizResult?.passed ?? false)
      : true

    return isVideoDone && isTextDone && isQuizPassed
  }, [videoEnded, textRead, quizResult, activeLesson])

  const isModuleUnlocked = (moduleId: string) => {
    if (!course || !dbEnrollment) return false
    if (course.type === 'Free') return true

    const currentModIndex = course.modules.findIndex((m) => m.id === moduleId)
    if (currentModIndex === 0) return true

    const previousModule = course.modules[currentModIndex - 1]
    return dbEnrollment.completedModules.includes(previousModule.id)
  }

  const handleLessonSelection = (lesson: Lesson, targetModule: Module) => {
    setActiveLesson(lesson)
    setActiveModule(targetModule)
    setAssignmentInputBuffer('')
    setSelectedAnswers({})
    setQuizSubmitted(false)
    setQuizResult(null)
    setActiveTab('content')
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
    if (isQuizSubmitted && quizResult?.passed) return
    setAnswer(questionId, option)
  }

  const handleSubmitQuiz = async (quiz: Quiz, isModuleLevel = false) => {
    if (!user?._id || !courseId) return

    let correctCount = 0
    const itemizedAnswers = quiz.questions.map((q) => {
      const chosen = selectedAnswers[q.id] || ''
      const isCorrect =
        chosen.trim().toLowerCase() === q.correctAnswer.trim().toLowerCase()
      if (isCorrect) correctCount++
      return { questionId: q.id, selectedOption: chosen, isCorrect }
    })

    const calculatedScore = Math.round(
      (correctCount / quiz.questions.length) * 100,
    )
    const passedStatus = calculatedScore >= quiz.passingScore

    setQuizResult({ score: calculatedScore, passed: passedStatus })

    startTransition(async () => {
      const updatesPayload: UpdatePayload = {
        quizAttempt: {
          quizId: quiz.id,
          score: calculatedScore,
          passed: passedStatus,
          answers: itemizedAnswers.map((ans) => ({
            questionId: ans.questionId,
            selectedOption: ans.selectedOption,
            isCorrect: ans.isCorrect,
          })),
        },
      }

      if (passedStatus) {
        if (isModuleLevel && activeModule) {
          // Double verify module requirements are cleared before permitting module completion flag saving
          if (isModuleLessonsComplete) {
            updatesPayload.newCompletedModuleId = activeModule.id
          }
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
        enqueueSnackbar(
          passedStatus
            ? 'Quiz passed successfully!'
            : 'Quiz not passed. Try again.',
          {
            variant: passedStatus ? 'success' : 'error',
          },
        )
      }
    })
  }

  const handleAssignmentSubmit = async () => {
    if (!assignmentInputBuffer || !activeModule?.assignment || !user?._id) {
      enqueueSnackbar('Please provide a valid assignment URL.', {
        variant: 'warning',
      })
      return
    }

    // Ensure all module lessons are fully marked finished before taking file assignments
    if (!isModuleLessonsComplete) {
      enqueueSnackbar(
        'Please complete all lessons inside this module before uploading files.',
        { variant: 'error' },
      )
      return
    }

    const assignmentId = activeModule.assignment.id
    const userId = user._id
    setIsAssignmentSubmitting(true)

    startTransition(async () => {
      try {
        const result = await updateEnrollmentProgressAction(userId, courseId, {
          assignmentSubmission: {
            assignmentId,
            url: assignmentInputBuffer,
          },
        })

        if (result.success && result.data) {
          setDbEnrollment(result.data)
          setAssignmentInputBuffer('')
          enqueueSnackbar('Assignment submitted successfully!', {
            variant: 'success',
          })
        } else {
          throw new Error(result.message || 'Submission failed')
        }
      } catch (error) {
        console.error(error)
        enqueueSnackbar('Failed to submit assignment.', { variant: 'error' })
      } finally {
        setIsAssignmentSubmitting(false)
      }
    })
  }

  const handleMarkComplete = async () => {
    if (!user?._id || !courseId || !activeLesson || !requirementsMet) return

    startTransition(async () => {
      const result = await updateEnrollmentProgressAction(user._id, courseId, {
        newCompletedLessonId: activeLesson.id,
      })

      if (result.success && result.data) {
        setDbEnrollment(result.data)
        enqueueSnackbar('Lesson marked as complete!', { variant: 'success' })
      }
    })
  }

  if (isCoursesLoading || !course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="animate-pulse font-mono text-xs tracking-widest text-neutral-400">
          INITIALIZING CLASSROOM...
        </div>
      </div>
    )
  }

  const currentLessonIsCompleted = activeLesson
    ? dbEnrollment?.completedLessons.includes(activeLesson.id)
    : false

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
        overlayProps={{ backgroundOpacity: 0.55, blur: 4 }}
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
                  className={`${!modUnlocked ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <div className="px-2 mb-2 flex items-center justify-between">
                    <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-neutral-400">
                      {mod.title}
                    </h3>
                    {!modUnlocked && (
                      <Lock className="w-3 h-3 text-neutral-400" />
                    )}
                  </div>

                  <div className="space-y-1.5">
                    {mod.lessons.map((les) => {
                      const isCurrent = activeLesson?.id === les.id
                      const isFinished =
                        dbEnrollment?.completedLessons.includes(les.id)

                      return (
                        <button
                          key={les.id}
                          onClick={() => handleLessonSelection(les, mod)}
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
        <div className="flex items-center justify-between gap-4 px-4 lg:px-8 py-4">
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-black truncate">
              {activeModule?.title || 'Course Workspace'}
            </p>
            <h1 className="text-base sm:text-lg lg:text-2xl font-black tracking-tight truncate">
              {activeLesson?.title || 'Learning Workspace'}
            </h1>
          </div>

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
        <div className="px-4 lg:px-8 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-5 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
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
                className={`px-5 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
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
                className={`px-5 py-2 rounded-2xl text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
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
        <div className="h-full overflow-y-auto px-4">
          <div className="max-w-5xl mx-auto py-5 lg:py-8">
            {/* CONTENT TAB */}
            {activeTab === 'content' && activeLesson && (
              <div className="space-y-6 lg:space-y-8">
                {activeLesson.videoUrl && (
                  <div className="overflow-hidden rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-neutral-950 shadow-2xl">
                    <div className="aspect-video w-full">
                      {activeLesson.videoUrl.endsWith('.mp4') ||
                      activeLesson.videoUrl.endsWith('.webm') ? (
                        <video
                          src={activeLesson.videoUrl}
                          controls
                          onEnded={() => setVideoEnded(true)}
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

                <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-sm">
                  <article className="prose prose-sm sm:prose-base lg:prose-lg dark:prose-invert max-w-none">
                    {activeLesson.markdownBody || activeLesson.summary}
                  </article>
                  {activeLesson.contentType === 'text' && (
                    <div
                      ref={observerTarget}
                      className="h-2 w-full bg-transparent"
                    />
                  )}
                </div>

                {/* LESSON CONTROL WORKFLOW BOX */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-6">
                  <div className="text-center sm:text-left">
                    <h4 className="text-sm font-black uppercase tracking-wider">
                      Lesson Status
                    </h4>
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                      {currentLessonIsCompleted
                        ? '✨ Completed & verified.'
                        : 'Finish video, text content and questions to clear.'}
                    </p>
                  </div>
                  <button
                    onClick={handleMarkComplete}
                    disabled={
                      isPending || !requirementsMet || currentLessonIsCompleted
                    }
                    className={`w-full sm:w-auto px-8 py-3 rounded-2xl text-sm font-black transition-all active:scale-[0.98] ${
                      currentLessonIsCompleted
                        ? 'bg-neutral-200 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400 cursor-not-allowed'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white disabled:opacity-40'
                    }`}
                  >
                    {isPending
                      ? 'Updating...'
                      : currentLessonIsCompleted
                        ? 'Lesson Completed ✓'
                        : 'Mark Lesson Complete'}
                  </button>
                </div>
              </div>
            )}

            {/* QUIZ TAB */}
            {activeTab === 'quiz' && (
              <div className="bg-white dark:bg-neutral-950 border border-neutral-200 dark:border-neutral-800 rounded-3xl p-5 sm:p-7 lg:p-10 shadow-sm">
                <div className="space-y-8">
                  {(activeLesson?.quiz || activeModule?.quiz)?.questions.map(
                    (q, index) => {
                      return (
                        <div key={q.id} className="space-y-4">
                          <h3 className="font-bold text-base lg:text-lg">
                            {index + 1}. {q.question}
                          </h3>
                          <div className="grid gap-3">
                            {q.options.map((option) => {
                              const isSelected =
                                selectedAnswers[q.id] === option
                              const isCorrectAnswer = option === q.correctAnswer

                              let borderClass =
                                'border-neutral-200 dark:border-neutral-800'
                              let bgClass = 'bg-white dark:bg-neutral-900'

                              if (isQuizSubmitted) {
                                if (isCorrectAnswer) {
                                  borderClass = 'border-emerald-500'
                                  bgClass =
                                    'bg-emerald-50 dark:bg-emerald-950/20 text-emerald-900 dark:text-emerald-200'
                                } else if (isSelected && !isCorrectAnswer) {
                                  borderClass = 'border-red-500'
                                  bgClass =
                                    'bg-red-50 dark:bg-red-950/20 text-red-900 dark:text-red-200'
                                }
                              } else if (isSelected) {
                                borderClass = 'border-blue-500'
                                bgClass = 'bg-blue-50 dark:bg-blue-950/20'
                              }

                              return (
                                <button
                                  key={option}
                                  disabled={
                                    isQuizSubmitted && quizResult?.passed
                                  }
                                  onClick={() =>
                                    handleAnswerSelect(q.id, option)
                                  }
                                  className={`flex items-center justify-between p-4 rounded-2xl border text-left ${borderClass} ${bgClass} transition-all`}
                                >
                                  <span className="text-sm">{option}</span>
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )
                    },
                  )}
                </div>

                {(!quizResult?.passed || !quizResult) && (
                  <button
                    onClick={() => {
                      if (isQuizSubmitted && !quizResult?.passed) {
                        resetQuizState()
                      } else {
                        handleSubmitQuiz(
                          (activeLesson?.quiz || activeModule?.quiz)!,
                          !activeLesson,
                        )
                      }
                    }}
                    className="w-full sm:w-auto px-8 py-3 text-sm mt-6 rounded-2xl bg-neutral-900 text-white dark:bg-white dark:text-black font-black transition-all hover:bg-neutral-800 dark:hover:bg-neutral-100 active:scale-[0.98]"
                  >
                    {isQuizSubmitted && !quizResult?.passed
                      ? 'Try Again'
                      : 'Submit Quiz'}
                  </button>
                )}
              </div>
            )}

            {/* ASSIGNMENT TAB */}
            {activeTab === 'assignment' && activeModule?.assignment && (
              <div className="space-y-6">
                {/* LOCKED BANNER IF MODULE LESSONS ARE REMAINING */}
                {!isModuleLessonsComplete && (
                  <div className="flex gap-3 items-center border border-amber-200 dark:border-amber-900/40 bg-amber-50 dark:bg-amber-950/20 p-4 rounded-2xl text-amber-900 dark:text-amber-200">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    <p className="text-xs sm:text-sm font-semibold">
                      <strong>Module Requirement Locked:</strong> You must fully
                      complete all lessons in this module outline before you can
                      upload task files or submit assignments.
                    </p>
                  </div>
                )}

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
                        onChange={(e) =>
                          setAssignmentInputBuffer(e.target.value)
                        }
                        disabled={
                          isAssignmentSubmitting ||
                          assignmentSubmitted ||
                          !isModuleLessonsComplete
                        }
                        className="w-full rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 px-5 py-4 text-sm outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-40"
                      />

                      <button
                        onClick={handleAssignmentSubmit}
                        disabled={
                          isAssignmentSubmitting ||
                          assignmentSubmitted ||
                          !isModuleLessonsComplete
                        }
                        className="w-full sm:w-auto px-8 py-3 rounded-2xl text-sm bg-amber-500 hover:bg-amber-400 text-black font-black transition-all active:scale-[0.98] disabled:opacity-40 disabled:pointer-events-none"
                      >
                        {isAssignmentSubmitting
                          ? 'Submitting Assignment...'
                          : assignmentSubmitted
                            ? 'Submitted ✓'
                            : 'Submit Assignment'}
                      </button>
                    </div>
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