'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  ShieldCheck,
  Award,
  Cpu,
  CheckCircle2,
  ExternalLink,
  Share2,
  Printer,
  ChevronLeft,
} from 'lucide-react'
import {
  Text,
  Badge,
  Paper,
  Group,
  Stack,
  Tooltip,
  ActionIcon,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'

interface CertificateItem {
  id: string
  courseId?: string | number
  courseTitle?: string
  title?: string
  issueDate?: string
  url?: string
}

interface UserPayload {
  firstName?: string
  lastName?: string
  name?: string
  avatar?: string
}

interface CertificatesPageProps {
  certificates?: CertificateItem[]
  user?: UserPayload
  initialSelectedId?: string | null
  isPortalView?: boolean
}

export default function CertificatesPage({
  certificates = [],
  user,
  initialSelectedId,
  isPortalView = false,
}: CertificatesPageProps) {
  const isMobile = useMediaQuery('(max-width: 768px)')
  const completedEnrollments = certificates || []

  const initialSelection =
    completedEnrollments.find(
      (c) => String(c.id) === String(initialSelectedId),
    ) ||
    completedEnrollments[0] ||
    null

  const [selectedCert, setSelectedCert] = useState<CertificateItem | null>(
    initialSelection,
  )

  if (completedEnrollments.length === 0) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 flex items-center justify-center text-neutral-400 dark:text-neutral-600 mb-5">
          <Award size={32} />
        </div>
        <h3 className="text-xl font-black text-foreground tracking-tight">
          No Credentials Issued
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm leading-relaxed">
          Certificates are automatically generated the exact moment you complete
          all milestones.
        </p>
      </div>
    )
  }

