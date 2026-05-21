'use client'

import React from 'react'
import { Tooltip, UnstyledButton, useMantineColorScheme } from '@mantine/core'
import { Sun, Moon } from 'lucide-react'

export function ThemeToggle() {
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
          <React.Fragment>
            <Sun size={18} className="text-yellow-500" />
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Moon size={18} />
          </React.Fragment>
        )}
      </UnstyledButton>
    </Tooltip>
  )
}
