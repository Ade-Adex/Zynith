'use client'

import React from 'react'
import {
  AppShell,
  Burger,
  NavLink,
  ScrollArea,
  Avatar,
  Group,
  Text,
  Badge,
  Tooltip,
  ActionIcon,
  Stack,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Users,
  Wallet,
  Settings,
  LogOut,
  ChevronLeft,
  Flame,
} from 'lucide-react'
import { MOCK_USER } from '@/app/data/mockUser'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarItem {
  icon: React.ElementType
  label: string
  href: string
  badge?: number
}

const SIDEBAR_DATA: SidebarItem[] = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: BookOpen, label: 'My Learning', href: '/dashboard/courses' },
  { icon: Users, label: 'Peer Review', href: '/dashboard/p2p', badge: 2 },
  { icon: Award, label: 'Certificates', href: '/dashboard/certificates' },
  { icon: Wallet, label: 'Marketplace', href: '/dashboard/wallet' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [opened, { toggle }] = useDisclosure(true)
  const pathname = usePathname()

  return (
    <AppShell
      navbar={{
        width: opened ? 280 : 80,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="lg"
      transitionDuration={300}
      transitionTimingFunction="ease"
      className="bg-[#fcfcfd]"
    >
      <AppShell.Navbar
        p="md"
        className="border-r border-slate-100 shadow-sm bg-white"
      >
        {/* Header / Logo */}
        <AppShell.Section className="flex items-center justify-between px-2 mb-10 mt-2">
          {opened && (
            <Link
              href="/"
              className="tracking-tighter italic text-xl  font-extrabold uppercase"
            >
              ZYNITH<span className="text-blue-600">.</span>
            </Link>
          )}
          <ActionIcon
            variant="subtle"
            color="gray"
            onClick={toggle}
            className={!opened ? 'mx-auto' : ''}
          >
            {opened ? (
              <ChevronLeft size={18} />
            ) : (
              <Burger opened={false} size="sm" />
            )}
          </ActionIcon>
        </AppShell.Section>

        {/* Navigation */}
        <AppShell.Section grow component={ScrollArea} className="-mx-2 px-2">
          <Stack gap={4}>
            {SIDEBAR_DATA.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip
                  key={item.label}
                  label={item.label}
                  disabled={opened}
                  position="right"
                  withArrow
                >
                  <Link href={item.href} className="no-underline">
                    <NavLink
                      label={opened ? item.label : null}
                      leftSection={
                        <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
                      }
                      rightSection={
                        opened && item.badge ? (
                          <Badge size="xs" color="blue" variant="filled">
                            {item.badge}
                          </Badge>
                        ) : null
                      }
                      active={isActive}
                      variant="light"
                      color="blue"
                      className={`rounded-xl py-3! font-bold! uppercase tracking-widest text-[10px]! transition-all
                        ${isActive ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:bg-slate-50'}
                      `}
                    />
                  </Link>
                </Tooltip>
              )
            })}
          </Stack>
        </AppShell.Section>

        {/* Footer / User Profile */}
        <AppShell.Section className="border-t border-slate-50 pt-6">
          <Group
            justify={opened ? 'space-between' : 'center'}
            className={`transition-all ${opened ? 'bg-slate-50 p-2 rounded-2xl border border-slate-100' : ''}`}
          >
            <Avatar
              src={MOCK_USER.avatar}
              radius="xl"
              size={opened ? 'md' : 'sm'}
            />
            {opened && (
              <div className="flex-1 min-w-0">
                <Text size="xs" fw={900} className="truncate uppercase">
                  {MOCK_USER.firstName}
                </Text>
                <div className="flex items-center gap-1">
                  <Flame
                    size={10}
                    className="text-orange-500 fill-orange-500"
                  />
                  <Text size="10px" c="dimmed" fw={700}>
                    {MOCK_USER.stats.streakDays} Day Streak
                  </Text>
                </div>
              </div>
            )}
            {opened && (
              <LogOut
                size={14}
                className="text-slate-300 hover:text-red-500 cursor-pointer"
              />
            )}
          </Group>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <div className="max-w-300 mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
          {children}
        </div>
      </AppShell.Main>
    </AppShell>
  )
}
