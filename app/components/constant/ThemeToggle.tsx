// /app/components/constant/ThemeToggle.tsx

'use client'

import React from 'react'
import dynamic from 'next/dynamic'
import { Tooltip, UnstyledButton, useMantineColorScheme } from '@mantine/core'
import { Sun, Moon } from 'lucide-react'

function ThemeToggleContent() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  const isDark = colorScheme === 'dark'

  return (
    <Tooltip
      className="text-xs!"
      label={isDark ? 'Switch to Light' : 'Switch to Dark'}
    >
      <UnstyledButton
        onClick={() => setColorScheme(isDark ? 'light' : 'dark')}
        className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors border! border-slate-300! dark:border-slate-600!"
      >
        {isDark ? (
          <Sun size={18} className="text-yellow-500" />
        ) : (
          <Moon size={18} />
        )}
      </UnstyledButton>
    </Tooltip>
  )
}

// 2. Export a dynamically imported version with SSR disabled to prevent execution loops
export const ThemeToggle = dynamic(() => Promise.resolve(ThemeToggleContent), {
  ssr: false,
  // This layout acts as a visual placeholder shell during the immediate render flash
  loading: () => (
    <div className="w-9 h-9 flex items-center justify-center rounded-full border border-slate-300 dark:border-zinc-800 opacity-40">
      <div className="w-[18px] h-[18px]" />
    </div>
  ),
})