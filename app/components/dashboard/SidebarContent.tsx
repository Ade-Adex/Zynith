'use client'

import React from 'react'
import { Stack, NavLink, Badge, Tooltip } from '@mantine/core'
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Users,
  Wallet,
  Settings,
  HelpCircle,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

interface SidebarContentProps {
  isCollapsed: boolean
}

const SIDEBAR_DATA = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: BookOpen, label: 'My Learning', href: '/dashboard/courses' },
  { icon: Users, label: 'Peer Review', href: '/dashboard/p2p', badge: 2 },
  { icon: Award, label: 'Certificates', href: '/dashboard/certificates' },
  { icon: Wallet, label: 'Marketplace', href: '/dashboard/wallet' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]

export function SidebarContent({ isCollapsed }: SidebarContentProps) {
  const pathname = usePathname()

  return (
    <Stack gap={4} px={isCollapsed ? 4 : 0}>
      {SIDEBAR_DATA.map((item) => {
        const isActive = pathname === item.href

        const linkContent = (
          <NavLink
            component={Link}
            href={item.href}
            label={isCollapsed ? null : item.label}
            leftSection={
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
            }
            rightSection={
              !isCollapsed && item.badge ? (
                <Badge size="xs" color="blue" variant="filled" circle>
                  {item.badge}
                </Badge>
              ) : null
            }
            active={isActive}
            variant="light"
            color="blue"
            className={`
              rounded-xl py-3! transition-all duration-200
              ${
                isActive
                  ? 'font-bold uppercase tracking-widest text-[10px]! bg-blue-50 text-blue-700'
                  : 'font-semibold uppercase tracking-widest text-[10px]! text-slate-500 hover:bg-slate-50'
              }
            `}
          />
        )

        return isCollapsed ? (
          <Tooltip
            key={item.label}
            label={item.label}
            position="right"
            withArrow
            offset={15}
          >
            {linkContent}
          </Tooltip>
        ) : (
          <React.Fragment key={item.label}>{linkContent}</React.Fragment>
        )
      })}

      {/* Support Section at Bottom */}
      <div className="mt-8 pt-8 border-t border-slate-50">
        <NavLink
          label={isCollapsed ? null : 'Help Center'}
          leftSection={<HelpCircle size={20} />}
          className="rounded-xl py-3! font-semibold uppercase tracking-widest text-[10px]! text-slate-400 hover:text-slate-600"
        />
      </div>
    </Stack>
  )
}
