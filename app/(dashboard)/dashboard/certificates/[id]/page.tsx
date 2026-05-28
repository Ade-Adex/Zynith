// /app/(dashboard)/dashboard/certificates/[id]/page.tsx

'use client'

import React, { useEffect, useState, use } from 'react'
import { notFound } from 'next/navigation'
import { Text, Loader } from '@mantine/core'
import { useAuthStore } from '@/app/store/authStore'
import { getDashboardOverviewAction } from '@/app/services/dashboardActions'
import { DashboardData } from '@/app/types/user'
import CertificatesPage from '../CertificatesPage'

interface SingleCertificateRouteProps {
  params: Promise<{ id: string }>
}

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

  const store = useAuthStore()
  const authUser = store.user

  const [loading, setLoading] = useState(true)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  useEffect(() => {
    async function loadTargetCertificate() {
      try {
        if (!authUser?._id) return
        setLoading(true)

        const response = await getDashboardOverviewAction(authUser._id)
        if (response?.success && response?.data) {
          setDashboard(response.data as DashboardData)
        }
      } catch (error) {
        console.error('Error fetching dashboard target:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTargetCertificate()
  }, [authUser?._id])

  if (loading || !dashboard) {
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

  const certificates = (dashboard.certificates || []) as StableCertificate[]
  const userPayload = dashboard.user || {}

  // Filter list down to ONLY the item matching our target route ID
  const targetedCertificateList = certificates.filter(
    (cert) => String(cert.id) === String(targetCertificateId),
  )

  if (targetedCertificateList.length === 0) {
    return notFound()
  }

  return (
    <CertificatesPage
      certificates={targetedCertificateList}
      user={userPayload}
      initialSelectedId={targetCertificateId}
      isPortalView={true} // 👈 Hides the selector sidebars and centers the viewport
    />
  )
}