// // /app/components/auth/AuthSyncManager.tsx'

// 'use client'

// import { useEffect } from 'react'
// import { useRouter, usePathname } from 'next/navigation'
// import { useAuthStore } from '@/app/store/authStore'
// import { useSnackbar } from 'notistack'

// export function AuthSyncManager({ children }: { children: React.ReactNode }) {
//   const router = useRouter()
//   const pathname = usePathname()
//   const { enqueueSnackbar } = useSnackbar()
//   const { isAuthenticated, authenticatedAt, logout } = useAuthStore()

//   useEffect(() => {
//     // 1. Cross-Tab Sync Mechanism
//     const handleStorageSync = (event: StorageEvent) => {
//       if (event.key === 'zynith-auth-storage') {
//         if (!event.newValue) {
//           logout()
//           if (pathname.startsWith('/dashboard')) {
//             enqueueSnackbar('Session terminated from another tab.', {
//               variant: 'info',
//             })
//             router.replace('/auth')
//           }
//           return
//         }

//         try {
//           const parsed = JSON.parse(event.newValue)
//           const isTargetAuthenticated = parsed?.state?.isAuthenticated

//           if (isTargetAuthenticated && !isAuthenticated) {
//             // CRITICAL FIX: Explicitly force Zustand to sync the fresh localStorage changes into this tab's state
//             useAuthStore.persist.rehydrate()

//             enqueueSnackbar('Authenticated from another tab. Welcome back!', {
//               variant: 'success',
//             })

//             // ALLOW TO ANY DASHBOARD ROUTE: Only redirect if they are stuck on the auth page
//             if (pathname === '/auth') {
//               router.replace('/dashboard')
//             }
//           }
//         } catch (err) {
//           console.error('Failed to parse cross-tab sync package.', err)
//         }
//       }
//     }

//     window.addEventListener('storage', handleStorageSync)
//     return () => window.removeEventListener('storage', handleStorageSync)
//   }, [isAuthenticated, logout, router, pathname, enqueueSnackbar])

//   useEffect(() => {
//     // 2. Token Lifetime Expiration Tracker (15 mins validation window)
//     if (!isAuthenticated || !authenticatedAt) return

//     const checkSessionValidity = () => {
//       const fifteenMinutesMs = 15 * 60 * 1000
//       const expirationThreshold = authenticatedAt + fifteenMinutesMs

//       if (Date.now() > expirationThreshold) {
//         logout()
//         enqueueSnackbar('Your secure workspace access token has expired.', {
//           variant: 'error',
//         })
//         router.replace('/auth')
//       }
//     }

//     checkSessionValidity()
//     const liveTrackerInterval = setInterval(checkSessionValidity, 5000)

//     return () => clearInterval(liveTrackerInterval)
//   }, [isAuthenticated, authenticatedAt, logout, router, enqueueSnackbar])

//   useEffect(() => {
//     if (isAuthenticated && pathname === '/auth') {
//       router.replace('/dashboard')
//     }
//     if (!isAuthenticated && pathname.startsWith('/dashboard')) {
//       router.replace('/auth')
//     }
//   }, [isAuthenticated, pathname, router])

//   return <>{children}</>
// }



// /app/components/auth/AuthSyncManager.tsx'

'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { useAuthStore } from '@/app/store/authStore'
import { useSnackbar } from 'notistack'

export function AuthSyncManager({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { enqueueSnackbar } = useSnackbar()
  const { isAuthenticated, authenticatedAt, logout, hasHydrated } =
    useAuthStore()

  // 1. Cross-Tab Sync
  useEffect(() => {
    const handleStorageSync = (event: StorageEvent) => {
      if (event.key === 'zynith-auth-storage') {
        if (!event.newValue) {
          logout()
          if (pathname.startsWith('/dashboard')) {
            enqueueSnackbar('Session terminated from another tab.', {
              variant: 'info',
            })
            router.replace('/auth')
          }
          return
        }

        try {
          const parsed = JSON.parse(event.newValue)
          const isTargetAuthenticated = parsed?.state?.isAuthenticated

          if (isTargetAuthenticated && !isAuthenticated) {
            useAuthStore.persist.rehydrate()
            enqueueSnackbar('Authenticated from another tab. Welcome back!', {
              variant: 'success',
            })

            // Only redirect if they are stuck on auth page
            if (pathname === '/auth') {
              router.replace('/dashboard')
            }
          }
        } catch (err) {
          console.error('Failed to parse cross-tab sync package.', err)
        }
      }
    }

    window.addEventListener('storage', handleStorageSync)
    return () => window.removeEventListener('storage', handleStorageSync)
  }, [isAuthenticated, logout, router, pathname, enqueueSnackbar])

  // 2. Token Lifetime Tracker
  useEffect(() => {
    if (!hasHydrated || !isAuthenticated || !authenticatedAt) return

    const checkSessionValidity = () => {
      const fifteenMinutesMs = 15 * 60 * 1000
      const expirationThreshold = authenticatedAt + fifteenMinutesMs

      if (Date.now() > expirationThreshold) {
        logout()
        enqueueSnackbar('Your secure workspace access token has expired.', {
          variant: 'error',
        })
        router.replace('/auth')
      }
    }

    checkSessionValidity()
    const liveTrackerInterval = setInterval(checkSessionValidity, 5000)
    return () => clearInterval(liveTrackerInterval)
  }, [
    isAuthenticated,
    authenticatedAt,
    hasHydrated,
    logout,
    router,
    enqueueSnackbar,
  ])

  // 3. Routing Guard
  useEffect(() => {
    // CRITICAL: Do nothing until the store has finished loading
    if (!hasHydrated) return

    // If logged in, don't let them sit on /auth
    if (isAuthenticated && pathname === '/auth') {
      router.replace('/dashboard')
    }

    // If NOT logged in, don't let them access any dashboard route
    if (!isAuthenticated && pathname.startsWith('/dashboard')) {
      router.replace('/auth')
    }
  }, [isAuthenticated, hasHydrated, pathname, router])

  return <>{children}</>
}