'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Play, Code, Users, X } from 'lucide-react'

export const Hero = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <>
      <section id="hero" className="pt-25 pb-20 border-b overflow-hidden">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Column: Copy & CTA */}
          <div className="relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Next Enrollment: June 2026
            </div>

            <h1 className="text-3xl md:text-6xl font-black tracking-tightest leading-[1.05]  uppercase mb-6">
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
              <button className="bg-slate-900  dark:bg-slate-300 text-white dark:text-black px-8 py-3 rounded-xl text-sm! font-bold! uppercase tracking-widest flex items-center gap-3 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-200 transition-all duration-300">
                Explore Tracks <ArrowRight size={16} />
              </button>

              <button
                onClick={() => setIsVideoOpen(true)}
                className="group flex items-center gap-3 text-sm! font-bold! uppercase tracking-widest cursor-pointer"
              >
                <div className="w-12 h-12 rounded-full border border-slate-300! dark:border-slate-600! flex items-center justify-center group-hover:bg-slate-50 group-hover:border-blue-200 transition-all duration-300">
                  <Play
                    size={14}
                    className="fill-slate-900 dark:fill-slate-300 ml-1"
                  />
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
                Joined by <span className="text-foreground">2,400+</span>{' '}
                engineers
              </p>
            </div>
          </div>

          {/* Right Column: Dashboard Visual */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-blue-100/40 dark:bg-blue-900/10 rounded-[40px] blur-3xl group-hover:bg-blue-200/40 dark:group-hover:bg-blue-900/20 transition duration-1000" />

            {/* Main Outer Card Container */}
            <div className="relative bg-white dark:bg-surface rounded-4xl p-3 border border-slate-300 dark:border-border shadow-2xl shadow-slate-200/50 dark:shadow-black/50 transition-colors duration-200">
              {/* Inner Simulated Browser Window Frame */}
              <div className="bg-white dark:bg-background rounded-3xl border border-slate-100 dark:border-border/50 md:aspect-video flex flex-col overflow-hidden transition-colors duration-200">
                {/* Browser Window Header Control Bar */}
                <div className="h-10 bg-slate-50/50 dark:bg-surface/30 border-b border-slate-100 dark:border-border/50 flex items-center justify-between px-4">
                  {/* Window Controls */}
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-red-400/70 dark:bg-red-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-amber-400/70 dark:bg-amber-500/50" />
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/70 dark:bg-emerald-500/50" />
                  </div>
                  {/* Domain Address Mock Text */}
                  <div className="text-[9px] font-black uppercase tracking-widest text-slate-400 dark:text-foreground/40">
                    app.zynith.edu
                  </div>
                  <div className="w-6" />
                </div>

                {/* Main Window Interface Layout */}
                <div className="flex-1 flex overflow-hidden">
                  {/* Sidebar Mock Navigation Blocks */}
                  <div className="w-16 border-r border-slate-50 dark:border-border/30 p-3 space-y-4 hidden sm:block">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className={`h-8 rounded-lg transition-colors duration-200 ${
                          i === 1
                            ? 'bg-blue-50 dark:bg-blue-950/40'
                            : 'bg-slate-50 dark:bg-surface/50'
                        }`}
                      />
                    ))}
                  </div>

                  {/* Content Workspace Canvas */}
                  <div className="flex-1 p-6 relative">
                    <div className="mb-4 flex justify-between items-start">
                      {/* Skeletal Mock Loader Elements */}
                      <div className="space-y-1.5">
                        <div className="h-3 w-32 bg-slate-100 dark:bg-surface rounded animate-pulse" />
                        <div className="h-2 w-48 bg-slate-50 dark:bg-surface/60 rounded" />
                      </div>
                      {/* Tech Icon Accent Button */}
                      <div className="w-8 h-8 rounded-full bg-blue-600 dark:bg-blue-500 flex items-center justify-center text-white shadow-sm">
                        <Code size={14} />
                      </div>
                    </div>

                    {/* Embedded Video Player Interactive Element */}
                    <div
                      onClick={() => setIsVideoOpen(true)}
                      className="relative w-full aspect-video bg-slate-900 rounded-xl overflow-hidden group/video cursor-pointer shadow-md"
                    >
                      <Image
                        src="https://images.unsplash.com/photo-1587620962725-abab7fe55159"
                        alt="Code background preview"
                        fill
                        priority
                        className="object-cover opacity-50 dark:opacity-40 transition-transform duration-700 group-hover/video:scale-110"
                      />
                      {/* Glassmorphic Centered Play Indicator Toggle */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/10 dark:bg-black/20 backdrop-blur-md border border-white/20 dark:border-white/10 flex items-center justify-center group-hover/video:scale-110 transition-all">
                          <Play
                            size={18}
                            className="text-white fill-white ml-0.5"
                          />
                        </div>
                      </div>
                      {/* Custom Streaming Player Progress Slider Track */}
                      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 dark:bg-white/10">
                        <div className="h-full w-2/3 bg-blue-500 dark:bg-blue-400" />
                      </div>
                    </div>

                    {/* Inset Widget Card: Floating Next Stream Preview */}
                    <div className="absolute -bottom-2 -left-5 bg-white dark:bg-surface p-3 rounded-lg border border-slate-200 dark:border-border shadow-xl max-w-45 hidden md:block z-20 transition-colors duration-200">
                      <p className="text-[8px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1">
                        Coming Up Next
                      </p>
                      <p className="text-[10px] font-bold text-slate-800 dark:text-foreground leading-tight">
                        Implementing Redis Caching Layers
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Outer Floating Widget Badge: Live Counter Element */}
            <div className="absolute -bottom-5 right-0 bg-white dark:bg-surface p-2 rounded-lg border border-slate-200 dark:border-border shadow-2xl items-center gap-4 hidden lg:flex animate-bounce-slow z-30 transition-colors duration-200">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                <Users size={24} />
              </div>
              <div>
                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-slate-400 dark:text-foreground/40">
                  Live Community
                </span>
                <p className="text-[12px] font-black text-slate-900 dark:text-foreground">
                  142 Active Now
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Video Modal */}
      {isVideoOpen && (
        <div className="fixed inset-0 z-999 flex items-center justify-center p-6">
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
