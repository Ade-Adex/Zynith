// /app/(dashboard)/dashboard/wallet/receipt/[reference]/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
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

const currencyFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}

export default function PaymentReceiptPage() {
  const params = useParams()
  const reference = Array.isArray(params?.reference)
    ? params.reference[0]
    : (params?.reference as string)

  const { user: rawUser } = useAuthStore()
  const user = rawUser as UserType | null

  const [loading, setLoading] = useState(true)
  const [orderData, setOrderData] = useState<OrderData | null>(null)

  useEffect(() => {
    if (!reference || !user?._id) return

    const fetchReceiptDetails = async () => {
      try {
        const response = await getReceiptDetailsByReference(reference, user._id)
        if (response.success && response.data) {
          setOrderData(response.data as OrderData)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchReceiptDetails()
  }, [reference, user?._id])

  const handlePrint = () => window.print()

  const renderGatewayDetails = () => {
    if (!orderData) return null

    switch (orderData.gateway) {
      case 'WALLET':
        return (
          <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
            <Wallet2 size={12} /> Wallet
          </span>
        )
      case 'PAYSTACK':
        return (
          <span className="flex items-center gap-1 text-teal-600 dark:text-teal-400">
            <CreditCard size={12} /> Paystack
          </span>
        )
      case 'STRIPE':
        return (
          <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">
            <CreditCard size={12} /> Stripe
          </span>
        )
      default:
        return orderData.gateway
    }
  }

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-t-blue-600 border-slate-200 dark:border-zinc-800 rounded-full animate-spin mx-auto" />
          <p className="text-[10px] sm:text-xs font-black uppercase tracking-widest text-slate-400">
            Loading receipt...
          </p>
        </div>
      </div>
    )
  }

  if (!orderData) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-sm text-center border rounded-2xl p-6 sm:p-8 bg-white dark:bg-zinc-950">
          <Hash className="mx-auto text-red-500 mb-3" />
          <h3 className="text-sm font-black uppercase">Not Found</h3>
          <p className="text-xs text-slate-500 mt-2 break-words">
            Reference: {reference}
          </p>

          <Link
            href="/dashboard/wallet"
            className="inline-flex mt-5 text-xs font-bold text-blue-600 gap-2"
          >
            <ArrowLeft size={14} /> Back
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full px-3 sm:px-6 py-6 sm:py-10 max-w-5xl mx-auto print:max-w-full print:py-0">

      {/* Back */}
      <div className="mb-4 print:hidden">
        <Link
          href="/dashboard/wallet"
          className="text-xs font-bold flex items-center gap-2 text-slate-500"
        >
          <ArrowLeft size={14} /> Back
        </Link>
      </div>

      <div className="bg-white dark:bg-zinc-950 border rounded-xl sm:rounded-2xl p-4 sm:p-8 md:p-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6">
          <div className="flex items-start gap-3 sm:gap-4">
            <CheckCircle2 className="text-emerald-500 shrink-0" />
            <div>
              <p className="text-[9px] sm:text-[10px] font-black uppercase text-emerald-500">
                Payment Successful
              </p>
              <h1 className="text-lg sm:text-2xl font-black">
                Transaction Receipt
              </h1>
            </div>
          </div>

          <button
            onClick={handlePrint}
            className="w-full sm:w-auto text-xs font-black px-4 py-2 border rounded-lg print:hidden"
          >
            <Printer size={14} className="inline mr-2" />
            Print
          </button>
        </div>

        {/* GRID (FIXED RESPONSIVE) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mt-6 bg-slate-50 dark:bg-zinc-900 p-4 rounded-xl">

          <div className="min-w-0">
            <p className="text-[9px] uppercase text-slate-400 flex items-center gap-1">
              <Hash size={10} /> Ref
            </p>
            <p className="text-xs font-mono break-all">{reference}</p>
          </div>

          <div>
            <p className="text-[9px] uppercase text-slate-400 flex items-center gap-1">
              <Calendar size={10} /> Date
            </p>
            <p className="text-xs">{orderData.date}</p>
          </div>

          <div>
            <p className="text-[9px] uppercase text-slate-400 flex items-center gap-1">
              <User size={10} /> User
            </p>
            <p className="text-xs truncate">
              {user?.firstName || 'User'}
            </p>
          </div>

          <div>
            <p className="text-[9px] uppercase text-slate-400 flex items-center gap-1">
              <CreditCard size={10} /> Method
            </p>
            <div className="text-xs">{renderGatewayDetails()}</div>
          </div>
        </div>

        {/* ITEMS */}
        <div className="mt-6 space-y-4">
          {orderData.items.map(item => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b pb-4"
            >
              <p className="text-sm font-bold break-words">
                {item.title}
              </p>
              <p className="text-sm font-mono">
                ₦{item.price.toLocaleString('en-US', currencyFormatOptions)}
              </p>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div className="mt-6 ml-auto max-w-full sm:max-w-sm space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>₦{orderData.subtotal.toLocaleString('en-US', currencyFormatOptions)}</span>
          </div>

          <div className="flex justify-between">
            <span>Tax</span>
            <span>₦{orderData.tax.toLocaleString('en-US', currencyFormatOptions)}</span>
          </div>

          <div className="border-t pt-2 flex justify-between font-black">
            <span>Total</span>
            <span className="text-emerald-500">
              ₦{orderData.total.toLocaleString('en-US', currencyFormatOptions)}
            </span>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex flex-col sm:flex-row gap-3 sm:items-center justify-between mt-8 pt-6 border-t print:hidden">
          <div className="flex items-center gap-2 text-[10px] text-slate-400">
            <ShieldCheck size={14} /> Secure
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <Link
              href="/dashboard/wallet"
              className="text-xs text-center px-4 py-2 border rounded-lg"
            >
              History
            </Link>
            <Link
              href="/dashboard/courses"
              className="text-xs text-center px-4 py-2 bg-blue-600 text-white rounded-lg flex items-center justify-center gap-2"
            >
              Classroom <ArrowRight size={14} />
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
          }
