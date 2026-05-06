import React from 'react'
import { notFound } from 'next/navigation'
import { COURSES } from '@/app/data'
import Image from 'next/image'
import {
  Play,
  Clock,
  Users,
  Star,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
} from 'lucide-react'
import { CourseCurriculum } from '@/app/components/CourseCurriculum'
import { CourseEnrollCard } from '@/app/components/CourseEnrollCard'

interface Props {
  params: Promise<{ id: string }>
}

export default async function CourseDetails({ params }: Props) {
  const { id } = await params
  const course = COURSES.find((c) => c.id === Number(id))

  if (!course) notFound()

  // FIX 1: Provide safe defaults for optional properties
  const features = course.features || []
  const price = course.price || '0'
  const type = course.type || 'Premium'
  const modules = course.modules || []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header Section */}
      <section className="relative bg-slate-950 text-white pt-40 pb-24 px-6 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          {course.image && (
            <Image
              src={course.image}
              alt=""
              fill
              className="object-cover blur-2xl"
            />
          )}
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="px-4 py-1 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
                {type}
              </span>
              {course.tag && (
                <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                  {course.tag}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.85] mb-8">
              {course.title}
            </h1>

            <p className="text-slate-400 text-sm md:text-base max-w-xl mb-10 leading-relaxed font-medium">
              Advance your career with {course.instructor}. Master{' '}
              {/* FIX 2: Check if features exist before accessing index 0 */}
              {features.length > 0 ? features[0] : 'Expert Skills'} and beyond
              through our high-fidelity modular learning protocol.
            </p>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <Star size={16} fill="currentColor" />
                  <span className="text-xl font-black">{course.rating}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Avg Rating
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Users size={16} />
                  <span className="text-xl font-black">
                    {course.students.toLocaleString()}
                  </span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Students
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Clock size={16} />
                  <span className="text-xl font-black">{course.duration}</span>
                </div>
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Duration
                </p>
              </div>
            </div>
          </div>

          <div className="relative group aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center">
            {/* Background Image */}
            {course.image && (
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              />
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/20 to-transparent" />

            {/* Play Button - Now Centered by the parent flex container */}
            <button className="relative z-10 w-16 h-16 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-500 shadow-white/10 shadow-2xl">
              <Play fill="currentColor" size={32} className="ml-1" />
            </button>

            {/* Bottom Info Bar */}
            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
              <p className="font-black uppercase text-[10px] tracking-[0.4em] text-white">
                Preview Track
              </p>
              <div className="h-[1px] flex-1 mx-4 bg-white/20" />
              <span className="text-[10px] font-black text-white">02:45</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-3 gap-20">
        <div className="lg:col-span-2 space-y-20">
          <section>
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <CheckCircle2 className="text-blue-600" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-tighter">
                Learning Outcomes
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {/* Use the safe features array */}
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-6 rounded-[2rem] border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-500 group"
                >
                  <ShieldCheck
                    className="text-blue-600 shrink-0 group-hover:scale-110 transition-transform"
                    size={24}
                  />
                  <p className="text-sm font-bold text-slate-700 leading-snug">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-10">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center">
                  <BookOpen className="text-white" size={20} />
                </div>
                <h2 className="text-3xl font-black uppercase tracking-tighter">
                  Curriculum
                </h2>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                {modules.length} Modules
              </span>
            </div>
            <CourseCurriculum modules={modules} />
          </section>
        </div>

        <aside className="relative">
          <div className="sticky top-32">
            {/* FIX 3: Pass guaranteed string values to the component */}
            <CourseEnrollCard price={price} type={type} />
          </div>
        </aside>
      </main>
    </div>
  )
}
