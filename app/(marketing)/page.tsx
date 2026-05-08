'use client'

import React, { useState, useMemo, useRef } from 'react'
import { Hero } from '@/app/components/Hero'
import { Features } from '@/app/components/Features'
import { StatsBar } from '@/app/components/StatsBar'
import { QuickNav } from '@/app/components/QuickNav'
import { MethodSection } from '@/app/components/MethodSection'
import { CourseGrid } from '@/app/components/CourseGrid'
import { CertificatePreview } from '@/app/components/CertificatePreview'
import { COURSES } from '@/app/data'
import { FilterType, Course } from '@/app/types'

type CourseFilter = FilterType | 'All' | 'Bestseller' | 'Top Rated'

export default function LandingPage() {
  const [filter, setFilter] = useState<CourseFilter>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const coursesRef = useRef<HTMLDivElement>(null)

  const filteredCourses = useMemo<Course[]>(() => {
    const list = [...COURSES]
    if (filter === 'Bestseller')
      return list.filter((c) => c.tag === 'Bestseller')
    if (filter === 'Top Rated') {
      return list
        .filter((c) => c.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
    }
    if (filter !== 'All') return list.filter((course) => course.type === filter)
    return list
  }, [filter])

  const handleFilterChange = (newFilter: CourseFilter): void => {
    setFilter(newFilter)
    setCurrentPage(1)
    coursesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white p-5 md:p-16 font-sans">
      <QuickNav />
      <Hero />
      <StatsBar />
      <MethodSection />

      <section
        id="courses"
        ref={coursesRef}
        className="max-w-7xl mx-auto py-12 scroll-mt-24"
      >
        <CourseGrid
          courses={filteredCourses}
          currentFilter={filter}
          currentPage={currentPage}
          onFilterChange={handleFilterChange}
          onPageChange={setCurrentPage}
        />
      </section>

      <CertificatePreview />
      <Features />
    </div>
  )
}