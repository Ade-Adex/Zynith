// /app/(dashboard)/dashboard/wallet/receipt/[reference]/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  CheckCircle2,
  Printer,
  ArrowRight,
  Calendar,
  Hash,
  User,
  ShieldCheck,
  CreditCard,
  Building,
  Wallet2,
  ArrowLeft,
} from 'lucide-react'
import { useAuthStore } from '@/app/store/authStore'
import { getReceiptDetailsByReference } from '@/app/services/receiptActions'
import { UserType } from '@/app/types/user'

interface PurchasedItem {
  _id: string
  title: string
  price: number
}

interface OrderData {
  gateway: 'PAYSTACK' | 'WALLET' | 'STRIPE'
  cardDetails?: {
    cardType?: string
    last4?: string
    bank?: string
  }
  items: PurchasedItem[]
  subtotal: number
  tax: number
  total: number
  date: string
}

export default function PaymentReceiptPage() {
  const params = useParams()
  // Secure dynamic array or plain object route parameters safely for Next.js 15+
  const reference = Array.isArray(params?.reference)
    ? params.reference[0]
    : (params?.reference as string)

  const router = useRouter()
  const { user: rawUser } = useAuthStore()
  const user = rawUser as UserType | null

  const [loading, setLoading] = useState<boolean>(true)
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    if (!reference || !user?._id) return

    const fetchReceiptDetails = async () => {
      try {
        const response = await getReceiptDetailsByReference(reference, user._id)
        if (response.success && response.data) {
          // Cast response match directly to state schema parameters
          setOrderData(response.data as OrderData)
        } else {
          console.error('Statement generation reference parameters mismatch.')
        }
      } catch (err) {
        console.error('Error fetching operational database receipt:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchReceiptDetails()
  }, [reference, user?._id])

  const handlePrint = () => {
    if (typeof window !== 'undefined') window.print()
  }

  // Gateway Badge Renderer Matrix
  const renderGatewayDetails = () => {
    if (!orderData) return null

    switch (orderData.gateway) {
      case 'WALLET':
        return (
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Wallet2 size={12} /> Internal Wallet
          </span>
        )
      case 'PAYSTACK':
        return (
          <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
            <CreditCard size={12} /> Paystack Engine
          </span>
        )
      case 'STRIPE':
        return (
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
            <CreditCard size={12} /> Stripe Payment
          </span>
        )
      default:
        return orderData.gateway
    }
  }

  if (loading) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center bg-transparent">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-t-blue-600 border-slate-200 dark:border-zinc-800 rounded-full animate-spin" />
          <p className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 animate-pulse">
            Compiling Transaction Statement...
          </p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4">
        <div className="text-center space-y-6 max-w-sm border border-slate-100 dark:border-zinc-800/80 p-8 rounded-3xl bg-white dark:bg-zinc-950 shadow-xl">
          <div className="w-12 h-12 rounded-full bg-red-50 dark:bg-red-950/20 flex items-center justify-center text-red-500 mx-auto">
            <Hash size={24} />
          </div>
          <div className="space-y-2">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-zinc-200">
              Statement Ledger Record Not Found
            </h3>
            <p className="text-xs text-slate-400 dark:text-zinc-500 leading-relaxed">
              We couldn&apos;t locate a settled ledger mapping reference code{' '}
              <span className="font-mono bg-slate-50 dark:bg-zinc-900 px-1 py-0.5 rounded text-red-400">
                {reference}
              </span>{' '}
              under this active account credentials.
            </p>
          </div>
          <Link
            href="/dashboard/wallet"
            className="inline-flex items-center gap-2 text-xs font-black text-blue-600 dark:text-blue-400 uppercase tracking-widest hover:underline pt-2"
          >
            <ArrowLeft size={14} /> Return to Wallet Hub
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="py-8 max-w-3xl mx-auto print:py-0 print:max-w-full px-4 sm:px-6">
      {/* Back Button Action Control */}
      <div className="mb-6 print:hidden">
        <Link
          href="/dashboard/wallet"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft size={14} /> Back to Financial Hub
        </Link>
      </div>

      {/* Printable Area Card Base Wrapper */}
      <div className="bg-white dark:bg-zinc-950 border border-slate-100 dark:border-zinc-900 rounded-3xl p-6 md:p-10 shadow-xl dark:shadow-black/40 print:border-none print:shadow-none print:bg-white text-slate-800 dark:text-zinc-100">
        {/* Header Branding Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pb-8 border-b border-slate-100 dark:border-zinc-900">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 flex items-center justify-center text-emerald-500 shrink-0">
              <CheckCircle2 size={28} className="fill-emerald-500/10" />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                Payment Authorized Successfully
              </p>
              <h1 className="text-xl md:text-2xl font-black uppercase tracking-tighter">
                Transaction Receipt
              </h1>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-300 rounded-xl text-xs font-black uppercase tracking-wider transition-all cursor-pointer print:hidden"
          >
            <Printer size={14} /> Print Statement
          </button>
        </div>

        {/* Audit Meta Grid Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-6 my-4 bg-slate-50/50 dark:bg-zinc-900/20 rounded-2xl border border-slate-100/50 dark:border-zinc-900/40 px-4">
          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <Hash size={10} /> Reference Code
            </span>
            <p
              className="text-xs font-bold font-mono text-slate-900 dark:text-zinc-200 truncate"
              title={reference}
            >
              {reference}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <Calendar size={10} /> Settlement Date
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-zinc-200">
              {orderData.date}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <User size={10} /> Account Identity
            </span>
            <p className="text-xs font-bold text-slate-900 dark:text-zinc-200 truncate">
              {user?.firstName || 'Learner Profile'}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[9px] font-black uppercase tracking-wider text-slate-400 dark:text-zinc-500 flex items-center gap-1">
              <CreditCard size={10} /> Settlement Path
            </span>
            <div className="text-xs font-bold text-slate-900 dark:text-zinc-200 flex items-center gap-1">
              {renderGatewayDetails()}
            </div>
          </div>
        </div>

        {/* Extra Card-specific details if populated from Gateway logs */}
        {orderData.cardDetails &&
          (orderData.cardDetails.bank || orderData.cardDetails.last4) && (
            <div className="mb-6 p-4 rounded-xl border border-slate-100 dark:border-zinc-900 bg-slate-50/30 dark:bg-zinc-900/10 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs font-medium text-slate-500 dark:text-zinc-400">
              {orderData.cardDetails.bank && (
                <span className="flex items-center gap-1.5">
                  <Building size={13} className="text-slate-400" />
                  Institution:{' '}
                  <strong className="text-slate-800 dark:text-zinc-300 font-bold uppercase">
                    {orderData.cardDetails.bank}
                  </strong>
                </span>
              )}
              {orderData.cardDetails.cardType && (
                <span className="flex items-center gap-1.5">
                  <CreditCard size={13} className="text-slate-400" />
                  Channel Type:{' '}
                  <strong className="text-slate-800 dark:text-zinc-300 font-bold uppercase">
                    {orderData.cardDetails.cardType}
                  </strong>
                </span>
              )}
              {orderData.cardDetails.last4 && (
                <span className="flex items-center gap-1.5 font-mono">
                  Number Matrix:{' '}
                  <strong className="text-slate-800 dark:text-zinc-200">
                    •••• •••• •••• {orderData.cardDetails.last4}
                  </strong>
                </span>
              )}
            </div>
          )}

        {/* Itemized Course Summary Breakdowns */}
        <div className="space-y-4 my-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 border-b border-slate-100 dark:border-zinc-900 pb-2">
            Manifest Item Breakdown
          </h3>

          <div className="divide-y divide-slate-100 dark:divide-zinc-900">
            {orderData.items.map((item) => (
              <div
                key={item._id}
                className="py-4 flex items-start justify-between gap-4 first:pt-0 last:pb-0"
              >
                <div className="space-y-1">
                  <h4 className="font-black uppercase tracking-tight text-sm text-slate-900 dark:text-zinc-100 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-[10px] font-black text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Full Digital Access Provisioned &bull; License Active
                  </p>
                </div>
                <span className="text-sm font-bold font-mono tracking-tight text-slate-900 dark:text-zinc-100 shrink-0">
                  ₦{item.price.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Calculation Balance Ledger Sheet */}
        <div className="border-t border-slate-100 dark:border-zinc-900 pt-6 mt-8 max-w-sm ml-auto space-y-3 text-xs md:text-sm font-medium text-slate-500 dark:text-zinc-400">
          <div className="flex justify-between">
            <span>Subtotal Balance</span>
            <span className="font-bold text-slate-900 dark:text-zinc-200 font-mono">
              ₦{orderData.subtotal.toLocaleString()}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Value Added Tax (7.5%)</span>
            <span className="font-bold text-slate-900 dark:text-zinc-200 font-mono">
              ₦{orderData.tax.toLocaleString()}
            </span>
          </div>
          <div className="h-px bg-slate-100 dark:bg-zinc-900 my-1" />
          <div className="flex justify-between text-base font-black text-slate-900 dark:text-zinc-100">
            <span className="italic uppercase tracking-tight">
              Total Settled Amount
            </span>
            <span className="font-mono text-emerald-600 dark:text-emerald-400">
              ₦{orderData.total.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Security / Closing Footer Sign-off */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-slate-100 dark:border-zinc-900 pt-8 mt-10 print:hidden">
          <div className="flex items-center gap-2 text-[10px] text-slate-400 dark:text-zinc-500 uppercase tracking-wider font-bold">
            <ShieldCheck size={14} className="text-emerald-500" />
            Verified & Secured Node Entry
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              href="/dashboard/wallet"
              className="w-full sm:w-auto px-5 py-3 bg-slate-50 hover:bg-slate-100 dark:bg-zinc-900 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-300 rounded-xl font-black uppercase text-[10px] tracking-wider text-center transition-all border border-slate-200 dark:border-zinc-800"
            >
              Billing History
            </Link>
            <Link
              href="/dashboard/courses"
              className="w-full sm:w-auto px-5 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] tracking-wider text-center transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10"
            >
              Enter Classroom <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}