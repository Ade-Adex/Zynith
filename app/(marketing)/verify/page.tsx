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
import CertificateFrame, { CertificateDataPayload, CertificateUserPayload } from '@/app/components/certificates/CertificateFrame'

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

  // const handleVerifyLookup = async (e: React.FormEvent) => {
  //   e.preventDefault()
  //   const targetId = certId.trim()
  //   if (!targetId) return

  //   setLoading(true)
  //   setSearched(true)
  //   setErrorStatus(null)
  //   setVerifiedPayload(null)

  //   try {
  //     // Execute the targeted unindexed/sparse index database action
  //     const response = await verifyCertificateAction(targetId)

  //     if (response.success && response.data) {
  //       setVerifiedPayload(response.data)
  //     } else {
  //       setErrorStatus(
  //         response.message ||
  //           'No security record matching this Credential ID could be found.',
  //       )
  //     }
  //   } catch (err) {
  //     console.error('Verification subsystem fault:', err)
  //     setErrorStatus(
  //       'An error occurred while communicating with the verification framework.',
  //     )
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  // const formattedIssueDate = verifiedPayload?.issuedAt
  //   ? new Date(verifiedPayload.issuedAt).toLocaleDateString(undefined, {
  //       year: 'numeric',
  //       month: 'long',
  //       day: 'numeric',
  //     })
  //   : ''



  const handleVerifyLookup = async (e: React.FormEvent) => {
    e.preventDefault()
    const targetId = certId.trim()
    if (!targetId) return

    setLoading(true)
    setSearched(true)
    setErrorStatus(null)
    setVerifiedPayload(null)

    try {
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

  // Safe mapping of the verified response data fields onto generic certificate context structures
  const standardUserStructure: CertificateUserPayload | null = verifiedPayload
    ? {
        firstName: verifiedPayload.recipient.firstName,
        lastName: verifiedPayload.recipient.lastName,
        name: verifiedPayload.recipient.name,
      }
    : null

 const standardCertStructure: CertificateDataPayload | null = verifiedPayload
    ? {
        id: verifiedPayload.certificateId,
        title: verifiedPayload.course?.title || 'Course Track Framework', //  Fixed
        issueDate: verifiedPayload.issuedAt,
      }
    : null



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

            <CertificateFrame
              userPayload={standardUserStructure}
              certificate={standardCertStructure}
              isMobile={false}
            />
          </div>
        )}
      </div>
    </div>
  )
}
