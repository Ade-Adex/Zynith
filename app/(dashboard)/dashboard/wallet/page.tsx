// /app/(dashboard)/wallet/page.tsx
'use client'

import React from 'react'
import { SimpleGrid, Paper, Text, Button, Center, Loader } from '@mantine/core'
import { Wallet } from 'lucide-react'
import { useAuthStore } from '@/app/store/authStore'

export default function WalletPage() {
  const { user, isAuthenticated } = useAuthStore()

  // Safely grab structural assets from user storage states
  const walletBalance = user?.wallet?.balance ?? 0
  const currencySymbol =
    user?.wallet?.currency === 'NGN' || !user?.wallet?.currency ? '₦' : '$'

  if (!user && !isAuthenticated) {
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
    <div className="py-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Balance Card */}
        <div className="lg:col-span-4">
          <Paper
            p="32px"
            radius="32px"
            className="bg-slate-900 text-white relative overflow-hidden"
          >
            <div className="relative z-10">
              <Text className="uppercase tracking-[0.3em] font-black text-[10px] opacity-60 mb-8">
                Available Balance
              </Text>
              <Text className="text-4xl font-jakarta font-black tracking-tighter mb-10">
                {currencySymbol}
                {walletBalance.toLocaleString()}
              </Text>
              <Button
                fullWidth
                radius="xl"
                color="blue"
                className="h-12 font-jakarta uppercase tracking-widest text-[11px]"
              >
                Add Funds
              </Button>
            </div>
            <Wallet className="absolute -bottom-4 -right-4 w-32 h-32 opacity-10 rotate-12" />
          </Paper>
        </div>

        {/* Marketplace Items */}
        <div className="lg:col-span-8">
          <Paper
            p="xl"
            radius="32px"
            withBorder
            className="border-slate-100 min-h-full"
          >
            <h2 className="font-jakarta font-black text-xl uppercase tracking-tighter mb-6">
              Zynith Perks
            </h2>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              <Paper
                p="md"
                radius="20px"
                className="bg-slate-50 border border-slate-100"
              >
                <Text fw={900} size="sm" className="uppercase">
                  1-on-1 Mentorship
                </Text>
                <Text size="xs" c="dimmed" mb="md">
                  15 Minute session with a Lead Engineer
                </Text>
                <Button
                  variant="white"
                  radius="md"
                  size="compact-xs"
                  className="border border-slate-200"
                >
                  5000 PTS
                </Button>
              </Paper>
            </SimpleGrid>
          </Paper>
        </div>
      </div>
    </div>
  )
}
