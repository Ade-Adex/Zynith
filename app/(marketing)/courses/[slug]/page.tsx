
// // /app/(marketing)/courses/[id]/page.tsx


// import React from 'react'
// import { notFound } from 'next/navigation'
// import Image from 'next/image'
// import Link from 'next/link'
// import {
//   Play,
//   Clock,
//   Users,
//   Star,
//   CheckCircle2,
//   ShieldCheck,
//   BookOpen,
//   Contact,
// } from 'lucide-react'
// import { CourseCurriculum } from '@/app/components/CourseCurriculum'
// import { CourseEnrollCard } from '@/app/components/CourseEnrollCard'
// import { Course } from '@/app/types'

// interface Props {
//   params: Promise<{ id: string }>
// }

// async function getCurrentUserSession() {
//   return {
//     isLoggedIn: true,
//     purchasedCourseIds: ['some-other-id-123'],
//     wishlistCourseIds: [] as string[],
//   }
// }

// async function getCourseFromDatabase(id: string): Promise<Course | null> {
//   try {
//     const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
//     const response = await fetch(`${baseUrl}/api/courses`, {
//       next: { revalidate: 60 },
//     })
//     if (!response.ok) return null
//     const json = await response.json()
//     const courses: Course[] = json.data || []
//     return courses.find((c) => String(c._id) === id) || null
//   } catch (error) {
//     console.error('Server side database communications failure:', error)
//     return null
//   }
// }

// export default async function CourseDetails({ params }: Props) {
//   const { id } = await params
//   const course = await getCourseFromDatabase(id)

//   if (!course) notFound()

//   const userSession = await getCurrentUserSession()

//   const parsedPrice = course.price ?? 0
//   const isFree = parsedPrice === 0
//   const hasAccess = isFree || userSession.purchasedCourseIds.includes(String(course._id))
//   const isInWishlist = userSession.wishlistCourseIds.includes(String(course._id))

//   const features = course.features || []
//   const price = course.price ?? 0
//   const type = course.type || 'Premium'
//   const modules = course.modules || []

  
//   return (
//     <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
//       {/* Hero Header Section */}
//       <section className="relative bg-slate-950 text-white pt-25 pb-16 md:pt-30 md:pb-24 px-5 md:px-16 overflow-hidden">
//         <div className="absolute inset-0 opacity-30">
//           {course.previewVideo ? (
//             <video
//               src={course.previewVideo}
//               autoPlay
//               muted
//               loop
//               className="w-full h-full object-cover blur-md scale-110"
//             />
//           ) : (
//             <div
//               className={`w-full h-full bg-gradient-to-br ${course.color || 'from-blue-900 to-slate-900'} blur-3xl opacity-50`}
//             />
//           )}
//         </div>

//         <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
//           <div>
//             <div className="flex items-center gap-3 mb-8">
//               <span className="px-4 py-1 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
//                 {type}
//               </span>
//               {course.tag && (
//                 <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
//                   {course.tag}
//                 </span>
//               )}
//             </div>

//             <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
//               {course.title}
//             </h1>

//             <p className="text-slate-400 text-sm md:text-base max-w-xl mb-10 leading-relaxed font-medium">
//               Advance your career with {course.instructor}. Master{' '}
//               {features[0] || 'Modern Technologies'} through our high-fidelity
//               modular learning protocol.
//             </p>

//             <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
//               <div>
//                 <div className="flex items-center gap-2 text-yellow-500 mb-1">
//                   <Star size={16} fill="currentColor" />
//                   <span className="text-base md:text-xl font-black">
//                     {(course.rating || 0).toFixed(1)}
//                   </span>
//                 </div>
//                 <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
//                   Avg Rating
//                 </p>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2 text-blue-400 mb-1">
//                   <Users size={16} />
//                   <span className="text-base md:text-xl font-black">
//                     {(course.students || 0).toLocaleString()}
//                   </span>
//                 </div>
//                 <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
//                   Learners
//                 </p>
//               </div>
//               <div>
//                 <div className="flex items-center gap-2 text-emerald-400 mb-1">
//                   <Clock size={16} />
//                   <span className="text-base md:text-xl font-black">
//                     {course.duration}
//                   </span>
//                 </div>
//                 <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
//                   Duration
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Video Preview Unit */}
//           <div className="relative group aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center">
//             {course.previewVideo ? (
//               <video
//                 src={course.previewVideo}
//                 autoPlay
//                 muted
//                 loop
//                 className="absolute inset-0 w-full h-full object-cover opacity-60"
//               />
//             ) : (
//               course.image && (
//                 <Image
//                   src={course.image}
//                   alt={course.title}
//                   fill
//                   className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
//                 />
//               )
//             )}

