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

  const features = course.features || []
  const price = course.price || '0'
  const type = course.type || 'Premium'
  const modules = course.modules || []

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Header Section */}
      <section className="relative bg-slate-950 text-white pt-40 pb-24 px-6 overflow-hidden">
        {/* Visual Background Layer */}
        <div className="absolute inset-0 opacity-30">
          {course.previewVideo ? (
            <video
              src={course.previewVideo}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover blur-md scale-110"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${course.color} blur-3xl opacity-50`}
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

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              {course.title}
            </h1>

            <p className="text-slate-400 text-sm md:text-base max-w-xl mb-10 leading-relaxed font-medium">
              Advance your career with {course.instructor}. Master{' '}
              {features[0] || 'Modern Technologies'} through our high-fidelity
              modular learning protocol.
            </p>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <Star size={16} fill="currentColor" />
                  <span className="text-base md:text-xl font-black">
                    {course.rating.toFixed(1)}
                  </span>
                </div>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Avg Rating
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Users size={16} />
                  <span className="text-base md:text-xl font-black">
                    {course.students.toLocaleString()}
                  </span>
                </div>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Learners
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Clock size={16} />
                  <span className="text-base md:text-xl font-black">{course.duration}</span>
                </div>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Duration
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Preview Player */}
          <div className="relative group aspect-video rounded-[2.5rem] overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center">
            {course.previewVideo ? (
              <video
                src={course.previewVideo}
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            ) : (
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
              />
            )}

            <button className="relative z-10 w-16 h-16 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl">
              <Play fill="currentColor" size={32} className="ml-1" />
            </button>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
              <p className="font-black uppercase text-[10px] tracking-[0.4em] text-white">
                Live Preview
              </p>
              <div className="h-[1px] flex-1 mx-4 bg-white/20" />
              <span className="text-[10px] font-black text-white">READY</span>
            </div>
          </div>
        </div>
      </section>

      <main className="max-w-7xl mx-auto px-6 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          <section>
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                <CheckCircle2 className="text-blue-600" />
              </div>
              <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">
                Learning Outcomes
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex gap-4 p-4 rounded-4xl border border-slate-100 bg-slate-50/50 transition-all hover:bg-white hover:shadow-xl group"
                >
                  <ShieldCheck className="text-blue-600 shrink-0" size={20} />
                  <p className="text-xs md:text-sm font-bold text-slate-700 leading-snug">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <div className="flex items-end justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 flex items-center justify-center">
                  <BookOpen className="text-white" size={20} />
                </div>
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">
                  Curriculum
                </h2>
              </div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">
                {modules.length} Stages
              </span>
            </div>
            <CourseCurriculum modules={modules} />
          </section>
        </div>

        <aside>
          <div className="sticky top-32">
            <CourseEnrollCard price={price} type={type} />
          </div>
        </aside>
      </main>
    </div>
  )
}