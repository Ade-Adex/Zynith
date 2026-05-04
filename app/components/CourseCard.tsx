import { PlayCircle, Star, Users, Clock, ArrowUpRight } from 'lucide-react'
import { Course } from '@/app/types'
import Image from 'next/image'

export const CourseCard = ({ course }: { course: Course }) => (
  <div className="group relative h-full">
    <div className="bg-foreground/[0.02] border border-foreground/5 rounded-[32px] p-4 hover:bg-foreground/[0.04] transition-all duration-700 flex flex-col h-full">
      {/* Visual Container */}
      <div
        className={`relative aspect-[16/11] rounded-[24px] overflow-hidden mb-6 bg-gradient-to-br ${course.color}`}
      >
        {/* Course Image */}
        {course.image && (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 backdrop-blur-sm bg-background/20 z-10">
          <div className="p-4 bg-background rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform duration-500">
            <PlayCircle className="text-primary fill-primary/10" size={32} />
          </div>
        </div>

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-center z-10">
          <span className="px-2.5 py-1 rounded-lg bg-background/90 backdrop-blur text-[8px] font-black uppercase tracking-tighter border border-foreground/5">
            {course.level}
          </span>
          <div className="w-8 h-8 rounded-full bg-background/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight size={14} className="text-primary" />
          </div>
        </div>
      </div>

      {/* Content Area - flex-1 ensures this grows to fill space */}
      <div className="px-1 flex-1 flex flex-col">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`text-[9px] font-black uppercase tracking-[0.2em] px-2 py-0.5 rounded-md ${
              course.type === 'Free'
                ? 'bg-emerald-500/10 text-emerald-500'
                : 'bg-primary/10 text-primary'
            }`}
          >
            {course.type}
          </span>
          <div className="flex items-center gap-1 opacity-80">
            <Clock size={10} />
            <span className="text-[9px] font-black uppercase tracking-widest">
              {course.duration}
            </span>
          </div>
        </div>

        {/* Title container grows to push footer down */}
        <div className="flex-1">
          <h3 className="text-xs md:text-sm font-black leading-[1.1] mb-6 group-hover:translate-x-1 transition-transform duration-500 uppercase tracking-tighter">
            {course.title}
          </h3>
        </div>

        {/* Footer Area - Stays at bottom */}
        <div className="flex items-center justify-between pt-5 border-t border-foreground/5 mt-auto">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Star size={10} className="fill-primary text-orange-600" />
              <span className="text-[11px] font-black">{course.rating}</span>
            </div>
            <div className="flex items-center gap-1 opacity-80">
              <Users size={10} />
              <span className="text-[11px] font-black">{course.students}</span>
            </div>
          </div>
          <span className="text-sm font-black tracking-tighter">
            {course.type === 'Free' ? 'FREE' : course.price}
          </span>
        </div>
      </div>
    </div>
  </div>
)
