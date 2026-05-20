// import React from 'react'
// import { Lock, PlayCircle, Users, FileText } from 'lucide-react'
// import { Module } from '@/app/types'

// export function CourseCurriculum({ modules }: { modules: Module[] }) {
//   return (
//     <div className="space-y-6">
//       {modules.map((mod, i) => (
//         <div
//           key={mod.id}
//           className="group border border-slate-200 rounded-2xl  overflow-hidden hover:border-blue-200 transition-colors"
//         >
//           <div className="bg-slate-50 px-4 md:px-10 py-4 flex justify-between items-center border-b border-slate-100 group-hover:bg-blue-50/30 transition-colors">
//             <div>
//               <p className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
//                 Module {String(i + 1).padStart(2, '0')}
//               </p>
//               <h3 className="font-black uppercase tracking-tight text-sm md:text-lg">
//                 {mod.title}
//               </h3>
//             </div>
//             <div className="flex gap-2">
//               {mod.hasAssignment && (
//                 <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
//                   <Users size={10} /> P2P Grading
//                 </span>
//               )}
//               {mod.hasTest && (
//                 <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
//                   Assessment
//                 </span>
//               )}
//             </div>
//           </div>

//           <div className="p-2 md:p-6 space-y-2">
//             {[...Array(mod.lessons || 1)].map((_, idx) => (
//               <div
//                 key={idx}
//                 className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group/item cursor-pointer"
//               >
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover/item:text-blue-600 group-hover/item:border-blue-200 transition-all">
//                     {i === 0 && idx === 0 ? (
//                       <PlayCircle size={20} />
//                     ) : (
//                       <Lock size={18} />
//                     )}
//                   </div>
//                   <span className="text-sm font-bold text-slate-600">
//                     Lesson {idx + 1}: Technical Deep Dive
//                   </span>
//                 </div>
//                 <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
//                   15:00
//                 </span>
//               </div>
//             ))}

//             {mod.hasAssignment && (
//               <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 border border-dashed border-blue-200 flex items-center justify-between group/p2p cursor-pointer hover:bg-blue-50 transition-all">
//                 <div className="flex items-center gap-4">
//                   <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
//                     <FileText size={18} />
//                   </div>
//                   <div>
//                     <span className="block text-sm font-black uppercase tracking-tight text-blue-900">
//                       Module Project & Peer Review
//                     </span>
//                     <span className="text-[8px] md:text-[10px] font-bold text-blue-600/70 uppercase">
//                       Requires {mod.peerReviewsRequired || 3} Reviews to unlock
//                     </span>
//                   </div>
//                 </div>
//                 <Users size={18} className="text-blue-400" />
//               </div>
//             )}
//           </div>
//         </div>
//       ))}
//     </div>
//   )
// }





import React from 'react'
import { Lock, PlayCircle, Users, FileText, HelpCircle } from 'lucide-react'
import { Module } from '@/app/types'

export function CourseCurriculum({ modules }: { modules: Module[] }) {
  return (
    <div className="space-y-6">
      {modules.map((mod, i) => (
        <div
          key={mod.id}
          className="group border border-slate-200 rounded-2xl overflow-hidden hover:border-blue-200 transition-colors"
        >
          <div className="bg-slate-50 px-4 md:px-10 py-4 flex justify-between items-center border-b border-slate-100 group-hover:bg-blue-50/30 transition-colors">
            <div>
              <p className="text-[8px] md:text-[10px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">
                Module {String(i + 1).padStart(2, '0')}
              </p>
              <h3 className="font-black uppercase tracking-tight text-sm md:text-lg">
                {mod.title}
              </h3>
            </div>
            <div className="flex gap-2">
              {mod.assignment && (
                <span className="px-3 py-1 rounded-lg bg-blue-600 text-white text-[8px] md:text-[9px] font-black uppercase tracking-widest flex items-center gap-2">
                  <Users size={10} /> P2P Grading
                </span>
              )}
              {mod.quiz && (
                <span className="px-3 py-1 rounded-lg bg-white border border-slate-200 text-[8px] md:text-[9px] font-black uppercase tracking-widest">
                  Assessment
                </span>
              )}
            </div>
          </div>

          <div className="p-2 md:p-6 space-y-2">
            {mod.lessons.map((lesson, idx) => (
              <div
                key={lesson.id}
                className="flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 transition-all group/item cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 group-hover/item:text-blue-600 group-hover/item:border-blue-200 transition-all">
                    {i === 0 && idx === 0 && lesson.isFreePreview ? (
                      <PlayCircle size={20} />
                    ) : (
                      <Lock size={18} />
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-600">
                      Lesson {idx + 1}: {lesson.title}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      Format: {lesson.contentType} {lesson.isDownloadable && '• Downloadable'}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  {lesson.quiz && (
                    <span className="text-[8px] font-black tracking-widest text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded uppercase flex items-center gap-1">
                      <HelpCircle size={8} /> Lesson Quiz
                    </span>
                  )}
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                    {lesson.duration}
                  </span>
                </div>
              </div>
            ))}

            {/* P2P Module Projects */}
            {mod.assignment && (
              <div className="mt-4 p-4 rounded-2xl bg-blue-50/50 border border-dashed border-blue-200 flex items-center justify-between group/p2p cursor-pointer hover:bg-blue-50 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                    <FileText size={18} />
                  </div>
                  <div>
                    <span className="block text-sm font-black uppercase tracking-tight text-blue-900">
                      {mod.assignment.title}
                    </span>
                    <span className="text-[8px] md:text-[10px] font-bold text-blue-600/70 uppercase">
                      Requires {mod.assignment.peerReviewsRequired || 3} Reviews to unlock
                    </span>
                  </div>
                </div>
                <Users size={18} className="text-blue-400" />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}