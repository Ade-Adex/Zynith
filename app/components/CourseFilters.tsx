// @/app/components/CourseFilters.tsx


import React from 'react'
import { Layers, ShieldCheck, Zap, Star, Flame } from 'lucide-react'
import { FilterType } from '@/app/types'

interface FilterOption {
  label: string
  value: FilterType
  icon: React.ReactNode
}

interface FilterProps {
  currentFilter: FilterType
  onFilterChange: (filter: FilterType) => void
}

export function CourseFilters({ currentFilter, onFilterChange }: FilterProps) {
  const filters: FilterOption[] = [
    { label: 'All Tracks', value: 'All', icon: <Layers size={12} /> },
    {
      label: 'Premium',
      value: 'Premium',
      icon: <ShieldCheck size={12} className="text-blue-500" />,
    },
    {
      label: 'Free',
      value: 'Free',
      icon: <Zap size={12} className="text-emerald-500" />,
    },
    {
      label: 'Bestsellers',
      value: 'Bestseller',
      icon: <Star size={12} className="fill-yellow-400 text-yellow-400" />,
    },
    {
      label: 'Top Rated',
      value: 'Top Rated',
      icon: <Flame size={12} className="text-orange-500" />,
    },
  ]

  return (
    <div className="sticky top-4 z-40 bg-white/90 backdrop-blur-md border border-slate-200 shadow-sm rounded-2xl py-3 px-6 mb-12 flex items-center gap-4 overflow-x-auto no-scrollbar">
      <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 shrink-0 pr-4 border-r border-slate-200">
        Catalog Filter
      </span>
      {filters.map((tag) => (
        <button
          key={tag.value}
          onClick={() => onFilterChange(tag.value)}
          className={`flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-xl border transition-all ${
            currentFilter === tag.value
              ? 'bg-slate-900 border-slate-900 text-white shadow-lg'
              : 'bg-white border-slate-100 hover:border-blue-200 text-slate-600'
          }`}
        >
          {tag.icon}
          <span className="text-[10px] font-black uppercase tracking-wide">
            {tag.label}
          </span>
        </button>
      ))}
    </div>
  )
}
