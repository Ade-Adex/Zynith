import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="mt-16 flex items-center justify-center gap-4">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="p-4 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
      >
        <ChevronLeft size={20} />
      </button>
      <div className="flex gap-2">
        {[...Array(totalPages)].map((_, i) => (
          <button
            key={i}
            onClick={() => onPageChange(i + 1)}
            className={`w-10 h-10 rounded-xl font-black text-xs transition-all ${
              currentPage === i + 1 ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="p-4 rounded-xl border border-slate-200 disabled:opacity-30 hover:bg-slate-50 transition-colors"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}