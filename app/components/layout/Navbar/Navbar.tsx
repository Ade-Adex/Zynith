'use client'

import React from 'react'
import { Search, ShoppingCart, Menu } from 'lucide-react'
import { NAV_LINKS } from '@/app/data'

export const Navbar = () => {
  // Replace this with your actual auth state (e.g., from Supabase or your custom AuthProvider)
  const isAuthenticated = false

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center z-10">
          <span className="text-lg font-black tracking-tighter uppercase italic">
            Zynith<span className="text-blue-600">.</span>
          </span>
        </div>

        {/* Center: Nav Links (Hidden on Mobile) */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-600 transition-colors duration-300"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 z-10">
          {/* Search Bar - Hidden on small mobile */}
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg focus-within:border-blue-300 focus-within:bg-white transition-all">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none text-[11px] focus:outline-none w-24 lg:w-40 font-medium"
            />
          </div>

          {/* Conditional Shopping Cart */}
          {isAuthenticated && (
            <button className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
              <ShoppingCart size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
            </button>
          )}

          {/* Auth Button */}
          <button className="bg-slate-900 text-white px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300">
            {isAuthenticated ? 'Dashboard' : 'Sign In'}
          </button>

          {/* Mobile Menu Toggle */}
          <button className="md:hidden p-2 text-slate-900">
            <Menu size={20} />
          </button>
        </div>
      </div>
    </nav>
  )
}
