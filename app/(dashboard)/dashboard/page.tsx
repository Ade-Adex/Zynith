import { MOCK_USER } from '@/app/data/mockUser'
import { Enrollment } from '@/app/types/user'

import {
  Card,
  Text,
  Progress,
  Group,
  Badge,
  SimpleGrid,
  Paper,
  Stack,
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

interface StatProps {
  label: string
  value: string | number
  icon: React.ReactNode
  trend: string
}

export default function DashboardOverview() {
  const currentCourse: Enrollment = MOCK_USER.enrollments[0]

  return (
    <div className='py-12'>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className='mb-8'>
          <Badge
            variant="dot"
            color="blue"
            className="mb-2 uppercase font-black tracking-widest text-[9px]"
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
          className="flex items-center gap-2 px-4 bg-white shadow-sm mb-5"
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
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
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
            padding="xl"
            radius="32px"
            className="border-none shadow-[0_8px_30px_rgb(0,0,0,0.04)] bg-white overflow-hidden relative min-h-[340px] flex flex-col justify-between"
          >
            <div className="absolute top-0 right-0 p-8">
              <div className="w-32 h-32 bg-blue-50 rounded-full blur-3xl opacity-60" />
            </div>

            <Stack>
              <Group justify="space-between">
                <Badge
                  size="md"
                  radius="sm"
                  color="blue"
                  variant="light"
                  className="font-black uppercase tracking-widest"
                >
                  Current Track
                </Badge>
                <ArrowUpRight className="text-slate-300" />
              </Group>

              <div className="mt-4">
                <Text
                  size="24px"
                  fw={900}
                  className="tracking-tighter leading-tight max-w-md text-slate-900"
                >
                  {currentCourse.courseTitle}
                </Text>
                <Text
                  c="dimmed"
                  fw={700}
                  className="uppercase tracking-[0.2em] text-[10px]! mt-2!"
                >
                  Module {currentCourse.currentModuleId} • Lecture 4: Ownership
                  & Borrowing
                </Text>
              </div>
            </Stack>

            <div className="mt-10">
              <Group justify="space-between" mb="xs">
                <Text size="xs" fw={900} color="blue">
                  {currentCourse.progressPercentage}% COMPLETE
                </Text>
                <Text size="xs" fw={800} c="dimmed">
                  12 / 24 LESSONS
                </Text>
              </Group>
              <Progress
                value={currentCourse.progressPercentage}
                color="blue"
                size="xl"
                radius="xl"
                className="bg-slate-100"
              />
              <button className="mt-8 bg-slate-900 text-white w-full md:w-auto px-10 py-3 rounded-2xl text-[11px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all active:scale-95 shadow-xl shadow-blue-900/10">
                Resume Course
              </button>
            </div>
          </Card>
        </div>

        {/* Sidebar Mini-Tasks */}
        <div className="lg:col-span-4 space-y-6 mt-6">
          <Paper
            p="lg"
            radius="32px"
            withBorder
            className="border-slate-100 bg-white shadow-sm"
          >
            <Text
              fw={900}
              className="uppercase tracking-widest text-[11px] mb-6 text-slate-400"
            >
              P2P Pending Reviews
            </Text>
            <Stack gap="md">
              {[1, 2].map((id) => (
                <div
                  key={id}
                  className="group flex items-center gap-4 py-3 hover:bg-slate-50 rounded-2xl transition-all cursor-pointer border border-transparent hover:border-slate-100"
                >
                  <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 font-bold text-xs group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
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
              <button className="w-full mt-4 text-[10px]! font-black uppercase tracking-widest text-blue-600 hover:bg-blue-50 py-3 rounded-xl transition-all">
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
      p="xl"
      radius="28px"
      withBorder
      className="border-slate-100 bg-white hover:border-blue-100 hover:shadow-lg hover:shadow-blue-900/5 transition-all duration-300 group"
    >
      <Group justify="space-between" mb="lg">
        <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-blue-50 transition-colors">
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
      <Text size="20px" fw={900} className="tracking-tighter text-slate-900">
        {value}
      </Text>
      <Text
        size="9px"
        fw={800}
        c="dimmed"
        className="uppercase tracking-widest mt-2!"
      >
        {label}
      </Text>
    </Paper>
  )
}
