// @/app/components/QuickNav.tsx
import React from 'react'
import { Cpu, Layers, Target, Award } from 'lucide-react'

export function QuickNav() {
  const navItems = [
    { id: 'hero', icon: <Cpu size={18} />, label: 'Top' },
    { id: 'method', icon: <Layers size={18} />, label: 'Method' },
    { id: 'courses', icon: <Target size={18} />, label: 'Tracks' },
    { id: 'certification', icon: <Award size={18} />, label: 'Verify' },
  ]

  return (
    <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-4">
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className="group flex items-center justify-end gap-3"
        >
          <span className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded">
            {item.label}
          </span>
          <div className="w-10 h-10 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:border-blue-600 transition-all shadow-sm hover:text-blue-600">
            {item.icon}
          </div>
        </a>
      ))}
    </aside>
  )
}
