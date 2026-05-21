import { Zap, Shield, Users, BarChart3 } from 'lucide-react'

export const Features = () => (
  <section className="py-12 md:py-16 bg-background transition-colors duration-300">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
        {[
          {
            icon: <Zap size={20} />,
            title: 'Real Projects',
            desc: 'Build SaaS products, not todo lists.',
          },
          {
            icon: <Shield size={20} />,
            title: 'Verified',
            desc: 'Blockchain-backed certifications.',
          },
          {
            icon: <Users size={20} />,
            title: 'Community',
            desc: 'Network with senior staff engineers.',
          },
          {
            icon: <BarChart3 size={20} />,
            title: 'Analytics',
            desc: 'Track your architectural growth.',
          },
        ].map((f, i) => (
          <div
            key={i}
            className="group flex flex-col items-center text-center bg-slate-50 dark:bg-surface/10 border border-slate-200/60 dark:border-border/60 p-8 rounded-3xl shadow-xs transition-all duration-300 hover:shadow-xl hover:shadow-blue-500/5 hover:-translate-y-1"
          >
            {/* Smooth icon box transition tied to parent card hover */}
            <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/40 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:bg-[#1d4ed8] group-hover:text-white dark:group-hover:text-white transition-all duration-300 transform group-hover:scale-105 mb-5 shadow-inner">
              {f.icon}
            </div>

            <h4 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-800 dark:text-foreground mb-2">
              {f.title}
            </h4>

            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)