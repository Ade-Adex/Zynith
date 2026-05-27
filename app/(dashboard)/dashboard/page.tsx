
// /app/(dashboard)/dashboard/page.tsx

'use client'

import React, { useEffect, useMemo, useState } from 'react'
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
  RingProgress,
  Divider,
  Avatar,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  Zap,
  Star,
  ArrowUpRight,
  Clock3,
  Flame,
  Wallet,
  ChevronRight,
  BookOpen,
  Trophy,
  CheckCircle2,
  GraduationCap,
  CalendarDays,
  Activity,
  PlayCircle,
  BarChart3,
  ReceiptText,
  Target,
  TrendingUp,
} from 'lucide-react'

import { useAuthStore } from '@/app/store/authStore'
import { getDashboardOverviewAction } from '@/app/services/dashboardActions'
import { DashboardData } from '@/app/types/user'
import { Module } from '@/app/types'

interface StatProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend: string
}

export default function DashboardOverview() {
  const store = useAuthStore()
  const authUser = store.user

  const isMobile = useMediaQuery(`(max-width: ${rem(768)})`)

  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function loadDashboard() {
      try {
        if (!authUser?._id) return

        setLoading(true)

        const response = await getDashboardOverviewAction(authUser._id)

        if (response?.success && response?.data) {

         setDashboard(response.data as DashboardData)
        }
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboard()
  }, [authUser?._id])

  const activeCourse = dashboard?.activeCourse

const currentModule = useMemo(() => {
  if (!activeCourse?.course?.modules?.length) return null

  return activeCourse.course.modules.find(
    (module: Module) =>
      String(module.id) === String(activeCourse.enrollment.currentModuleId),
  )
}, [activeCourse])
  
  const walletCurrency =
    dashboard?.user?.wallet?.currency === 'USD' ? '$' : '₦'

  if (loading || !dashboard) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader size="sm" color="blue" />

        <Text
          size="xs"
          fw={800}
          className="uppercase tracking-[0.25em] text-slate-500"
        >
          Synchronizing Dashboard...
        </Text>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-6 md:py-10">
      {/* HERO */}
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <Avatar
            radius="xl"
            size={isMobile ? 56 : 72}
            src={dashboard.user.avatar || undefined}
            className="bg-blue-600 text-white shadow-lg"
          >
            {!dashboard.user.avatar &&
              (dashboard.user.firstName?.slice(0, 1) || 'S')}
          </Avatar>

          <div className="min-w-0">
            <Badge
              variant="light"
              color="blue"
              radius="sm"
              className="uppercase tracking-[0.2em] font-black mb-3"
            >
              Learning Workspace
            </Badge>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight leading-tight text-slate-900 dark:text-white break-words">
              Welcome back, {dashboard.user.firstName}
              <span className="text-blue-600">.</span>
            </h1>

            <p className="text-sm md:text-base mt-2 text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
              Track your real-time course progress, transactions, achievements,
              and learning performance from your personalized workspace.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <Paper
            radius="lg"
            p="md"
            withBorder
            className="bg-surface! surface-border"
          >
            <Group gap={8}>
              <BookOpen size={15} className="text-blue-500" />

              <Text size="10px" fw={900} className="uppercase tracking-widest">
                Enrolled
              </Text>
            </Group>

            <Text fw={900} className="text-lg! md:text-xl! mt-3! text-center!">
              {dashboard.metrics.enrolledCourses}
            </Text>
          </Paper>

          <Paper
            radius="lg"
            p="md"
            withBorder
            className="bg-surface! surface-border"
          >
            <Group gap={8}>
              <Target size={15} className="text-emerald-500" />

              <Text size="10px" fw={900} className="uppercase tracking-widest">
                Completion
              </Text>
            </Group>

            <Text fw={900} className="text-lg! md:text-xl! mt-3! text-center!">
              {dashboard.metrics.completionRate}%
            </Text>
          </Paper>

          <Paper
            radius="lg"
            p="md"
            withBorder
            className="bg-surface! surface-border col-span-2 md:col-span-1"
          >
            <Group gap={8}>
              <TrendingUp size={15} className="text-orange-500" />

              <Text size="10px" fw={900} className="uppercase tracking-widest">
                Active Courses
              </Text>
            </Group>

            <Text fw={900} className="text-lg! md:text-xl! mt-3! text-center!">
              {dashboard.metrics.activeCourses}
            </Text>
          </Paper>
        </div>
      </div>

      {/* STATS */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="lg" mb="xl">
        <StatItem
          label="Learning Points"
          value={dashboard.metrics.points.toLocaleString()}
          icon={<Zap size={18} className="text-amber-500 fill-amber-500" />}
          trend={`${dashboard.metrics.completedCourses} Completed`}
        />

        <StatItem
          label="Peer Reviews"
          value={dashboard.metrics.peerReviews}
          icon={<Star size={18} className="text-violet-500" />}
          trend="Student Activity"
        />

        <StatItem
          label="Learning Streak"
          value={`${dashboard.metrics.streakDays} Days`}
          icon={<Flame size={18} className="text-orange-500 fill-orange-500" />}
          trend="Consistency"
        />

        <StatItem
          label="Wallet Balance"
          value={`${walletCurrency}${dashboard.user.wallet?.balance?.toLocaleString() ?? 0}`}
          icon={<Wallet size={18} className="text-green-500" />}
          trend="Updated Live"
        />
      </SimpleGrid>

      <div className="grid grid-cols-1 2xl:grid-cols-12 gap-6">
        {/* LEFT */}
        <div className="2xl:col-span-8 space-y-6">
          {/* ACTIVE COURSE */}
          {activeCourse ? (
            <Card
              radius="24px"
              padding={isMobile ? 'md' : 'xl'}
              className="relative overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50"
            >
              <div className="absolute top-0 right-0">
                <div
                  className={`w-72 h-72 rounded-full blur-3xl opacity-10 dark:opacity-5 bg-gradient-to-br ${
                    activeCourse.course.color || 'from-blue-400 to-indigo-500'
                  }`}
                />
              </div>

              <div className="relative z-10">
                <Group justify="space-between" align="flex-start">
                  <div className="min-w-0 flex-1">
                    <Badge
                      color="green"
                      variant="light"
                      radius="sm"
                      className="uppercase tracking-widest font-black mb-4"
                    >
                      Active Course
                    </Badge>

                    <h2 className="text-2xl md:text-3xl font-black tracking-tight leading-tight text-slate-900 dark:text-white break-words">
                      {activeCourse.course.title}
                    </h2>

                    <Text
                      size="xs"
                      fw={800}
                      className="uppercase tracking-[0.2em] mt-3 text-slate-400 dark:text-slate-500 break-words"
                    >
                      {currentModule
                        ? `Current Module • ${currentModule.title}`
                        : 'Learning In Progress'}
                    </Text>
                  </div>

                  <Link href={`/courses/${activeCourse.course._id}`}>
                    <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all">
                      <ArrowUpRight size={18} />
                    </div>
                  </Link>
                </Group>

                <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Group justify="space-between" mb="xs">
                      <Text
                        size="10px"
                        fw={900}
                        className="uppercase tracking-widest text-blue-600"
                      >
                        Overall Progress
                      </Text>

                      <Text size="xs" fw={800} className="text-slate-500">
                        {dashboard.metrics.completedLessons} /{' '}
                        {dashboard.metrics.totalLessons} Lessons
                      </Text>
                    </Group>

                    <Progress
                      value={activeCourse.enrollment.progressPercentage || 0}
                      size="xl"
                      radius="xl"
                      color="blue"
                    />

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      <MiniMetric
                        label="Modules"
                        value={activeCourse.course.modules?.length || 0}
                        icon={<BookOpen size={16} />}
                      />

                      <MiniMetric
                        label="Completed"
                        value={dashboard.metrics.completedLessons}
                        icon={<CheckCircle2 size={16} />}
                      />

                      <MiniMetric
                        label="Certificates"
                        value={dashboard.metrics.certificates}
                        icon={<GraduationCap size={16} />}
                      />

                      <MiniMetric
                        label="Progress"
                        value={`${dashboard.metrics.completionRate}%`}
                        icon={<BarChart3 size={16} />}
                      />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 mt-8">
                      <Link
                        href={`/courses/${activeCourse.course._id}/learn`}
                        className="w-full sm:w-auto"
                      >
                        <button className="w-full sm:w-auto bg-slate-900 dark:bg-white dark:text-slate-950 text-white px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.18em] text-xs hover:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white transition-all cursor-pointer shadow-lg">
                          <span className="flex items-center justify-center gap-2">
                            <PlayCircle size={16} />

                            {activeCourse.enrollment.progressPercentage === 0
                              ? 'Start Learning'
                              : 'Resume Learning'}
                          </span>
                        </button>
                      </Link>

                      <Link href="/courses" className="w-full sm:w-auto">
                        <button className="w-full sm:w-auto border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-8 py-3.5 rounded-2xl font-black uppercase tracking-[0.18em] text-xs hover:border-blue-500 hover:text-blue-600 transition-all cursor-pointer">
                          Explore Courses
                        </button>
                      </Link>
                    </div>
                  </div>

                  <div className="flex items-center justify-center">
                    <RingProgress
                      size={180}
                      thickness={16}
                      roundCaps
                      sections={[
                        {
                          value:
                            activeCourse.enrollment.progressPercentage || 0,
                          color: 'blue',
                        },
                      ]}
                      label={
                        <div className="text-center">
                          <Text
                            fw={900}
                            className="text-3xl text-slate-900 dark:text-white"
                          >
                            {activeCourse.enrollment.progressPercentage || 0}%
                          </Text>

                          <Text
                            size="10px"
                            fw={900}
                            className="uppercase tracking-widest text-slate-500 mt-1"
                          >
                            Completed
                          </Text>
                        </div>
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>
          ) : (
            <Card
              radius="24px"
              padding="xl"
              className="min-h-[320px] flex flex-col items-center justify-center border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/30 text-center"
            >
              <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center mb-5">
                <BookOpen size={32} className="text-blue-600" />
              </div>

              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                No Active Course
              </h2>

              <p className="max-w-md mt-3 text-sm leading-relaxed text-slate-500">
                You are currently not enrolled in any active learning track.
              </p>

              <Link href="/courses" className="mt-8">
                <button className="bg-blue-600 hover:bg-slate-900 text-white px-8 py-3 rounded-2xl font-black uppercase tracking-[0.18em] text-xs transition-all cursor-pointer">
                  Browse Courses
                </button>
              </Link>
            </Card>
          )}

          {/* RECENT TRANSACTIONS */}
          <Paper
            radius="24px"
            p={isMobile ? 'md' : 'xl'}
            withBorder
            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
          >
            <Group justify="space-between" mb="lg">
              <div>
                <Text
                  fw={900}
                  className="uppercase tracking-[0.2em] text-sm text-slate-500"
                >
                  Recent Transactions
                </Text>

                <Text size="sm" className="text-slate-400 mt-1">
                  Latest successful payments from your account.
                </Text>
              </div>

              <ReceiptText size={20} className="text-emerald-500" />
            </Group>

            <div className="space-y-4">
              {dashboard.recentTransactions.length > 0 ? (
                dashboard.recentTransactions.map(
                  (
                    transaction: DashboardData['recentTransactions'][number],
                  ) => (
                    <div
                      key={transaction.reference}
                      className="flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800"
                    >
                      <div className="w-11 h-11 rounded-2xl bg-green-50 dark:bg-green-950/30 flex items-center justify-center text-green-600">
                        <Wallet size={16} />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Text
                          fw={800}
                          className="text-slate-900 dark:text-white truncate"
                        >
                          {transaction.titles.join(', ')}
                        </Text>

                        <Text size="xs" className="text-slate-500 mt-1">
                          Ref: {transaction.reference}
                        </Text>
                      </div>

                      <Badge color="green" variant="light">
                        {walletCurrency}
                        {transaction.amount.toLocaleString()}
                      </Badge>
                    </div>
                  ),
                )
              ) : (
                <Text size="sm" className="text-slate-500">
                  No recent transactions found.
                </Text>
              )}
            </div>
          </Paper>
        </div>

        {/* RIGHT */}
        <div className="2xl:col-span-4 space-y-6">
          {/* PERFORMANCE */}
          <Paper
            radius="24px"
            p={isMobile ? 'md' : 'xl'}
            withBorder
            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
          >
            <Group justify="space-between" mb="lg">
              <Text
                fw={900}
                className="uppercase tracking-[0.2em] text-sm text-slate-500"
              >
                Performance Overview
              </Text>

              <Activity size={18} className="text-blue-500" />
            </Group>

            <Stack gap="lg">
              <PerformanceRow
                label="Course Completion"
                value={`${dashboard.metrics.completedCourses}`}
              />

              <PerformanceRow
                label="Certificates Earned"
                value={`${dashboard.metrics.certificates}`}
              />

              <PerformanceRow
                label="Assignments Reviewed"
                value={`${dashboard.metrics.peerReviews}`}
              />

              <PerformanceRow
                label="Current Streak"
                value={`${dashboard.metrics.streakDays} Days`}
              />
            </Stack>
          </Paper>

          {/* RECENT ENROLLMENTS */}
          <Paper
            radius="24px"
            p={isMobile ? 'md' : 'xl'}
            withBorder
            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
          >
            <Group justify="space-between" mb="lg">
              <Text
                fw={900}
                className="uppercase tracking-[0.2em] text-sm text-slate-500"
              >
                Recent Courses
              </Text>

              <CalendarDays size={18} className="text-orange-500" />
            </Group>

            <div className="space-y-4">
              {dashboard.recentEnrollments.length > 0 ? (
                dashboard.recentEnrollments.map(
                  (item: DashboardData['recentEnrollments'][number]) => (
                    <div key={item.enrollmentId}>
                      <div className="flex items-start gap-4">
                        <div className="w-3 h-3 rounded-full bg-blue-600 mt-1.5" />

                        <div className="flex-1 min-w-0">
                          <Text
                            fw={800}
                            className="text-slate-900 dark:text-white break-words"
                          >
                            {item.course?.title || 'Course'}
                          </Text>

                          <Text size="xs" className="text-slate-500 mt-1">
                            {item.progressPercentage}% completed
                          </Text>
                        </div>
                      </div>
                    </div>
                  ),
                )
              ) : (
                <Text size="sm" className="text-slate-500">
                  No recent enrollments available.
                </Text>
              )}
            </div>
          </Paper>

          {/* QUICK ACTIONS */}
          <Paper
            radius="24px"
            p={isMobile ? 'md' : 'xl'}
            withBorder
            className="bg-white dark:bg-slate-900/50 border-slate-200 dark:border-slate-800"
          >
            <Text
              fw={900}
              className="uppercase tracking-[0.2em] text-sm text-slate-500 mb-6"
            >
              Quick Actions
            </Text>

            <div className="space-y-3">
              <QuickAction
                href="/courses"
                title="Browse Courses"
                subtitle="Explore available learning tracks"
                icon={<BookOpen size={16} />}
              />

              <QuickAction
                href="/dashboard/wallet"
                title="Wallet & Payments"
                subtitle="Manage balance and transactions"
                icon={<Wallet size={16} />}
              />

              <QuickAction
                href="/dashboard/certificates"
                title="Certificates"
                subtitle="Access earned certificates"
                icon={<GraduationCap size={16} />}
              />

              <QuickAction
                href="/dashboard/transactions"
                title="Transactions"
                subtitle="Review purchase history"
                icon={<ReceiptText size={16} />}
              />
            </div>
          </Paper>
        </div>
      </div>
    </div>
  )
}

function StatItem({ label, value, icon, trend }: StatProps) {
  return (
    <Paper
      p="lg"
      radius="24px"
      withBorder
      className="group bg-surface! surface-border"
    >
      <Group justify="space-between" mb="lg">
        <div className="w-10 h-10 rounded-2xl icon-bg flex items-center justify-center">
          {icon}
        </div>

        <Badge size="sm" variant="light" color="" className="font-black">
          {trend}
        </Badge>
      </Group>

      <Text
        fw={900}
        className="text-2xl tracking-tight wrap-break-word"
      >
        {value}
      </Text>

      <Text
        size="10px"
        fw={900}
        className="uppercase tracking-[0.25em] mt-2 text-slate-500"
      >
        {label}
      </Text>
    </Paper>
  )
}

function MiniMetric({
  label,
  value,
  icon,
}: {
  label: string
  value: string | number
  icon: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 p-4">
      <div className="flex items-center gap-2 text-slate-500 mb-2">
        {icon}
      </div>

      <Text
        fw={900}
        className="text-xl text-slate-900 dark:text-white"
      >
        {value}
      </Text>

      <Text
        size="10px"
        fw={900}
        className="uppercase tracking-widest text-slate-500 mt-1"
      >
        {label}
      </Text>
    </div>
  )
}

function PerformanceRow({
  label,
  value,
}: {
  label: string
  value: string
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <Text
        size="sm"
        fw={700}
        className="text-slate-600 dark:text-slate-400"
      >
        {label}
      </Text>

      <Badge
        radius="sm"
        size="lg"
        variant="light"
        color="blue"
        className="font-black"
      >
        {value}
      </Badge>
    </div>
  )
}

function QuickAction({
  href,
  title,
  subtitle,
  icon,
}: {
  href: string
  title: string
  subtitle: string
  icon: React.ReactNode
}) {
  return (
    <Link href={href}>
      <div className="group flex items-center gap-4 p-4 rounded-2xl border border-slate-100 dark:border-slate-800 hover:border-blue-200 dark:hover:border-blue-900 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-all cursor-pointer">
        <div className="w-11 h-11 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-blue-600">
          {icon}
        </div>

        <div className="flex-1 min-w-0">
          <Text
            fw={800}
            className="text-slate-900 dark:text-white"
          >
            {title}
          </Text>

          <Text
            size="xs"
            className="text-slate-500 mt-1"
          >
            {subtitle}
          </Text>
        </div>

        <ChevronRight
          size={16}
          className="text-slate-400 group-hover:text-blue-600 transition-colors"
        />
      </div>
    </Link>
  )
}