return (
  <div className="py-6 md:py-12 px-4 max-w-7xl mx-auto min-h-screen bg-background text-foreground selection:bg-blue-500/10">
    {/* CONDITIONAL HEADER */}
    {isPortalView ? (
      <div className="mb-10 text-center max-w-2xl mx-auto space-y-3">
        <Link
          href="/dashboard/certificates"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-muted-foreground hover:text-blue-500 mb-2 transition-colors duration-200 group"
        >
          <ChevronLeft
            size={14}
            className="transition-transform group-hover:-translate-x-0.5"
          />
          Back to My Workspace
        </Link>
        <div className="flex items-center justify-center">
          <Badge
            variant="filled"
            color="teal"
            size="xs"
            radius="sm"
            className="font-black tracking-[0.2em] px-2.5 py-1 bg-emerald-600 text-white border-none"
          >
            PUBLIC VERIFICATION PORTAL
          </Badge>
        </div>
        <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Secure Credential Verification
        </h1>
        <p className="text-xs md:text-sm text-slate-400 dark:text-slate-500 max-w-md mx-auto leading-relaxed">
          This digital cryptographic token directly matches validated
          educational frameworks securely verified on-chain.
        </p>
      </div>
    ) : (
      <div className="mb-10 border-b border-slate-100 dark:border-slate-800/60 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <ShieldCheck
              size={14}
              className="text-blue-600 dark:text-blue-400"
            />
            <span className="text-[10px] uppercase font-black tracking-[0.3em] text-slate-400 dark:text-slate-500">
              Verified Academic Records
            </span>
          </div>
          <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Achievements & Certificates
          </h1>
        </div>
        <p className="text-xs text-slate-400 dark:text-slate-500 max-w-xs md:text-right leading-relaxed">
          Access, share, and export secure official documentation for finished
          learning paths.
        </p>
      </div>
    )}

    {/* CORE DISPLAY LOGIC */}
    <div
      className={
        isPortalView
          ? 'max-w-4xl mx-auto w-full'
          : 'grid grid-cols-1 lg:grid-cols-12 gap-8 items-start'
      }
    >
      {/* SIDEBAR NAVIGATION */}
      {!isPortalView && (
        <div className="lg:col-span-4 space-y-4 print:hidden">
          <div className="flex items-center justify-between px-1">
            <Text
              size="xs"
              fw={900}
              className="uppercase tracking-[0.15em] text-slate-400 dark:text-slate-500 block"
            >
              Your Credentials ({completedEnrollments.length})
            </Text>
          </div>

          <div className="space-y-2.5 max-h-[60vh] lg:max-h-[75vh] overflow-y-auto pr-1 scrollbar-thin">
            {completedEnrollments.map((zipCert) => {
              const isSelected = String(selectedCert?.id) === String(zipCert.id)
              return (
                <div
                  key={String(zipCert.id)}
                  onClick={() => setSelectedCert(zipCert)}
                  className={`p-4 rounded-xl border transition-all duration-300 cursor-pointer flex gap-4 items-start relative overflow-hidden select-none active:scale-[0.99] ${
                    isSelected
                      ? 'bg-blue-600/[0.02] dark:bg-blue-500/[0.01] border-blue-500 dark:border-blue-500 shadow-xl shadow-blue-500/[0.03]'
                      : 'bg-white dark:bg-[#0d0d0d] border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:shadow-md'
                  }`}
                >
                  {isSelected && (
                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-600 dark:bg-blue-500" />
                  )}
                  <div
                    className={`p-2.5 rounded-lg shrink-0 transition-colors duration-300 ${
                      isSelected
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    <Award size={18} />
                  </div>
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
                      {zipCert.courseTitle ||
                        zipCert.title ||
                        'Course Certificate'}
                    </h4>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant="light"
                        color="blue"
                        size="xs"
                        radius="xs"
                        className="font-black text-[9px] tracking-wider px-1.5 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border-none"
                      >
                        VERIFIED
                      </Badge>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 font-mono truncate">
                        ID:{' '}
                        {zipCert.id ? `${zipCert.id.slice(0, 8)}...` : 'N/A'}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* COMPONENT PREVIEW CONTAINER */}
      {selectedCert && (
        <div
          className={
            isPortalView
              ? 'w-full space-y-4'
              : 'lg:col-span-8 space-y-4 print:col-span-12 print:w-full'
          }
        >
          {/* TOOLBAR */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/80 p-3 rounded-xl print:hidden">
            <Group gap="xs" className="px-1">
              <ShieldCheck size={15} className="text-emerald-500" />
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Secured Framework Node ID:{' '}
                <span className="font-mono text-slate-900 dark:text-white font-bold tracking-tight bg-slate-200/50 dark:bg-slate-800 px-1.5 py-0.5 rounded-sm">
                  {selectedCert.id}
                </span>
              </span>
            </Group>

            <Group gap="xs" className="justify-end w-full sm:w-auto">
              {!isPortalView && (
                <Tooltip
                  label="Open Dedicated View Page"
                  position="top"
                  withArrow
                >
                  <Link
                    href={`/dashboard/certificates/${selectedCert.id}`}
                    target="_blank"
                  >
                    <ActionIcon
                      variant="default"
                      size="lg"
                      radius="md"
                      className="hover:text-blue-500 bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-slate-800"
                    >
                      <ExternalLink size={15} />
                    </ActionIcon>
                  </Link>
                </Tooltip>
              )}

              <Tooltip
                label="Copy Direct Verification Link"
                position="top"
                withArrow
              >
                <ActionIcon
                  variant="default"
                  size="lg"
                  radius="md"
                  className="hover:text-indigo-500 bg-white dark:bg-[#0a0a0a] border-slate-200 dark:border-slate-800"
                  onClick={() => {
                    const secureUrl = `${window.location.origin}/dashboard/certificates/${selectedCert.id}`
                    navigator.clipboard.writeText(secureUrl)
                  }}
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

          {/* HIGH FIDELITY CONTAINER BRANDED AS PREVIEW */}
          <Paper
            radius="24px"
            withBorder
            className="relative p-6 sm:p-8 md:p-14 bg-white dark:bg-[#0b0c10] text-slate-900 dark:text-slate-100 md:aspect-[1.414/1] flex flex-col border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-all duration-300 w-full print:border-none print:shadow-none print:p-0"
          >
            {/* Technical Grid Overlay Watermark */}
            <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] text-slate-900 dark:text-white pointer-events-none flex items-center justify-center select-none z-0">
              <Cpu size={420} strokeWidth={0.75} />
            </div>

            {/* Inner Decorative Framing Box */}
            <div className="absolute inset-3 sm:inset-5 border border-slate-100 dark:border-slate-800/60 rounded-xl pointer-events-none z-0" />

            {/* Header Elements */}
            <div className="flex justify-between items-start relative z-10 w-full mb-6 md:mb-0">
              <div className="flex flex-col space-y-0.5">
                <span className="text-xl md:text-2xl font-black tracking-tighter italic leading-none text-slate-900 dark:text-white">
                  ZYNITH
                  <span className="text-blue-600 dark:text-blue-500">.</span>
                </span>
                <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500">
                  LMS / Excellence Framework
                </span>
              </div>

              {/* Verification Award Badge */}
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

            {/* Main Content Block - Using flex-1 to push the footer down cleanly */}
            <div className="flex-1 flex flex-col justify-center text-center relative z-10 my-auto py-8 md:py-0 space-y-4 md:space-y-6">
              <div>
                <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-400">
                  Certificate of Achievement
                </p>
              </div>

              <h2 className="text-2xl md:text-5xl font-serif italic text-slate-800 dark:text-slate-100 font-normal tracking-wide">
                {user?.firstName
                  ? `${user.firstName} ${user?.lastName || ''}`
                  : user?.name || 'Authenticated Student'}
              </h2>

              <div className="flex items-center justify-center gap-4 max-w-sm mx-auto w-full">
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
                <span className="text-[8px] md:text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] whitespace-nowrap">
                  has successfully mastered
                </span>
                <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
              </div>

              <div>
                <p className="text-xs md:text-xl font-black uppercase tracking-wide text-slate-900 dark:text-white bg-slate-50 dark:bg-slate-900/40 inline-block px-6 py-2.5 rounded-lg border border-slate-100 dark:border-slate-800/80 shadow-xs">
                  {selectedCert.courseTitle ||
                    selectedCert.title ||
                    'Course Track Framework'}
                </p>
              </div>
            </div>

            {/* Verified Footer Metadata - Firm baseline anchoring with mt-auto */}
            <div className="mt-auto pt-6 md:pt-8 flex flex-col gap-4 sm:flex-row justify-between items-center sm:items-end relative z-10 w-full border-t border-slate-100 dark:border-slate-800/60">
              <div className="space-y-1 text-center sm:text-left">
                <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Credential Issued
                </p>
                <p className="text-[9px] md:text-[11px] font-black text-slate-900 dark:text-white font-mono">
                  {selectedCert.issueDate
                    ? new Date(selectedCert.issueDate)
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

              <div className="text-center order-last sm:order-none">
                <div className="hidden sm:block w-24 md:w-32 h-px bg-slate-200 dark:bg-slate-800 mb-1.5 mx-auto" />
                <p className="text-[6px] md:text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 italic">
                  Academic Director
                </p>
              </div>

              <div className="text-center sm:text-right space-y-1">
                <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                  Verification ID
                </p>
                <p className="text-[9px] md:text-[11px] font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight bg-blue-50/50 dark:bg-blue-950/20 px-2 py-0.5 rounded-sm">
                  {selectedCert.id
                    ? selectedCert.id.toUpperCase()
                    : 'ZN-PRO-8821-X9'}
                </p>
              </div>
            </div>
          </Paper>
        </div>
      )}
    </div>
  </div>
)
  }