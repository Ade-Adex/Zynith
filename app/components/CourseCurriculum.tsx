// /app/components/CourseCurriculum.tsx

import React from 'react'
import { Lock, PlayCircle, Users, FileText, HelpCircle, ArrowRight } from 'lucide-react'
import { Module } from '@/app/types'

// Explicitly type the incoming parameters to clear the TS error
interface CourseCurriculumProps {
  modules: Module[]
  courseId: string
  hasAccess: boolean
}

export function CourseCurriculum({ modules, courseId, hasAccess }: CourseCurriculumProps) {
  return (
    <div className="space-y-6">
      {modules.map((mod, i) => (
        <div
          key={mod.id}
          className="group border border-slate-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:border-blue-200 dark:hover:border-blue-500/50 transition-colors bg-white dark:bg-[#0a0a0a]"
        >
          {/* Module Header */}
          <div className="bg-slate-50 dark:bg-zinc-900/50 px-4 md:px-10 py-4 flex justify-between items-center border-b border-slate-100 dark:border-zinc-800 group-hover:bg-blue-50/30 dark:group-hover:bg-blue-950/10 transition-colors">
            <div>
              <p className="text-[8px] md:text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-1">
                Module {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-black uppercase tracking-tight text-sm md:text-lg text-slate-900 dark:text-zinc-100">
                {mod.title}
              </h3>
            </div>
            <div className="flex gap-2">
              {mod.assignment && (
                <span className="px-3 py-1 rounded-lg bg-blue-600 dark:bg-blue-500 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Users size={10} /> P2P Grading
                </span>
              )}
              {mod.quiz && (
                <span className="px-3 py-1 rounded-lg bg-white dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-800 dark:text-zinc-200 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                  Assessment
                </span>
              )}
            </div>
          </div>

          {/* Lessons List */}
          <div className="p-2 md:p-6 space-y-2">
            {mod.lessons.map((lesson, idx) => {
              // The lesson is unlocked if the user has course-wide access OR if it's explicitly marked as a free preview item
              const isLessonUnlocked = hasAccess || lesson.isFreePreview

              return (
                <div
                  key={lesson.id}
                  className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-zinc-900/40 transition-all group/item cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl bg-white dark:bg-zinc-900 border flex items-center justify-center transition-all ${
                      isLessonUnlocked 
                        ? 'text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-900/40 bg-blue-50/20' 
                        : 'text-slate-400 dark:text-zinc-500 border-slate-200 dark:border-zinc-800 group-hover/item:text-blue-600 dark:group-hover/item:text-blue-400 group-hover/item:border-blue-200 dark:group-hover/item:border-blue-500/30'
                    }`}>
                      {isLessonUnlocked ? (
                        <PlayCircle size={20} />
                      ) : (
                        <Lock size={18} />
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-600 dark:text-zinc-300 group-hover/item:text-slate-900 dark:group-hover/item:text-zinc-100 transition-colors">
                        Lesson {idx + 1}: {lesson.title}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-medium">
                        Format: {lesson.contentType}{' '}
                        {lesson.isDownloadable && '• Downloadable'}
                        {lesson.isFreePreview && !hasAccess && (
                          <span className="ml-2 px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[8px] font-black uppercase tracking-wider">
                            Free Preview
                          </span>
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    {lesson.quiz && (
                      <span className="text-[8px] font-black tracking-widest text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                        <HelpCircle size={8} /> Lesson Quiz
                      </span>
                    )}
                    
                    {isLessonUnlocked ? (
                      <ArrowRight size={14} className="text-slate-300 dark:text-zinc-600 group-hover/item:text-blue-500 transition-colors translate-x-[-4px] group-hover/item:translate-x-0" />
                    ) : (
                      <span className="text-[10px] font-black text-slate-400 dark:text-zinc-500 uppercase tracking-widest">
                        {lesson.duration}
                      </span>
                    )}
                  </div>
                </div>
              )
            })}

            {/* P2P Module Projects */}
            {mod.assignment && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 dark:bg-blue-950/10 border border-dashed border-blue-200 dark:border-blue-900/60 flex items-center justify-between group/p2p cursor-pointer hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 dark:bg-blue-500 text-white flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <span className="block text-sm font-black uppercase tracking-tight text-blue-900 dark:text-blue-200">
                      {mod.assignment.title}
                    </span>
                    <span className="text-[8px] md:text-[10px] font-bold text-blue-600/70 dark:text-blue-400/70 uppercase">
                      Requires {mod.assignment.peerReviewsRequired || 3} Reviews to unlock
                    </span>
                  </div>
                </div>
                <Users size={18} className="text-blue-400 dark:text-blue-500" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}