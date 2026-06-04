'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { Paper, Stack, Group, Text, Button, Alert } from '@mantine/core'
import { FileText, Loader2, AlertCircle, Inbox } from 'lucide-react'
import { useSnackbar } from 'notistack'

import { useAuthStore } from '@/app/store/authStore'
import {
  getPendingPeerReviewsAction,
  PeerReviewItem,
} from '@/app/services/peerReviewActions'

export default function PeerReviewPage() {
  const { user, hasHydrated } = useAuthStore()
  const { enqueueSnackbar } = useSnackbar()

  const [reviews, setReviews] = useState<PeerReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    async function loadReviews() {
      if (!hasHydrated || !user?._id) return

      try {
        const response = await getPendingPeerReviewsAction(user._id)
        if (response.success) {
          setReviews(response.data)
        } else {
          enqueueSnackbar(response.error, { variant: 'error' })
        }
      } catch (err) {
        console.error(err)
        enqueueSnackbar('Failed to connect to grading infrastructure.', {
          variant: 'error',
        })
      } finally {
        setLoading(false)
      }
    }

    loadReviews()
  }, [user?._id, hasHydrated, enqueueSnackbar])

  const handleStartReview = (item: PeerReviewItem) => {
    enqueueSnackbar(
      `Initializing workspace layout for ${item.anonymousStudentId}`,
      {
        variant: 'info',
      },
    )
    // Route implementation or drawer modal opens here passing item details:
    // router.push(`/dashboard/peer-review/${item.enrollmentId}/${item.assignmentId}`)
  }

  // Loading Framework
  if (loading || !hasHydrated) {
    return (
      <div className="py-8 max-w-4xl flex items-center gap-2 text-foreground bg-background">
        <Loader2 className="animate-spin text-blue-600" size={16} />
        <Text
          size="xs"
          fw={700}
          className="uppercase tracking-widest text-slate-400"
        >
          Syncing Assignment Grading Matrix...
        </Text>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-4xl text-foreground bg-background">
      <header className="mb-10">
        <h1 className="text-xl md:text-3xl font-bold tracking-tighter uppercase">
          Grading Hub<span className="text-blue-600">.</span>
        </h1>
        <Text
          c="dimmed"
          fw={600}
          className="uppercase tracking-widest text-[10px]! md:text-xs! mt-2"
        >
          Earn +50 points for each high-quality review
        </Text>
      </header>

      {reviews.length === 0 ? (
        <Paper
          p="xl"
          radius="24px"
          withBorder
          className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900 text-center py-12"
        >
          <Stack align="center" gap="sm">
            <div className="w-12 h-12 bg-slate-50 dark:bg-slate-900 rounded-2xl flex items-center justify-center text-slate-400">
              <Inbox size={20} />
            </div>
            <Text
              fw={700}
              size="sm"
              className="uppercase tracking-wider text-slate-800 dark:text-slate-200"
            >
              Inboxes Cleared Completely
            </Text>
            <Text size="xs" c="dimmed" className="max-w-xs mx-auto">
              There are currently no peer assignments awaiting assessment
              parameters. Check back shortly!
            </Text>
          </Stack>
        </Paper>
      ) : (
        <Stack gap="md">
          {reviews.map((item) => (
            <Paper
              key={`${item.enrollmentId}-${item.assignmentId}`}
              p="xl"
              radius="24px"
              withBorder
              className="bg-white border-slate-100 dark:bg-slate-950 dark:border-slate-900"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <Group gap="lg" className="flex-1 min-w-0">
                  <div className="w-12 h-12 bg-blue-50 dark:bg-blue-950/40 rounded-2xl flex items-center justify-center text-blue-600 shrink-0">
                    <FileText size={20} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <Text
                      fw={900}
                      className="uppercase tracking-tight text-slate-900 dark:text-slate-100 text-sm md:text-base truncate"
                    >
                      {item.assignmentTitle}
                    </Text>
                    <Text size="10px" c="dimmed" fw={700} className="mt-0.5">
                      Student: {item.anonymousStudentId} • Submitted{' '}
                      {new Date(item.submittedAt).toLocaleDateString(
                        undefined,
                        {
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        },
                      )}
                    </Text>
                  </div>
                </Group>

                <Button
                  color="blue"
                  radius="xl"
                  onClick={() => handleStartReview(item)}
                  className="w-full md:w-auto font-jakarta uppercase tracking-widest text-[10px] h-10 px-6 shrink-0"
                >
                  Start Review
                </Button>
              </div>
            </Paper>
          ))}
        </Stack>
      )}
    </div>
  )
}
