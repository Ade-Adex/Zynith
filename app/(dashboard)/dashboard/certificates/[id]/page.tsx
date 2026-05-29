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
import CertificateFrame from '@/app/components/certificates/CertificateFrame'

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
       <CertificateFrame
          userPayload={userPayload}
          certificate={certificate}
          isMobile={!!isMobile}
        />
      </div>
    </div>
  )
}