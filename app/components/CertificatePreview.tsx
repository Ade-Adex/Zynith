import React from 'react'
import { Award, Cpu, ArrowRight } from 'lucide-react'
import { useMediaQuery } from '@mantine/hooks'
import Link from 'next/link'

export function CertificatePreview() {

  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <section
      id="certification"
      className="bg-slate-100 dark:bg-slate-900/40 py-8 md:py-16 px-4 md:px-6 rounded-2xl md:rounded-3xl border border-slate-200/60 dark:border-slate-800/50 text-foreground max-w-7xl mx-auto relative overflow-hidden mb-20 transition-colors duration-300"
    >
      {/* Decorative background ambient neon blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 dark:bg-blue-500/5 blur-[100px] rounded-full -mr-32 -mt-32 pointer-events-none" />

      <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
        <div>
          <span className="text-blue-600 dark:text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]">
            Credential Engine
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mt-6 mb-8 leading-[0.9] flex items-center gap-2 text-slate-900 dark:text-white">
            Prove Your{' '}
            <span className="text-blue-600 dark:text-blue-500">Expertise.</span>
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm leading-relaxed mb-8 max-w-md">
            Every track on Zynith includes a verifiable digital credential. Our
            certificates are backed by your specific performance data and
            modular test scores.
          </p>
          <Link href="/auth" className="flex w-fit items-center gap-3 bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-semibold uppercase text-sm! transition-all shadow-lg shadow-blue-600/10 active:scale-95">
            Start Your Journey <ArrowRight size={16} />
          </Link>
        </div>

        {/* The Certificate UI Card Component */}
        <div className="relative bg-white dark:bg-surface text-slate-900 dark:text-foreground p-5 md:p-12 rounded-2xl md:aspect-[1.41/1] flex flex-col justify-between shadow-2xl shadow-slate-200/60 dark:shadow-black/40 border border-slate-200 dark:border-border/60 overflow-hidden transition-all duration-300">
          {/* Watermark Dynamic Technical Grid */}
          <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] text-slate-900 dark:text-white pointer-events-none flex items-center justify-center">
            <Cpu size={400} strokeWidth={1} />
          </div>

          {/* Inner Decorative Framing Box */}
          <div className="absolute inset-4 border border-slate-100 dark:border-border/40 rounded-lg pointer-events-none" />

          {/* Header */}
          <div className="flex justify-between items-start relative z-10">
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black tracking-tighter italic leading-none text-slate-900 dark:text-white">
                ZYNITH
                <span className="text-blue-600 dark:text-blue-500">.</span>
              </span>
              <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-slate-400 dark:text-slate-500 mt-1">
                LMS / Excellence Framework
              </span>
            </div>

            {/* Verification Award Badge */}
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 bg-blue-600/5 dark:bg-blue-500/10 rounded-full animate-pulse" />
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white dark:bg-background border-2 border-blue-600 dark:border-blue-500 rounded-full flex items-center justify-center shadow-xs">
                <Award
                  className="text-blue-600 dark:text-blue-400"
                  size={isMobile ? 16 : 24}
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>

          {/* Main Recipient Content Block */}
          <div className="text-center relative z-10 mt-5 md:mt-0">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 dark:text-blue-400 mb-6">
              Certificate of Achievement
            </p>
            <h3 className="md:text-4xl font-serif italic text-slate-800 dark:text-slate-100 mb-2">
              Solomon Oluwatosin
            </h3>

            <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-6 md:w-12 bg-slate-200 dark:bg-border/60" />
              <span className="text-[9px]! md:text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                has successfully mastered
              </span>
              <div className="h-px w-6 md:w-12 bg-slate-200 dark:bg-border/60" />
            </div>

            <p className="text-[9px] md:text-xl font-black uppercase tracking-tight text-slate-900 dark:text-white bg-slate-100 dark:bg-background/20 inline-block px-6 py-2 rounded-lg border border-slate-100 dark:border-border/40">
              Advanced System Design
            </p>
          </div>

          {/* Verified Footer Metadata */}
          <div className="flex justify-between items-end relative z-10 mt-6 md:mt-0">
            <div className="space-y-1">
              <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Credential Issued
              </p>
              <p className="text-[8px] md:text-[11px] font-black text-slate-900 dark:text-white">
                MAY 06, 2026
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 md:w-32 h-px bg-slate-900/20 dark:bg-border mb-2 mx-auto" />
              <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 italic">
                Program Director
              </p>
            </div>

            <div className="text-right space-y-1">
              <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500">
                Verification ID
              </p>
              <p className="text-[8px] md:text-[11px] font-black text-blue-600 dark:text-blue-400 font-mono">
                ZN-PRO-8821-X9
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
