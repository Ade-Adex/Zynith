import React from 'react'
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
  const totalPages = Math.ceil(courses.length / ITEMS_PER_PAGE)
  const displayedCourses = courses.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  )

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
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {displayedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[2rem]">
          <p className="text-slate-400 text-xs font-black uppercase tracking-widest">
            No tracks found matching &quot;{currentFilter}&quot;.
          </p>
        </div>
      )}
    </>
  )
}
