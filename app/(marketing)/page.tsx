// // /app/(marketing)/page.tsx

// 'use client'

// import React, { useState, useMemo, useRef } from 'react'
// import { Hero } from '@/app/components/Hero'
// import { Features } from '@/app/components/Features'
// import { StatsBar } from '@/app/components/StatsBar'
// import { QuickNav } from '@/app/components/QuickNav'
// import { MethodSection } from '@/app/components/MethodSection'
// import { CourseGrid } from '@/app/components/CourseGrid'
// import { CertificatePreview } from '@/app/components/CertificatePreview'
// import { COURSES } from '@/app/data'
// import { FilterType, Course } from '@/app/types'

// type CourseFilter = FilterType | 'All' | 'Bestseller' | 'Top Rated'

// export default function LandingPage() {
//   const [filter, setFilter] = useState<CourseFilter>('All')
//   const [currentPage, setCurrentPage] = useState<number>(1)
//   const coursesRef = useRef<HTMLDivElement>(null)

//   const filteredCourses = useMemo<Course[]>(() => {
//     const list = [...COURSES]
//     if (filter === 'Bestseller')
//       return list.filter((c) => c.tag === 'Bestseller')
//     if (filter === 'Top Rated') {
//       return list
//         .filter((c) => c.rating >= 4.5)
//         .sort((a, b) => b.rating - a.rating)
//     }
//     if (filter !== 'All') return list.filter((course) => course.type === filter)
//     return list
//   }, [filter])

//   const handleFilterChange = (newFilter: CourseFilter): void => {
//     setFilter(newFilter)
//     setCurrentPage(1)
//     coursesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
//   }

//   return (
//     <div className="min-h-screen bg-white selection:bg-blue-600 selection:text-white p-5 md:p-16 font-sans">
//       <QuickNav />
//       <Hero />
//       <StatsBar />
//       <MethodSection />

//       <section
//         id="courses"
//         ref={coursesRef}
//         className="max-w-7xl mx-auto py-12 scroll-mt-24"
//       >
//         <CourseGrid
//           courses={filteredCourses}
//           currentFilter={filter}
//           currentPage={currentPage}
//           onFilterChange={handleFilterChange}
//           onPageChange={setCurrentPage}
//         />
//       </section>

//       <CertificatePreview />
//       <Features />
//     </div>
//   )
// }

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
import { Star, MessageSquareQuote } from 'lucide-react'

type CourseFilter = FilterType | 'All' | 'Bestseller' | 'Top Rated'

// Derived from all course testimonies for top global placement
const LANDING_TESTIMONIALS = COURSES.flatMap((c) =>
  c.testimonies.map((t) => ({ ...t, courseTitle: c.title })),
)

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

      {/* Global Student Testimonial Section */}
      <section className="max-w-7xl mx-auto py-16 border-t border-slate-100">
        <div className="flex items-center gap-4 mb-12">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
            <MessageSquareQuote size={22} />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600 mb-0.5">
              Real Impact
            </p>
            <h2 className="text-xl md:text-3xl font-black uppercase tracking-tighter">
              Learner Experiences
            </h2>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {LANDING_TESTIMONIALS.map((test) => (
            <div
              key={test.id}
              className="p-6 border border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col justify-between"
            >
              <div>
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[...Array(test.rating)].map((_, i) => (
                    <Star key={i} size={14} fill="currentColor" />
                  ))}
                </div>
                <p className="text-slate-700 font-medium text-sm md:text-base mb-6 leading-relaxed">
                  &quot;{test.reviewText}&quot;
                </p>
              </div>
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <span className="text-xs font-black uppercase tracking-wider text-slate-900">
                  {test.studentName}
                </span>
                <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400">
                  {test.courseTitle}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <CertificatePreview />
      <Features />
    </div>
  )
}