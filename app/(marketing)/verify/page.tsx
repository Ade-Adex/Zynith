'use client'

import React, { useState } from 'react'
import { Text, Loader, Paper, TextInput, Button } from '@mantine/core'
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  Award,
  Cpu,
  CalendarDays,
  UserCheck2,
  Building2,
} from 'lucide-react'
import {
  verifyCertificateAction,
  VerificationResult,
} from '@/app/services/verifyActions'

type VerifiedData = NonNullable<VerificationResult['data']>

export default function PublicCertificateVerificationPortal() {
  const [certId, setCertId] = useState<string>('')
  const [loading, setLoading] = useState<boolean>(false)
  const [searched, setSearched] = useState<boolean>(false)

  // Explicit type states mapped directly onto the new server action interface
  const [verifiedPayload, setVerifiedPayload] = useState<VerifiedData | null>(
    null,
  )
  const [errorStatus, setErrorStatus] = useState<string | null>(null)

  const handleVerifyLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetId = certId.trim()
    if (!targetId) return

    setLoading(true)
    setSearched(true)
    setErrorStatus(null)
    setVerifiedPayload(null)

    try {
      // Execute the targeted unindexed/sparse index database action
      const response = await verifyCertificateAction(targetId)

      if (response.success && response.data) {
        setVerifiedPayload(response.data)
      } else {
        setErrorStatus(
          response.message ||
            'No security record matching this Credential ID could be found.',
        )
      }
    } catch (err) {
      console.error('Verification subsystem fault:', err)
      setErrorStatus(
        'An error occurred while communicating with the verification framework.',
      )
    } finally {
      setLoading(false)
    }
  }

  const formattedIssueDate = verifiedPayload?.issuedAt
    ? new Date(verifiedPayload.issuedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : ''

  return (
    <div className="pt-20 pb-8 md:pt-24 md:pb-12 max-w-4xl mx-auto min-h-screen px-4 bg-background text-foreground selection:bg-blue-500/10">
      {/* HEADER EXPLANATION PANEL */}
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <div className="inline-flex p-2.5 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-2xl border border-blue-100/30 dark:border-blue-900/30 mb-2">
          <ShieldCheck size={28} />
        </div>
        <h1 className="text-xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
          Secured Credential Verification
        </h1>
        <p className="text-sm md:text-base text-slate-500 dark:text-slate-400 leading-relaxed">
          Verify the authenticity and graduation metrics of any issued ZYNITH
          framework certificate. Enter the unique alphanumeric Verification ID
          listed below the document signature line.
        </p>
      </div>

      {/* SEARCH BAR INPUT FORM */}
      <Paper
        withBorder
        radius="20px"
        className="p-4 md:p-6 bg-white dark:bg-[#0a0a0c] border-slate-200 dark:border-slate-800/80 shadow-xl shadow-slate-100 dark:shadow-none max-w-xl mx-auto mb-12"
      >
        <form
          onSubmit={handleVerifyLookup}
          className="flex flex-col sm:flex-row gap-3 items-end sm:items-center"
        >
          <TextInput
            placeholder="e.g., ZN-PRO-8821-X9"
            label="Credential Verification ID"
            required
            size="md"
            radius="lg"
            className="w-full flex-1"
            value={certId}
            onChange={(e) => setCertId(e.currentTarget.value)}
            styles={{
              input: {
                backgroundColor: 'transparent',
                fontFamily: 'monospace',
                letterSpacing: '0.05em',
                varColors: true,
              },
              label: {
                fontWeight: 700,
                fontSize: '11px',
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                marginBottom: '6px',
              },
            }}
          />
          <Button
            type="submit"
            size="md"
            radius="md"
            className="w-full sm:w-auto bg-blue-600! hover:bg-blue-700! h-10 px-6 transition-all md:mt-7.5"
            disabled={loading || !certId.trim()}
            leftSection={
              loading ? (
                <Loader size="xs" color="white" />
              ) : (
                <Search size={16} />
              )
            }
          >
            Validate
          </Button>
        </form>
      </Paper>

      {/* INTERACTIVE RESULTS DISPATCHER */}
      <div className="relative">
        {/* Loading Spinner View */}
        {loading && (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader size="sm" color="blue" />
            <Text
              size="xs"
              fw={800}
              className="uppercase tracking-widest text-slate-400"
            >
              Querying distributed validation records...
            </Text>
          </div>
        )}

        {/* Failure Result Status Card */}
        {!loading && searched && errorStatus && (
          <Paper
            withBorder
            radius="16px"
            className="p-6 text-center max-w-xl mx-auto border-red-200 dark:border-red-950/50 bg-red-50/30 dark:bg-red-950/10 space-y-3"
          >
            <div className="inline-flex p-2 bg-red-100 dark:bg-red-950 text-red-600 dark:text-red-400 rounded-xl mx-auto">
              <ShieldAlert size={20} />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Verification Failed
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal max-w-sm mx-auto">
              {errorStatus} Check the string characters for accuracy and verify
              capitalization structure matches perfectly.
            </p>
          </Paper>
        )}

        {/* Success / Authentic High Fidelity Frame Output */}
        {!loading && searched && verifiedPayload && (
          <div className="space-y-8 animate-fade-in">
            {/* Context Verification Overview strip */}
            <div className="flex items-center gap-3 bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/60 dark:border-emerald-800/40 p-4 rounded-xl max-w-2xl mx-auto">
              <div className="p-2 bg-emerald-500 text-white rounded-lg">
                <ShieldCheck size={20} />
              </div>
              <div>
                <p className="text-xs font-black text-emerald-800 dark:text-emerald-400 uppercase tracking-wider leading-none">
                  Status: Legitimate Credential
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  The cryptographic record for ID{' '}
                  <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                    {verifiedPayload.certificateId.toUpperCase()}
                  </span>{' '}
                  is secure, intact, and officially registered.
                </p>
              </div>
            </div>

            {/* Structured Info Matrix Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-w-4xl mx-auto pt-2">
              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 p-3 rounded-xl">
                <div className="p-2 bg-blue-50 dark:bg-blue-950/40 rounded-lg text-blue-600 dark:text-blue-400">
                  <UserCheck2 size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-none">
                    Recipient Graduate
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {verifiedPayload.recipient.firstName
                      ? `${verifiedPayload.recipient.firstName} ${verifiedPayload.recipient.lastName || ''}`
                      : verifiedPayload.recipient.name}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 p-3 rounded-xl">
                <div className="p-2 bg-purple-50 dark:bg-purple-950/40 rounded-lg text-purple-600 dark:text-purple-400">
                  <Building2 size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-none">
                    Issuing Authority
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    Zynith Excellence Academy
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-900/30 border border-slate-200/60 dark:border-slate-800/60 p-3 rounded-xl">
                <div className="p-2 bg-amber-50 dark:bg-amber-950/40 rounded-lg text-amber-600 dark:text-amber-400">
                  <CalendarDays size={16} />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider leading-none">
                    Date Registered
                  </p>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200 mt-1">
                    {formattedIssueDate}
                  </p>
                </div>
              </div>
            </div>

            {/* HIGH-FIDELITY SECURE CERTIFICATE CONTAINER FOR PREVIEW */}
            <Paper
              radius="24px"
              withBorder
              className="relative p-6 sm:p-12 md:p-16 bg-white dark:bg-[#0b0c10] text-slate-900 dark:text-slate-100 flex flex-col border-slate-200 dark:border-slate-800/80 overflow-hidden shadow-2xl w-full min-h-[520px]"
            >
              <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.015] text-slate-900 dark:text-white pointer-events-none flex items-center justify-center select-none z-0">
                <Cpu size={420} strokeWidth={0.75} />
              </div>

              <div className="absolute inset-3 sm:inset-5 border border-slate-100 dark:border-slate-800/60 rounded-xl pointer-events-none z-0" />

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

                <div className="relative flex items-center justify-center">
                  <div className="absolute w-14 h-14 bg-blue-600/5 dark:bg-blue-500/10 rounded-full animate-pulse" />
                  <div className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-[#0f1015] border border-slate-200 dark:border-slate-800 rounded-full flex items-center justify-center shadow-md">
                    <Award
                      className="text-blue-600 dark:text-blue-400"
                      size={22}
                      strokeWidth={2}
                    />
                  </div>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center text-center relative z-10 my-auto py-12 space-y-5 md:space-y-7">
                <div>
                  <p className="text-[7px] md:text-[9px] font-black uppercase tracking-[0.6em] text-blue-600 dark:text-blue-400">
                    Certificate of Achievement
                  </p>
                </div>

                <h2 className="text-2xl md:text-5xl font-serif italic text-slate-800 dark:text-slate-100 font-normal tracking-wide">
                  {verifiedPayload.recipient.firstName
                    ? `${verifiedPayload.recipient.firstName} ${verifiedPayload.recipient.lastName || ''}`
                    : verifiedPayload.recipient.name}
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
                    {verifiedPayload.course.title}
                  </p>
                </div>
              </div>

              <div className="mt-auto pt-6 flex gap-4 flex-row justify-between items-center sm:items-end relative z-10 w-full border-t border-slate-100 dark:border-slate-800/60">
                <div className="space-y-1 text-center sm:text-left">
                  <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Credential Issued
                  </p>
                  <p className="text-[8px] md:text-[11px] font-black text-slate-900 dark:text-white font-mono uppercase">
                    {formattedIssueDate}
                  </p>
                </div>

                <div className="text-center hidden sm:block">
                  <div className="w-24 md:w-32 h-px bg-slate-400 dark:bg-slate-600 mb-1.5 mx-auto" />
                  <p className="text-[6px] md:text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-slate-400 italic">
                    Instructor: {verifiedPayload.course.instructor}
                  </p>
                </div>

                <div className="text-center space-y-1">
                  <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                    Verification ID
                  </p>
                  <p className="text-[8px] md:text-[11px] font-black text-blue-600 dark:text-blue-400 font-mono tracking-tight bg-blue-50/50 dark:bg-blue-950/20 px-2 py-0.5 rounded-sm">
                    {verifiedPayload.certificateId.toUpperCase()}
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
