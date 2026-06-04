// /app/(dashboard)/dashboard/p2p/page.tsx




'use client'

import React, { useEffect, useState, useTransition } from 'react'
import {
  Paper,
  Stack,
  Group,
  Text,
  Button,
  Modal,
  Textarea,
  NumberInput,
} from '@mantine/core'
import {
  FileText,
  Loader2,
  Inbox,
  ExternalLink,
} from 'lucide-react'
import { useSnackbar } from 'notistack'

import { useAuthStore } from '@/app/store/authStore'
import {
  getPendingPeerReviewsAction,
  submitPeerReviewAction,
  PeerReviewItem,
} from '@/app/services/peerReviewActions'

export default function PeerReviewPage() {
  const { user, hasHydrated } = useAuthStore()
  const { enqueueSnackbar } = useSnackbar()

  const [reviews, setReviews] = useState<PeerReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [isPending, startTransition] = useTransition()

  // Modal Workspace Tracking State Hooks
  const [selectedReview, setSelectedReview] = useState<PeerReviewItem | null>(null)
  const [reviewScore, setReviewScore] = useState<string | number>(80)
  const [reviewFeedback, setReviewFeedback] = useState('')

  // FIX: Passing 'user' instead of 'user?._id' matches the React Compiler's static optimization schema
  const loadReviews = React.useCallback(async () => {
    if (!user?._id) return
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
  }, [user, enqueueSnackbar])

 useEffect(() => {
   if (hasHydrated) {
     const timer = setTimeout(() => {
       loadReviews()
     }, 0)

     return () => clearTimeout(timer)
   }
 }, [hasHydrated, loadReviews])

  const handleStartReview = (item: PeerReviewItem) => {
    setSelectedReview(item)
    setReviewScore(80) 
    setReviewFeedback('')
  }

  const handleCommitReview = async () => {
    if (!user?._id || !selectedReview) return
    if (!reviewFeedback.trim() || reviewFeedback.length < 15) {
      enqueueSnackbar(
        'Please provide high-quality structural engineering feedback (min 15 characters).',
        { variant: 'warning' },
      )
      return
    }

    startTransition(async () => {
      try {
        const response = await submitPeerReviewAction(
          user._id,
          selectedReview.enrollmentId,
          selectedReview.assignmentId,
          {
            score: Number(reviewScore),
            feedback: reviewFeedback,
          },
        )

        if (response.success) {
          enqueueSnackbar(
            'Evaluation parameters signed and posted. +50 PTS saved.',
            { variant: 'success' },
          )
          setSelectedReview(null)
          await loadReviews()
        } else {
          enqueueSnackbar(response.message, { variant: 'error' })
        }
      } catch (err) {
        console.error(err)
        enqueueSnackbar('Asynchronous orchestration pipeline block.', {
          variant: 'error',
        })
      }
    })
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

      {/* MODAL WORKSPACE FORM */}
      <Modal
        opened={!!selectedReview}
        onClose={() => !isPending && setSelectedReview(null)}
        title={
          <Text
            fw={900}
            size="sm"
            className="uppercase tracking-wider text-slate-900 dark:text-slate-100"
          >
            Assessing: {selectedReview?.anonymousStudentId}
          </Text>
        }
        centered
        radius="24px"
        size="lg"
        classNames={{
          content:
            'bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 text-foreground p-2',
          header:
            'bg-white dark:bg-slate-950 border-b border-slate-50 dark:border-slate-900/50 pb-4',
        }}
      >
        {selectedReview && (
          <Stack gap="xl" className="pt-4">
            {/* Context Header and Specs */}
            <div>
              <Text
                size="xs"
                fw={800}
                className="uppercase tracking-widest text-slate-400 block mb-1"
              >
                Problem Statement Matrix
              </Text>
              <Text
                size="xs"
                className="text-slate-600 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-900 p-4 radius-[16px] border border-slate-100 dark:border-slate-900/40 rounded-xl"
              >
                {selectedReview.problemStatement ||
                  'No structural context criteria configured for this task matrix item.'}
              </Text>
            </div>

            {/* Target Submission Document Link */}
            <Paper
              p="md"
              radius="xl"
              withBorder
              className="bg-blue-50/30 dark:bg-blue-950/10 border-blue-100/40 dark:border-blue-950/40"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <Text
                    size="xs"
                    fw={800}
                    className="text-blue-600 uppercase tracking-wider"
                  >
                    Student Project Submission Link
                  </Text>
                  <Text
                    size="11px"
                    c="dimmed"
                    className="truncate max-w-[280px] sm:max-w-md mt-0.5"
                  >
                    {selectedReview.submissionUrl}
                  </Text>
                </div>
                <Button
                  component="a"
                  href={selectedReview.submissionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="light"
                  color="blue"
                  radius="xl"
                  size="xs"
                  rightSection={<ExternalLink size={12} />}
                  className="uppercase font-bold tracking-widest text-[9px]"
                >
                  Open Sandbox
                </Button>
              </div>
            </Paper>

            {/* Assessment Input Matrix */}
            <Stack gap="md">
              <NumberInput
                label={
                  <Text
                    size="xs"
                    fw={800}
                    className="uppercase tracking-widest text-slate-400 mb-1"
                  >
                    Award Grade Score (0 - 100)
                  </Text>
                }
                value={reviewScore}
                onChange={(val) => setReviewScore(val || 0)}
                min={0}
                max={100}
                clampBehavior="blur"
                disabled={isPending}
                radius="md"
                size="sm"
                classNames={{
                  input:
                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm font-bold',
                }}
              />

              <Textarea
                label={
                  <Text
                    size="xs"
                    fw={800}
                    className="uppercase tracking-widest text-slate-400 mb-1"
                  >
                    Technical Commentary Review
                  </Text>
                }
                placeholder="Analyze system efficiency patterns, code optimization parameters, structural issues or edge execution failures observed..."
                value={reviewFeedback}
                onChange={(e) => setReviewFeedback(e.currentTarget.value)}
                minRows={4}
                disabled={isPending}
                radius="md"
                size="sm"
                classNames={{
                  input:
                    'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-sm',
                }}
              />
            </Stack>

            {/* Action Control Row */}
            <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-50 dark:border-slate-900/50">
              <Button
                variant="subtle"
                color="gray"
                radius="xl"
                disabled={isPending}
                onClick={() => setSelectedReview(null)}
                className="uppercase tracking-widest text-[10px] font-bold h-10 px-5"
              >
                Cancel
              </Button>
              <Button
                color="blue"
                radius="xl"
                loading={isPending}
                onClick={handleCommitReview}
                className="uppercase tracking-widest text-[10px] font-bold h-10 px-6"
              >
                Submit Evaluation Matrix
              </Button>
            </div>
          </Stack>
        )}
      </Modal>
    </div>
  )
}