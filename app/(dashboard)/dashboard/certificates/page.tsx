// /app/certification/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { Text, Loader, Badge, Paper, SimpleGrid } from '@mantine/core'
import {
  Award,
  ShieldCheck,
  ArrowRight,
  Calendar,
  Bookmark,
} from 'lucide-react'
import { useAuthStore } from '@/app/store/authStore'
import { getDashboardOverviewAction } from '@/app/services/dashboardActions'
import { DashboardData } from '@/app/types/user'

export default function CertificatesWorkspaceRoot() {
  const store = useAuthStore()
  const authUser = store.user

  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function loadDashboardCertificates() {
      try {
        if (!authUser?._id) return
        setLoading(true)

        const response = await getDashboardOverviewAction(authUser._id)
        if (response?.success && response?.data) {
          setDashboard(response.data as DashboardData)
        }
      } catch (error) {
        console.error('Error fetching dashboard records:', error)
      } finally {
        setLoading(false)
      }
    }

    loadDashboardCertificates()
  }, [authUser?._id])

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader size="sm" color="blue" />
        <Text
          size="xs"
          fw={800}
          className="uppercase tracking-[0.25em] text-neutral-500"
        >
          Loading Academic Records...
        </Text>
      </div>
    )
  }

  const certificates = dashboard?.certificates || []

  if (certificates.length === 0) {
    return (
      <div className="py-20 px-4 max-w-xl mx-auto text-center flex flex-col items-center justify-center min-h-[450px]">
        <div className="w-16 h-16 rounded-2xl bg-neutral-100 dark:bg-neutral-900/60 flex items-center justify-center text-neutral-400 dark:text-neutral-600 mb-5">
          <Award size={32} />
        </div>
        <h3 className="text-xl font-black text-foreground tracking-tight">
          No Credentials Issued Yet
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2 max-w-sm leading-relaxed">
          Certificates are generated instantly once you complete core framework
          courses, quizzes, and modules.
        </p>
        <Link href="/courses" className="mt-6">
          <button className="bg-blue-600 hover:bg-slate-900 text-white text-xs px-6 py-2.5 rounded-xl font-black uppercase tracking-wider transition-all cursor-pointer">
            Explore Course Tracks
          </button>
        </Link>
      </div>
    )
  }

  return (
    <div className="py-6 md:py-10 px-4 max-w-7xl mx-auto min-h-screen bg-background text-foreground">
      {/* SECTION HEADER */}
      <div className="mb-10">
        <div className="flex items-center gap-2">
          <ShieldCheck size={16} className="text-blue-600 dark:text-blue-400" />
          <span className="text-[10px] uppercase font-black tracking-[0.25em] text-neutral-400">
            Verified Student Desk
          </span>
        </div>
        <h1 className="text-2xl md:text-4xl font-black tracking-tight mt-1 text-slate-900 dark:text-white">
          Earned Credentials
        </h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Review, share, and manage your verified academic achievements.
        </p>
      </div>

      {/* COMPREHENSIVE CERTIFICATE GRID */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
        {certificates.map((cert) => (
          <Paper
            key={String(cert.id)}
            radius="20px"
            withBorder
            className="p-6 bg-white dark:bg-neutral-900/40 border-neutral-200 dark:border-neutral-800/80 flex flex-col justify-between hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 group"
          >
            <div>
              {/* Card Badge Top Decoration */}
              <div className="flex items-center justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  <Award size={22} />
                </div>
                <Badge
                  variant="light"
                  color="blue"
                  size="xs"
                  radius="sm"
                  className="font-black"
                >
                  ACTIVE SECURE
                </Badge>
              </div>

              {/* Title Block */}
              <h3 className="text-base font-black text-slate-900 dark:text-white tracking-tight leading-snug line-clamp-2 mb-4 min-h-[44px]">
                {cert.courseTitle || cert.title || 'Framework Course Track'}
              </h3>

              {/* Information Row Meta Fields */}
              <div className="space-y-2 border-t border-neutral-100 dark:border-neutral-800/60 pt-4 mb-6">
                <div className="flex items-center gap-2 text-xs text-neutral-500">
                  <Calendar size={14} className="text-neutral-400" />
                  <span>
                    Issued:{' '}
                    {cert.issueDate
                      ? new Date(cert.issueDate).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                        })
                      : 'Recent'}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-xs text-neutral-400 font-mono">
                  <Bookmark size={14} className="text-neutral-500" />
                  <span className="truncate">Ref: {cert.id}</span>
                </div>
              </div>
            </div>

            {/* Redirection Link trigger */}
            <Link
              href={`/dashboard/certificates/${cert.id}`}
              className="block w-full"
            >
              <button className="w-full bg-neutral-50 dark:bg-neutral-900 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 border border-neutral-200 dark:border-neutral-800 group-hover:border-blue-500/20 text-slate-900 dark:text-neutral-300 text-xs font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer">
                View Certificate Verification{' '}
                <ArrowRight
                  size={14}
                  className="group-hover:translate-x-1 transition-transform"
                />
              </button>
            </Link>
          </Paper>
        ))}
      </SimpleGrid>
    </div>
  )
}