// // /app/(dashboard)/dashboard/certificates/[id]/page.tsx



'use client'

import React, { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import {
  Text,
  Loader,
  Badge,
  Paper,
  Group,
  Tooltip,
  ActionIcon,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  ShieldCheck,
  Award,
  Cpu,
  Share2,
  Printer,
  ChevronLeft,
} from 'lucide-react'
import { useAuthStore } from '@/app/store/authStore'
import { getDashboardOverviewAction } from '@/app/services/dashboardActions'
import { DashboardData } from '@/app/types/user'

interface SingleCertificateRouteProps {
  params: Promise<{ id: string }>
}

type StructuredUserPayload = DashboardData['user']

interface StableCertificate {
  id: string
  courseId?: string | number
  courseTitle?: string
  title?: string
  issueDate?: string
  url?: string
}

export default function SingleCertificateViewPortal({
  params,
}: SingleCertificateRouteProps) {
  const resolvedParams = use(params)
  const targetCertificateId = resolvedParams.id

  const isMobile = useMediaQuery('(max-width: 768px)')
  const { user: authUser } = useAuthStore()

  const [loading, setLoading] = useState(true)
  const [certificate, setCertificate] = useState<StableCertificate | null>(null)
  const [userPayload, setUserPayload] = useState<StructuredUserPayload | null>(
    null,
  )

  useEffect(() => {
    async function loadTargetCertificate() {
      try {
        if (!authUser?._id) return
        setLoading(true)

        const response = await getDashboardOverviewAction(authUser._id)
        if (response?.success && response?.data) {
          const dashboardData = response.data as DashboardData
          const certificatesList = (dashboardData.certificates ||
            []) as StableCertificate[]

          // Locate exact targeted certificate
          const targetCert = certificatesList.find(
            (cert) => String(cert.id) === String(targetCertificateId),
          )

          if (targetCert) {
            setCertificate(targetCert)
            setUserPayload(dashboardData.user || {})
          }
        }
      } catch (error) {
        console.error('Error fetching target certificate structure:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTargetCertificate()
  }, [authUser?._id, targetCertificateId])

  // Native share handling logic
  const handleShareCertificate = async () => {
    if (!certificate) return
    const secureUrl = `${window.location.origin}/dashboard/certificates/${certificate.id}`
    const shareData = {
      title: `Zynith Credential - ${certificate.courseTitle || certificate.title || 'Framework Verification'}`,
      text: `Review the validated educational achievements awarded through the Zynith LMS Excellence Platform.`,
      url: secureUrl,
    }

    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData)
      } catch (error) {
        console.error('Error sharing through system native component:', error)
      }
    } else {
      // Graceful fallback to clipboard copy if runtime environment lacks web-share API hooks
      try {
        await navigator.clipboard.writeText(secureUrl)
        alert('Sharing context copied to clipboard link secure buffer.')
      } catch (copyError) {
        console.error('Sharing context generation fallback fault:', copyError)
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader size="sm" color="blue" />
        <Text
          size="xs"
          fw={800}
          className="uppercase tracking-[0.25em] text-slate-500"
        >
          Verifying Credential Link...
        </Text>
      </div>
    )
  }

  // Handle missing or unauthorized certificate items natively
  if (!certificate) {
    return notFound()
  }

  return (
    <div className="py-6 md:py-12 max-w-4xl mx-auto min-h-screen bg-background text-foreground selection:bg-blue-500/10">
      {/* ACTION HEADER */}
      <div className="print:hidden">
        <Link
          href="/dashboard/certificates"
          className="inline-flex gap-1.5 text-xs font-bold text-muted-foreground hover:text-blue-500 mb-4 transition-colors duration-200 group"
        >
          <ChevronLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Go Back
        </Link>
      </div>

      <div className="space-y-6">
        {/* ACTION TOOLBAR CONTROLS */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl print:hidden">
          <Group gap="xs" className="px-1">
            <ShieldCheck size={15} className="text-emerald-500" />
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Secured Verification Code:{' '}
              <span className="font-mono text-slate-900 dark:text-white font-bold tracking-tight bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
                {certificate.id}
              </span>
            </span>
          </Group>

          <Group gap="xs" className="justify-end w-full sm:w-auto">
            <Tooltip label="Share" position="top" withArrow>
              <ActionIcon
                variant="default"
                size="lg"
                radius="md"
                className="hover:text-blue-500 bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-slate-800"
                onClick={handleShareCertificate}
              >
                <Share2 size={15} />
              </ActionIcon>
            </Tooltip>

            <button
              onClick={() => window.print()}
              className="bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-bold text-xs uppercase tracking-wider py-2.5 px-4 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm shadow-blue-600/10"
            >
              <Printer size={14} /> Print / Save PDF
            </button>
          </Group>
        </div>

        {/* HIGH-FIDELITY SECURE CERTIFICATE CONTAINER */}
        <Paper
          radius="16px"
          withBorder
          className="relative p-4 sm:p-12 md:p-16 bg-white dark:bg-[#0b0c10] text-slate-900 dark:text-slate-100 flex flex-col border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-all duration-300 w-full md:min-h-130 print:border-none print:shadow-none print:p-0"
        >
          {/* Technical Grid Overlay Background Decoration */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] text-slate-900 dark:text-white pointer-events-none flex items-center justify-center select-none z-0">
            <Cpu size={420} strokeWidth={0.75} />
          </div>

          {/* Frame Outline Line decoration */}
          <div className="absolute inset-3 sm:inset-5 border border-slate-100 dark:border-slate-800/60 rounded-xl pointer-events-none z-0" />

          {/* Branding Header Area */}
          <div className="flex justify-between items-start relative z-10 w-full">
            <div className="flex flex-col space-y-0.5">
              <span className="text-xl md:text-2xl font-black tracking-tighter italic leading-none text-slate-900 dark:text-white">
                ZYNITH
                <span className="text-blue-600 dark:text-blue-500">.</span>
              </span>
              <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                LMS / Excellence Framework
              </span>
            </div>

            {/* Pulsing Verified Seal */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-14 h-14 bg-blue-600/5 dark:bg-blue-500/10 rounded-full animate-pulse" />
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-[#0f1015] border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center shadow-md">
                <Award
                  className="text-blue-600 dark:text-blue-400"
                  size={isMobile ? 16 : 22}
                  strokeWidth={2}
                />
              </div>
            </div>
          </div>

          {/* Certificate Dynamic Fields Block */}
          <div className="flex-1 flex flex-col justify-center text-center relative z-10 my-auto py-12 space-y-5 md:space-y-7">
            <div>
              <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-400">
                Certificate of Achievement
              </p>
            </div>

            <h2 className="text-2xl md:text-5xl font-serif italic text-slate-800 dark:text-slate-100 font-normal tracking-wide">
              {userPayload?.firstName
                ? `${userPayload.firstName} ${userPayload?.lastName || ''}`
                : userPayload?.name || 'Authenticated Student'}
            </h2>

            <div className="flex items-center justify-center gap-4 max-w-xs mx-auto w-full">
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              <span className="text-[8px] md:text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">
                has successfully mastered
              </span>
              <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
            </div>

            <div>
              <p className="text-xs md:text-xl font-black uppercase tracking-wide text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/40 inline-block px-6 py-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 shadow-xs">
                {certificate.courseTitle ||
                  certificate.title ||
                  'Course Track Framework'}
              </p>
            </div>
          </div>

          {/* Bottom Anchored Verification Footer */}
          <div className="mt-auto pt-6 flex gap-4 flex-row justify-between items-center sm:items-end relative z-10 w-full border-t border-slate-100 dark:border-slate-800/60">
            <div className="space-y-1 text-center sm:text-left">
              <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Credential Issued
              </p>
              <p className="text-[8px] md:text-[11px] font-black text-slate-900 dark:text-white font-mono">
                {certificate.issueDate
                  ? new Date(certificate.issueDate)
                      .toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      .toUpperCase()
                  : new Date()
                      .toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })
                      .toUpperCase()}
              </p>
            </div>

            <div className="text-center">
              <div className="w-24 md:w-32 h-px bg-slate-400 dark:bg-slate-600 mb-1.5 mx-auto" />
              <p className="text-[6px] md:text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 italic">
                Academic Director
              </p>
            </div>

            <div className="text-center space-y-1">
              <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Verification ID
              </p>
              <p className="text-[8px] md:text-[11px] font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight bg-blue-50/50 dark:bg-blue-950/20 px-2 py-0.5 rounded-sm">
                {certificate.id
                  ? certificate.id.toUpperCase()
                  : 'ZN-PRO-8821-X9'}
              </p>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  )
}