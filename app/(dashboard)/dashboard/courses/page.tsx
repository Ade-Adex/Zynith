'use client'

import { SimpleGrid, Text, Tabs, Badge } from '@mantine/core'
import { CourseCard } from '@/app/components/CourseCard'
import { COURSES } from '@/app/data'
import { MOCK_USER } from '@/app/data/mockUser'

export default function MyLearningPage() {
  const enrolledIds = MOCK_USER.enrollments.map((e) => e.courseId)
  const myCourses = COURSES.filter((c) => enrolledIds.includes(c.id))

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
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
            {myCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </SimpleGrid>
        </Tabs.Panel>
      </Tabs>
    </div>
  )
}
