// /app/(auth)/auth/page.tsx

'use client'

import React, { useState, useTransition, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { sendMagicLinkAction } from '@/app/services/authActions'
import { useAuthStore } from '@/app/store/authStore'
import { useSnackbar } from 'notistack'
import { Mail, CheckCircle2, Loader2, ArrowLeft } from 'lucide-react'

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
    <main className="min-h-screen w-full flex items-center justify-center bg-background px-4 text-foreground transition-colors duration-300 relative overflow-hidden">
      {/* Dynamic Background Ambiance Radials */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-125 h-125 bg-blue-600/3 dark:bg-blue-500/2 blur-[120px] rounded-full pointer-events-none" />

      <div className="w-full max-w-md bg-white dark:bg-background/80 border border-slate-200/60 dark:border-border/60 rounded-3xl p-8 md:p-10 shadow-2xl shadow-slate-100/50 dark:shadow-black/30 relative z-10 transition-all duration-300">
        {/* Absolute Back Trigger Link */}
        {!isSent && (
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 mb-6 transition-colors group/back"
          >
            <ArrowLeft
              size={14}
              className="transform group-hover/back:-translate-x-0.5 transition-transform duration-200"
            />
            Back to Home
          </Link>
        )}

        <div className="text-center mb-8">
          <h1 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic">
            Zynith<span className="text-blue-600 dark:text-blue-500">.</span>
          </h1>
          <p className="text-xs md:text-sm font-semibold text-slate-500 dark:text-slate-400 mt-2">
            Sign in safely with a passwordless magic link
          </p>
        </div>

        {isSent ? (
          <div className="bg-blue-50/40 dark:bg-blue-950/20 border border-blue-100/70 dark:border-blue-900/30 rounded-2xl p-6 text-center transition-all">
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
              <CheckCircle2 size={24} />
            </div>
            <h3 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Check your inbox
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-2 leading-relaxed">
              We just emailed a secure authentication link to{' '}
              <strong className="text-slate-800 dark:text-slate-200 break-all">
                {email}
              </strong>
              . It remains valid for 15 minutes.
            </p>

            <div className="mt-5 pt-4 border-t border-blue-100/50 dark:border-blue-900/20 flex items-center justify-center gap-2 text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-widest">
              <Loader2
                size={12}
                className="animate-spin text-blue-600 dark:text-blue-500"
              />
              Waiting for verification...
            </div>
          </div>
        ) : (
          <form onSubmit={handleMagicLinkSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-slate-500 mb-2"
              >
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 dark:text-slate-500">
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
                  className="w-full pl-11! pr-4 py-3! border-none! bg-slate-100! dark:bg-surface! text-slate-900 dark:text-white rounded-2xl text-sm! font-semibold focus:outline-none! focus:border-none! focus:ring-0! focus-visible:ring-0! focus-visible:outline-none! transition-all disabled:opacity-50 placeholder:text-slate-400 dark:placeholder:text-slate-600"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending || !email}
              className={`w-full py-3.5 bg-[#2563eb]! hover:bg-[#2563eb] dark:hover:bg-[#2563eb]! text-white rounded-2xl text-sm! font-black! uppercase tracking-widest transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-50 ${isPending ||  !email ? 'cursor-not-allowed' : 'cursor-pointer'}`}
            >
              {isPending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Sending Link...
                </>
              ) : (
                'Send Link'
              )}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}