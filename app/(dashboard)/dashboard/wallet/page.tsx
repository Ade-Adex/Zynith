// /app/(dashboard)/wallet/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import {
  SimpleGrid,
  Paper,
  Text,
  Button,
  Center,
  Loader,
  Badge,
  Tooltip,
} from '@mantine/core'
import { Wallet, FileText, ArrowUpRight, Award } from 'lucide-react'
import { useAuthStore } from '@/app/store/authStore'
import {
  getWalletDashboardData,
  SerializedMarketplaceItem,
  SerializedTransactionHistory,
} from '@/app/services/walletActions'
import { UserType } from '@/app/types/user'
import Link from 'next/link'

// Core Fix: Standardize fractional decimal limits across the ledger UI
const currencyFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
}

export default function WalletPage() {
  const { user: rawUser, isAuthenticated } = useAuthStore()
  const user = rawUser as UserType | null

  const [loading, setLoading] = useState<boolean>(true)
  const [perks, setPerks] = useState<SerializedMarketplaceItem[]>()
  const [history, setHistory] = useState<SerializedTransactionHistory[]>()

  console.log('history', history)

  const walletBalance = user?.wallet?.balance ?? 0
  const userPoints = user?.stats?.points ?? 0
  const currencySymbol =
    user?.wallet?.currency === 'NGN' || !user?.wallet?.currency ? '₦' : '$'

  useEffect(() => {
    async function loadData() {
      if (user?._id) {
        const response = await getWalletDashboardData(user._id)
        if (response.success) {
          setPerks(response.marketplaceItems)
          setHistory(response.historyItems)
        }
        setLoading(false)
      }
    }
    if (user) loadData()
  }, [user?._id])

  if ((!user && !isAuthenticated) || loading) {
    return (
      <Center className="py-32">
        <div className="flex flex-col items-center gap-3">
          <Loader size="sm" color="blue" />
          <Text
            size="xs"
            fw={700}
            className="uppercase tracking-widest text-slate-400"
          >
            Connecting Ledger Registry...
          </Text>
        </div>
      </Center>
    )
  }

  return (
    <div className="py-6 space-y-8">
      <div className="flex flex-col gap-1">
        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-600 dark:text-blue-400">
          Financial Hub
        </p>
        <h1 className="text-2xl md:text-3xl font-black uppercase tracking-tighter text-slate-900 dark:text-slate-100">
          Billing & Workspace Marketplace
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Financial Balance Assets */}
        <div className="lg:col-span-4 space-y-6">
          <Paper
            p="32px"
            radius="24px"
            className="bg-slate-950 border border-slate-900 text-white relative overflow-hidden shadow-2xl"
          >
            <div className="relative z-10">
              <Text className="uppercase tracking-[0.3em] font-black text-[10px] text-slate-400 mb-6">
                Available Cash Balance
              </Text>
              <Text className="text-4xl font-black tracking-tighter mb-8 text-slate-100">
                {currencySymbol}
                {walletBalance.toLocaleString('en-US', currencyFormatOptions)}
              </Text>
              <Button
                fullWidth
                radius="xl"
                color="blue"
                className="h-11 font-bold uppercase tracking-widest text-[10px] bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                Add Funds
              </Button>
            </div>
            <Wallet className="absolute -bottom-4 -right-4 w-32 h-32 text-slate-900 opacity-40 rotate-12 pointer-events-none" />
          </Paper>

          <Paper
            p="24px"
            radius="24px"
            withBorder
            className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/30 rounded-xl">
                <Award className="text-amber-500" size={20} />
              </div>
              <div>
                <Text className="uppercase tracking-widest font-black text-[9px] text-slate-400">
                  Accumulated Rewards
                </Text>
                <Text className="text-lg font-black tracking-tight text-slate-900 dark:text-slate-100">
                  {userPoints.toLocaleString()}{' '}
                  <span className="text-xs text-slate-400">PTS</span>
                </Text>
              </div>
            </div>
          </Paper>
        </div>

        {/* Right Column: Dynamic Marketplace Items */}
        <div className="lg:col-span-8">
          <Paper
            p="xl"
            radius="24px"
            withBorder
            className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 min-h-full"
          >
            <h2 className="font-black text-sm uppercase tracking-widest text-slate-400 mb-6">
              Premium Upgrades Available
            </h2>

            {perks && perks.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                {perks.map((item) => (
                  <Paper
                    key={item._id}
                    p="lg"
                    radius="16px"
                    className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 flex flex-col justify-between gap-4 group hover:border-blue-200 dark:hover:border-blue-900/40 transition-all duration-200"
                  >
                    <div>
                      <Badge
                        size="xs"
                        color="blue"
                        variant="light"
                        className="mb-2 font-black tracking-wider uppercase"
                      >
                        {item.tag}
                      </Badge>
                      <Text
                        fw={900}
                        size="sm"
                        className="text-slate-900 dark:text-slate-100 line-clamp-1 uppercase tracking-tight"
                      >
                        {item.title}
                      </Text>
                      <Text
                        size="xs"
                        className="text-slate-400 dark:text-slate-500 font-medium"
                      >
                        Instructor: {item.instructor}
                      </Text>
                    </div>
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/60">
                      <Text className="font-mono font-bold text-slate-800 dark:text-slate-200">
                        {currencySymbol}
                        {item.price.toLocaleString(
                          'en-US',
                          currencyFormatOptions,
                        )}
                      </Text>
                      <Button
                        variant="white"
                        radius="md"
                        size="xs"
                        className="border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-zinc-300 hover:text-blue-600 dark:hover:text-blue-400 font-bold uppercase tracking-wider text-[10px]"
                      >
                        Acquire Course
                      </Button>
                    </div>
                  </Paper>
                ))}
              </SimpleGrid>
            ) : (
              <Text
                size="xs"
                className="text-slate-400 font-bold uppercase tracking-wide py-4"
              >
                No advanced workspace items listed at this time.
              </Text>
            )}
          </Paper>
        </div>
      </div>

      {/* Full-width Transaction Ledger Section */}
      <Paper
        radius="24px"
        withBorder
        className="bg-white dark:bg-slate-950 border-slate-100 dark:border-slate-800 overflow-hidden shadow-sm"
      >
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
          <h2 className="text-xs font-black uppercase tracking-widest text-slate-400">
            System Billing Statements
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-[10px] font-black uppercase tracking-wider text-slate-400 dark:text-slate-500">
                <th className="py-4 px-6">Reference Code</th>
                <th className="py-4 px-6">Date</th>
                <th className="py-4 px-6">Product Description</th>
                <th className="py-4 px-6">Amount Settled</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-900/40 text-xs font-semibold text-slate-700 dark:text-slate-300">
              {history && history.length > 0 ? (
                history.map((tx) => (
                  <tr
                    key={tx.reference}
                    className="hover:bg-slate-50/30 dark:hover:bg-slate-900/10 transition-colors group"
                  >
                    <td className="py-4 px-6 font-mono text-[11px] font-bold text-slate-900 dark:text-slate-100">
                      {tx.reference}
                    </td>
                    <td className="py-4 px-6 text-slate-400 dark:text-slate-500">
                      {tx.date}
                    </td>

                    <td className="py-4 px-6 text-slate-800 dark:text-slate-200 font-bold truncate max-w-xs">
                      <Tooltip
                        label={tx.courseTitle}
                        position="top-start"
                        withArrow
                        events={{ hover: true, focus: true, touch: false }}
                      >
                        <div className="truncate cursor-help">
                          {tx.courseTitle}
                        </div>
                      </Tooltip>
                    </td>

                    <td className="py-4 px-6 font-mono font-bold italic text-slate-900 dark:text-slate-100">
                      {currencySymbol}
                      {tx.amount.toLocaleString('en-US', currencyFormatOptions)}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <Link
                        href={`/dashboard/wallet/receipt/${tx.reference}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 dark:text-zinc-400 hover:border-blue-200 dark:hover:border-blue-900/50 transition-all text-[10px] font-black uppercase tracking-wider"
                      >
                        <FileText size={12} /> View Receipt
                        <ArrowUpRight
                          size={10}
                          className="opacity-0 group-hover:opacity-100 transition-opacity"
                        />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-slate-400 uppercase tracking-wider text-[10px] font-black"
                  >
                    No payment sequences recorded in database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Paper>
    </div>
  )
}