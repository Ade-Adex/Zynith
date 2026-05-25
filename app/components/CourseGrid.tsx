'use client'

import React, { useState, useEffect } from 'react'
import { CourseCard } from '@/app/components/CourseCard'
import { CourseFilters } from '@/app/components/CourseFilters'
import { Pagination } from '@/app/components/Pagination'
import { Course, FilterType } from '@/app/types'

type CourseFilter = FilterType | 'All' | 'Bestseller' | 'Top Rated'

interface CourseGridProps {
  courses: Course[]
  currentFilter: CourseFilter
  currentPage: number
  onFilterChange: (filter: CourseFilter) => void
  onPageChange: (page: number) => void
}

const ITEMS_PER_PAGE = 4

export function CourseGrid({
  courses,
  currentFilter,
  currentPage,
  onFilterChange,
  onPageChange,
}: CourseGridProps) {
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(
    null,
  )
  const [animatingPage, setAnimatingPage] = useState(currentPage)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)

  // Derive courses based on the current animating page block
  const displayedCourses = courses.slice(
    (animatingPage - 1) * ITEMS_PER_PAGE,
    animatingPage * ITEMS_PER_PAGE,
  )

  const handlePageTransition = (nextPage: number) => {
    if (nextPage === currentPage || isTransitioning) return

    // Determine swipe vector trajectory
    setSlideDirection(nextPage > currentPage ? 'right' : 'left')
    setIsTransitioning(true)

    // Stage 1: Trigger out-slide action
    setTimeout(() => {
      onPageChange(nextPage)
      setAnimatingPage(nextPage)
      // Reverse slide vector to smoothly slide in from the opposite side
      setSlideDirection(nextPage > currentPage ? 'left' : 'right')
    }, 250) // Matches half duration cycle
  }

  useEffect(() => {
    if (isTransitioning) {
      // Stage 2: Reset transformation tracks to resting state
      const timer = setTimeout(() => {
        setSlideDirection(null)
        setIsTransitioning(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentPage, isTransitioning])

  return (
    <>
      <div className="mb-8">
        <h2 className="text-4xl font-black uppercase tracking-tighter mb-2">
          Engineering <span className="text-blue-600">Excellence</span>
        </h2>
        <p className="text-slate-500 text-sm italic">
          Currently viewing {courses.length} results for &quot;{currentFilter}
          &quot;
        </p>
      </div>

      <CourseFilters
        currentFilter={currentFilter}
        onFilterChange={onFilterChange}
      />

      {displayedCourses.length > 0 ? (
        <div className="w-full overflow-x-hidden py-4 px-1">
          <div
            className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 transition-all duration-300 ease-out transform ${
              slideDirection === 'right'
                ? '-translate-x-12 opacity-20 filter blur-xs'
                : slideDirection === 'left'
                  ? 'translate-x-12 opacity-20 filter blur-xs'
                  : 'translate-x-0 opacity-100 filter blur-none'
            }`}
          >
            {displayedCourses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageTransition}
          />
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-4xl">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
            No tracks found matching &quot;{currentFilter}&quot;.
          </p>
        </div>
      )}
    </>
  )
}