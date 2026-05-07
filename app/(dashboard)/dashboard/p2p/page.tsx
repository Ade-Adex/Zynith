'use client'

import { Paper, Stack, Group, Text, Badge, Button } from '@mantine/core'
import { FileText, CheckCircle, AlertCircle } from 'lucide-react'

export default function PeerReviewPage() {
  return (
    <div className="py-8 max-w-4xl">
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

      <Stack gap="md">
        {[1, 2].map((i) => (
          <Paper
            key={i}
            p="xl"
            radius="24px"
            withBorder
            className="bg-white border-slate-100"
          >
            <Group justify="space-between">
              <Group gap="lg">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600">
                  <FileText size={20} />
                </div>
                <div>
                  <Text
                    fw={900}
                    className="uppercase tracking-tight text-slate-900 text-sm md:text-base"
                  >
                    System Architecture Assignment
                  </Text>
                  <Text size="10px" c="dimmed" fw={700}>
                    Student: ANONYMOUS_{i}72 • Submitted 2h ago
                  </Text>
                </div>
              </Group>
              <Button
                color="blue"
                radius="xl"
                className="font-jakarta uppercase tracking-widest text-[10px] h-10 px-6"
              >
                Start Review
              </Button>
            </Group>
          </Paper>
        ))}
      </Stack>
    </div>
  )
}