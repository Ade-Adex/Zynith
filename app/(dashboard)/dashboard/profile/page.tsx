'use client'

import React from 'react'
import {
  Text,
  Group,
  Badge,
  Paper,
  Stack,
  rem,
  Avatar,
  TextInput,
  SimpleGrid,
} from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import {
  User as UserIcon,
  Mail,
  Wallet,
  Shield,
  KeyRound,
  CheckCircle2,
  CalendarDays,
  CircleDollarSign,
  Zap,
  Flame,
  Award,
  Star,
} from 'lucide-react'

import { useAuthStore } from '@/app/store/authStore'

export default function ProfilePage() {
  const store = useAuthStore()
  const authUser = store.user

  const isMobile = useMediaQuery(`(max-width: ${rem(768)})`)

  const walletCurrency = authUser?.wallet?.currency === 'USD' ? '$' : '₦'

  // Format the explicit joinedAt property from your MongoDB schema structure
  const formattedJoinDate = authUser?.joinedAt
    ? new Date(authUser.joinedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Active Session'

  if (!authUser) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Text
          size="xs"
          fw={800}
          className="uppercase tracking-[0.25em] text-slate-500"
        >
          No Authenticated Session Found...
        </Text>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground py-6 md:py-10">
      {/* HEADER HERO */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div className="flex items-start gap-4">
          <Avatar
            radius="xl"
            size={isMobile ? 64 : 80}
            src={authUser.avatar || undefined}
            className="bg-blue-600 text-white shadow-lg border-2 border-blue-500"
          >
            {!authUser.avatar && (authUser.firstName?.slice(0, 1) || 'U')}
          </Avatar>

          <div>
            <Badge
              variant="light"
              color="blue"
              radius="sm"
              className="uppercase tracking-[0.2em] font-black mb-2"
            >
              Account Security Center
            </Badge>

            <h1 className="text-2xl md:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {authUser.name || `${authUser.firstName} ${authUser.lastName}`}
              <span className="text-blue-600">.</span>
            </h1>

            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md leading-relaxed">
              Manage your core workspace credentials, token metrics, and
              identity parameters.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* LEFT PANEL: EXACT SCHEMA FIELD MAPPINGS */}
        <div className="xl:col-span-8 space-y-6">
          <Paper
            radius="24px"
            p={isMobile ? 'sm' : 'lg'}
            withBorder
            className="bg-surface! surface-border"
          >
            <Group
              justify="space-between"
              mb="xl"
              className="border-b surface-border pb-4"
            >
              <div>
                <Text
                  fw={900}
                  className="uppercase tracking-[0.2em] text-sm! text-slate-500"
                >
                  Personal Matrix
                </Text>
                <Text className="text-slate-400 text-[12px]! mt-1">
                  Primary system values bound to your identity record.
                </Text>
              </div>
              <UserIcon size={20} className="text-blue-500" />
            </Group>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" className="mt-4">
              <TextInput
                label="FIRST NAME"
                value={authUser.firstName || ''}
                readOnly
                disabled
                radius="md"
                variant="filled"
                classNames={{
                  input:
                    'bg-slate-50! dark:bg-slate-900/50! font-bold text-slate-800 dark:text-slate-200 border-slate-200! dark:border-slate-800!',
                  label:
                    'text-[10px] tracking-widest font-black text-slate-400 mb-1.5',
                }}
              />

              <TextInput
                label="LAST NAME"
                value={authUser.lastName || ''}
                readOnly
                disabled
                radius="md"
                variant="filled"
                classNames={{
                  input:
                    'bg-slate-50! dark:bg-slate-900/50! font-bold text-slate-800 dark:text-slate-200 border-slate-200! dark:border-slate-800!',
                  label:
                    'text-[10px] tracking-widest font-black text-slate-400 mb-1.5',
                }}
              />

              <TextInput
                label="USERNAME"
                value={authUser.username ? `@${authUser.username}` : ''}
                readOnly
                disabled
                radius="md"
                variant="filled"
                classNames={{
                  input:
                    'bg-slate-50! dark:bg-slate-900/50! font-bold text-slate-800 dark:text-slate-200 border-slate-200! dark:border-slate-800!',
                  label:
                    'text-[10px] tracking-widest font-black text-slate-400 mb-1.5',
                }}
              />

              <TextInput
                label="EMAIL ADDRESS"
                value={authUser.email || ''}
                readOnly
                disabled
                radius="md"
                variant="filled"
                leftSection={<Mail size={14} className="text-slate-400" />}
                classNames={{
                  input:
                    'bg-slate-50! dark:bg-slate-900/50! font-bold text-slate-800 dark:text-slate-200 border-slate-200! dark:border-slate-800!',
                  label:
                    'text-[10px] tracking-widest font-black text-slate-400 mb-1.5',
                }}
              />

              <TextInput
                label="ACCOUNT NODE REFERENCE (ID)"
                value={authUser._id || ''}
                readOnly
                disabled
                radius="md"
                variant="filled"
                leftSection={<KeyRound size={14} className="text-slate-400" />}
                className="sm:col-span-2"
                classNames={{
                  input:
                    'bg-slate-50! dark:bg-slate-900/50! font-mono text-xs text-slate-400 border-slate-200! dark:border-slate-800!',
                  label:
                    'text-[10px] tracking-widest font-black text-slate-400 mb-1.5',
                }}
              />
            </SimpleGrid>

            {/* PLATFORM SECURITY ADVISORY */}
            <div className="mt-8 border border-dashed border-blue-200 dark:border-blue-900/50 bg-blue-50/30 dark:bg-blue-950/10 rounded-2xl p-4 flex gap-3 items-start">
              <Shield size={18} className="text-blue-500 shrink-0 mt-0.5" />
              <div>
                <Text
                  size="xs"
                  fw={800}
                  className="text-slate-900 dark:text-white uppercase tracking-wider"
                >
                  Managed Identity Protocol
                </Text>
                <Text
                  size="xs"
                  className="text-slate-500 dark:text-slate-400 mt-1 leading-relaxed"
                >
                  Verification states, system performance metrics, and asset
                  balances are tracked natively on the ledger engine. Profile
                  attributes cannot be overridden directly inside this client
                  container.
                </Text>
              </div>
            </div>
          </Paper>
        </div>

        {/* RIGHT PANEL: LIVE WALLET & SCHEMA STATUS METRICS */}
        <div className="xl:col-span-4 space-y-6">
          {/* USER LEDGER ASSET WALLET */}
          <Paper
            radius="24px"
            p={isMobile ? 'sm' : 'lg'}
            withBorder
            className="bg-surface! surface-border"
          >
            <Group justify="space-between" mb="lg">
              <Text
                fw={900}
                className="uppercase tracking-[0.2em] text-sm! text-slate-500"
              >
                Wallet Vector
              </Text>
              <CircleDollarSign size={18} className="text-green-500" />
            </Group>

            <div className=" border border-slate-800 dark:from-slate-900/40 dark:to-slate-950/40 p-6 rounded-2xl relative overflow-hidden group">
              <div className="absolute -right-6 -bottom-6 text-white/5 rotate-12 transition-transform group-hover:scale-110 duration-300">
                <Wallet size={120} />
              </div>

              <div className="relative z-10">
                <Text
                  size="10px"
                  fw={900}
                  className="uppercase tracking-[0.25em] text-slate-400"
                >
                  Available Balance
                </Text>

                <Text fw={900} className="text-3xl tracking-tight mt-2">
                  {walletCurrency}
                  {authUser.wallet?.balance?.toLocaleString() ?? 0}
                </Text>

                <div className="flex items-center gap-2 mt-4">
                  <Badge
                    color="green"
                    variant="light"
                    radius="sm"
                    className="font-black tracking-wider text-[10px]"
                  >
                    System Scope: {authUser.wallet?.currency || 'NGN'}
                  </Badge>
                </div>
              </div>
            </div>
          </Paper>

          {/* META ATTRIBUTES TIMELINE */}
          <Paper
            radius="24px"
            p={isMobile ? 'sm' : 'lg'}
            withBorder
            className="bg-surface! surface-border"
          >
            <Group justify="space-between" mb="lg">
              <Text
                fw={900}
                className="uppercase tracking-[0.2em] text-sm! text-slate-500"
              >
                Meta Definitions
              </Text>
              <CalendarDays size={18} className="text-orange-500" />
            </Group>

            <Stack gap="md">
              <div className="flex items-center justify-between border-b surface-border pb-3">
                <Text
                  size="11px"
                  fw={800}
                  className="uppercase tracking-widest text-slate-500"
                >
                  Role Authorization
                </Text>
                <Badge
                  color="blue"
                  variant="filled"
                  size="sm"
                  radius="sm"
                  className="font-black"
                >
                  {authUser.role || 'STUDENT'}
                </Badge>
              </div>

              <div className="flex items-center justify-between border-b surface-border pb-3">
                <Text
                  size="11px"
                  fw={800}
                  className="uppercase tracking-widest text-slate-500"
                >
                  Identity State
                </Text>
                <Group gap={4}>
                  <CheckCircle2 size={12} className="text-emerald-500" />
                  <Text
                    size="xs"
                    fw={800}
                    className="text-emerald-500 uppercase tracking-wider"
                  >
                    Verified Node
                  </Text>
                </Group>
              </div>

              <div className="flex items-center justify-between pt-1">
                <Text
                  size="11px"
                  fw={800}
                  className="uppercase tracking-widest text-slate-500"
                >
                  Genesis Timestamp
                </Text>
                <Text
                  size="xs"
                  fw={800}
                  className="text-slate-800 dark:text-slate-200"
                >
                  {formattedJoinDate}
                </Text>
              </div>
            </Stack>
          </Paper>
        </div>
      </div>
    </div>
  )
}
