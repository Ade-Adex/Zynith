// /app/(marketing)/cart/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import LinkComponent from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import {
  ShoppingBag,
  Trash2,
  ArrowRight,
  ShieldCheck,
  ArrowLeft,
  Tag,
} from 'lucide-react'
import { useCartStore } from '@/app/store/cartStore'
import { useAuthStore } from '@/app/store/authStore'
import {
  enrollUserAfterPaymentAction,
  checkExistingEnrollmentsAction, // ✅ Import the new verification action
} from '@/app/services/enrollmentActions'

interface PaystackTransactionResponse {
  reference: string
  status: string
  trans: string
  transaction: string
  message: string
  channel?: string
  bank?: string
  card?: {
    brand: string
    last4: string
  }
}

interface PaystackTransactionOptions {
  key: string
  email: string
  amount: number
  currency: string
  ref?: string
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

interface PaystackLegacyHandler {
  open: () => void
}

interface PaystackIframeHandler {
  openIframe: () => void
}

type PaystackHandler = PaystackLegacyHandler | PaystackIframeHandler

interface PaystackPopInstance {
  setup: (options: PaystackTransactionOptions) => PaystackHandler
}

export default function CartPage() {
  const router = useRouter()
  const pathname = usePathname()
  const [mounted, setMounted] = useState(false)
  const [isProcessingPayment, setIsProcessingPayment] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null) // ✅ Error message tracker UI asset

  const { cartItems, removeFromCart, getCartTotal, clearCart } = useCartStore()
  const { user, isAuthenticated } = useAuthStore()

  useEffect(() => {
    const handle = requestAnimationFrame(() => setMounted(true))
    return () => cancelAnimationFrame(handle)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background text-foreground pt-36 pb-24 flex items-center justify-center">
        <div className="text-xs font-black uppercase tracking-widest animate-pulse text-slate-400">
          Initializing Workspace...
        </div>
      </div>
    )
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-[#ffffff] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] pt-36 pb-24 flex flex-col items-center justify-center px-5">
        <div className="w-20 h-20 rounded-3xl bg-blue-50 dark:bg-zinc-900 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-8 animate-pulse">
          <ShoppingBag size={36} />
        </div>
        <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter mb-4 text-center">
          Your Shopping Cart is Empty
        </h1>
        <p className="text-slate-500 dark:text-zinc-400 text-xs md:text-sm max-w-sm text-center mb-10 font-medium leading-relaxed">
          Looks like you haven&apos;t added any structural development courses
          to your workspace yet. Let&apos;s change that.
        </p>
        <LinkComponent
          href="/courses"
          className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-8 py-3 rounded-2xl font-black uppercase text-[12px] tracking-wider transition-all flex items-center gap-3 shadow-xl shadow-blue-600/20"
        >
          Explore Engineering Modules <ArrowRight size={16} />
        </LinkComponent>
      </div>
    )
  }

  const rawSubtotal = getCartTotal()
  const vatValue = rawSubtotal * 0.075
  const finalTotal = rawSubtotal + vatValue

  const loadPaystackScript = (): Promise<boolean> => {
    return new Promise((resolve) => {
      if (
        typeof window !== 'undefined' &&
        window['PaystackPop' as keyof Window]
      ) {
        resolve(true)
        return
      }
      const existingScript = document.querySelector(
        'script[src="https://js.paystack.co/v1/inline.js"]',
      )
      if (existingScript) {
        existingScript.addEventListener('load', () => resolve(true))
        return
      }
      const script = document.createElement('script')
      script.src = 'https://js.paystack.co/v1/inline.js'
      script.async = true
      script.onload = () => resolve(true)
      document.body.appendChild(script)
    })
  }

