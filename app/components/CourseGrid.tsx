// /app/components/CourseGrid.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { CourseCard } from '@/app/components/CourseCard'
import { CourseFilters } from '@/app/components/CourseFilters'
import { Pagination } from '@/app/components/Pagination'
import { Course, FilterType } from '@/app/types'

interface CourseGridProps {
  courses: Course[]
  currentFilter: FilterType | 'All' | 'Bestseller' | 'Top Rated'
  currentPage: number
  onFilterChange: (filter: FilterType) => void
  onPageChange: (page: number) => void
  viewLayout?: 'grid' | 'list'
}

const ITEMS_PER_PAGE = 4

export function CourseGrid({
  courses,
  currentFilter,
  currentPage,
  onFilterChange,
  onPageChange,
  viewLayout = 'grid',
}: CourseGridProps) {
  const [slideDirection, setSlideDirection] = useState<'left' | 'right' | null>(
    null,
  )
  const [isTransitioning, setIsTransitioning] = useState(false)

  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)

  // FIX: Dynamic slice recalculation bound strictly to the managed parent page index
  const displayedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

  const handlePageTransition = (nextPage: number) => {
    if (nextPage === currentPage || isTransitioning) return

    setSlideDirection(nextPage > currentPage ? 'right' : 'left')
    setIsTransitioning(true)

    setTimeout(() => {
      onPageChange(nextPage)
    }, 250)
  }

  useEffect(() => {
    if (isTransitioning) {
      const timer = setTimeout(() => {
        setSlideDirection(null)
        setIsTransitioning(false)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [currentPage, isTransitioning])

  return (
    <>
      <div className="mb-8 space-y-2">
        <h2 className="text-3xl md:text-5xl font-black tracking-tight uppercase italic text-slate-900 dark:text-white">
          Engineering <span className="text-blue-600">Excellence</span>
        </h2>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
          Currently filtering{' '}
          <span className="font-bold text-blue-600">{courses.length}</span>{' '}
          active tracks under framework selection &quot;{currentFilter}&quot;
        </p>
      </div>

      <CourseFilters
        currentFilter={currentFilter as FilterType}
        onFilterChange={onFilterChange}
      />

      {displayedCourses.length > 0 ? (
        <div className="w-full overflow-x-hidden py-4 px-1">
          <div
            className={`transition-all duration-300 ease-out transform ${
              viewLayout === 'list'
                ? 'flex flex-col gap-6'
                : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
            } ${
              slideDirection === 'right'
                ? '-translate-x-12 opacity-20 filter blur-xs'
                : slideDirection === 'left'
                  ? 'translate-x-12 opacity-20 filter blur-xs'
                  : 'translate-x-0 opacity-100 filter blur-none'
            }`}
          >
            {displayedCourses.map((course) => (
              <CourseCard
                key={course._id}
                course={course}
                viewLayout={viewLayout}
              />
            ))}
          </div>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageTransition}
          />
        </div>
      ) : (
        <div className="py-24 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl max-w-xl mx-auto space-y-2">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
            Zero Catalog Intersections Identified
          </p>
          <p className="text-slate-500 text-xs max-w-xs mx-auto">
            No matching development tracks were extracted using parameter
            filters: &quot;{currentFilter}&quot;.
          </p>
        </div>
      )}
    </>
  )
}