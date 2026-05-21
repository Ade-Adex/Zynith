// /app/components/CourseEnrollCard.tsx


'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import {
  ShieldCheck,
  ArrowRight,
  Award,
  Zap,
  Users,
  Heart,
  ShoppingBag,
  Check,
} from 'lucide-react'
import { useCartStore } from '@/app/store/cartStore'
import { useAuthStore } from '@/app/store/authStore'
import { Course } from '@/app/types'

interface PaystackTransactionResponse {
  reference: string
  status: string
  trans: string
  transaction: string
  message: string
}

interface PaystackTransactionOptions {
  key: string
  email: string
  amount: number
  currency: string
  metadata: {
    custom_fields: Array<{
      display_name: string
      variable_name: string
      value: string | number
    }>
  }
  callback: (response: PaystackTransactionResponse) => void
  onClose: () => void
}

interface PaystackPopInstance {
  setup: (options: PaystackTransactionOptions) => { open: () => void }
}

declare global {
  interface Window {
    PaystackPop?: PaystackPopInstance
  }
}

interface CourseEnrollCardProps {
  course: Course
  price: string
  type: string
  hasAccess: boolean
  isLoggedIn: boolean
  isInWishlist: boolean
}

export function CourseEnrollCard({
  course,
  price,
  type,
  hasAccess,
  isInWishlist,
}: CourseEnrollCardProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)

  const { addToCart, removeFromCart, isInCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  const isFree = type === 'Free' || price === 'FREE'
  const numericPrice = parseFloat(price) || 0

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  const currentCourseId = String(course._id)
  const itemInCart = mounted ? isInCart(currentCourseId) : false

  const handleCartToggle = async () => {
    if (isAdding) return

    if (itemInCart) {
      removeFromCart(currentCourseId)
    } else {
      setIsAdding(true)
      setTimeout(() => {
        addToCart(course)
        setIsAdding(false)
      }, 400)
    }
  }

  const loadPaystackScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (window.PaystackPop) {
        resolve(true)
        return
      }
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      script.onload = () => resolve(true)
      document.body.appendChild(script)
    })
  }

  const handleBuyNowPayment = async () => {
    if (!mounted || isProcessingPayment) return

    if (!isAuthenticated || !user) {
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    setIsProcessingPayment(true)

    try {
      await loadPaystackScript()

      if (
        !window.PaystackPop ||
        typeof window.PaystackPop.setup !== 'function'
      ) {
        throw new Error('Paystack SDK failed to initialize.')
      }

      const handler = window.PaystackPop.setup({
        key:
          process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
          'pk_test_your_public_key_here',
        email: user.email,
        amount: Math.round(numericPrice * 100),
        currency: 'NGN',
        metadata: {
          custom_fields: [
            {
              display_name: 'Purchase Type',
              variable_name: 'purchase_type',
              value: 'single_course',
            },
            {
              display_name: 'Course ID',
              variable_name: 'course_id',
              value: currentCourseId,
            },
            {
              display_name: 'User Identifier ID',
              variable_name: 'user_id',
              value: user._id,
            },
          ],
        },
        callback: (response) => {
          router.push(
            `/dashboard/courses/${currentCourseId}/lessons?reference=${response.reference}`,
          )
        },
        onClose: () => {
          setIsProcessingPayment(false)
        },
      })

      handler.open()
    } catch (error) {
      console.error('Payment initialization failure package.', error)
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="bg-white dark:bg-[#0a0a0a] border border-slate-200 dark:border-zinc-800 p-4 md:p-10 rounded-2xl shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] relative overflow-hidden">
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-600/10 dark:bg-blue-500/5 blur-[80px] rounded-full" />

      <div className="mb-10 relative z-10">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 mb-4 flex items-center gap-2">
          <Zap size={12} fill="currentColor" /> Lifetime Access
        </p>
        <div className="flex items-baseline gap-3">
          <span className="text-lg md:text-2xl font-black tracking-tighter italic text-slate-900 dark:text-zinc-100">
            {isFree ? 'FREE' : `₦${numericPrice.toLocaleString()}`}
          </span>
          {!isFree && (
            <span className="text-slate-300 dark:text-zinc-600 font-bold line-through text-sm md:text-base">
              ₦299,000
            </span>
          )}
        </div>
      </div>

      <div className="space-y-3 mb-10 relative z-10">
        {hasAccess ? (
          <Link
            href={`/dashboard/courses/${currentCourseId}/lessons`}
            className="w-full bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white py-3 rounded-2xl font-black uppercase text-[12px] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-600/20 dark:shadow-emerald-500/10"
          >
            Go to Classroom <ArrowRight size={18} />
          </Link>
        ) : (
          <>
            <button
              onClick={handleBuyNowPayment}
              disabled={isProcessingPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3 rounded-2xl font-black uppercase text-sm cursor-pointer transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 dark:shadow-blue-500/10 disabled:opacity-50"
            >
              {isProcessingPayment ? (
                'Connecting Secure Gateway...'
              ) : (
                <>
                  Buy Now <ArrowRight size={18} />
                </>
              )}
            </button>

            {!isFree && (
              <button
                onClick={handleCartToggle}
                disabled={!mounted || isAdding}
                className={`w-full py-3 rounded-2xl font-black uppercase text-sm transition-all flex items-center justify-center gap-3 border cursor-pointer ${
                  itemInCart
                    ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-200 dark:border-emerald-900/30 text-emerald-600 dark:text-emerald-400 hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-600 dark:hover:text-red-400 hover:border-red-200 dark:hover:border-red-900/30 group/cartbtn'
                    : 'bg-white hover:bg-slate-50 dark:bg-transparent dark:hover:bg-white/5 border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100'
                }`}
              >
                {isAdding ? (
                  'Processing...'
                ) : itemInCart ? (
                  <>
                    <span className="inline group-hover/cartbtn:hidden">
                      In Cart <Check size={16} className="inline ml-1" />
                    </span>
                    <span className="hidden group-hover/cartbtn:inline">
                      Remove Item
                    </span>
                  </>
                ) : (
                  <>
                    Add to Cart <ShoppingBag size={16} />
                  </>
                )}
              </button>
            )}
          </>
        )}

        {!hasAccess && (
          <button className="w-full bg-slate-950 hover:bg-slate-800 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-white py-3 rounded-2xl font-black uppercase text-sm transition-all flex items-center justify-center gap-2 cursor-pointer">
            <Heart
              size={14}
              fill={isInWishlist ? 'currentColor' : 'none'}
              className={isInWishlist ? 'text-red-500' : ''}
            />
            {isInWishlist ? 'In Your Wishlist' : 'Add to Wishlist'}
          </button>
        )}
      </div>

      <div className="space-y-4 border-t border-slate-100 dark:border-zinc-800 pt-6 relative z-10">
        {[
          {
            icon: (
              <Award className="text-blue-600 dark:text-blue-400" size={20} />
            ),
            text: 'Industry Certificate',
          },
          {
            icon: (
              <Users className="text-blue-600 dark:text-blue-400" size={20} />
            ),
            text: 'P2P Peer Grading',
          },
          {
            icon: (
              <ShieldCheck
                className="text-blue-600 dark:text-blue-400"
                size={20}
              />
            ),
            text: 'Expert Support',
          },
        ].map((feat, i) => (
          <div key={i} className="flex items-center gap-4">
            <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950/30 flex items-center justify-center shrink-0">
              {feat.icon}
            </div>
            <span className="text-[8px] md:text-[10px] font-black uppercase tracking-[0.15em] text-slate-500 dark:text-zinc-400">
              {feat.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}