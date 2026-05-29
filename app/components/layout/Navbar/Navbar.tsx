// /app/components/layout/Navbar.tsx


'use client'

import { useAuthStore } from '@/app/store/authStore'
import { NAV_LINKS } from '@/app/data/navLink'
import {
  Menu,
  UnstyledButton,
  rem,
  Avatar,
  Indicator,
  Tooltip,
  Burger,
} from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import {
  LogOut,
  Search,
  Settings,
  ShoppingCart,
  User,
  LayoutDashboard,
  Zap,
  Wallet,
  Flame,
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ThemeToggle } from '@/app/components/constant/ThemeToggle'
import { useCartStore } from '@/app/store/cartStore'

export const Navbar = () => {
  // Grab hasHydrated along with your authentication variables
  const { user, logout, isAuthenticated, hasHydrated } = useAuthStore()
  const { cartItems } = useCartStore()
  const [opened, { toggle, close }] = useDisclosure(false)
  const router = useRouter()

  const formatWalletBalance = (balance?: number, currency?: string) => {
    if (balance === undefined) return '₦0'
    const symbol = currency === 'USD' ? '$' : '₦'
    return `${symbol}${balance >= 1000 ? `${(balance / 1000).toFixed(1)}k` : balance}`
  }

  return (
    <nav className="fixed top-0 w-full z-50 bg-background backdrop-blur-md border-b border-slate-300! dark:border-slate-600! px-5 md:px-16">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between relative">
        <div className="flex justify-between items-center w-1/2">
          <div className="z-10">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-black tracking-tighter uppercase italic cursor-pointer">
                Zynith<span className="text-blue-600">.</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-bold uppercase tracking-widest whitespace-nowrap">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className=" transition-colors hover:text-primary"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div className="w-1/2 flex justify-end items-center gap-2 lg:gap-4 z-10">
          <div className="hidden lg:flex items-center bg-foreground/5 dark:bg-surface rounded-full px-4 group focus-within:bg-background focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
            <Search
              size={14}
              className="text-foreground/40 group-focus-within:text-blue-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-transparent! border-none! p-0 focus:ring-0! text-sm! font-medium ml-2 w-32 xl:w-48 outline-none! text-foreground placeholder:text-foreground/40"
            />
          </div>

          <div className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-foreground/5 dark:hover:bg-surface transition-colors cursor-pointer">
            <Search size={18} className="text-foreground/70" />
          </div>

          {/* CRITICAL FIX: Check if store has fully hydrated from localStorage.
            If false, render a structural placeholder shell matching your button layout 
            to hold the layout spacing without showing wrong states.
          */}
          {!hasHydrated ? (
            <div className="hidden md:block w-[80px] h-9" />
          ) : isAuthenticated && user ? (
            <div className="flex items-center gap-2 md:gap-3">
              <div className="hidden sm:flex items-center gap-3 border border-slate-300 dark:border-slate-700 px-3 py-1.5 rounded-full">
                <Tooltip label="Daily Streak">
                  <div className="flex items-center gap-1">
                    <Flame
                      size={14}
                      className="text-orange-500 fill-orange-500"
                    />
                    <span className="text-[11px] font-bold">
                      {user.stats?.streakDays ?? 1}
                    </span>
                  </div>
                </Tooltip>
                <div className="w-px h-3 " />
                <Tooltip label="Wallet Balance">
                  <div className="flex items-center gap-1">
                    <Wallet size={14} className="text-blue-600" />
                    <span className="text-[11px] font-bold">
                      {formatWalletBalance(
                        user.wallet?.balance,
                        user.wallet?.currency,
                      )}
                    </span>
                  </div>
                </Tooltip>
              </div>

              <Indicator
                size={20}
                label={cartItems.length.toString()}
                color="blue"
                withBorder
                offset={4}
                radius="xl"
                disabled={cartItems.length === 0}
                inline
                styles={{
                  indicator: {
                    fontSize: rem(9),
                    fontWeight: 900,
                  },
                }}
              >
                <Tooltip label="Your Cart">
                  <UnstyledButton
                    onClick={() => router.push('/cart')}
                    className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                  >
                    <ShoppingCart
                      size={18}
                      className="text-slate-600 dark:text-slate-400"
                    />
                  </UnstyledButton>
                </Tooltip>
              </Indicator>

              <Menu
                shadow="md"
                width={240}
                radius="lg"
                transitionProps={{ transition: 'pop-top-right' }}
                offset={12}
                styles={{
                  dropdown: {
                    backgroundColor: 'var(--background)',
                    borderColor: 'var(--border)',
                    padding: '6px',
                  },
                  item: {
                    color: 'var(--foreground)',
                    transition: 'background-color 0.15s ease, color 0.15s ease',
                  },
                  label: {
                    color: 'var(--foreground)',
                    opacity: 0.4,
                  },
                  divider: {
                    borderColor: 'var(--border)',
                  },
                }}
              >
                <Menu.Target>
                  <UnstyledButton className="group">
                    <Indicator
                      inline
                      size={10}
                      offset={2}
                      position="bottom-end"
                      color="green"
                      withBorder
                      styles={{
                        indicator: {
                          borderColor: 'var(--surface) !important',
                        },
                      }}
                    >
                      <Avatar
                        src={user.avatar}
                        radius="xl"
                        className="w-8 h-8 md:w-9 md:h-9 border-2 border-transparent group-hover:border-blue-600 transition-all"
                      />
                    </Indicator>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown>
                  <Menu.Label className="text-[10px] uppercase tracking-tighter font-black">
                    Account
                  </Menu.Label>

                  <Menu.Item
                    component={Link}
                    href="/dashboard"
                    className="hover:bg-foreground/5"
                    leftSection={
                      <LayoutDashboard
                        size={14}
                        className="text-blue-600 dark:text-blue-400"
                      />
                    }
                  >
                    <span className="text-xs font-bold">Dashboard</span>
                  </Menu.Item>

                  <Menu.Item
                    leftSection={<User size={14} className="opacity-70" />}
                    className="hover:bg-foreground/5"
                  >
                    <span className="text-xs font-bold">My Profile</span>
                  </Menu.Item>

                  <Menu.Item
                    className="hover:bg-foreground/5"
                    leftSection={
                      <Zap
                        size={14}
                        className="text-orange-500 dark:text-orange-400"
                      />
                    }
                  >
                    <span className="text-xs font-bold">Upgrade to Pro</span>
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Label className="text-[10px] uppercase tracking-tighter font-black">
                    Settings
                  </Menu.Label>

                  <Menu.Item
                    leftSection={<Settings size={14} className="opacity-70" />}
                    className="hover:bg-foreground/5"
                  >
                    <span className="text-xs font-bold">Account Settings</span>
                  </Menu.Item>

                  <Menu.Item
                    onClick={logout}
                    color="red"
                    leftSection={<LogOut size={14} />}
                    className="hover:bg-red-500/10"
                  >
                    <span className="text-xs font-bold">Sign Out</span>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          ) : (
            <button
              className="hidden! md:flex! btn-primary"
              onClick={() => router.push('/auth')}
            >
              Sign In
            </button>
          )}

          <ThemeToggle />

          <div className="md:hidden">
            <Menu
              shadow="md"
              width="100%"
              offset={15}
              radius={0}
              opened={opened}
              onClose={close}
              styles={{
                dropdown: {
                  backgroundColor: 'var(--background)',
                  borderColor: 'var(--border)',
                },
                item: {
                  '&:hover': {
                    backgroundColor: 'rgba(var(--foreground), 0.05)',
                  },
                },
              }}
            >
              <Menu.Target>
                <Burger
                  opened={opened}
                  onClick={toggle}
                  size="sm"
                  lineSize={2}
                  className="text-foreground"
                />
              </Menu.Target>
              <Menu.Dropdown className="h-[calc(100vh-64px)] md:h-auto p-4 bg-surface border-border pt-10!">
                {NAV_LINKS.map((link) => (
                  <Menu.Item
                    key={link.label}
                    component={Link}
                    href={link.href}
                    onClick={close}
                    className="hover:bg-foreground/5 dark:hover:bg-background transition-colors rounded-lg"
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest py-2 block text-foreground">
                      {link.label}
                    </span>
                  </Menu.Item>
                ))}

                {/* Handle mobile menu hydration safety cleanly as well */}
                {!hasHydrated ? null : isAuthenticated ? (
                  <Menu.Item
                    component={Link}
                    href="/dashboard"
                    onClick={close}
                    className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors rounded-lg"
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 py-2 block">
                      Go to Dashboard
                    </span>
                  </Menu.Item>
                ) : (
                  <Menu.Item
                    onClick={() => {
                      router.push('/auth')
                      close()
                    }}
                    className="hover:bg-blue-50 dark:hover:bg-blue-950/30 transition-colors rounded-lg"
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 dark:text-blue-400 py-2 block">
                      Sign In
                    </span>
                  </Menu.Item>
                )}
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}