// @/app/components/StatsBar.tsx

import { STATS } from '@/app/data'

export function StatsBar() {
  return (
    <section className="border-y border-slate-100 bg-slate-50/50 py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-black text-slate-900">{stat.val}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}