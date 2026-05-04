'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Play, Code, Users, X } from 'lucide-react'

export const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <>
      <section className="pt-25 pb-20 border-b border-slate-100 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Copy & CTA */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Next Enrollment: June 2026
            </div>

            <h1 className="text-3xl md:text-6xl font-black tracking-tightest leading-[1.05] text-slate-900 uppercase mb-6">
              Master the <br />
              <span className="text-blue-600 italic">Engineering</span> <br />
              Standard.
            </h1>

            <p className="max-w-md text-slate-500 text-sm font-medium leading-relaxed mb-10">
              The only LMS architected for senior growth. Move beyond basic
              syntax and build distributed systems with industry experts in a
              production-ready environment.
            </p>

            <div className="flex flex-wrap gap-6">
              <button className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300">
                Explore Tracks <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setIsVideoOpen(true)}
                className="group flex items-center gap-3 text-[11px] font-black uppercase tracking-widest text-slate-900 cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:bg-slate-50 group-hover:border-blue-200 transition-all duration-300">
                  <Play size={14} className="fill-slate-900 ml-1" />
                </div>
                Watch Preview
              </button>
            </div>

            {/* Quick Social Proof */}
            <div className="mt-12 flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="relative w-8 h-8 rounded-full border-2 border-white overflow-hidden bg-slate-100"
                  >
                    <Image
                      src={`https://i.pravatar.cc/100?u=${i}`}
                      alt="Student profile"
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                Joined by <span className="text-slate-900">2,400+</span>{' '}
                engineers
              </p>
            </div>
          </div>

          {/* Right Column: Dashboard Visual */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-blue-100/40 rounded-[40px] blur-3xl group-hover:bg-blue-200/40 transition duration-1000" />

            <div className="relative bg-white rounded-[32px] p-3 border border-slate-200 shadow-2xl shadow-slate-200/50">
              <div className="bg-white rounded-[24px] border border-slate-100 aspect-video flex flex-col overflow-hidden">
                <div className="h-10 bg-slate-50/50 border-b border-slate-100 flex items-center justify-between px-4">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-300" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-300" />
                  </div>
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400">
                    app.zynith.edu
                  </div>
                  <div className="w-6" />
                </div>

                <div className="flex-1 flex overflow-hidden">
                  <div className="w-16 border-r border-slate-50 p-3 space-y-4 hidden sm:block">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-8 rounded-lg ${i === 1 ? 'bg-blue-50' : 'bg-slate-50'}`}
                      />
                    ))}
                  </div>

                  <div className="flex-1 p-6 relative">
                    <div className="mb-4 flex justify-between items-start">
                      <div className="space-y-1.5">
                        <div className="h-3 w-32 bg-slate-100 rounded animate-pulse" />
                        <div className="h-2 w-48 bg-slate-50 rounded" />
                      </div>
                      <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white">
                        <Code size={14} />
                      </div>
                    </div>

                    <div
                      onClick={() => setIsVideoOpen(true)}
                      className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden group/video cursor-pointer"
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1587620962725-abab7fe55159"
                        alt="Code background preview"
                        fill
                        priority
                        className="object-cover opacity-50 transition-transform duration-700 group-hover/video:scale-110"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center group-hover/video:scale-110 transition-all">
                          <Play
                            size={18}
                            className="text-white fill-white ml-0.5"
                          />
                        </div>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                        <div className="h-full w-2/3 bg-blue-500" />
                      </div>
                    </div>

                    <div className="absolute -bottom-2 -left-2 bg-white p-3 rounded-xl border border-slate-200 shadow-xl max-w-[180px] hidden md:block z-20">
                      <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 mb-1">
                        Coming Up Next
                      </p>
                      <p className="text-[10px] font-bold text-slate-800 leading-tight">
                        Implementing Redis Caching Layers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -right-5 bg-white p-3 rounded-2xl border border-slate-200 shadow-2xl items-center gap-4 hidden lg:flex animate-bounce-slow z-30">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Users size={24} />
              </div>
              <div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Live Community
                </span>
                <p className="text-[12px] font-black text-slate-900">
                  142 Active Now
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-6">
          <div
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setIsVideoOpen(false)}
          />
          <div className="relative w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-6 right-6 z-50 p-2 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-md transition-colors"
            >
              <X size={20} />
            </button>
            <iframe
              src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
              className="w-full h-full"
              allow="autoplay; fullscreen"
            />
          </div>
        </div>
      )}
    </>
  )
}
