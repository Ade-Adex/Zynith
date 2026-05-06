import React from 'react'
import { PlayCircle, FileBarChart, Award } from 'lucide-react'

export function MethodSection() {
  const methods = [
    {
      icon: <PlayCircle size={28} />,
      title: 'Modular Progression',
      desc: 'Break complex architectures into digestible modules.',
    },
    {
      icon: <FileBarChart size={28} />,
      title: 'Adaptive Assessment',
      desc: 'Validate knowledge with per-module professional tests.',
    },
    {
      icon: <Award size={28} />,
      title: 'Verified Results',
      desc: 'Earn certificates backed by real-time performance data.',
    },
  ]

  return (
    <section id="method" className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-16">
        <span className="text-blue-600 font-black uppercase tracking-[0.3em] text-[10px]">
          The Zynith Protocol
        </span>
        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter mt-4 leading-none">
          Mastery Through <span className="italic">Precision</span>
        </h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {methods.map((item, idx) => (
          <div
            key={idx}
            className="group p-8 rounded-4xl border border-slate-100 hover:bg-slate-50/50 transition-all"
          >
            <div className="w-14 h-14 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-6">
              {item.icon}
            </div>
            <h3 className="font-black uppercase tracking-tight text-lg mb-3">
              {item.title}
            </h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </section>
  )
}