  const handleCartPaymentCheckout = async () => {
    if (isProcessingPayment) return
    setErrorMessage(null) // Reset errors

    if (!isAuthenticated || !user) {
      router.push(`/auth?redirect=${encodeURIComponent(pathname)}`)
      return
    }

    setIsProcessingPayment(true)

    try {
      const courseIdsStaged = cartItems.map((item) => String(item._id))

      // ✅ 1. Validate against existing database enrollments BEFORE triggering payment gateway popup
      const checkEnrollment = await checkExistingEnrollmentsAction(
        user._id,
        courseIdsStaged,
      )

      if (checkEnrollment.hasDuplicates) {
        setErrorMessage(
          `Checkout Blocked: You have already purchased "${checkEnrollment.duplicateTitles.join(', ')}". Please remove it from your cart.`,
        )
        setIsProcessingPayment(false)
        return
      }

      // 2. Load script and boot setup if validation passes
      await loadPaystackScript()

      const paystackInstance =
        typeof window !== 'undefined'
          ? (window[
              'PaystackPop' as keyof Window
            ] as unknown as PaystackPopInstance)
          : undefined

      if (!paystackInstance || typeof paystackInstance.setup !== 'function') {
        throw new Error('Paystack SDK failed to initialize.')
      }

      const generatedReference = `BKP-${Date.now()}-${Math.floor(Math.random() * 10000)}`

      const handler = paystackInstance.setup({
        key:
          process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY ||
          'pk_test_your_public_key_here',
        email: user.email,
        amount: Math.round(finalTotal * 100),
        currency: 'NGN',
        ref: generatedReference,
        metadata: {
          custom_fields: [
            {
              display_name: 'Purchase Type',
              variable_name: 'purchase_type',
              value: 'bulk_cart_checkout',
            },
            {
              display_name: 'Staged Course IDs',
              variable_name: 'course_ids',
              value: courseIdsStaged.join(','),
            },
            {
              display_name: 'User Identifier ID',
              variable_name: 'user_id',
              value: user._id,
            },
          ],
        },
        callback: async (response: PaystackTransactionResponse) => {
          try {
            const activeUserId = user?._id
            if (!activeUserId) return

            const channel = response.channel || 'card'
            const brandType = response.card?.brand || 'VISA / MASTER'
            const numericEnding = response.card?.last4 || '****'
            const issuingBank = response.bank || 'Gateway Bank'

            await enrollUserAfterPaymentAction(
              String(activeUserId),
              courseIdsStaged,
              response.reference,
              {
                gateway: 'PAYSTACK',
                cardType: `${channel.toUpperCase()} (${brandType})`,
                last4: numericEnding,
                bank: issuingBank,
              },
            )
          } catch (err) {
            console.error('Bulk processing background sync failure:', err)
          } finally {
            clearCart()
            setIsProcessingPayment(false)
            router.push(`/dashboard/wallet/receipt/${response.reference}`)
          }
        },
        onClose: () => {
          setIsProcessingPayment(false)
        },
      })

      if ('open' in handler) {
        handler.open()
      } else if ('openIframe' in handler) {
        handler.openIframe()
      }
    } catch (error) {
      console.error('Cart payment workspace runtime error.', error)
      setIsProcessingPayment(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#ffffff] dark:bg-[#0a0a0a] text-[#171717] dark:text-[#ededed] pt-24 pb-16 px-5 md:px-16 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between border-b border-slate-200 dark:border-zinc-800 pb-8 mb-8 gap-4">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400 mb-2">
              Review Selection
            </p>
            <h1 className="text-2xl md:text-4xl font-black uppercase tracking-tighter leading-none">
              Your Cart
            </h1>
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500">
            [{cartItems.length}] Module{cartItems.length > 1 ? 's' : ''} Staged
          </span>
        </div>

        <div className="grid lg:grid-cols-3 gap-12 items-start">
          <div className="lg:col-span-2 space-y-4">
            {/* ✅ Added a professional error notice block if verification actions fail */}
            {errorMessage && (
              <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/50 text-red-600 dark:text-red-400 text-xs font-bold uppercase tracking-wide leading-relaxed">
                {errorMessage}
              </div>
            )}

            {cartItems.map((item) => (
              <div
                key={item._id}
                className="group flex flex-col sm:flex-row items-start sm:items-center justify-between p-5 rounded-3xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-[#0f0f0f] transition-all hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-xl dark:hover:shadow-black/20 gap-6"
              >
                <div className="flex items-center gap-5 w-full sm:w-auto">
                  <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-slate-100 dark:bg-zinc-800 shrink-0 border border-slate-200 dark:border-zinc-800">
                    {item.image && (
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        unoptimized
                        className="object-cover filter brightness-95 group-hover:scale-105 transition-transform duration-500"
                      />
                    )}
                  </div>

                  <div className="space-y-1">
                    <div className="flex flex-wrap gap-2 items-center">
                      <span className="text-[8px] font-black uppercase tracking-widest bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded">
                        {item.tag || 'Core Module'}
                      </span>
                      <span className="text-slate-400 text-xs font-medium">
                        by {item.instructor}
                      </span>
                    </div>
                    <h2 className="font-black uppercase tracking-tight text-sm md:text-base text-slate-900 dark:text-zinc-100 line-clamp-1">
                      {item.title}
                    </h2>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      {item.duration} • {item.modules?.length || 0} Lessons
                    </p>
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto border-t sm:border-t-0 border-slate-100 dark:border-zinc-800/80 pt-4 sm:pt-0 shrink-0 gap-4">
                  <span className="text-sm md:text-base font-black tracking-tight text-slate-900 dark:text-zinc-100 italic">
                    ₦{(item.price ?? 0).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeFromCart(String(item._id))}
                    className="p-2.5 rounded-xl bg-slate-50 hover:bg-red-50 dark:bg-zinc-900 dark:hover:bg-red-950/30 text-slate-400 hover:text-red-500 transition-colors border border-slate-200 dark:border-zinc-800 hover:border-red-200 dark:hover:border-red-900/30 cursor-pointer"
                    title="Remove Item"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}

            <LinkComponent
              href="/courses"
              className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors pt-4"
            >
              <ArrowLeft size={14} /> Back to Learning Vault
            </LinkComponent>
          </div>

          <aside className="bg-white dark:bg-[#0f0f0f] border border-slate-200 dark:border-zinc-800 p-4 md:p-6 rounded-3xl shadow-xl dark:shadow-black/10 space-y-6">
            <h3 className="font-black uppercase tracking-tight text-base border-b border-slate-100 dark:border-zinc-800 pb-4">
              Order Summary
            </h3>

            <div className="space-y-3 font-medium text-xs md:text-sm text-slate-600 dark:text-zinc-400">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">
                  ₦{rawSubtotal.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax (7.5%)</span>
                <span className="font-bold text-slate-900 dark:text-zinc-100">
                  ₦{vatValue.toLocaleString()}
                </span>
              </div>
              <div className="h-px bg-slate-100 dark:bg-zinc-800 my-2" />
              <div className="flex justify-between text-base font-black text-slate-900 dark:text-zinc-100 italic">
                <span>Total Due</span>
                <span>₦{finalTotal.toLocaleString()}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-surface focus:outline-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none rounded-xl px-3 border border-slate-200 dark:border-zinc-800 transition-all">
              <Tag size={14} className="text-slate-400" />
              <input
                type="text"
                placeholder="PROMO CODE"
                className="bg-transparent border-none py-2.5 outline-none focus:outline-none focus:border-none focus:ring-0 focus-visible:ring-0 focus-visible:outline-none font-black text-sm tracking-wider placeholder:text-slate-400 uppercase w-full"
              />
            </div>

            <button
              onClick={handleCartPaymentCheckout}
              disabled={isProcessingPayment}
              className="w-full bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white py-3.5 rounded-2xl font-black uppercase text-sm tracking-wider transition-all flex items-center justify-center gap-3 shadow-xl shadow-blue-600/20 disabled:opacity-50 cursor-pointer"
            >
              {isProcessingPayment ? (
                'Initializing Gateways...'
              ) : (
                <>
                  Proceed to Payment <ArrowRight size={16} />
                </>
              )}
            </button>

            <div className="flex items-center gap-3 text-[10px] text-slate-400 dark:text-zinc-500 font-bold uppercase tracking-wide justify-center pt-2">
              <ShieldCheck size={14} className="text-emerald-500" /> Secured
              Gateway Encryption
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
