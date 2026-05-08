import React from 'react'
import { Award, Cpu, ArrowRight } from 'lucide-react'
import { useMediaQuery } from '@mantine/hooks'

export function CertificatePreview() {

  const isMobile = useMediaQuery('(max-width: 768px)')
  return (
    <section
      id="certification"
      className="bg-slate-900 py-8 md:py-16 px-4 md:px-6 rounded-2xl md:rounded-3xl text-white max-w-7xl mx-auto relative overflow-hidden mb-20"
    >
      {/* Decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 blur-[100px] rounded-full -mr-32 -mt-32" />

      <div className="grid lg:grid-cols-2 gap-10 items-center relative z-10">
        <div>
          <span className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px]">
            Credential Engine
          </span>
          <h2 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mt-6 mb-8 leading-[0.9] gap-2 flex items-center">
            Prove Your
            <span className="text-blue-600">Expertise.</span>
          </h2>
          <p className="text-slate-400 text-xs md:text-sm leading-relaxed mb-8 max-w-md">
            Every track on Zynith includes a verifiable digital credential. Our
            certificates are backed by your specific performance data and
            modular test scores.
          </p>
          <button className="flex items-center gap-3 bg-blue-600 hover:bg-blue-500 px-8 py-3 rounded-2xl font-black uppercase text-sm! transition-all">
            Start Your Journey <ArrowRight size={16} />
          </button>
        </div>

        {/* The Certificate UI */}
        <div className="relative bg-white text-slate-900 p-5 md:p-12 rounded-2xl md:aspect-[1.41/1] flex flex-col justify-between shadow-[0_35px_60px_-15px_rgba(0,0,0,0.3)] border border-slate-200 overflow-hidden">
          {/* Watermark Background */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <Cpu size={400} strokeWidth={1} />
          </div>

          {/* Inner Border Frame */}
          <div className="absolute inset-4 border border-slate-100 rounded-lg pointer-events-none" />

          {/* Header */}
          <div className="flex justify-between items-start relative z-10 ">
            <div className="flex flex-col">
              <span className="text-lg md:text-2xl font-black tracking-tighter italic leading-none">
                ZYNITH<span className="text-blue-600">.</span>
              </span>
              <span className="text-[6px] md:text-[8px] font-bold uppercase tracking-[0.4em] text-slate-400 mt-1">
                LMS / Excellence Framework
              </span>
            </div>
            <div className="relative flex items-center justify-center">
              <div className="absolute w-16 h-16 bg-blue-600/5 rounded-full animate-pulse" />
              <div className="w-10 h-10 md:w-12 md:h-12 bg-white border-2 border-blue-600 rounded-full flex items-center justify-center shadow-sm">
                <Award
                  className="text-blue-600"
                  size={isMobile ? 16 : 24}
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="text-center relative z-10 mt-5 md:mt-0">
            <p className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.5em] text-blue-600 mb-6">
              Certificate of Achievement
            </p>
            <h3 className="md:text-4xl font-serif italic text-slate-800 mb-2">
              Solomon Oluwatosin
            </h3>
            <div className="flex items-center justify-center gap-4 mb-4 md:mb-6">
              <div className="h-px w-6 md:w-12 bg-slate-200" />
              <span className="text-[9px]! md:text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                has successfully mastered
              </span>
              <div className="h-px w-6 md:w-12 bg-slate-200" />
            </div>
            <p className="text-[9px] md:text-xl font-black uppercase tracking-tight text-slate-900 bg-slate-50 inline-block px-6 py-2 rounded-lg border border-slate-100">
              Advanced System Design
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end relative z-10 mt-6 md:mt-0">
            <div className="space-y-1">
              <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400">
                Credential Issued
              </p>
              <p className="text-[8px] md:text-[11px] font-black text-slate-900">
                MAY 06, 2026
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 md:w-32 h-px bg-slate-900/20 mb-2 mx-auto" />
              <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400 italic">
                Program Director
              </p>
            </div>
            <div className="text-right space-y-1">
              <p className="text-[6px] md:text-[8px] font-bold uppercase tracking-widest text-slate-400">
                Verification ID
              </p>
              <p className="text-[8px] md:text-[11px]  font-black text-blue-600 font-mono">
                ZN-PRO-8821-X9
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
