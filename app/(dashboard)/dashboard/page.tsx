'use client'

import React from 'react'
import { MOCK_USER } from '@/app/data/mockUser'
import { COURSES } from '@/app/data'
import { Enrollment } from '@/app/types/user'
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
} from '@mantine/core'
import {
  Zap,
  Star,
  ArrowUpRight,
  Clock,
  Flame,
  Wallet,
  ChevronRight,
} from 'lucide-react'
import { useMediaQuery } from '@mantine/hooks'

interface StatProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend: string
}

export default function DashboardOverview() {
  // Get enrollment and find matching course data
  const enrollment: Enrollment = MOCK_USER.enrollments[0]
  const courseDetails = COURSES.find((c) => c.id === enrollment.courseId)

  const isMobile = useMediaQuery(`(max-width: ${rem(768)})`)
  // Find current module title from course details
  const currentModule = courseDetails?.modules.find(
    (m) => m.id === enrollment.currentModuleId,
  )

  return (
    <div className="py-12">
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
          <h1 className="text-2xl md:text-4xl font-black tracking-tighter text-slate-900">
            Welcome, {MOCK_USER.firstName}
            <span className="text-blue-600">.</span>
          </h1>
        </div>
        <Paper
          withBorder
          radius="md"
          p="xs"
          className=" flex items-center justify-items-center md:justify-items-start gap-2 px-4 bg-white shadow-sm mb-5"
        >
          <Clock size={14} className="text-slate-400" />
          <Text
            size="10px"
            fw={800}
            className="uppercase tracking-widest text-slate-600"
          >
            Session: 2h 45m
          </Text>
        </Paper>
      </div>

      {/* Stats Grid */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md" mb="xl">
        <StatItem
          label="Course Points"
          value={MOCK_USER.stats.points.toLocaleString()}
          icon={<Zap size={18} className="text-amber-500 fill-amber-500" />}
          trend="+12% this week"
        />
        <StatItem
          label="Reviews Done"
          value={MOCK_USER.stats.peerReviewsDone}
          icon={<Star size={18} className="text-purple-500" />}
          trend="Top 5% Rank"
        />
        <StatItem
          label="Active Streak"
          value={`${MOCK_USER.stats.streakDays} Days`}
          icon={<Flame size={18} className="text-orange-500 fill-orange-500" />}
          trend="Mastery Goal"
        />
        <StatItem
          label="Wallet Balance"
          value={`₦${MOCK_USER.wallet.balance.toLocaleString()}`}
          icon={<Wallet size={18} className="text-green-500" />}
          trend="Velora Ready"
        />
      </SimpleGrid>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Main Learning Card */}
        <div className="lg:col-span-8">
          <Card
            padding={isMobile ? '6px' : 'xl'}
            radius="16px"
            className="border border-slate-200 shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden relative min-h-85 flex flex-col justify-between"
          >
            {/* Visual background gradient based on course color */}
            <div className="absolute top-0 right-0 md:p-8">
              <div
                className={`w-40 h-40 bg-linear-to-br ${courseDetails?.color || 'from-blue-50 to-indigo-50'} rounded-full blur-3xl opacity-20`}
              />
            </div>

            <Stack>
              <Group justify="space-between">
                <Badge
                  size="sm"
                  radius="sm"
                  color="blue"
                  variant="light"
                  className="font-black uppercase tracking-widest"
                >
                  Current Track
                </Badge>
                <Link href={`/courses/${enrollment.courseId}`}>
                  <ArrowUpRight className="text-slate-300 hover:text-blue-600 transition-colors cursor-pointer" />
                </Link>
              </Group>

              <div className="mt-4">
                <Text
                  size="20px"
                  fw={900}
                  className="tracking-tighter leading-tight max-w-md text-slate-900 uppercase"
                >
                  {courseDetails?.title || enrollment.courseTitle}
                </Text>
                <Text
                  c="dimmed"
                  fw={700}
                  className="uppercase tracking-[0.2em] text-[10px]! mt-1.5!"
                >
                  {currentModule
                    ? `Module ${enrollment.currentModuleId} • ${currentModule.title}`
                    : `Module ${enrollment.currentModuleId} • Continuing Lessons`}
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
                  {enrollment.progressPercentage}% COMPLETE
                </Text>
                <Text size="xs" fw={800} c="dimmed">
                  {/* Estimated lesson count based on 20 lessons total */}
                  {Math.round((enrollment.progressPercentage / 100) * 20)} / 20
                  LESSONS
                </Text>
              </Group>
              <Progress
                value={enrollment.progressPercentage}
                color="blue"
                size="lg"
                radius="xl"
                className="bg-slate-100"
              />
              <Link
                href={`/courses/${enrollment.courseId}/learn`}
                className="block mt-8"
              >
                <button className="bg-slate-900 text-white w-full md:w-auto px-10 py-3 rounded-xl text-xs! font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-900/10">
                  Resume Course
                </button>
              </Link>
            </div>
          </Card>
        </div>

        {/* Sidebar Mini-Tasks */}
        <div className="lg:col-span-4 space-y-6">
          <Paper
            p={isMobile ? 'sm' : 'lg'}
            radius="16px"
            withBorder
            className="border-slate-100 bg-white shadow-sm"
          >
            <Text
              fw={900}
              className="uppercase tracking-widest text-sm! mb-6 text-slate-400"
            >
              P2P Pending Reviews
            </Text>
            <Stack gap="md">
              {[1, 2].map((id) => (
                <div
                  key={id}
                  className="group flex items-center gap-4 py-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100 "
                >
                  <div className="w-8 h-8 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                    {id === 1 ? 'R' : 'G'}
                  </div>
                  <div className="flex-1">
                    <Text
                      size="xs"
                      fw={800}
                      className="leading-none mb-1 text-slate-800"
                    >
                      Assignment #{id + 500}
                    </Text>
                    <Text size="10px" c="dimmed" fw={700}>
                      System Logic • +50 PTS
                    </Text>
                  </div>
                  <ChevronRight size={14} className="text-slate-300" />
                </div>
              ))}
              <button className="w-full mt-4 text-sm! font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 py-3 rounded-xl transition-all">
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
      className="border-slate-100 bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group"
    >
      <Group justify="space-between" mb="md">
        <div className="p-2 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
          {icon}
        </div>
        <Badge
          variant="transparent"
          color="gray"
          size="xs"
          className="font-bold tracking-tighter"
        >
          {trend}
        </Badge>
      </Group>
      <Text size="18px" fw={900} className="tracking-tighter text-slate-900">
        {value}
      </Text>
      <Text
        size="8px"
        fw={800}
        c="dimmed"
        className="uppercase tracking-widest mt-1.5!"
      >
        {label}
      </Text>
    </Paper>
  )
}