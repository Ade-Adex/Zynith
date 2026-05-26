// /app/(auth)/auth/callback/page.tsx

'use client'

import React, { useEffect, useRef, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { verifyTokenAndLoginAction } from '@/app/services/authActions'
import { useAuthStore } from '@/app/store/authStore'
import { useSnackbar } from 'notistack'
import { Loader2 } from 'lucide-react'

function CallbackHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const login = useAuthStore((state) => state.login)
  const { enqueueSnackbar } = useSnackbar()
  const verificationAttempted = useRef(false)

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      enqueueSnackbar('No verification token found in URL.', {
        variant: 'error',
      })
      router.replace('/auth')
      return
    }

    if (verificationAttempted.current) return
    verificationAttempted.current = true

    async function executeVerification() {
      try {
        const result = await verifyTokenAndLoginAction(token as string)

        if (result.success && result.userData) {
          const parsedUser = JSON.parse(result.userData)

          // Set zustand store layer data alongside the authenticated timestamp
          login(parsedUser)

          enqueueSnackbar('Welcome back! Login successful.', {
            variant: 'success',
          })
          router.replace('/dashboard')
        } else {
          enqueueSnackbar(result.message || 'Verification process failed.', {
            variant: 'error',
          })
          router.replace('/auth')
        }
      } catch (err) {
        console.error('Callback error:', err)
        enqueueSnackbar('An unexpected system error occurred.', {
          variant: 'error',
        })
        router.replace('/auth')
      }
    }

    executeVerification()
  }, [searchParams, login, router, enqueueSnackbar])

  return (
    <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 text-center shadow-xl shadow-slate-100/50">
      <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase italic mb-6">
        Zynith<span className="text-blue-600">.</span>
      </h1>

      <div className="flex flex-col items-center justify-center space-y-4">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <p className="text-xs font-bold uppercase tracking-widest text-slate-500">
          Validating Workspace Access Session...
        </p>
      </div>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
      <Suspense
        fallback={<Loader2 size={32} className="animate-spin text-blue-600" />}
      >
        <CallbackHandler />
      </Suspense>
    </main>
  )
}