// /app/(dashboard)/learning/page.tsx

'use client'

import React, { useMemo, useState, useEffect } from 'react'
import Link from 'next/link'
import { SimpleGrid, Text, Tabs, Center, Loader } from '@mantine/core'
import { CourseCard } from '@/app/components/CourseCard'
import { useCourses } from '@/app/hooks/useCourses'
import { useAuthStore } from '@/app/store/authStore'
import {
  getEnrollmentProgressAction,
  SerializedEnrollment,
} from '@/app/services/enrollmentActions'
import { Course } from '@/app/types'

interface DashboardUserExtension {
  _id: string
  wishlist?: string[]
}

interface ExtendedCourseInstance extends Course {
  progress: number
}

export default function MyLearningPage() {
  const { courses, loading: coursesLoading } = useCourses()
  const { user, isAuthenticated } = useAuthStore()

  const [activeTab, setActiveTab] = useState<string | null>('active')
  const [enrollments, setEnrollments] = useState<SerializedEnrollment[]>([])

  // Track operational network sync statuses cleanly without synchronous mount side effects
  const [isFetchingAction, setIsFetchingAction] = useState<boolean>(false)

  // Fetch real-time active tracks via Server Actions
  useEffect(() => {
    // 1. Enforce strict type isolation on the local pointer
    const userId: string | undefined = user?._id

    // 2. Return early if prerequisites are missing, avoiding any state manipulation
    if (!userId || !courses || courses.length === 0) {
      return
    }

    let isMounted = true

    async function aggregateWorkspaceEnrollments() {
      try {
        if (isMounted) setIsFetchingAction(true)

        // 3. Create a stable reference inside the loop that TypeScript knows cannot change
        const currentUserId = userId as string

        const trackPromises = courses.map(async (course) => {
          const res = await getEnrollmentProgressAction(
            currentUserId,
            String(course._id),
          )
          return res.success && res.data ? res.data : null
        })

        const resolvedEnrollments = await Promise.all(trackPromises)
        const validEnrollments = resolvedEnrollments.filter(
          (item): item is SerializedEnrollment => item !== null,
        )

        if (isMounted) {
          setEnrollments(validEnrollments)
        }
      } catch (err) {
        console.error(
          'Failed to aggregate collection tracks directly through service context:',
          err,
        )
      } finally {
        if (isMounted) {
          setIsFetchingAction(false)
        }
      }
    }

    aggregateWorkspaceEnrollments()

    return () => {
      isMounted = false
    }
  }, [user?._id, courses])

  // Cross-reference DB collections against active course catalog
  const learningMatrix = useMemo(() => {
    if (!courses || courses.length === 0) {
      return { active: [], completed: [], wishlist: [] }
    }

    const enrollmentMap = new Map<string, SerializedEnrollment>(
      enrollments.map((e) => [String(e.courseId), e]),
    )

    const activeList: ExtendedCourseInstance[] = []
    const completedList: ExtendedCourseInstance[] = []

    courses.forEach((course) => {
      const enrollmentRecord = enrollmentMap.get(String(course._id))
      if (enrollmentRecord) {
        const progressVal = enrollmentRecord.progressPercentage ?? 0
        const bundledData: ExtendedCourseInstance = {
          ...course,
          progress: progressVal,
        }

        if (enrollmentRecord.status === 'completed' || progressVal === 100) {
          completedList.push(bundledData)
        } else {
          activeList.push(bundledData)
        }
      }
    })

    const typedUser = user as unknown as DashboardUserExtension | null
    const wishlistIds: string[] = typedUser?.wishlist || []

    const wishlistList: ExtendedCourseInstance[] = courses
      .filter((c) => wishlistIds.includes(String(c._id)))
      .map((c) => ({ ...c, progress: 0 }))

    return {
      active: activeList,
      completed: completedList,
      wishlist: wishlistList,
    }
  }, [courses, enrollments, user])

  // Derived loading strategy: Eliminates cascading sets by assessing active state dependencies dynamically
  const isEnrollmentLoading =
    !!user?._id &&
    courses.length > 0 &&
    enrollments.length === 0 &&
    isFetchingAction
  const globalLoading =
    coursesLoading || (isEnrollmentLoading && isAuthenticated)

  if (globalLoading) {
    return (
      <Center className="py-32 bg-background min-h-[50vh]">
        <div className="flex flex-col items-center gap-4">
          <Loader size="sm" color="blue" />
          <Text
            size="xs"
            fw={700}
            className="uppercase tracking-widest text-neutral-500 font-mono"
          >
            Synchronizing your courses...
          </Text>
        </div>
      </Center>
    )
  }

  return (
    <div className="pt-6 pb-24 max-w-7xl mx-auto space-y-10 min-h-screen bg-background">
      {/* HEADER BLOCK */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-neutral-100 dark:border-neutral-800 pb-6">
        <div>
          <h1 className="text-xl md:text-3xl font-black tracking-tighter uppercase font-sans">
            My Learning Workspace<span className="text-blue-600">.</span>
          </h1>
          <Text
            c="dimmed"
            fw={600}
            className="uppercase tracking-widest text-[10px] md:text-xs mt-1.5 font-mono opacity-80"
          >
            Securely synchronized
          </Text>
        </div>

        <Link
          href="/courses"
          className="flex w-fit items-center gap-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold uppercase text-xs! transition-all shadow-lg shadow-blue-600/10 active:scale-95"
        >
          Explore Catalog
        </Link>
      </header>

      {/* METRIC MATRIX GRID */}
      <section className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="p-5 rounded-2xl bg-surface border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider">
            Active Workspace Streams
          </span>
          <p className="text-3xl font-black mt-2 tracking-tight">
            {learningMatrix.active.length}
          </p>
        </div>
        <div className="p-5 rounded-2xl bg-surface border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider">
            Completed Vault
          </span>
          <p className="text-3xl font-black mt-2 tracking-tight text-emerald-500">
            {learningMatrix.completed.length}
          </p>
        </div>
        <div className="col-span-2 md:col-span-1 p-5 rounded-2xl bg-surface border border-neutral-200 dark:border-neutral-800">
          <span className="text-[10px] font-mono uppercase font-bold text-neutral-400 tracking-wider">
            Saved Shortlists
          </span>
          <p className="text-3xl font-black mt-2 tracking-tight text-amber-500">
            {learningMatrix.wishlist.length}
          </p>
        </div>
      </section>

      {/* LAYOUT CONTROLS TABS */}
      <Tabs
        value={activeTab}
        onChange={setActiveTab}
        variant="unstyled"
        classNames={{
          tab: 'font-mono font-bold uppercase tracking-widest text-[11px]',
        }}
      >
        <Tabs.List className="flex gap-6 border-b border-neutral-200 dark:border-neutral-800 mb-8 overflow-x-auto whitespace-nowrap scrollbar-none">
          <Tabs.Tab
            value="active"
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'active'
                ? 'border-blue-600 text-blue-600 dark:text-blue-500 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            In Progress ({learningMatrix.active.length})
          </Tabs.Tab>
          <Tabs.Tab
            value="completed"
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'completed'
                ? 'border-blue-600 text-blue-600 dark:text-blue-500 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Completed Verification ({learningMatrix.completed.length})
          </Tabs.Tab>
          <Tabs.Tab
            value="wishlist"
            className={`pb-3 border-b-2 transition-all ${
              activeTab === 'wishlist'
                ? 'border-blue-600 text-blue-600 dark:text-blue-500 font-bold'
                : 'border-transparent text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-100'
            }`}
          >
            Bookmarks ({learningMatrix.wishlist.length})
          </Tabs.Tab>
        </Tabs.List>

        {/* WORKSPACE CONTENT PANELS */}
        <Tabs.Panel value="active">
          {learningMatrix.active.length === 0 ? (
            <WorkspaceEmptyState
              title="No active paths detected"
              description="Your account doesn't point to any ongoing training models right now."
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="" className='gap-6!'>
              {learningMatrix.active.map((course) => (
                <div
                  key={String(course._id)}
                  className="relative group space-y-2 mb-10 md:mb-0"
                >
                  <CourseCard
                    course={course}
                    href={`/dashboard/courses/${course._id}/lessons`}
                  />
                  <div className="px-1 flex justify-between items-center font-mono text-[10px] text-neutral-400">
                    <span>Progress Metric</span>
                    <span className="font-bold text-neutral-900 dark:text-white">
                      {course.progress}%
                    </span>
                  </div>
                  <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-300"
                      style={{ width: `${course.progress}%` }}
                    />
                  </div>
                </div>
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="completed">
          {learningMatrix.completed.length === 0 ? (
            <WorkspaceEmptyState
              title="Archive clearance clean"
              description="Complete all mandatory verification modules to unlock production code certificates."
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
              {learningMatrix.completed.map((course) => (
                <div key={String(course._id)} className="opacity-90">
                  <CourseCard
                    course={course}
                    href={`/dashboard/courses/${course._id}/lessons`}
                  />
                  <div className="mt-2 p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/20 text-center font-mono text-[10px] font-bold text-emerald-500 uppercase tracking-wider">
                    ✓ Course Fully Completed
                  </div>
                </div>
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="wishlist">
          {learningMatrix.wishlist.length === 0 ? (
            <WorkspaceEmptyState
              title="Wishlist index empty"
              description="Save paths directly within the course descriptions to plan your engineering track dependencies."
            />
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
              {learningMatrix.wishlist.map((course) => (
                <CourseCard key={String(course._id)} course={course} />
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}

function WorkspaceEmptyState({
  title,
  description,
}: {
  title: string
  description: string
}) {
  return (
    <Center className="py-24 border border-dashed border-neutral-200 dark:border-neutral-800 rounded-3xl bg-neutral-50/30 dark:bg-[#0d0d0d]/10 text-center px-4">
      <div className="max-w-xs space-y-3">
        <div className="mx-auto w-10 h-10 rounded-xl bg-neutral-100 dark:bg-neutral-900 flex items-center justify-center text-neutral-400">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
        </div>
        <h4 className="text-xs font-bold font-mono uppercase tracking-wider text-neutral-800 dark:text-neutral-200">
          {title}
        </h4>
        <p className="text-xs text-neutral-400 dark:text-neutral-500 leading-relaxed">
          {description}
        </p>
        <div className="pt-2">
          <Link
            href="/courses"
            className="text-[11px] font-mono font-bold text-blue-600 dark:text-blue-500 hover:underline uppercase tracking-widest"
          >
            Find Courses →
          </Link>
        </div>
      </div>
    </Center>
  )
}