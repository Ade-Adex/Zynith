// /app/providers.tsx
'use client'

import React from 'react'
import { MantineProvider, createTheme } from '@mantine/core'
import { SnackbarProvider } from 'notistack'
import { AuthSyncManager } from '@/app/components/auth/AuthSyncManager'
import '@mantine/core/styles.css'

const theme = createTheme({
  primaryColor: 'blue',
  fontFamily: 'var(--font-geist-sans)',
  fontFamilyMonospace: 'var(--font-geist-mono)',
  defaultRadius: 'xl',
})

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider theme={theme} defaultColorScheme="light">
      <SnackbarProvider
        maxSnack={3}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        autoHideDuration={3000}
      >
        <AuthSyncManager>
          {children}
        </AuthSyncManager>
      </SnackbarProvider>
    </MantineProvider>
  )
}