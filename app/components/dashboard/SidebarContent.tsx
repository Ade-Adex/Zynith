// /app/components/dashboard/SidebarContent.tsx

'use client'

import React from 'react'
import { Stack, NavLink, Badge, Tooltip, rem } from '@mantine/core'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SIDEBAR_DATA } from '@/app/data/sidebarData'
import { HelpCircle } from 'lucide-react'

interface SidebarContentProps {
  isCollapsed: boolean
  closeSidebar: () => void
  isMobile?: boolean
}

export function SidebarContent({
  isCollapsed,
  closeSidebar,
  isMobile,
}: SidebarContentProps) {
  const pathname = usePathname()

  const handleLinkClick = () => {
    if (isMobile) {
      closeSidebar()
    }
  }

  return (
    <Stack gap={4} px={isCollapsed ? 4 : 0}>
      {SIDEBAR_DATA.map((item) => {
        const isActive = pathname === item.href

        const linkContent = (
          <NavLink
            component={Link}
            href={item.href}
            label={isCollapsed ? null : item.label}
            onClick={handleLinkClick}
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
            className={`rounded-xl py-3! transition-all duration-200 ${
              isActive
                ? 'font-bold uppercase tracking-widest text-[10px]! bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400'
                : 'font-semibold uppercase tracking-widest text-[10px]! text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/50'
            }`}
          />
        )

        return (
          <React.Fragment key={item.label}>
            {isCollapsed ? (
              <Tooltip
                label={item.label}
                position="right"
                withArrow
                offset={15}
              >
                <div className="w-full">{linkContent}</div>
              </Tooltip>
            ) : (
              linkContent
            )}
          </React.Fragment>
        )
      })}

      <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800">
        <NavLink
          label={isCollapsed ? null : 'Help Center'}
          leftSection={<HelpCircle size={20} />}
          onClick={handleLinkClick}
          className="rounded-xl py-3! font-semibold uppercase tracking-widest text-[10px]! text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300"
        />
      </div>
    </Stack>
  )
}