//             <Link
//               href={
//                 hasAccess
//                   ? `/dashboard/courses/${course._id}/lessons`
//                   : `#enrollment-card`
//               }
//               className="relative z-10 w-16 h-16 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl cursor-pointer"
//             >
//               <Play fill="currentColor" size={32} className="ml-1" />
//             </Link>

//             <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
//               <p className="font-black uppercase text-[10px] tracking-[0.4em] text-white">
//                 {hasAccess ? 'Full Course Unlocked' : 'Preview Mode'}
//               </p>
//               <div className="h-px flex-1 mx-4 bg-white/20" />
//               <span className="text-[10px] font-black text-white">READY</span>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Main Layout Area */}
//       <main className="max-w-7xl mx-auto px-5 md:px-16 py-10 grid lg:grid-cols-3 gap-10">
//         <div className="lg:col-span-2 space-y-12">
//           {/* Learning Outcomes */}
//           {features.length > 0 && (
//             <section>
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-transparent dark:border-blue-900/20 flex items-center justify-center">
//                   <CheckCircle2 className="text-blue-600 dark:text-blue-400" />
//                 </div>
//                 <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">
//                   Learning Outcomes
//                 </h2>
//               </div>
//               <div className="grid md:grid-cols-3 gap-4">
//                 {features.map((feature, i) => (
//                   <div
//                     key={i}
//                     className="flex gap-4 p-4 rounded-3xl border border-slate-100 dark:border-border/60 bg-surface transition-all hover:shadow-xl dark:hover:shadow-black/20 group"
//                   >
//                     <ShieldCheck
//                       className="text-blue-600 dark:text-blue-400 shrink-0"
//                       size={20}
//                     />
//                     <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">
//                       {feature}
//                     </p>
//                   </div>
//                 ))}
//               </div>
//             </section>
//           )}

//           {/* Curriculum Mapping */}
//           <section>
//             <div className="flex items-end justify-between mb-6">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-surface border border-transparent dark:border-border/60 flex items-center justify-center">
//                   <BookOpen
//                     className="text-white dark:text-blue-400"
//                     size={20}
//                   />
//                 </div>
//                 <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">
//                   Curriculum
//                 </h2>
//               </div>
//               <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
//                 {modules.length} Stages
//               </span>
//             </div>
//             <CourseCurriculum
//               modules={modules}
//               courseId={String(course._id)}
//               hasAccess={hasAccess}
//             />
//           </section>

//           {/* Dedicated Tutor Profile Block */}
//           {course.tutorDetails && (
//             <section className="p-6 md:p-8 border border-slate-200 dark:border-border/60 rounded-3xl bg-surface">
//               <div className="flex items-center gap-4 mb-6">
//                 <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
//                   <Contact size={20} />
//                 </div>
//                 <div>
//                   <p className="text-[8px] md:text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-0.5">
//                     Your Instructor
//                   </p>
//                   <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">
//                     Tutor Overview
//                   </h2>
//                 </div>
//               </div>

//               <div className="flex flex-col md:flex-row gap-6 items-start">
//                 {course.tutorDetails.avatar && (
//                   <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-border/80">
//                     <Image
//                       src={course.tutorDetails.avatar}
//                       alt={course.tutorDetails.name || 'Tutor Avatar'}
//                       fill
//                       className="object-cover"
//                     />
//                   </div>
//                 )}
//                 <div className="space-y-3">
//                   <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">
//                     {course.tutorDetails.name}
//                   </h3>
//                   <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
//                     {course.tutorDetails.bio}
//                   </p>
//                   {course.tutorDetails.expertise && (
//                     <div className="flex flex-wrap gap-1.5 pt-2">
//                       {course.tutorDetails.expertise.map((exp, index) => (
//                         <span
//                           key={index}
//                           className="px-2 py-0.5 bg-background border border-slate-200 dark:border-border/60 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-bold uppercase tracking-wider"
//                         >
//                           {exp}
//                         </span>
//                       ))}
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </section>
//           )}
//         </div>

//         {/* Action Sidebar */}
//         <aside id="enrollment-card">
//           <div className="sticky top-32">
//             <CourseEnrollCard
//               course={course}
//               price={price}
//               type={type}
//               hasAccess={hasAccess}
//               isLoggedIn={userSession.isLoggedIn}
//               isInWishlist={isInWishlist}
//             />
//           </div>
//         </aside>
//       </main>
//     </div>
//   )
// }





