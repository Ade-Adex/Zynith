'use client'

import React, { useState, useMemo } from 'react'
import { Hero } from '@/app/components/Hero'
import { Features } from '@/app/components/Features'
import { CourseCard } from './components/CourseCard'
import { COURSES } from '@/app/data'
import { FilterType } from '@/app/types' // Ensure this type exists: 'All' | 'Free' | 'Premium'

export default function LandingPage() {
  const [filter, setFilter] = useState<FilterType>('All')

  const filteredCourses = useMemo(() => {
    if (filter === 'All') return COURSES
    return COURSES.filter((course) => course.type === filter)
  }, [filter])

  return (
    <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white">
      <Hero />
      <Features />

      {/* Course Grid Section */}
      <section
        id="courses"
        className="max-w-7xl mx-auto px-6 py-24 border-t border-slate-100"
      >
        <div className="flex flex-col lg:flex-row lg:items-end justify-between mb-16 gap-8">
          <div className="max-w-md">
            <h2 className="text-3xl font-black uppercase tracking-tighter mb-4">
              Core <span className="text-blue-600">Tracks</span>
            </h2>
            <p className="text-slate-500 text-sm font-medium leading-relaxed">
              From distributed systems to advanced frontend architecture. Filter
              by tier to find your next challenge.
            </p>
          </div>

          {/* Sleek Filter Tabs */}
          <div className="flex p-1 bg-slate-50 border border-slate-200 rounded-xl w-fit">
            {(['All', 'Free', 'Premium'] as FilterType[]).map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type)}
                className={`px-8 py-2 rounded-lg text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-300 ${
                  filter === type
                    ? 'bg-white text-blue-600 shadow-sm border border-slate-100 scale-[1.02]'
                    : 'text-slate-400 hover:text-slate-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Courses Display */}
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {filteredCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center border-2 border-dashed border-slate-100 rounded-[32px]">
            <p className="text-slate-400 text-sm font-bold uppercase tracking-widest">
              No courses found in this category.
            </p>
          </div>
        )}

        <div className="mt-20 flex justify-center">
          <button className="px-10 py-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-colors shadow-lg shadow-slate-200">
            View All 42 Courses
          </button>
        </div>
      </section>
    </div>
  )
}
