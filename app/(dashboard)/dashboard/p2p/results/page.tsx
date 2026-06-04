// /app/(dashboard)/dashboard/p2p/results/page.tsx
'use client'

import React, { useEffect, useState } from 'react'
import { Paper, Stack, Text, Badge, Group } from '@mantine/core'
import {
  MessageSquare,
  Inbox,
  AlertCircle,
  CheckCircle,
  Clock,
} from 'lucide-react'
import { useAuthStore } from '@/app/store/authStore'
import {
  getReceivedReviewsAction,
  ReceivedReviewItem,
} from '@/app/services/peerReviewActions'

export default function PeerReviewResultsPage() {
  const { user, hasHydrated } = useAuthStore()
  const [results, setResults] = useState<ReceivedReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadMyGrades() {
      if (!user?._id) return
      try {
        const response = await getReceivedReviewsAction(user._id)
        if (response.success) setResults(response.data)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    if (hasHydrated) loadMyGrades()
  }, [user, hasHydrated])

  if (loading || !hasHydrated) {
    return (
      <Text
        size="xs"
        fw={700}
        className="uppercase tracking-widest text-slate-400 p-8"
      >
        Loading Grading Results...
      </Text>
    )
  }

  // Helper badge selector for submission status parameters
  const getStatusBadge = (status: ReceivedReviewItem['status']) => {
    switch (status) {
      case 'passed':
        return (
          <Badge
            color="green"
            variant="light"
            leftSection={<CheckCircle size={10} />}
          >
            Passed
          </Badge>
        )
      case 'failed':
        return (
          <Badge
            color="red"
            variant="light"
            leftSection={<AlertCircle size={10} />}
          >
            Failed
          </Badge>
        )
      default:
        return (
          <Badge
            color="yellow"
            variant="light"
            leftSection={<Clock size={10} />}
          >
            Awaiting Reviews
          </Badge>
        )
    }
  }

  return (
    <div className="py-8 max-w-4xl text-foreground bg-background">
      <header className="mb-10">
        <h1 className="text-xl md:text-3xl font-bold tracking-tighter uppercase">
          My Evaluation Feedback<span className="text-blue-600">.</span>
        </h1>
      </header>

      {results.length === 0 ? (
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
            <Text fw={700} size="sm" className="uppercase tracking-wider">
              No Submissions Evaluated
            </Text>
            <Text size="xs" c="dimmed" className="max-w-xs mx-auto">
              You haven&quot;t submitted any assignments for tracking or grading
              matrix evaluation parameters yet.
            </Text>
          </Stack>
        </Paper>
      ) : (
        <Stack gap="md">
          {results.map((item) => (
            <Paper
              key={item.assignmentId} // FIX: Using item.assignmentId instead of item._id
              p="xl"
              radius="24px"
              withBorder
              className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-900"
            >
              <Group justify="space-between" mb="sm">
                <Text
                  fw={900}
                  className="uppercase text-sm md:text-base text-slate-900 dark:text-slate-100"
                >
                  {item.assignmentTitle}
                </Text>

                <Group gap="xs">
                  {getStatusBadge(item.status)}
                  <Badge color="blue" size="lg" radius="md">
                    Final Score:{' '}
                    {item.finalScore !== undefined && item.finalScore !== null
                      ? `${item.finalScore}/100`
                      : 'N/A'}
                  </Badge>
                </Group>
              </Group>

              {/* FIX: Loop through the actual reviewsReceived list array context */}
              {item.reviewsReceived.length === 0 ? (
                <Text size="xs" c="dimmed" className="italic mt-4 pl-2">
                  No peer metrics compiled yet. Peer evaluations are
                  asynchronously pending execution workflows.
                </Text>
              ) : (
                <Stack gap="sm" className="mt-4">
                  {item.reviewsReceived.map((review, index) => (
                    <div
                      key={`${item.assignmentId}-review-${index}`}
                      className="bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-100 dark:border-slate-900/40"
                    >
                      <Group
                        justify="space-between"
                        mb="xs"
                        className="text-slate-400"
                      >
                        <Group gap="xs">
                          <MessageSquare size={14} />
                          <Text
                            size="xs"
                            fw={800}
                            className="uppercase tracking-wider"
                          >
                            Peer Reviewer Evaluation #{index + 1}
                          </Text>
                        </Group>
                        <Text
                          size="xs"
                          fw={700}
                          className="text-blue-600 dark:text-blue-400"
                        >
                          Awarded Mark: {review.score}/100
                        </Text>
                      </Group>
                      <Text
                        size="sm"
                        className="text-slate-700 dark:text-slate-300 leading-relaxed italic"
                      >
                        &quot;{review.feedback}&quot;
                      </Text>
                    </div>
                  ))}
                </Stack>
              )}
            </Paper>
          ))}
        </Stack>
      )}
    </div>
  )
}
