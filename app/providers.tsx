
// /app/providers.tsx
'use client'

import React from 'react'
import { MantineProvider, createTheme } from '@mantine/core'
import { SnackbarProvider } from 'notistack'
import { AuthSyncManager } from '@/app/components/auth/AuthSyncManager'

import '@mantine/core/styles.css'
import '@mantine/carousel/styles.css'

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'var(--font-jakarta), var(--font-inter), sans-serif',
  fontFamilyMonospace: 'var(--font-jetbrains), monospace',
  defaultRadius: 'xl',
})

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="auto">
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3000}
      >
        <AuthSyncManager>{children}</AuthSyncManager>
      </SnackbarProvider>
    </MantineProvider>
  )
}
