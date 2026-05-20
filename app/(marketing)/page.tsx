// /app/(marketing)/page.tsx
'use client'

import React, { useState, useMemo, useRef } from 'react'
import { Carousel } from '@mantine/carousel'
import { Hero } from '@/app/components/Hero'
import { Features } from '@/app/components/Features'
import { StatsBar } from '@/app/components/StatsBar'
import { QuickNav } from '@/app/components/QuickNav'
import { MethodSection } from '@/app/components/MethodSection'
import { CourseGrid } from '@/app/components/CourseGrid'
import { CertificatePreview } from '@/app/components/CertificatePreview'
import { FilterType, Course } from '@/app/types'
import { Star, MessageSquareQuote, Loader2, ArrowLeft, ArrowRight } from 'lucide-react'
import { useCourses } from '@/app/hooks/useCourses'

type CourseFilter = FilterType | 'All' | 'Bestseller' | 'Top Rated'

export default function LandingPage() {
  const { courses, loading } = useCourses()
  const [filter, setFilter] = useState<CourseFilter>('All')
  const [currentPage, setCurrentPage] = useState<number>(1)
  const coursesRef = useRef<HTMLDivElement>(null)

  // Dynamically derived straight from operational database values
  const landingTestimonials = useMemo(() => {
    if (!courses) return []
    return courses.flatMap((c) =>
      (c.testimonies || []).map((t) => ({ ...t, courseTitle: c.title })),
    )
  }, [courses])

  const filteredCourses = useMemo<Course[]>(() => {
    const list = [...(courses || [])]
    if (filter === 'Bestseller')
      return list.filter((c) => c.tag === 'Bestseller')
    if (filter === 'Top Rated') {
      return list
        .filter((c) => c.rating >= 4.5)
        .sort((a, b) => b.rating - a.rating)
    }
    if (filter !== 'All') return list.filter((course) => course.type === filter)
    return list
  }, [filter, courses])

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
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-4 border border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
            <Loader2 className="animate-spin text-blue-600" size={24} />
            <p className="text-xs font-black uppercase tracking-widest text-slate-400">
              Retrieving Catalog Repository...
            </p>
          </div>
        ) : (
          <CourseGrid
            courses={filteredCourses}
            currentFilter={filter}
            currentPage={currentPage}
            onFilterChange={handleFilterChange}
            onPageChange={setCurrentPage}
          />
        )}
      </section>

      {/* Global Student Testimonial Section with Valid Type-Safe Mantine Configuration */}
      {landingTestimonials.length > 0 && (
        <section className="max-w-7xl mx-auto py-16 border-t border-slate-100">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 mb-12">
            <div className="flex items-center gap-4">
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
          </div>

          <Carousel
            withIndicators
            slideGap="lg"
            slideSize={{ base: '100%', sm: '50%', lg: '33.333333%' }}
            nextControlIcon={
              <ArrowRight size={16} className="text-slate-700" />
            }
            previousControlIcon={
              <ArrowLeft size={16} className="text-slate-700" />
            }
            emblaOptions={{
              slidesToScroll: 1,
              loop: true,
              align: 'start',
            }}
            classNames={{
              root: 'group relative',
              controls: 'absolute -top-20 right-0 flex gap-2',
              control:
                'w-10 h-10 border border-slate-200! bg-white hover:bg-slate-50! shadow-xs transition-colors rounded-xl flex items-center justify-center pointer-events-auto static z-50!',
              indicators: 'flex justify-center gap-2 mt-8',
              indicator:
                'w-2 h-2 rounded-full bg-red-500 transition-all data-[active]:w-6 data-[active]:bg-blue-600',
            }}
          >
            {landingTestimonials.map((test, index) => (
              <Carousel.Slide key={test.id || index} className="pb-4">
                <div className="h-full p-6 border border-slate-200 rounded-3xl bg-slate-50/50 flex flex-col justify-between hover:border-slate-300 transition-all duration-300 shadow-xs hover:shadow-md">
                  <div>
                    <div className="flex gap-1 mb-4 text-amber-400">
                      {[...Array(Number(test.rating || 5))].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          fill="currentColor"
                          stroke="none"
                        />
                      ))}
                    </div>
                    <p className="text-slate-700 font-medium text-sm md:text-base mb-6 leading-relaxed">
                      &quot;{test.reviewText}&quot;
                    </p>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
                    <span className="text-xs font-black uppercase tracking-wider text-slate-900 truncate max-w-[140px]">
                      {test.studentName}
                    </span>
                    <span className="text-[9px] font-bold uppercase tracking-widest text-slate-400 truncate max-w-[160px] text-right ml-2">
                      {test.courseTitle}
                    </span>
                  </div>
                </div>
              </Carousel.Slide>
            ))}
          </Carousel>
        </section>
      )}

      <CertificatePreview />
      <Features />
    </div>
  )
}