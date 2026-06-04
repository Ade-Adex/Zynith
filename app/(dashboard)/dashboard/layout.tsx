// /app/(dashboard)/layout.tsx

'use client'

import React from 'react'
import {
  AppShell,
  Burger,
  Group,
  Avatar,
  Text,
  ActionIcon,
  Tooltip,
  ScrollArea,
  Menu,
  rem,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { Bell, Flame, Zap, LogOut, User, Settings } from 'lucide-react'
import { SidebarContent } from '@/app/components/dashboard/SidebarContent'
import Link from 'next/link'
import { useMediaQuery } from '@mantine/hooks'
import { useAuthStore } from '@/app/store/authStore'
import { ThemeToggle } from '@/app/components/constant/ThemeToggle'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [opened, { toggle, close }] = useDisclosure(false)
  const isMobile = useMediaQuery(`(max-width: ${rem(768)})`)
  const { user, logout, isAuthenticated } = useAuthStore()

  if (!user) {
    return null
  }

  return (
    <AppShell
      header={{ height: 70 }}
      navbar={{
        width: opened ? 260 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      className="bg-[var(--background)] text-[var(--foreground)] px-8"
    >
      {/* Global Dashboard Header */}
      <AppShell.Header className="border-b border-slate-100 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 md:px-12">
        <Group h="100%" justify="space-between" wrap="nowrap">
          <Group gap="md">
            <Burger
              opened={opened}
              onClick={toggle}
              size="sm"
              color="var(--mantine-color-gray-6)"
              className="hover:bg-slate-50 dark:hover:bg-slate-800 rounded-md p-1"
              aria-label="Toggle navigation"
            />

            <Link href="/" className="hidden sm:block">
              <Text className="text-lg! font-black! tracking-tighter! uppercase italic cursor-pointer text-slate-900 dark:text-slate-100">
                ZYNITH
                <span className="text-blue-600 dark:text-blue-500">.</span>
              </Text>
            </Link>
          </Group>

          <Group gap={isMobile ? '6px' : '12px'}>
            {/* Gamification Stats */}
            <Group gap="xs" className="hidden! lg:flex">
              <Tooltip label="12 Day Streak">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 dark:bg-orange-950/30 rounded-lg border border-orange-100 dark:border-orange-900/50">
                  <Flame
                    size={14}
                    className="text-orange-500 fill-orange-500"
                  />
                  <span className="text-xs font-black text-orange-600 dark:text-orange-400">
                    {/* {user.stats.streakDays} */}
                  </span>
                </div>
              </Tooltip>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-100 dark:border-blue-900/50">
                <Zap
                  size={14}
                  className="text-blue-600 fill-blue-600 dark:text-blue-400 dark:fill-blue-400"
                />
                <span className="text-xs font-black text-blue-600 dark:text-blue-400 uppercase">
                  {/* {user.stats.points.toLocaleString()} PTS */}
                </span>
              </div>
            </Group>

            <ThemeToggle />

            <ActionIcon variant="subtle" color="gray" size="lg">
              <Bell size={20} className="text-slate-600 dark:text-slate-400" />
            </ActionIcon>

            {/* Profile Dropdown */}
            <Menu
              shadow="md"
              width={220}
              radius="md"
              position="bottom-end"
              transitionProps={{ transition: 'pop-top-right' }}
            >
              <Menu.Target>
                <Avatar
                  src={user.avatar}
                  radius="xl"
                  size="md"
                  className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                />
              </Menu.Target>
              <Menu.Dropdown className="dark:bg-slate-900 dark:border-slate-800">
                <div className="px-3 py-2 mb-1">
                  <Text
                    size="xs"
                    fw={900}
                    className="uppercase tracking-widest text-slate-400 dark:text-slate-500"
                  >
                    Account
                  </Text>
                  <Text
                    size="sm"
                    fw={700}
                    className="text-slate-800 dark:text-slate-200"
                  >
                    {user.firstName}
                  </Text>
                </div>
                <Menu.Divider className="dark:border-slate-800" />
                <Menu.Item
                  component={Link}
                  href="/dashboard/profile"
                  leftSection={<User size={16} />}
                  className="dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Profile
                </Menu.Item>
                <Menu.Item
                  component={Link}
                  href="/dashboard/settings"
                  leftSection={<Settings size={16} />}
                  className="dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300"
                >
                  Settings
                </Menu.Item>
                <Menu.Divider className="dark:border-slate-800" />
                <Menu.Item
                  color="red"
                  onClick={logout}
                  leftSection={<LogOut size={16} />}
                  className="dark:hover:bg-red-950/30"
                >
                  <span className="font-bold">Logout</span>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar Section */}
      <AppShell.Navbar className="border-r border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-10">
        <AppShell.Section grow component={ScrollArea} mx="-xs" px="xs">
          <SidebarContent
            isCollapsed={!opened}
            closeSidebar={close}
            isMobile={isMobile}
          />
        </AppShell.Section>

        {/* Mini Profile info when Sidebar is Open */}
        {opened && (
          <AppShell.Section className="border-t border-slate-50 dark:border-slate-900 pt-4">
            <div className="bg-slate-50 dark:bg-slate-900/50 p-3 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <Avatar src={user.avatar} size="sm" radius="md" />
              <div className="flex-1 overflow-hidden">
                <Text
                  size="11px"
                  fw={900}
                  className="truncate uppercase text-slate-800 dark:text-slate-200"
                >
                  {user.firstName}
                </Text>
                <Text
                  size="10px"
                  c="dimmed"
                  fw={700}
                  className="truncate text-slate-400 dark:text-slate-500"
                >
                  Active Student
                </Text>
              </div>
            </div>
          </AppShell.Section>
        )}
      </AppShell.Navbar>

      {/* Primary Content Window */}
      <AppShell.Main className="bg-[var(--background)]">
        <div className="max-w-6xl mx-auto">{children}</div>
      </AppShell.Main>
    </AppShell>
  )
}