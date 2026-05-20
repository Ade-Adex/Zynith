// /app/(dashboard)/learning/page.tsx
'use client'

import React, { useMemo } from 'react'
import { SimpleGrid, Text, Tabs, Center, Loader } from '@mantine/core'
import { CourseCard } from '@/app/components/CourseCard'
import { useCourses } from '@/app/hooks/useCourses'
import { useAuthStore } from '@/app/store/authStore'
import { UserType } from '@/app/types/user' // Import the master user schema types directly

export default function MyLearningPage() {
  const { courses, loading: coursesLoading } = useCourses()
  const { user, isAuthenticated } = useAuthStore()

  // Safely map store profile against master definitions to resolve missing field errors
  const currentUser = user as unknown as UserType | null

  // Process data purely based on the active state inside Zustand storage
  const myCourses = useMemo(() => {
    if (!currentUser?.enrollments || !courses) return []

    const enrolledIds = currentUser.enrollments.map((e) => String(e.courseId))
    return courses.filter((c) => enrolledIds.includes(String(c._id)))
  }, [currentUser, courses])

  const isLoading = coursesLoading || (!currentUser && !isAuthenticated)

  return (
    <div className="py-8">
      <header className="mb-10">
        <h1 className="text-xl md:text-3xl font-bold tracking-tighter uppercase">
          My Learning<span className="text-blue-600">.</span>
        </h1>
        <Text
          c="dimmed"
          fw={600}
          className="uppercase tracking-widest text-[10px]! md:text-xs! mt-2"
        >
          Track your progress and continue where you left off
        </Text>
      </header>

      {isLoading ? (
        <Center className="py-24 border border-dashed border-slate-100 rounded-[32px] bg-slate-50/30">
          <div className="flex flex-col items-center gap-3">
            <Loader size="sm" color="blue" />
            <Text
              size="xs"
              fw={700}
              className="uppercase tracking-widest text-slate-400"
            >
              Retrieving Enrolled Profile Tracks...
            </Text>
          </div>
        </Center>
      ) : (
        <Tabs
          defaultValue="active"
          variant="unstyled"
          classNames={{
            tab: 'font-jakarta font-bold uppercase tracking-widest text-xs',
          }}
        >
          <Tabs.List className="flex gap-8 border-b border-slate-100 mb-8">
            <Tabs.Tab
              value="active"
              className="pb-4 data-[active]:border-b-2 data-[active]:border-blue-600"
            >
              Active
            </Tabs.Tab>
            <Tabs.Tab
              value="completed"
              className="pb-4 opacity-50 data-[active]:opacity-100"
            >
              Completed
            </Tabs.Tab>
            <Tabs.Tab
              value="wishlist"
              className="pb-4 opacity-50 data-[active]:opacity-100"
            >
              Wishlist
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="active">
            {myCourses.length === 0 ? (
              <Center className="py-16 border border-slate-100 rounded-[24px] bg-slate-50/50">
                <Text
                  size="sm"
                  fw={600}
                  c="dimmed"
                  className="uppercase tracking-wider"
                >
                  No active modern courses found on your profile
                </Text>
              </Center>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
                {myCourses.map((course) => (
                  <CourseCard key={String(course._id)} course={course} />
                ))}
              </SimpleGrid>
            )}
          </Tabs.Panel>
        </Tabs>
      )}
    </div>
  )
}
