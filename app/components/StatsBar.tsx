// @/app/components/StatsBar.tsx

import { STATS } from "@/app/data/statItem"

export function StatsBar() {
  return (
    <section className="border-y border-slate-300! dark:border-slate-600! bg-background py-10">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
        {STATS.map((stat, i) => (
          <div key={i} className="text-center">
            <p className="text-2xl font-black">{stat.val}</p>
            <p className="text-[10px] font-bold uppercase tracking-widest">
              {stat.label}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}