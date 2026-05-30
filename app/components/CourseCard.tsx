// /app/components/CourseCard.tsx

'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Star, BookOpen, Clock, GraduationCap } from 'lucide-react'
import { Badge, Paper } from '@mantine/core'
import { Course } from '@/app/types'
import Image from 'next/image'
import Link from 'next/link'

export const CourseCard = ({
  course,
  href,
  viewLayout = 'grid',
}: {
  course: Course
  href?: string
  viewLayout?: 'grid' | 'list'
}) => {
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

  const targetLink = href || `/courses/${course.slug}`
  // const targetLink = href || `/courses/${course._id}`

  const moduleCount = course.modules?.length || 0
  const lessonCount =
    course.modules?.reduce((acc, mod) => acc + (mod.lessonsCount || 0), 0) || 0

  return (
    <Link
      href={targetLink}
      className="group relative block no-underline text-inherit cursor-pointer w-full h-full"
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
      <Paper
        withBorder
        radius="24px"
        className={`flex bg-white dark:bg-[#0c0d12] border-slate-200 dark:border-slate-800/60 overflow-hidden shadow-sm hover:shadow-xl hover:border-blue-500/40 transition-all duration-300 ${
          viewLayout === 'list'
            ? 'flex-col md:flex-row items-stretch'
            : 'flex-col h-full'
        }`}
      >
        {/* Thumbnail Layer Section */}
        <div
          className={`relative overflow-hidden bg-slate-100 dark:bg-slate-900 shrink-0 aspect-video ${
            viewLayout === 'list'
              ? 'w-full md:w-[320px] md:aspect-auto'
              : 'w-full'
          }`}
        >
          <Image
            src={course.image || '/api/placeholder/400/225'}
            alt={course.title}
            fill
            sizes="(max-w-7xl) 33vw, 100vw"
            priority={false}
            className={`object-cover transition-all duration-500 group-hover:scale-105 ${
              isHovered && !isPreviewFinished && course.previewVideo
                ? 'opacity-0'
                : 'opacity-100'
            }`}
          />

          {course.previewVideo && (
            <video
              ref={videoRef}
              src={course.previewVideo}
              muted
              playsInline
              className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
                isHovered && !isPreviewFinished ? 'opacity-100' : 'opacity-0'
              }`}
            />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-80 pointer-events-none" />

          {/* Floaters */}
          <div className="absolute top-3 left-3 flex gap-1.5 z-10">
            <Badge
              variant="filled"
              color={course.type === 'Premium' ? 'purple' : 'gray'}
              size="sm"
              radius="md"
              className="font-black uppercase tracking-wider"
            >
              {course.type}
            </Badge>
            {course.tag && (
              <Badge
                variant="filled"
                color="blue"
                size="sm"
                radius="md"
                className="font-black uppercase tracking-wider"
              >
                {course.tag}
              </Badge>
            )}
          </div>

          <div className="absolute bottom-3 right-3 bg-black/50 backdrop-blur-xs px-2 py-0.5 rounded-md font-mono text-[10px] font-bold text-white uppercase tracking-wider z-10">
            {course.level}
          </div>
        </div>

        {/* Info Layout Description Block */}
        <div className="p-6 flex flex-col flex-1 justify-between gap-4">
          <div className="space-y-2">
            <h3 className="text-base md:text-xl font-black tracking-tight text-slate-800 dark:text-white line-clamp-2 leading-snug group-hover:text-blue-500 transition-colors uppercase">
              {course.title}
            </h3>
            <div className="flex items-center gap-1.5 opacity-80 text-xs text-slate-400 dark:text-slate-500 font-medium">
              <GraduationCap size={14} />
              <span>
                Lead:{' '}
                <strong className="text-slate-600 dark:text-slate-400 font-bold">
                  {course.instructor}
                </strong>
              </span>
            </div>
          </div>

          {/* Curriculum Stats Metric Grid */}
          <div className="grid grid-cols-3 gap-4 border-y border-slate-100 dark:border-slate-800/80 py-3.5 text-[11px] text-slate-500 dark:text-slate-400 font-medium max-w-md">
            <div className="flex items-center gap-1.5">
              <BookOpen size={14} className="text-blue-500" />
              <span>{moduleCount} Modules</span>
            </div>
            <div className="flex items-center gap-1.5">
              <GraduationCap size={14} className="text-indigo-500" />
              <span>{lessonCount} Blocks</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-amber-500" />
              <span>{course.duration}</span>
            </div>
          </div>

          {/* Pricing and Action Control Footer Line */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-2">
              <div className="flex items-center text-amber-500">
                <Star size={14} fill="currentColor" />
              </div>
              <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                {(course.rating || 5.0).toFixed(1)}
              </span>
              <span className="text-[10px] text-slate-400">
                ({(course.students || 0).toLocaleString()} devs)
              </span>
            </div>

            <div className="flex items-center gap-4 self-end sm:self-auto">
              <span className="text-base md:text-xl font-black text-slate-900 dark:text-white font-mono">
                {course.price > 0
                  ? `NGN ${course.price.toLocaleString()}`
                  : 'FREE CORE'}
              </span>

              {viewLayout === 'list' && (
                <button className="bg-slate-900 hover:bg-blue-600 dark:bg-slate-800 dark:hover:bg-blue-600 text-white text-xs font-bold uppercase tracking-wider px-6 py-2.5 rounded-xl transition-all cursor-pointer shadow-xs">
                  Launch
                </button>
              )}
            </div>
          </div>
        </div>
      </Paper>
    </Link>
  )
}