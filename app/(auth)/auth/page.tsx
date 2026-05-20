// /app/(auth)/auth/page.tsx
'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { sendMagicLinkAction } from '@/app/services/authActions'
import { useAuthStore } from '@/app/store/authStore'
import { useSnackbar } from 'notistack'
import { Mail, CheckCircle2, Loader2 } from 'lucide-react'

export default function LoginPage() {
  const [email, setEmail] = useState<string>('')
  const [isPending, startTransition] = useTransition()
  const [isSent, setIsSent] = useState<boolean>(false)

  const router = useRouter()
  const { enqueueSnackbar } = useSnackbar()

  // Connect directly to the specific reactive store property
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)

  // Listens for updates driven by the AuthSyncManager cross-tab rehydration process
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard')
    }
  }, [isAuthenticated, router])

  const handleMagicLinkSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!email) return

    startTransition(async () => {
      const response = await sendMagicLinkAction(email)

      if (response.success) {
        setIsSent(true)
        enqueueSnackbar('Magic link sent! Check your inbox.', {
          variant: 'success',
        })
      } else {
        enqueueSnackbar(response.message || 'Failed to send magic link.', {
          variant: 'error',
        })
      }
    })
  }

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white border border-slate-100 rounded-3xl p-8 shadow-xl shadow-slate-100/50">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900 uppercase italic">
            Zynith<span className="text-blue-600">.</span>
          </h1>
          <p className="text-sm font-semibold text-slate-500 mt-2">
            Sign in safely with a passwordless magic link
          </p>
        </div>

        {isSent ? (
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 text-center">
            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Check your inbox
            </h3>
            <p className="text-xs text-slate-500 font-medium mt-2 leading-relaxed">
              We just emailed a secure authentication link to{' '}
              <strong className="text-slate-700">{email}</strong>. It remains
              valid for 15 minutes.
            </p>
            <div className="mt-4 flex items-center justify-center gap-2 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
              <Loader2 size={12} className="animate-spin text-blue-500" />
              Waiting for email verification...
            </div>
          </div>
        ) : (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                  <Mail size={16} />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  disabled={isPending}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@domain.com"
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs font-semibold focus:outline-none focus:bg-white focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5 transition-all outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !email}
              className={`w-full py-3 bg-slate-900 hover:bg-blue-600 text-white rounded-2xl text-sm! font-black uppercase tracking-widest transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2  disabled:opacity-50 ${isPending ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Magic Link'
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
