// /app/(marketing)/courses/page.tsx

'use client'

import React, { useState, useMemo } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { useCourses } from '@/app/hooks/useCourses'
import { CourseGrid } from '@/app/components/CourseGrid'
import { FilterType } from '@/app/types'

type ViewLayout = 'grid' | 'list'
type CourseFilter = FilterType | 'All' | 'Bestseller' | 'Top Rated'

export default function CoursesPage() {
  const { courses = [], loading, error } = useCourses()
  const [currentFilter, setCurrentFilter] = useState<CourseFilter>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [viewLayout, setViewLayout] = useState<ViewLayout>('grid')

  // FIX: Overhauled array filtering to support type safety flags perfectly
  const filteredCourses = useMemo(() => {
    const list = [...(courses || [])]

    if (currentFilter === 'All') return list

    if (currentFilter === 'Bestseller') {
      return list.filter((c) => c.tag?.toLowerCase() === 'bestseller')
    }

    if (currentFilter === 'Top Rated') {
      return list
        .filter((c) => c.rating && c.rating >= 4.5)
        .sort((a, b) => (b.rating || 0) - (a.rating || 0))
    }

    if (currentFilter === 'Free') {
      return list.filter(
        (c) => c.type?.toLowerCase() === 'free' || c.price === 0,
      )
    }

    if (currentFilter === 'Premium') {
      return list.filter(
        (c) => c.type?.toLowerCase() === 'premium' || (c.price && c.price > 0),
      )
    }

    // FIX: Typecast fallback check to eliminate structural union mismatching
    return list.filter((course) => course.type === (currentFilter as string))
  }, [currentFilter, courses])

  const handleFilterChange = (filter: string) => {
    setCurrentFilter(filter as CourseFilter)
    setCurrentPage(1) // Instantly clear pagination offset indexes
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 min-h-screen bg-background text-foreground">
      {/* Control Strip Matrix Header Layout */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 border-b border-slate-100 dark:border-slate-800/80 pb-6">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">
            Internal Platform Registry
          </p>
          <h1 className="text-2xl font-black uppercase tracking-tight text-slate-900 dark:text-white">
            Development Curriculums
          </h1>
        </div>

        {/* View Layout Switcher Segment toggler */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl self-end sm:self-auto border border-slate-200/40 dark:border-slate-800/40">
          <button
            onClick={() => setViewLayout('grid')}
            className={`p-2 rounded-lg cursor-pointer transition-all ${
              viewLayout === 'grid'
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="Grid Layout View"
          >
            <LayoutGrid size={16} />
          </button>
          <button
            onClick={() => setViewLayout('list')}
            className={`p-2 rounded-lg cursor-pointer transition-all ${
              viewLayout === 'list'
                ? 'bg-white dark:bg-slate-800 text-blue-600 shadow-xs'
                : 'text-slate-400 hover:text-slate-600'
            }`}
            title="List Layout View"
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {/* Database State Gateways */}
      {loading && (
        <div className="py-24 text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-xs font-mono tracking-widest uppercase text-slate-400 animate-pulse">
            Querying catalog matrices...
          </p>
        </div>
      )}

      {error && (
        <div className="py-12 max-w-xl mx-auto text-center border border-red-200/60 dark:border-red-900/40 bg-red-50/50 dark:bg-red-950/10 rounded-2xl p-6">
          <p className="text-xs font-black uppercase tracking-wider text-red-500 mb-1">
            Communication Interface Failure
          </p>
          <p className="text-xs text-slate-500">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <CourseGrid
          courses={filteredCourses}
          currentFilter={currentFilter}
          currentPage={currentPage}
          onFilterChange={handleFilterChange}
          onPageChange={setCurrentPage}
          viewLayout={viewLayout}
        />
      )}
    </main>
  )
}