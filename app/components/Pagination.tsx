import React from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null

  // Smart Pagination Window Algorithm
  const getPageNumbers = () => {
    const pages: (number | string)[] = []

    // Always show first page
    pages.push(1)

    // Calculate start and end ranges around current page
    let startPage = Math.max(2, currentPage - 1)
    let endPage = Math.min(totalPages - 1, currentPage + 1)

    // Keep active block size consistent near boundaries
    if (currentPage <= 3) {
      endPage = Math.min(totalPages - 1, 4)
    }
    if (currentPage >= totalPages - 2) {
      startPage = Math.max(2, totalPages - 3)
    }

    // Add left ellipsis if needed
    if (startPage > 2) {
      pages.push('...')
    }

    // Add middle page numbers
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }

    // Add right ellipsis if needed
    if (endPage < totalPages - 1) {
      pages.push('...')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  return (
    <div className="mt-16 flex items-center justify-center gap-2 sm:gap-4">
      {/* Previous Button */}
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className={`bg-[#1d4ed8] p-2.5 rounded-full ${currentPage === 1 ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer text-white'} disabled:opacity-30 transition-colors`}
      >
        <ChevronLeft size={20} />
      </button>

      {/* Dynamic Page Items */}
      <div className="flex gap-1.5 sm:gap-2">
        {pageNumbers.map((page, index) => {
          if (page === '...') {
            return (
              <span
                key={`ellipsis-${index}`}
                className="w-10 h-10 flex items-center justify-center text-slate-400 dark:text-slate-600 font-bold tracking-widest text-xs"
              >
                ...
              </span>
            )
          }

          const isSelected = currentPage === page

          return (
            <button
              key={`page-${page}`}
              onClick={() => onPageChange(page as number)}
              className={`w-8 h-8 rounded-xl font-black text-xs! transition-all duration-200 active:scale-95 ${
                isSelected
                  ? 'bg-foreground text-background shadow-md transform -translate-y-0.5'
                  : 'bg-surface border border-foreground/5 text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              {page}
            </button>
          )
        })}
      </div>

      {/* Next Button */}
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className={`bg-[#1d4ed8] p-2.5 rounded-full ${currentPage === totalPages ? 'cursor-not-allowed text-gray-300' : 'cursor-pointer text-white'} disabled:opacity-30 transition-colors`}
      >
        <ChevronRight size={20} />
      </button>
    </div>
  )
}
