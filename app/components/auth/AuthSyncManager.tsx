// /app/components/auth/AuthSyncManager.tsx

'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/app/store/authStore'
import { useSnackbar } from 'notistack'
import { logoutAction } from '@/app/services/authActions'

export function AuthSyncManager({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { enqueueSnackbar } = useSnackbar()

  const { isAuthenticated, authenticatedAt, logout, hasHydrated } =
    useAuthStore()

  /**
   * 1. Cross-Tab Authentication Sync
   */
  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key !== 'zynith-auth-storage') return

      try {
        if (!event.newValue) {
          logout()
          logoutAction()

          if (pathname.startsWith('/dashboard')) {
            enqueueSnackbar('Session terminated from another tab.', {
              variant: 'info',
            })
            router.replace('/auth')
          }
          return
        }

        const parsed = JSON.parse(event.newValue)
        const incomingAuthState = parsed?.state?.isAuthenticated ?? false

        if (incomingAuthState && !isAuthenticated) {
          useAuthStore.persist.rehydrate()
          enqueueSnackbar('Authenticated from another tab. Welcome back!', {
            variant: 'success',
          })

          if (pathname === '/auth') {
            router.replace('/dashboard')
          }
        }

        if (!incomingAuthState && isAuthenticated) {
          logout()
          logoutAction()
          enqueueSnackbar('Session terminated from another tab.', {
            variant: 'info',
          })

          if (pathname.startsWith('/dashboard')) {
            router.replace('/auth')
          }
        }
      } catch (err) {
        console.error('Failed to parse auth sync package.', err)
      }
    }

    window.addEventListener('storage', handleStorageSync)
    return () => window.removeEventListener('storage', handleStorageSync)
  }, [isAuthenticated, logout, pathname, router, enqueueSnackbar])

  /**
   * 2. Session Expiration Tracker (Updated cleanly to 1 Day)
   */
  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !authenticatedAt) {
      return
    }

    const checkSessionValidity = async () => {
      // 24 Hours absolute timeframe calculation
      const oneDayMs = 24 * 60 * 60 * 1000
      const expirationThreshold = authenticatedAt + oneDayMs

      if (Date.now() > expirationThreshold) {
        logout()
        await logoutAction() // Clear background server cookie path

        enqueueSnackbar(
          'Your workspace verification session has expired (1 Day limit reached).',
          {
            variant: 'error',
          },
        )

        router.replace('/auth')
      }
    }

    checkSessionValidity()
    const liveTrackerInterval = setInterval(checkSessionValidity, 15000) // Sweeps cleanly every 15s

    return () => clearInterval(liveTrackerInterval)
  }, [
    isAuthenticated,
    authenticatedAt,
    hasHydrated,
    logout,
    router,
    enqueueSnackbar,
  ])

  /**
   * 3. Route Protection Guard
   */
  useEffect(() => {
    if (!hasHydrated) return

    if (isAuthenticated && pathname === '/auth') {
      router.replace('/dashboard')
      return
    }

    if (!isAuthenticated && pathname.startsWith('/dashboard')) {
      router.replace('/auth')
      return
    }
  }, [isAuthenticated, hasHydrated, pathname, router])

  return <>{children}</>
}