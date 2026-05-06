import React from 'react'
import { Lock, PlayCircle, CheckCircle } from 'lucide-react'
import { Module } from '@/app/types'

export function CourseCurriculum({ modules }: { modules: Module[] }) {
  return (
    <div className="space-y-6">
      {modules.map((mod, i) => (
        <div
          key={i}
          className="group border border-slate-100 rounded-[2.5rem] overflow-hidden hover:border-blue-200 transition-colors"
        >
          <div className="bg-slate-50 px-10 py-6 flex justify-between items-center border-b border-slate-100 group-hover:bg-blue-50/30 transition-colors">
            <div>
              <p className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                Module {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-black uppercase tracking-tight text-lg">
                {mod.title}
              </h3>
            </div>
            {mod.hasTest && (
              <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[9px] font-black uppercase tracking-widest">
                Includes Assessment
              </span>
            )}
          </div>
          <div className="p-6 space-y-2">
            {/* Generating mock lessons based on the data count */}
            {[...Array(mod.lessons || 1)].map((_, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group/item cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover/item:text-blue-600 group-hover/item:border-blue-200 transition-all">
                    {i === 0 && idx === 0 ? (
                      <PlayCircle size={20} />
                    ) : (
                      <Lock size={18} />
                    )}
                  </div>
                  <span className="text-sm font-bold text-slate-600">
                    Lesson {idx + 1}: Technical Deep Dive
                  </span>
                </div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover/item:text-slate-900">
                  15:00
                </span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
