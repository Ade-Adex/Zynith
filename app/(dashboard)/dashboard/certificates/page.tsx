'use client'

import React from 'react'
import {
  Paper,
  Text,
  Stack,
  Group,
  Badge,
  Button,
  ActionIcon,
  Tooltip,
} from '@mantine/core'
import {
  Award,
  Download,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react'
import { MOCK_USER } from '@/app/data/mockUser'
import { COURSES } from '@/app/data'
import { Enrollment } from '@/app/types/user'
import { Course } from '@/app/types'

interface CertificateData extends Enrollment {
  details?: Course
}

export default function CertificationPage() {
  const completedCourses: CertificateData[] = MOCK_USER.enrollments
    .filter((en: Enrollment) => en.progressPercentage === 100)
    .map((en: Enrollment) => ({
      ...en,
      details: COURSES.find((c: Course) => c.id === en.courseId),
    }))

  return (
    <div className="py-8 max-w-6xl mx-auto">
      {/* Minimal Header */}
      <header className="flex justify-between items-end mb-16">
        <div>
          <h1 className="text-xl md:text-3xl font-bold uppercase tracking-tighter leading-none">
            Registry<span className="text-blue-600">.</span>
          </h1>
          <Text c="dimmed" className="text-[10px]! md:text-xs! mt-2! max-w-md">
            Your verified academic record and professional certifications
            secured on the Zynith framework.
          </Text>
        </div>
        <div className="text-right hidden md:block">
          <Text className="text-[10px]! md:text-sm uppercase text-slate-400">
            Total Credentials
          </Text>
          <Text className="text-base font-bold">{completedCourses.length}</Text>
        </div>
      </header>

      {completedCourses.length > 0 ? (
        <Stack gap="xs">
          {/* List Header */}
          <Group
            px="sm"
            py="sm"
            className="hidden! md:flex! opacity-40 uppercase font-bold text-[9px]"
          >
            <Text className="flex-1 text-[9px]! md:text-sm!">
              Certification Track
            </Text>
            <Text className="w-40 text-center text-[9px]! md:text-sm!">
              Issued Date
            </Text>
            <Text className="w-48 text-center text-[9px]! md:text-sm!">
              Verification ID
            </Text>
            <div className="w-32" />
          </Group>

          {completedCourses.map((cert) => (
            <CertificateRow key={cert.courseId} cert={cert} />
          ))}
        </Stack>
      ) : (
        <EmptyRegistry />
      )}
    </div>
  )
}

function CertificateRow({ cert }: { cert: CertificateData }) {
  return (
    <Paper
      p="md"
      radius="20px"
      withBorder
      className="group bg-white border-slate-100 hover:border-blue-200 hover:shadow-[0_20px_40px_rgb(0,0,0,0.03)] transition-all duration-300"
    >
      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Top Section */}
        <div className="flex items-start gap-4 flex-1 min-w-0">
          {/* Leading Icon */}
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
            <Award size={20} strokeWidth={2.5} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <Text className="text-sm md:text-base! font-bold! uppercase tracking-tight text-slate-900 leading-snug wrap-break-word">
              {cert.details?.title || cert.courseTitle}
            </Text>

            <Group gap={6} mt={4}>
              <ShieldCheck size={12} className="text-blue-600 shrink-0" />
              <Text
                size="10px"
                fw={700}
                c="dimmed"
                className="uppercase tracking-wider"
              >
                Verified Credential
              </Text>
            </Group>

            {/* Mobile Meta */}
            <div className="flex flex-col gap-2 mt-4 md:hidden">
              <Text size="11px" fw={800} className="text-slate-500 uppercase">
                Issued May 2026
              </Text>

              <Badge
                variant="outline"
                color="gray"
                radius="sm"
                className="text-[10px]! border-slate-200 w-fit"
              >
                ZN-{String(cert.courseId).toUpperCase()}-X22
              </Badge>
            </div>
          </div>
        </div>

        {/* Desktop Date */}
        <div className="w-40 hidden md:block text-center">
          <Text size="12px" fw={800} className="text-slate-600">
            MAY 2026
          </Text>
        </div>

        {/* Desktop ID */}
        <div className="w-48 hidden md:block text-center">
          <Badge
            variant="outline"
            color="gray"
            radius="sm"
            className="text-[10px]! border-slate-200"
          >
            ZN-{String(cert.courseId).toUpperCase()}-X22
          </Badge>
        </div>

        {/* Actions */}
        <Group
          gap="xs"
          className="w-full md:w-32 justify-between md:justify-end"
        >
          <Tooltip label="Download PDF" position="top">
            <ActionIcon
              variant="subtle"
              color="dark"
              radius="md"
              size="lg"
              className="flex-1 md:flex-none"
            >
              <Download size={18} />
            </ActionIcon>
          </Tooltip>

          <ActionIcon
            variant="filled"
            color="blue"
            radius="md"
            size="lg"
            className="shadow-lg shadow-blue-600/20 flex-1 md:flex-none"
          >
            <ChevronRight size={20} />
          </ActionIcon>
        </Group>
      </div>
    </Paper>
  )
}

function EmptyRegistry() {
  return (
    <Paper
      radius="16px"
      className="bg-slate-50 border border-slate-200 px-6 md:px-16 py-12 flex flex-col items-center justify-center text-center"
    >
      <div className="relative mb-8">
        <div className="absolute inset-0 bg-blue-100 blur-2xl rounded-full opacity-50" />
        <Award size={64} className="text-slate-300 relative z-10" />
      </div>
      <Text className="font-bold uppercase text-base md:text-xl tracking-tighter text-slate-400">
        Registry Entry Empty
      </Text>
      <Text
        size="xs"
        c="dimmed"
        className="uppercase font-bold tracking-[0.2em] mt-2"
      >
        Complete your active curriculum to populate this list.
      </Text>
      <Button
        mt="xl"
        variant="filled"
        color="dark"
        radius="xl"
        className="uppercase tracking-widest text-[10px] h-11 px-10"
      >
        Go to Learning Path
      </Button>
    </Paper>
  )
}
