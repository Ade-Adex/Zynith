'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Star, Users, Clock, ArrowUpRight, GraduationCap } from 'lucide-react'
import { Course } from '@/app/types'
import Image from 'next/image'
import Link from 'next/link'

export const CourseCard = ({ course }: { course: Course }) => {
  const [isHovered, setIsHovered] = useState(false)
  const [isPreviewFinished, setIsPreviewFinished] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    let timer: NodeJS.Timeout

    if (isHovered && !isPreviewFinished && videoRef.current) {
      videoRef.current.play().catch(() => {})

      timer = setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.pause()
          setIsPreviewFinished(true)
        }
      }, 5000)
    }

    return () => {
      if (timer) clearTimeout(timer)
    }
  }, [isHovered, isPreviewFinished])

  return (
    <Link
      href={`/courses/${course._id}`}
      className="group relative h-full block no-underline text-inherit"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setIsPreviewFinished(false)
        if (videoRef.current) {
          videoRef.current.pause()
          videoRef.current.currentTime = 0
        }
      }}
    >
      <div className="bg-background border border-slate-300! dark:border-slate-600! rounded-xl p-4 hover:border-blue-500/30 hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-500 flex flex-col h-full">
        <div
          className={`relative aspect-16/10 rounded-2xl overflow-hidden mb-6 bg-linear-to-br ${course.color}`}
        >
          <Image
            src={course.image}
            alt={course.title}
            fill
            className={`object-cover transition-opacity duration-500 ${isHovered && !isPreviewFinished && course.previewVideo ? 'opacity-0' : 'opacity-100'}`}
          />

          {course.previewVideo && (
            <video
              ref={videoRef}
              src={course.previewVideo}
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${isHovered && !isPreviewFinished ? 'opacity-100' : 'opacity-0'}`}
            />
          )}

          <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
            <div className="flex items-center w-full">
              <span className="px-2.5 py-1 rounded-lg bg-surface backdrop-blur text-[8px] font-black uppercase tracking-widest border border-foreground/5 text-foreground">
                {course.level}
              </span>

              {course.tag && (
                <span className="ml-auto px-2.5 py-1 rounded-lg bg-blue-600 dark:bg-blue-500 text-white text-[8px] font-black uppercase tracking-widest shadow-sm">
                  {course.tag}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="px-1 flex-1 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <span
              className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${course.type === 'Free' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-blue-500/10 text-blue-600'}`}
            >
              {course.type}
            </span>
            <div className="flex items-center gap-1 opacity-50">
              <Clock size={10} />
              <span className="text-[9px] font-black uppercase tracking-widest">
                {course.duration}
              </span>
            </div>
          </div>

          <h3 className="text-sm md:text-[15px] font-black leading-[1.2] mb-2 transition-colors group-hover:text-blue-600 uppercase tracking-tighter">
            {course.title}
          </h3>
          <div className="flex items-center gap-1.5 mb-6 opacity-60">
            <GraduationCap size={12} />
            <p className="text-[10px] font-bold uppercase tracking-wider">
              {course.instructor}
            </p>
          </div>

          <div className="flex items-center justify-between pt-5 border-t border-foreground/5 mt-auto">
            <div className="flex items-center gap-4 opacity-70">
              <div className="flex items-center gap-1">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                <span className="text-[11px] font-black">
                  {course.rating.toFixed(1)}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Users size={10} />
                <span className="text-[11px] font-black">
                  {course.students.toLocaleString()}
                </span>
              </div>
            </div>
            <span className="text-[15px] font-black tracking-tighter">
              {course.type === 'Free' ? 'FREE' : `₦${course.price}`}
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}