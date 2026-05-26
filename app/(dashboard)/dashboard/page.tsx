// /app/(dashboard)/dashboard/page.tsx

'use client'

import React from 'react'
import { useCourses } from '@/app/hooks/useCourses'
import { Enrollment, UserType } from '@/app/types/user'
import Link from 'next/link'
import {
  Card,
  Text,
  Progress,
  Group,
  Badge,
  SimpleGrid,
  Paper,
  Stack,
  rem,
  Loader,
} from '@mantine/core'
import {
  Zap,
  Star,
  ArrowUpRight,
  Clock,
  Flame,
  Wallet,
  ChevronRight,
  BookOpen,
} from 'lucide-react'
import { useMediaQuery } from '@mantine/hooks'
import { useAuthStore } from '@/app/store/authStore'

interface StatProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend: string
}

export default function DashboardOverview() {
  const store = useAuthStore()
  const user = store.user as UserType | null | undefined
  const isMobile = useMediaQuery(`(max-width: ${rem(768)})`)

  // Pulling live data directly from the hook connected to /api/courses
  const { courses: databaseCourses, loading: coursesLoading } = useCourses()

  // Guard clause handles both store hydration and active API loading states safely
  if (!user || !user.stats || coursesLoading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3 bg-[var(--background)] text-[var(--foreground)]">
        <Loader size="sm" color="blue" />
        <Text
          size="xs"
          fw={700}
          className="text-slate-400 dark:text-slate-500 uppercase tracking-widest"
        >
          Loading workspace...
        </Text>
      </div>
    )
  }

  const userEnrollments: Enrollment[] = user.enrollments || []
  // Grabbing the most recent enrollment (usually the one just paid for)
  const enrollment: Enrollment | undefined = userEnrollments[userEnrollments.length - 1]

  // Pure lookups inside your database array values
  const courseDetails = enrollment
    ? databaseCourses.find((c) => String(c._id) === String(enrollment.courseId))
    : undefined

  const currentModule =
    courseDetails && enrollment
      ? courseDetails.modules.find(
          (m) => String(m.id) === String(enrollment.currentModuleId),
        )
      : undefined

  // Dynamic lesson calculations based on actual course structure instead of hardcoded 20
  const totalLessons = courseDetails 
    ? courseDetails.modules.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 20
    : 20

  const completedLessons = Math.round(((enrollment?.progressPercentage || 0) / 100) * totalLessons)

  return (
    <div className="py-12 bg-[var(--background)] text-[var(--foreground)]">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="mb-8">
          <Badge
            variant="dot"
            color="blue"
            className="mb-4 md:mb-2 uppercase font-black tracking-widest text-[9px]"
          >
            Student Workspace
          </Badge>
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-900 dark:text-slate-100">
            Welcome, {user.firstName || 'Student'}
            <span className="text-blue-600 dark:text-blue-500">.</span>
          </h1>
        </div>
        <Paper
          withBorder
          radius="md"
          p="xs"
          className="flex items-center justify-items-center md:justify-items-start gap-2 px-4 bg-white dark:bg-slate-900/50 border-slate-100 dark:border-slate-800 shadow-sm mb-5"
        >
          <Clock size={14} className="text-slate-400 dark:text-slate-500" />
          <Text
            size="10px"
            fw={800}
            className="uppercase tracking-widest text-slate-600 dark:text-slate-300"
          >
            Session: 2h 45m
          </Text>
        </Paper>
      </div>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        <StatItem
          label="Course Points"
          value={user.stats.points.toLocaleString()}
          icon={<Zap size={18} className="text-amber-500 fill-amber-500" />}
          trend="+12% this week"
        />
        <StatItem
          label="Reviews Done"
          value={user.stats.peerReviewsDone}
          icon={<Star size={18} className="text-purple-500" />}
          trend="Top 5% Rank"
        />
        <StatItem
          label="Active Streak"
          value={`${user.stats.streakDays} Days`}
          icon={<Flame size={18} className="text-orange-500 fill-orange-500" />}
          trend="Mastery Goal"
        />
        <StatItem
          label="Wallet Balance"
          value={`${user.wallet?.currency === 'USD' ? '$' : '₦'}${user.wallet?.balance?.toLocaleString() ?? 0}`}
          icon={<Wallet size={18} className="text-green-500" />}
          trend="Updated Live"
        />
      </SimpleGrid>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Learning Card */}
        <div className="lg:col-span-8">
          {enrollment && courseDetails ? (
            <Card
              padding={isMobile ? 'md' : 'xl'}
              radius="16px"
              className="border border-slate-200 dark:border-slate-800 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white dark:bg-slate-900/40 overflow-hidden relative min-h-85 flex flex-col justify-between"
            >
              <div className="absolute top-0 right-0 md:p-8">
                <div
                  className={`w-40 h-40 bg-gradient-to-br ${courseDetails.color || 'from-blue-50 to-indigo-50'} rounded-full blur-3xl opacity-20 dark:opacity-5`}
                />
              </div>

              <Stack>
                <Group justify="space-between">
                  <Badge
                    size="sm"
                    radius="sm"
                    color="green"
                    variant="light"
                    className="font-black uppercase tracking-widest"
                  >
                    Active Track
                  </Badge>
                  <Link href={`/courses/${enrollment.courseId}`}>
                    <ArrowUpRight className="text-slate-300 dark:text-slate-600 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer" />
                  </Link>
                </Group>

                <div className="mt-4">
                  <h2 className="text-xl font-black tracking-tighter leading-tight max-w-md text-slate-900 dark:text-slate-100 uppercase">
                    {courseDetails.title}
                  </h2>
                  <Text
                    c="dimmed"
                    fw={700}
                    className="uppercase tracking-[0.2em] text-[10px] !mt-1.5 text-slate-400 dark:text-slate-500"
                  >
                    {currentModule
                      ? `Module ${enrollment.currentModuleId} • ${currentModule.title}`
                      : `Module ${enrollment.currentModuleId || 1} • Starting Lessons`}
                  </Text>
                </div>
              </Stack>

              <div className="mt-4">
                <Group justify="space-between" mb="xs">
                  <Text
                    size="10px"
                    fw={900}
                    color="blue"
                    className="tracking-widest"
                  >
                    {enrollment.progressPercentage || 0}% COMPLETE
                  </Text>
                  <Text
                    size="xs"
                    fw={800}
                    className="text-slate-400 dark:text-slate-500"
                  >
                    {completedLessons} / {totalLessons} LESSONS
                  </Text>
                </Group>
                <Progress
                  value={enrollment.progressPercentage || 0}
                  color="blue"
                  size="lg"
                  radius="xl"
                  className="bg-slate-100 dark:bg-slate-800"
                />
                <Link
                  href={`/courses/${enrollment.courseId}/learn`}
                  className="block mt-8"
                >
                  <button className="bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-950 w-full md:w-auto px-10 py-3 rounded-xl text-xs cursor-pointer font-black uppercase tracking-[0.2em] hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all active:scale-95 shadow-xl shadow-blue-900/10">
                    {enrollment.progressPercentage === 0 ? 'Start Course' : 'Resume Course'}
                  </button>
                </Link>
              </div>
            </Card>
          ) : (
            <Card
              padding="xl"
              radius="16px"
              className="border border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 flex flex-col items-center justify-center p-12 text-center min-h-[340px]"
            >
              <BookOpen size={32} className="text-slate-300 dark:text-slate-600 mb-3" />
              <Text
                size="sm"
                fw={800}
                className="text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1"
              >
                No Active Enrollments
              </Text>
              <p className="text-xs text-slate-400 dark:text-slate-500 font-semibold max-w-xs leading-relaxed mb-6">
                You are currently not registered for any active system tracks.
                Explore the repository catalog to pick up points.
              </p>
              <Link href="/courses">
                <button className="bg-blue-600 hover:bg-slate-900 dark:hover:bg-white dark:hover:text-slate-950 text-white px-8 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest transition-all cursor-pointer shadow-md">
                  Browse Catalog
                </button>
              </Link>
            </Card>
          )}
        </div>

        {/* Sidebar Mini-Tasks */}
        <div className="lg:col-span-4 space-y-6">
          <Paper
            p={isMobile ? 'sm' : 'lg'}
            radius="16px"
            withBorder
            className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 shadow-sm"
          >
            <Text
              fw={900}
              className="uppercase tracking-widest text-sm mb-6 text-slate-400 dark:text-slate-500"
            >
              P2P Pending Reviews
            </Text>
            <Stack gap="md">
              {[1, 2].map((id) => (
                <div
                  key={id}
                  className="group flex items-center gap-4 py-3 px-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 dark:hover:border-slate-800"
                >
                  <div className="w-8 h-8 bg-slate-50 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 dark:text-slate-500 font-bold text-xs group-hover:bg-blue-100 dark:group-hover:bg-blue-950/50 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {id === 1 ? 'R' : 'G'}
                  </div>
                  <div className="flex-1">
                    <Text
                      size="xs"
                      fw={800}
                      className="leading-none mb-1 text-slate-800 dark:text-slate-200"
                    >
                      Assignment #{id + 500}
                    </Text>
                    <Text
                      size="10px"
                      fw={700}
                      className="text-slate-400 dark:text-slate-500"
                    >
                      System Logic • +50 PTS
                    </Text>
                  </div>
                  <ChevronRight
                    size={14}
                    className="text-slate-300 dark:text-slate-600"
                  />
                </div>
              ))}
              <button className="w-full mt-4 text-sm font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 py-3 rounded-xl transition-all cursor-pointer">
                Access Grading Hub
              </button>
            </Stack>
          </Paper>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value, icon, trend }: StatProps) {
  return (
    <Paper
      p="md"
      radius="16px"
      withBorder
      className="border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900/40 hover:border-blue-100 dark:hover:border-blue-900/50 hover:shadow-lg dark:hover:shadow-blue-950/20 hover:shadow-blue-900/5 transition-all duration-300 group"
    >
      <Group justify="space-between" mb="md">
        <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-2xl group-hover:bg-blue-50 dark:group-hover:bg-blue-950/50 transition-colors">
          {icon}
        </div>
        <Badge
          variant="transparent"
          color="gray"
          size="xs"
          className="font-bold tracking-tighter text-slate-400 dark:text-slate-500"
        >
          {trend}
        </Badge>
      </Group>
      <Text
        size="18px"
        fw={900}
        className="tracking-tighter text-slate-900 dark:text-slate-100"
      >
        {value}
      </Text>
      <Text
        size="8px"
        fw={800}
        className="uppercase tracking-widest !mt-1.5 text-slate-400 dark:text-slate-500"
      >
        {label}
      </Text>
    </Paper>
  )
}