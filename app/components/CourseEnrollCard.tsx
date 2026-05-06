import React from 'react'
import { ShieldCheck, ArrowRight, Award, Globe, Zap, Users } from 'lucide-react'

export function CourseEnrollCard({
  price,
  type,
}: {
  price: string
  type: string
}) {
  const isFree = type === 'Free' || price === 'FREE'

  return (
    <div className="bg-white border border-slate-200 p-10 rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 blur-[80px] rounded-full" />

      <div className="mb-10 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 mb-4 flex items-center gap-2">
          <Zap size={12} fill="currentColor" /> Lifetime Access
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-2xl md:text-4xl font-black tracking-tighter italic">
            {isFree ? 'FREE' : `₦${price}`}
          </span>
          {!isFree && (
            <span className="text-slate-300 font-bold line-through text-xl">
              ₦299
            </span>
          )}
        </div>
      </div>

      <div className="space-y-4 mb-10 relative z-10">
        <button className="w-full bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] active:scale-[0.98] text-white py-3 rounded-2xl font-black uppercase text-xs transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20">
          {isFree ? 'Get Access Now' : 'Enroll in Track'}{' '}
          <ArrowRight size={18} />
        </button>
        <button className="w-full bg-slate-950 hover:bg-slate-800 text-white py-3 rounded-2xl font-black uppercase text-xs transition-all">
          Watch Free Preview
        </button>
      </div>

      <div className="space-y-5 border-t border-slate-100 pt-10 relative z-10">
        {[
          {
            icon: <Award className="text-blue-600" size={20} />,
            text: 'Industry Certificate',
          },
          {
            icon: <Users className="text-blue-600" size={20} />,
            text: 'P2P Peer Grading',
          }, // Added P2P here
          {
            icon: <ShieldCheck className="text-blue-600" size={20} />,
            text: 'Expert Support',
          },
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
              {feat.icon}
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.15em] text-slate-500">
              {feat.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
