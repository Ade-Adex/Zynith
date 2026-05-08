import { Zap, Shield, Users, BarChart3 } from 'lucide-react'

export const Features = () => (
  <section className="md:py-12 bg-white">
    <div className="max-w-5xl mx-auto px-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
        {[
          {
            icon: <Zap />,
            title: 'Real Projects',
            desc: 'Build SaaS products, not todo lists.',
          },
          {
            icon: <Shield />,
            title: 'Verified',
            desc: 'Blockchain-backed certifications.',
          },
          {
            icon: <Users />,
            title: 'Community',
            desc: 'Network with senior staff engineers.',
          },
          {
            icon: <BarChart3 />,
            title: 'Analytics',
            desc: 'Track your architectural growth.',
          },
        ].map((f, i) => (
          <div key={i} className="space-y-4 group mx-auto justify-items-center text-center">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-600 group-hover:text-white transition-all">
              {f.icon}
            </div>
            <h4 className="text-[11px] font-black uppercase tracking-widest">
              {f.title}
            </h4>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {f.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
)