// /app/(marketing)/courses/[slug]/page.tsx

import React from 'react'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import {
  Play,
  Clock,
  Users,
  Star,
  CheckCircle2,
  ShieldCheck,
  BookOpen,
  Contact,
} from 'lucide-react'
import { CourseCurriculum } from '@/app/components/CourseCurriculum'
import { CourseEnrollCard } from '@/app/components/CourseEnrollCard'
import { Course } from '@/app/types'

interface Props {
  params: Promise<{ slug: string }> 
}

async function getCurrentUserSession() {
  return {
    isLoggedIn: true,
    purchasedCourseIds: ['some-other-id-123'],
    wishlistCourseIds: [] as string[],
  }
}

// Overhauled lookup strategy to pull courses cleanly by slug signatures
async function getCourseFromDatabase(slug: string): Promise<Course | null> {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/courses`, {
      next: { revalidate: 60 },
    })
    if (!response.ok) return null
    const json = await response.json()
    const courses: Course[] = json.data || []
    
    // Check slug properties uniformly with lowercased values to prevent string variations from breaking links
    return courses.find((c) => c.slug?.toLowerCase() === slug.toLowerCase()) || null
  } catch (error) {
    console.error('Server side database communications failure:', error)
    return null
  }
}

export default async function CourseDetails({ params }: Props) {
  const { slug } = await params
  const course = await getCourseFromDatabase(slug)

  if (!course) notFound()

  const userSession = await getCurrentUserSession()

  const parsedPrice = course.price ?? 0
  const isFree = parsedPrice === 0
  
  // Note: Internal platform checks for permissions or dashboard parameters still use course._id
  const hasAccess = isFree || userSession.purchasedCourseIds.includes(String(course._id))
  const isInWishlist = userSession.wishlistCourseIds.includes(String(course._id))

  const features = course.features || []
  const price = course.price ?? 0
  const type = course.type || 'Premium'
  const modules = course.modules || []

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Hero Header Section */}
      <section className="relative bg-slate-950 text-white pt-25 pb-16 md:pt-30 md:pb-24 px-5 md:px-16 overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          {course.previewVideo ? (
            <video
              src={course.previewVideo}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover blur-md scale-110"
            />
          ) : (
            <div
              className={`w-full h-full bg-gradient-to-br ${course.color || 'from-blue-900 to-slate-900'} blur-3xl opacity-50`}
            />
          )}
        </div>

        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center relative z-10">
          <div>
            <div className="flex items-center gap-3 mb-8">
              <span className="px-4 py-1 rounded-full bg-blue-600 text-[10px] font-black uppercase tracking-[0.2em]">
                {type}
              </span>
              {course.tag && (
                <span className="px-4 py-1 rounded-full bg-white/10 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-[0.2em] border border-white/10">
                  {course.tag}
                </span>
              )}
            </div>

            <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tighter leading-[0.9] mb-8">
              {course.title}
            </h1>

            <p className="text-slate-400 text-sm md:text-base max-w-xl mb-10 leading-relaxed font-medium">
              Advance your career with {course.instructor}. Master{' '}
              {features[0] || 'Modern Technologies'} through our high-fidelity
              modular learning protocol.
            </p>

            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-white/10">
              <div>
                <div className="flex items-center gap-2 text-yellow-500 mb-1">
                  <Star size={16} fill="currentColor" />
                  <span className="text-base md:text-xl font-black">
                    {(course.rating || 0).toFixed(1)}
                  </span>
                </div>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Avg Rating
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-blue-400 mb-1">
                  <Users size={16} />
                  <span className="text-base md:text-xl font-black">
                    {(course.students || 0).toLocaleString()}
                  </span>
                </div>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Learners
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 text-emerald-400 mb-1">
                  <Clock size={16} />
                  <span className="text-base md:text-xl font-black">
                    {course.duration}
                  </span>
                </div>
                <p className="text-[8px] md:text-[10px] font-bold uppercase tracking-widest text-slate-500">
                  Duration
                </p>
              </div>
            </div>
          </div>

          {/* Video Preview Unit */}
          <div className="relative group aspect-video rounded-2xl overflow-hidden bg-slate-900 border border-white/10 shadow-2xl flex items-center justify-center">
            {course.previewVideo ? (
              <video
                src={course.previewVideo}
                autoPlay
                muted
                loop
                className="absolute inset-0 w-full h-full object-cover opacity-60"
              />
            ) : (
              course.image && (
                <Image
                  src={course.image}
                  alt={course.title}
                  fill
                  className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-1000"
                />
              )
            )}

            <Link
              href={
                hasAccess
                  ? `/dashboard/courses/${course._id}/lessons`
                  : `#enrollment-card`
              }
              className="relative z-10 w-16 h-16 bg-white text-slate-950 rounded-full flex items-center justify-center hover:scale-110 transition-all shadow-2xl cursor-pointer"
            >
              <Play fill="currentColor" size={32} className="ml-1" />
            </Link>

            <div className="absolute bottom-8 left-8 right-8 flex justify-between items-center">
              <p className="font-black uppercase text-[10px] tracking-[0.4em] text-white">
                {hasAccess ? 'Full Course Unlocked' : 'Preview Mode'}
              </p>
              <div className="h-px flex-1 mx-4 bg-white/20" />
              <span className="text-[10px] font-black text-white">READY</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Layout Area */}
      <main className="max-w-7xl mx-auto px-5 md:px-16 py-10 grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-12">
          {/* Learning Outcomes */}
          {features.length > 0 && (
            <section>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/30 border border-transparent dark:border-blue-900/20 flex items-center justify-center">
                  <CheckCircle2 className="text-blue-600 dark:text-blue-400" />
                </div>
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">
                  Learning Outcomes
                </h2>
              </div>
              <div className="grid md:grid-cols-3 gap-4">
                {features.map((feature, i) => (
                  <div
                    key={i}
                    className="flex gap-4 p-4 rounded-3xl border border-slate-100 dark:border-border/60 bg-surface transition-all hover:shadow-xl dark:hover:shadow-black/20 group"
                  >
                    <ShieldCheck
                      className="text-blue-600 dark:text-blue-400 shrink-0"
                      size={20}
                    />
                    <p className="text-xs md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">
                      {feature}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Curriculum Mapping */}
          <section>
            <div className="flex items-end justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-900 dark:bg-surface border border-transparent dark:border-border/60 flex items-center justify-center">
                  <BookOpen
                    className="text-white dark:text-blue-400"
                    size={20}
                  />
                </div>
                <h2 className="text-lg md:text-2xl font-black uppercase tracking-tighter">
                  Curriculum
                </h2>
              </div>
              <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-[0.3em]">
                {modules.length} Stages
              </span>
            </div>
            <CourseCurriculum
              modules={modules}
              courseId={String(course._id)}
              hasAccess={hasAccess}
            />
          </section>

          {/* Dedicated Tutor Profile Block */}
          {course.tutorDetails && (
            <section className="p-6 md:p-8 border border-slate-200 dark:border-border/60 rounded-3xl bg-surface">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white">
                  <Contact size={20} />
                </div>
                <div>
                  <p className="text-[8px] md:text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-[0.2em] mb-0.5">
                    Your Instructor
                  </p>
                  <h2 className="text-lg md:text-xl font-black uppercase tracking-tight">
                    Tutor Overview
                  </h2>
                </div>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-start">
                {course.tutorDetails.avatar && (
                  <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-slate-200 dark:border-border/80">
                    <Image
                      src={course.tutorDetails.avatar}
                      alt={course.tutorDetails.name || 'Tutor Avatar'}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <div className="space-y-3">
                  <h3 className="font-black text-slate-900 dark:text-white uppercase text-sm tracking-tight">
                    {course.tutorDetails.name}
                  </h3>
                  <p className="text-slate-600 dark:text-slate-300 text-xs md:text-sm leading-relaxed font-medium">
                    {course.tutorDetails.bio}
                  </p>
                  {course.tutorDetails.expertise && (
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {course.tutorDetails.expertise.map((exp, index) => (
                        <span
                          key={index}
                          className="px-2 py-0.5 bg-background border border-slate-200 dark:border-border/60 text-slate-500 dark:text-slate-400 rounded-md text-[9px] font-bold uppercase tracking-wider"
                        >
                          {exp}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </div>

        {/* Action Sidebar */}
        <aside id="enrollment-card">
          <div className="sticky top-32">
            <CourseEnrollCard
              course={course}
              price={price}
              type={type}
              hasAccess={hasAccess}
              isLoggedIn={userSession.isLoggedIn}
              isInWishlist={isInWishlist}
            />
          </div>
        </aside>
      </main>
    </div>
  )
}