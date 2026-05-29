// /app/components/certificates/CertificateFrame.tsx
'use client'

import React from 'react'
import { Paper } from '@mantine/core'
import { Award, Cpu } from 'lucide-react'

export interface CertificateUserPayload {
  firstName?: string
  lastName?: string
  name?: string
}

export interface CertificateDataPayload {
  id: string
  courseTitle?: string
  title?: string
  issueDate?: string | Date
}

interface CertificateFrameProps {
  userPayload: CertificateUserPayload | null
  certificate: CertificateDataPayload | null
  isMobile?: boolean
}

export default function CertificateFrame({
  userPayload,
  certificate,
  isMobile = false,
}: CertificateFrameProps) {
  // Gracefully fallback or parse raw date formats safely
  const resolvedDate = certificate?.issueDate
    ? new Date(certificate.issueDate)
    : new Date()

  const formattedDate = resolvedDate
    .toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    .toUpperCase()

  const displayName = userPayload?.firstName
    ? `${userPayload.firstName} ${userPayload?.lastName || ''}`.trim()
    : userPayload?.name || 'Authenticated Student'

  const displayCourse =
    certificate?.courseTitle || certificate?.title || 'Course Track Framework'

  const displayId = certificate?.id
    ? certificate.id.toUpperCase()
    : 'ZN-PRO-8821-X9'

  return (
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
          {displayName}
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
            {displayCourse}
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
            {formattedDate}
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
            {displayId}
          </p>
        </div>
      </div>
    </Paper>
  )
}
