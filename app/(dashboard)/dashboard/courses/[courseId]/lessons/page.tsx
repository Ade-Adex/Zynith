// /app/(dashboard)/dashboard/courses/[courseId]/lessons/page.tsx

'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCourses } from '@/app/hooks/useCourses'
import { useAuthStore } from '@/app/store/authStore'
import {
  getEnrollmentProgressAction,
  SerializedEnrollment,
} from '@/app/services/enrollmentActions'
import { Course, Module, Lesson } from '@/app/types'
import { UserType } from '@/app/types/user'
import {
  Loader,
  Text,
  Badge,
  ScrollArea,
  Collapse,
  UnstyledButton,
  Group,
  ThemeIcon,
  Paper,
} from '@mantine/core'
import {
  Play,
  FileText,
  ChevronDown,
  ChevronRight,
  ArrowLeft,
  HelpCircle,
  FolderLock,
  FileCode,
} from 'lucide-react'

export default function CourseLessonsWorkspace() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  // Global Store & States
  const store = useAuthStore()
  const user = store.user as UserType | null | undefined
  const { courses, loading: coursesLoading } = useCourses()

  // Live Database Sync States
  const [dbEnrollment, setDbEnrollment] = useState<SerializedEnrollment | null>(
    null,
  )
  const [enrollmentLoading, setEnrollmentLoading] = useState<boolean>(true)

  // Functional Workspace Active Engine
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null)
  const [activeModuleId, setActiveModuleId] = useState<string | null>(null)
  const [expandedModules, setExpandedModules] = useState<
    Record<string, boolean>
  >({})

  // Ref locks to secure single-fire state setups and eliminate cascading render loops
  const progressLoadedRef = useRef<boolean>(false)

  // Find exact targeted course information
  const course: Course | undefined = courses.find(
    (c) => String(c._id) === String(courseId),
  )

  useEffect(() => {
    async function syncWorkspaceContext() {
      if (!user?._id || !courseId || user._id === 'undefined') return

      try {
        const result = await getEnrollmentProgressAction(
          String(user._id),
          courseId,
        )
        if (result.success) {
          setDbEnrollment(result.data)
        }
      } catch (err) {
        console.error('Failed to resolve database progress layer:', err)
      } finally {
        // Use a timeout to push the state update out of the render phase
        setTimeout(() => setEnrollmentLoading(false), 0)
      }
    }

    // Guard clause
    if (coursesLoading) return

    if (course?.type === 'Free') {
      setTimeout(() => setEnrollmentLoading(false), 0)
    } else if (course?.type === 'Premium') {
      syncWorkspaceContext()
    }
  }, [user?._id, courseId, coursesLoading, course?.type])
  // 2. Process routing checkpoints and baseline layout distributions cleanly
  useEffect(() => {
    if (
      coursesLoading ||
      enrollmentLoading ||
      !course ||
      progressLoadedRef.current
    )
      return

    // Security Interceptor: Redirect if Premium and no active enrollment document returned
    if (course.type === 'Premium' && !dbEnrollment) {
      router.push(`/courses/${courseId}`)
      return
    }

    // Auto-select baseline layout or continuous lesson state from db parameters
    if (course.modules && course.modules.length > 0) {
      let targetModule = course.modules[0]
      let targetLesson = targetModule.lessons && targetModule.lessons[0]

      const currentModuleIdFromDb = dbEnrollment?.currentModuleId
      const currentLessonIdFromDb = dbEnrollment?.currentLessonId

      if (currentModuleIdFromDb) {
        const matchingMod = course.modules.find(
          (m) => String(m.id) === String(currentModuleIdFromDb),
        )
        if (matchingMod) {
          targetModule = matchingMod
          if (matchingMod.lessons && matchingMod.lessons.length > 0) {
            const matchingLes = matchingMod.lessons.find(
              (l) => String(l.id) === String(currentLessonIdFromDb),
            )
            targetLesson = matchingLes || matchingMod.lessons[0]
          }
        }
      }

      if (targetLesson) {
        progressLoadedRef.current = true // Set ref lock immediately before scheduling state mutations

        // Using queueMicrotask or setTimeout breaks the synchronous render cascade rule beautifully
        queueMicrotask(() => {
          setActiveLesson(targetLesson)
          setActiveModuleId(targetModule.id)
          setExpandedModules((prev) => ({ ...prev, [targetModule.id]: true }))
        })
      }
    }
  }, [
    course,
    dbEnrollment,
    coursesLoading,
    enrollmentLoading,
    courseId,
    router,
  ])

  const toggleModuleAccordion = (modId: string) => {
    setExpandedModules((prev) => ({ ...prev, [modId]: !prev[modId] }))
  }

  // Unified loading screen handling synchronization metrics
  const isHydrating =
    coursesLoading || (enrollmentLoading && course?.type === 'Premium')

  if (isHydrating || !course) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-slate-950 text-white">
        <Loader size="md" color="blue" variant="dots" />
        <Text
          size="xs"
          fw={850}
          className="uppercase tracking-[0.25em] text-slate-500"
        >
          Syncing Content Vault...
        </Text>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans selection:bg-blue-500/30 py-24">
      {/* Top Application Ribbon */}
      <header className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-slate-800 rounded-xl transition-all text-slate-400 hover:text-white cursor-pointer"
          >
            <ArrowLeft size={16} />
          </button>
          <div className="border-l border-slate-800 h-6 hidden sm:block" />
          <div>
            <h1 className="text-xs sm:text-sm font-black tracking-tight uppercase truncate max-w-[240px] sm:max-w-md text-slate-200">
              {course.title}
            </h1>
            <Text
              size="10px"
              fw={700}
              className="text-blue-500 uppercase tracking-widest hidden sm:block"
            >
              Instructor: {course.instructor}
            </Text>
          </div>
        </div>
        <Badge
          variant="filled"
          color="blue"
          radius="sm"
          className="font-black tracking-widest text-[9px] uppercase"
        >
          {course.type === 'Premium' ? 'Premium Access' : 'Free Class'}
        </Badge>
      </header>

      {/* Main Workspace Frame split into Video Content & Sidebar Navigation */}
      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {/* Playback & Core Material Viewer Viewport Pane */}
        <main className="flex-1 overflow-y-auto bg-slate-950 p-4 sm:p-8">
          {activeLesson ? (
            <div className="max-w-4xl mx-auto space-y-8">
              {/* Media Renderer Window */}
              {activeLesson.contentType !== 'text' && activeLesson.videoUrl && (
                <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-2xl bg-black border border-slate-800 relative group">
                  <iframe
                    src={activeLesson.videoUrl}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Lesson Text Header Context */}
              <div className="border-b border-slate-800 pb-6">
                <Group justify="space-between" align="start">
                  <div>
                    <Badge
                      variant="dot"
                      color="blue"
                      className="text-[9px] uppercase font-bold tracking-wider mb-2"
                    >
                      {activeLesson.duration} Runtime Unit
                    </Badge>
                    <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">
                      {activeLesson.title}
                    </h2>
                  </div>
                </Group>
                <p className="text-sm text-slate-400 mt-3 font-medium leading-relaxed max-w-2xl">
                  {activeLesson.summary}
                </p>
              </div>

              {/* Lesson Document/Body Section */}
              {activeLesson.markdownBody && (
                <Paper className="bg-slate-900/40 border border-slate-800/80 rounded-2xl p-6 sm:p-8 shadow-sm">
                  <div className="prose prose-invert prose-slate max-w-none prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight prose-p:text-slate-300 prose-p:leading-relaxed prose-code:text-blue-400">
                    <div className="whitespace-pre-line text-sm sm:text-base font-normal">
                      {activeLesson.markdownBody}
                    </div>
                  </div>
                </Paper>
              )}

              {/* Supplemental Task Interceptors for Quizzes or Assignments */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                {activeLesson.quiz && (
                  <Paper
                    withBorder
                    p="lg"
                    className="bg-slate-900/20 border-slate-800 rounded-xl flex items-start gap-4"
                  >
                    <ThemeIcon
                      color="blue"
                      variant="light"
                      size="lg"
                      radius="md"
                    >
                      <HelpCircle size={18} />
                    </ThemeIcon>
                    <div>
                      <Text
                        size="sm"
                        fw={800}
                        className="text-white uppercase tracking-tight"
                      >
                        Lesson Challenge Quiz
                      </Text>
                      <Text
                        size="xs"
                        c="dimmed"
                        className="mt-1 font-medium mb-3"
                      >
                        Test comprehension to secure reward points.
                      </Text>
                      <button className="text-[10px] bg-blue-600 font-black tracking-widest text-white uppercase px-4 py-1.5 rounded-lg hover:bg-blue-500 transition-all cursor-pointer">
                        Initialize Quiz
                      </button>
                    </div>
                  </Paper>
                )}
                {activeLesson.isDownloadable && activeLesson.downloadUrl && (
                  <Paper
                    withBorder
                    p="lg"
                    className="bg-slate-900/20 border-slate-800 rounded-xl flex items-start gap-4"
                  >
                    <ThemeIcon
                      color="green"
                      variant="light"
                      size="lg"
                      radius="md"
                    >
                      <FileCode size={18} />
                    </ThemeIcon>
                    <div>
                      <Text
                        size="sm"
                        fw={800}
                        className="text-white uppercase tracking-tight"
                      >
                        Source Resources
                      </Text>
                      <Text
                        size="xs"
                        c="dimmed"
                        className="mt-1 font-medium mb-3"
                      >
                        Local deployment project material attachments.
                      </Text>
                      <a
                        href={activeLesson.downloadUrl}
                        download
                        className="inline-block text-[10px] bg-slate-800 font-black tracking-widest text-slate-200 uppercase px-4 py-1.5 rounded-lg hover:bg-slate-700 transition-all"
                      >
                        Fetch Files
                      </a>
                    </div>
                  </Paper>
                )}
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <FolderLock
                size={36}
                className="text-slate-700 mb-2 animate-pulse"
              />
              <Text
                size="sm"
                fw={800}
                className="text-slate-400 uppercase tracking-widest"
              >
                No Lesson Segment Selected
              </Text>
            </div>
          )}
        </main>

        {/* Course Index & Progression Navigation Drawer Bar Panel */}
        <aside className="w-full lg:w-80 border-t lg:border-t-0 lg:border-l border-slate-800 bg-slate-900 flex flex-col h-[50vh] lg:h-auto">
          <div className="p-4 border-b border-slate-800 bg-slate-900/50">
            <Text
              size="xs"
              fw={900}
              className="text-slate-400 uppercase tracking-widest"
            >
              Course Structure Syllabus
            </Text>
          </div>

          <ScrollArea className="flex-1 p-3">
            <div className="space-y-2">
              {course.modules?.map((mod: Module, modIndex: number) => {
                const isExpanded = !!expandedModules[mod.id]
                return (
                  <div
                    key={mod.id}
                    className="border border-slate-800/60 rounded-xl overflow-hidden bg-slate-950/20"
                  >
                    {/* Module Accordion Interactive Header */}
                    <UnstyledButton
                      onClick={() => toggleModuleAccordion(mod.id)}
                      className="w-full p-3.5 flex items-center justify-between gap-2 hover:bg-slate-800/40 transition-all"
                    >
                      <div className="flex-1 min-w-0">
                        <Text
                          size="10px"
                          fw={800}
                          className="text-blue-500 uppercase tracking-wider block mb-0.5"
                        >
                          Module {modIndex + 1}
                        </Text>
                        <Text
                          size="xs"
                          fw={800}
                          className="text-slate-200 uppercase truncate leading-snug"
                        >
                          {mod.title}
                        </Text>
                      </div>
                      {isExpanded ? (
                        <ChevronDown
                          size={14}
                          className="text-slate-500 flex-shrink-0"
                        />
                      ) : (
                        <ChevronRight
                          size={14}
                          className="text-slate-500 flex-shrink-0"
                        />
                      )}
                    </UnstyledButton>

                    {/* <Collapse opened={!!isExpanded}>
                      <div className="bg-slate-900/60 p-1.5 border-t border-slate-800/40 space-y-1">
                        {mod.lessons?.map((les: Lesson) => {
                          const isCurrent = activeLesson?.id === les.id
                          return (
                            <UnstyledButton
                              key={les.id}
                              onClick={() => {
                                setActiveLesson(les)
                                setActiveModuleId(mod.id)
                              }}
                              className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
                              }`}
                            >
                              <div className="mt-0.5">
                                {les.contentType === 'video' ||
                                les.contentType === 'hybrid' ? (
                                  <Play
                                    size={12}
                                    className={
                                      isCurrent
                                        ? 'text-blue-400 fill-blue-400'
                                        : 'text-slate-500'
                                    }
                                  />
                                ) : (
                                  <FileText
                                    size={12}
                                    className={
                                      isCurrent
                                        ? 'text-blue-400'
                                        : 'text-slate-500'
                                    }
                                  />
                                )}
                              </div>
                              <div className="flex-1 min-w-0">
                                <Text
                                  size="xs"
                                  fw={700}
                                  className={`uppercase truncate calculation-layout ${
                                    isCurrent
                                      ? 'text-blue-400 font-extrabold'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {les.title}
                                </Text>
                                <Text
                                  size="10px"
                                  c="dimmed"
                                  className="font-semibold mt-0.5"
                                >
                                  {les.duration}
                                </Text>
                              </div>
                            </UnstyledButton>
                          )
                        })}
                      </div>
                    </Collapse> */}

                    {isExpanded && (
                      <div className="bg-slate-900/60 p-1.5 border-t border-slate-800/40 space-y-1">
                        {mod.lessons?.map((les: Lesson) => {
                          const isCurrent = activeLesson?.id === les.id

                          return (
                            <UnstyledButton
                              key={les.id}
                              onClick={() => {
                                setActiveLesson(les)
                                setActiveModuleId(mod.id)
                              }}
                              className={`w-full p-2.5 rounded-lg flex items-start gap-3 transition-all cursor-pointer ${
                                isCurrent
                                  ? 'bg-blue-600/15 border border-blue-500/30 text-white'
                                  : 'hover:bg-slate-800/50 text-slate-400 hover:text-slate-200 border border-transparent'
                              }`}
                            >
                              <div className="mt-0.5">
                                {les.contentType === 'video' ||
                                les.contentType === 'hybrid' ? (
                                  <Play
                                    size={12}
                                    className={
                                      isCurrent
                                        ? 'text-blue-400 fill-blue-400'
                                        : 'text-slate-500'
                                    }
                                  />
                                ) : (
                                  <FileText
                                    size={12}
                                    className={
                                      isCurrent
                                        ? 'text-blue-400'
                                        : 'text-slate-500'
                                    }
                                  />
                                )}
                              </div>

                              <div className="flex-1 min-w-0">
                                <Text
                                  size="xs"
                                  fw={700}
                                  className={`uppercase truncate calculation-layout ${
                                    isCurrent
                                      ? 'text-blue-400 font-extrabold'
                                      : 'text-slate-300'
                                  }`}
                                >
                                  {les.title}
                                </Text>

                                <Text
                                  size="10px"
                                  c="dimmed"
                                  className="font-semibold mt-0.5"
                                >
                                  {les.duration}
                                </Text>
                              </div>
                            </UnstyledButton>
                          )
                        })}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </ScrollArea>
        </aside>
      </div>
    </div>
  )
}
