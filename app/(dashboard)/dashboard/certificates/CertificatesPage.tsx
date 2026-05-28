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
  <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-blue-50/40 dark:from-[#050816] dark:via-[#070b1a] dark:to-[#0a1022] text-foreground">
    {/* BACKGROUND EFFECTS */}
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="absolute -top-40 -right-40 h-[420px] w-[420px] rounded-full bg-blue-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-0 h-[320px] w-[320px] rounded-full bg-indigo-500/10 blur-3xl" />
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#64748b0f_1px,transparent_1px),linear-gradient(to_bottom,#64748b0f_1px,transparent_1px)] bg-[size:40px_40px]" />
    </div>

    <div className="relative z-10 py-6 md:py-10 px-4 md:px-6 max-w-[1600px] mx-auto">
      {/* HEADER */}
      {isPortalView ? (
        <div className="mb-10 md:mb-14">
          <div className="max-w-3xl mx-auto text-center">
            <Link
              href="/dashboard/certificates"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/60 dark:bg-white/[0.03] backdrop-blur-xl px-4 py-2 text-xs font-bold tracking-wide text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all duration-300"
            >
              <ChevronLeft size={14} />
              Back to My Workspace
            </Link>

            <div className="mt-6 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-4 py-2">
                <ShieldCheck size={14} className="text-emerald-500" />

                <span className="text-[10px] font-black uppercase tracking-[0.28em] text-emerald-600 dark:text-emerald-400">
                  Public Credential Verification Portal
                </span>
              </div>
            </div>

            <h1 className="mt-6 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Secure Certificate
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Verification System
              </span>
            </h1>

            <p className="mt-5 text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
              Validate academic achievements and authenticated learning records
              securely through the Zynith institutional verification framework.
            </p>
          </div>
        </div>
      ) : (
        <div className="mb-10 md:mb-14 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-500/10 bg-blue-500/5 px-4 py-2 backdrop-blur-xl">
              <ShieldCheck
                size={14}
                className="text-blue-600 dark:text-blue-400"
              />

              <span className="text-[10px] uppercase font-black tracking-[0.28em] text-blue-600 dark:text-blue-400">
                Verified Academic Credentials
              </span>
            </div>

            <h1 className="mt-5 text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
              Achievements &
              <span className="block bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
                Certificates
              </span>
            </h1>

            <p className="mt-4 max-w-2xl text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
              Access professionally issued learning certificates, secure
              verification IDs, downloadable records, and authenticated
              completion achievements from your workspace.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl px-5 py-4 shadow-xl shadow-black/[0.03]">
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">
                Credentials
              </p>

              <h3 className="mt-2 text-2xl font-black text-slate-900 dark:text-white">
                {completedEnrollments.length}
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl px-5 py-4 shadow-xl shadow-black/[0.03]">
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">
                Verified
              </p>

              <h3 className="mt-2 text-2xl font-black text-emerald-500">
                100%
              </h3>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-xl px-5 py-4 shadow-xl shadow-black/[0.03] col-span-2 sm:col-span-1">
              <p className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">
                Institution
              </p>

              <h3 className="mt-2 text-lg font-black text-slate-900 dark:text-white">
                ZYNITH
              </h3>
            </div>
          </div>
        </div>
      )}

      {/* MAIN GRID */}
      <div
        className={
          isPortalView
            ? 'max-w-5xl mx-auto'
            : 'grid grid-cols-1 xl:grid-cols-12 gap-8 items-start'
        }
      >
        {/* SIDEBAR */}
        {!isPortalView && (
          <aside className="xl:col-span-4 2xl:col-span-3">
            <div className="sticky top-6">
              <div className="rounded-[32px] border border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl p-5 md:p-6 shadow-2xl shadow-black/[0.04]">
                <div className="flex items-center justify-between gap-4 mb-6">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] font-black text-slate-400">
                      Your Credentials
                    </p>

                    <h3 className="mt-2 text-xl font-black text-slate-900 dark:text-white">
                      {completedEnrollments.length} Certificates
                    </h3>
                  </div>

                  <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-600/30">
                    <Award size={20} />
                  </div>
                </div>

                <div className="space-y-3 max-h-[75vh] overflow-y-auto pr-1">
                  {completedEnrollments.map((zipCert) => {
                    const isSelected =
                      String(selectedCert?.id) === String(zipCert.id)

                    return (
                      <button
                        key={String(zipCert.id)}
                        onClick={() => setSelectedCert(zipCert)}
                        className={`group w-full text-left rounded-3xl border p-4 transition-all duration-300 ${
                          isSelected
                            ? 'border-blue-500/40 bg-blue-500/[0.08] shadow-lg shadow-blue-500/10'
                            : 'border-transparent bg-slate-100/70 dark:bg-white/[0.03] hover:border-slate-200 dark:hover:border-white/10'
                        }`}
                      >
                        <div className="flex gap-4">
                          <div
                            className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl transition-all ${
                              isSelected
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-white dark:bg-slate-900 text-slate-500'
                            }`}
                          >
                            <Award size={22} />
                          </div>

                          <div className="min-w-0 flex-1">
                            <h4 className="text-sm md:text-[15px] font-black leading-snug text-slate-900 dark:text-white line-clamp-2">
                              {zipCert.courseTitle ||
                                zipCert.title ||
                                'Course Certificate'}
                            </h4>

                            <div className="mt-3 flex flex-wrap items-center gap-2">
                              <Badge
                                variant="light"
                                color="emerald"
                                radius="sm"
                                className="font-black"
                              >
                                VERIFIED
                              </Badge>

                              <span className="font-mono text-[10px] text-slate-400">
                                {zipCert.id
                                  ? `${zipCert.id.slice(0, 14)}...`
                                  : 'Credential Issued'}
                              </span>
                            </div>
                          </div>
                        </div>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </aside>
        )}

        {/* MAIN CONTENT */}
        {selectedCert && (
          <section
            className={
              isPortalView
                ? 'w-full space-y-5'
                : 'xl:col-span-8 2xl:col-span-9 space-y-5'
            }
          >
            {/* ACTION TOOLBAR */}
            <div className="rounded-[28px] border border-white/10 bg-white/70 dark:bg-white/[0.03] backdrop-blur-2xl p-4 md:p-5 shadow-xl shadow-black/[0.03]">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-500">
                    <ShieldCheck size={20} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">
                      Verification Credential
                    </p>

                    <p className="mt-1 font-mono text-sm font-bold text-slate-900 dark:text-white break-all">
                      {selectedCert.id}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  {!isPortalView && (
                    <Tooltip label="Open Dedicated Page">
                      <Link
                        href={`/dashboard/certificates/${selectedCert.id}`}
                        target="_blank"
                      >
                        <ActionIcon
                          size="xl"
                          radius="xl"
                          variant="default"
                          className="border border-slate-200 dark:border-white/10 hover:text-blue-500 transition-all"
                        >
                          <ExternalLink size={18} />
                        </ActionIcon>
                      </Link>
                    </Tooltip>
                  )}

                  <Tooltip label="Copy Verification Link">
                    <ActionIcon
                      size="xl"
                      radius="xl"
                      variant="default"
                      className="border border-slate-200 dark:border-white/10 hover:text-indigo-500 transition-all"
                      onClick={() => {
                        const secureUrl = `${window.location.origin}/dashboard/certificates/${selectedCert.id}`
                        navigator.clipboard.writeText(secureUrl)
                      }}
                    >
                      <Share2 size={18} />
                    </ActionIcon>
                  </Tooltip>

                  <button
                    onClick={() => window.print()}
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-white shadow-xl shadow-blue-600/20 transition-all hover:scale-[1.02] hover:shadow-blue-600/40 cursor-pointer"
                  >
                    <Printer size={15} />
                    Print / Save PDF
                  </button>
                </div>
              </div>
            </div>

            {/* CERTIFICATE */}
            <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-white dark:bg-[#070b14] shadow-[0_20px_80px_rgba(0,0,0,0.08)] dark:shadow-[0_20px_80px_rgba(0,0,0,0.45)]">
              {/* BACKGROUND */}
              <div className="absolute inset-0">
                <div className="absolute top-0 right-0 h-72 w-72 rounded-full bg-blue-500/10 blur-3xl" />
                <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl" />
              </div>

              <div className="relative z-10 p-6 md:p-10 xl:p-14 min-h-[720px] flex flex-col">
                {/* TOP */}
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <div className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                      ZYNITH
                      <span className="text-blue-600">.</span>
                    </div>

                    <p className="mt-2 text-[10px] uppercase tracking-[0.45em] font-black text-slate-400">
                      Excellence Learning Framework
                    </p>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-blue-600/20 blur-xl" />

                    <div className="relative flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-full border-4 border-blue-500/20 bg-white dark:bg-slate-950">
                      <Award
                        size={32}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    </div>
                  </div>
                </div>

                {/* CENTER */}
                <div className="flex-1 flex flex-col items-center justify-center text-center py-12 md:py-20">
                  <p className="text-[10px] md:text-xs font-black uppercase tracking-[0.45em] text-blue-600 dark:text-blue-400">
                    Certificate of Achievement
                  </p>

                  <h2 className="mt-8 text-3xl md:text-6xl leading-tight font-serif italic text-slate-900 dark:text-white">
                    {user?.firstName
                      ? `${user.firstName} ${user?.lastName || ''}`
                      : user?.name || 'Authenticated Student'}
                  </h2>

                  <div className="mt-8 flex items-center gap-4 w-full max-w-md">
                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />

                    <span className="text-[10px] uppercase tracking-[0.25em] font-bold text-slate-400 whitespace-nowrap">
                      has successfully completed
                    </span>

                    <div className="h-px flex-1 bg-slate-200 dark:bg-white/10" />
                  </div>

                  <div className="mt-8 rounded-3xl border border-slate-200 dark:border-white/10 bg-slate-50/80 dark:bg-white/[0.03] px-6 md:px-10 py-5 md:py-6 shadow-lg">
                    <h3 className="text-lg md:text-3xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
                      {selectedCert.courseTitle ||
                        selectedCert.title ||
                        'Course Track Framework'}
                    </h3>
                  </div>

                  <p className="mt-8 max-w-2xl text-sm md:text-base leading-relaxed text-slate-500 dark:text-slate-400">
                    This credential is digitally verified and securely issued
                    under the Zynith Learning Accreditation & Achievement
                    Framework.
                  </p>
                </div>

                {/* FOOTER */}
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 items-end">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">
                      Date Issued
                    </p>

                    <p className="mt-2 text-sm md:text-base font-black text-slate-900 dark:text-white">
                      {selectedCert.issueDate
                        ? new Date(selectedCert.issueDate).toLocaleDateString(
                            undefined,
                            {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            },
                          )
                        : new Date().toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="mx-auto mb-3 h-px w-40 bg-slate-300 dark:bg-white/10" />

                    <p className="text-xs font-black uppercase tracking-[0.25em] text-slate-400">
                      Academic Director
                    </p>
                  </div>

                  <div className="md:text-right">
                    <p className="text-[10px] uppercase tracking-[0.25em] font-black text-slate-400">
                      Verification ID
                    </p>

                    <p className="mt-2 font-mono text-sm md:text-base font-black text-blue-600 dark:text-blue-400 break-all">
                      {selectedCert.id
                        ? selectedCert.id.toUpperCase()
                        : 'ZN-PRO-8821-X9'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  </div>
)
  }