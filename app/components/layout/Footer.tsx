'use client'

import React from 'react'
import { ArrowUpRight } from 'lucide-react'

// Optimized SVG Social Icons
const SocialIcons = {
  X: () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.294 19.497h2.039L6.486 3.24H4.298L17.607 20.65z" />
    </svg>
  ),
  Github: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
}

export const Footer = () => (
  <footer className="bg-white border-t border-slate-100 pt-24 pb-12">
    <div className="max-w-7xl mx-auto px-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
        <div className="col-span-1 sm:col-span-2">
          <span className="text-lg font-black tracking-tighter uppercase italic mb-6 block">
            Zynith<span className="text-blue-600">.</span>
          </span>
          <p className="text-slate-500 text-sm font-medium max-w-xs leading-relaxed">
            The standard for high-fidelity engineering education. Built by
            developers, for developers.
          </p>
        </div>

        {/* Links Columns */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Platform
          </h4>
          {['Curriculum', 'Mentorship', 'Enterprise', 'Pricing'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs font-bold text-slate-600 hover:text-blue-600 transition w-fit"
            >
              {item}
            </a>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Company
          </h4>
          {['About', 'Careers', 'Terms', 'Privacy'].map((item) => (
            <a
              key={item}
              href="#"
              className="text-xs font-bold text-slate-600 hover:text-blue-600 transition w-fit"
            >
              {item}
            </a>
          ))}
        </div>

        {/* Custom Social Icons */}
        <div className="flex flex-col gap-4">
          <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
            Connect
          </h4>
          <div className="flex gap-5">
            <a
              href="#"
              className="text-slate-400 hover:text-blue-600 transition items-center flex"
            >
              <SocialIcons.X />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-blue-600 transition items-center flex"
            >
              <SocialIcons.Github />
            </a>
            <a
              href="#"
              className="text-slate-400 hover:text-blue-600 transition items-center flex"
            >
              <SocialIcons.Linkedin />
            </a>
          </div>
        </div>
      </div>

      <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
          © 2026 ZYNITH EDUCATION GROUP.
        </span>
        <div className="flex flex-wrap justify-center gap-8">
          <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400">
            System Status
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
          </div>
          <a
            href="#"
            className="flex items-center gap-1 text-[10px] font-black uppercase tracking-widest hover:text-blue-600 transition"
          >
            Support Center <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </div>
  </footer>
)
