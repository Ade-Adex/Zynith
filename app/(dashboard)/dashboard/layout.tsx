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
import {
  Search,
  Bell,
  Flame,
  Zap,
  Menu as MenuIcon,
  LogOut,
  User,
  Settings,
} from 'lucide-react'
import { MOCK_USER } from '@/app/data/mockUser'
import { SidebarContent } from '@/app/components/dashboard/SidebarContent'
import Link from 'next/link'
import { useMediaQuery } from '@mantine/hooks'
import { useAuth } from '@/app/context/AuthContext'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
 const [opened, { toggle, close }] = useDisclosure(false)
  const isMobile = useMediaQuery(`(max-width: ${rem(768)})`)
  const { user, logout } = useAuth()

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
      className="bg-[#fcfcfd] px-8"
    >
      {/* Global Dashboard Header */}
      <AppShell.Header className="border-b border-slate-100 bg-white/80 backdrop-blur-md px-6 md:px-12">
        <Group h="100%" justify="space-between" wrap="nowrap">
          <Group gap="md">
            <ActionIcon
              variant="subtle"
              color="gray"
              onClick={toggle}
              size="lg"
              className="hover:bg-slate-50"
            >
              <MenuIcon size={20} className="text-slate-600" />
            </ActionIcon>

            <Link href="/" className="hidden sm:block">
              <Text className="text-lg! font-black! tracking-tighter! uppercase italic cursor-pointer">
                ZYNITH<span className="text-blue-600">.</span>
              </Text>
            </Link>
          </Group>

          <Group gap={isMobile ? '6px' : '12px'}>
            {/* Gamification Stats */}
            <Group gap="xs" className="hidden! lg:flex">
              <Tooltip label="12 Day Streak">
                <div className="flex items-center gap-1.5 px-3 py-1.5 bg-orange-50 rounded-lg border border-orange-100">
                  <Flame
                    size={14}
                    className="text-orange-500 fill-orange-500"
                  />
                  <span className="text-xs font-black text-orange-600">
                    {MOCK_USER.stats.streakDays}
                  </span>
                </div>
              </Tooltip>

              <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 rounded-lg border border-blue-100">
                <Zap size={14} className="text-blue-600 fill-blue-600" />
                <span className="text-xs font-black text-blue-600 uppercase">
                  {MOCK_USER.stats.points.toLocaleString()} PTS
                </span>
              </div>
            </Group>

            <ActionIcon variant="subtle" color="gray" size="lg">
              <Bell size={20} />
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
                  src={MOCK_USER.avatar}
                  radius="xl"
                  size="md"
                  className="cursor-pointer border-2 border-transparent hover:border-blue-500 transition-all"
                />
              </Menu.Target>
              <Menu.Dropdown>
                <div className="px-3 py-2 mb-1">
                  <Text
                    size="xs"
                    fw={900}
                    className="uppercase tracking-widest text-slate-400"
                  >
                    Account
                  </Text>
                  <Text size="sm" fw={700}>
                    {MOCK_USER.name}
                  </Text>
                </div>
                <Menu.Divider />
                <Menu.Item leftSection={<User size={16} />}>Profile</Menu.Item>
                <Menu.Item leftSection={<Settings size={16} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  color="red"
                  onClick={logout}
                  leftSection={<LogOut size={16} />}
                >
                  <span className="font-bold">Logout</span>
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      {/* Sidebar Section */}
      <AppShell.Navbar className="border-r border-slate-100 px-4 py-10">
        <AppShell.Section grow component={ScrollArea} mx="-xs" px="xs">
          <SidebarContent isCollapsed={!opened} closeSidebar={close} />
        </AppShell.Section>

        {/* Mini Profile info when Sidebar is Open */}
        {opened && (
          <AppShell.Section className="border-t border-slate-50 pt-0">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 flex items-center gap-3">
              <Avatar src={MOCK_USER.avatar} size="sm" radius="md" />
              <div className="flex-1 overflow-hidden">
                <Text size="11px" fw={900} className="truncate uppercase">
                  {MOCK_USER.firstName}
                </Text>
                <Text size="10px" c="dimmed" fw={700} className="truncate">
                  Active Student
                </Text>
              </div>
            </div>
          </AppShell.Section>
        )}
      </AppShell.Navbar>

      {/* Primary Content Window */}
      <AppShell.Main>
        <div className="max-w-6xl mx-auto ">{children}</div>
      </AppShell.Main>
    </AppShell>
  )
}
