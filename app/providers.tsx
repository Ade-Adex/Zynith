'use client'

import React from 'react'
import { MantineProvider, createTheme } from '@mantine/core'
import { SnackbarProvider } from 'notistack'
import '@mantine/core/styles.css'
import { AuthProvider } from '@/app/context/AuthContext'

// You can customize your Mantine theme here to match Zynith's branding
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
        <AuthProvider>
          {children}
        </AuthProvider>
      </SnackbarProvider>
    </MantineProvider>
  )
}
