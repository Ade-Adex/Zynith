'use client'

import { useAuth } from '@/app/context/AuthContext'
import { NAV_LINKS } from '@/app/data'
import { MOCK_USER } from '@/app/data/mockUser'
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
  Menu as MenuIcon,
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

export const Navbar = () => {
  const { user, logout, login, isAuthenticated } = useAuth()

  const [opened, { toggle, close }] = useDisclosure(false)

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100 px-5 md:px-16">
      <div className="max-w-7xl mx-auto h-16 flex items-center justify-between relative">
        <div className="flex justify-between items-center w-1/2">
          {/* Left: Logo */}
          <div className="z-10">
            <Link href="/" className="flex items-center">
              <span className="text-lg font-black tracking-tighter uppercase italic cursor-pointer">
                Zynith<span className="text-blue-600">.</span>
              </span>
            </Link>
          </div>

          {/* Center: Nav Links */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500 whitespace-nowrap">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="hover:text-blue-600 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="w-1/2 flex justify-end items-center gap-2 lg:gap-4 z-10">
          {/* Search Bar */}
          <div className="hidden lg:flex items-center bg-slate-100 rounded-full px-4 py-3 group focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-600/20 transition-all">
            <Search
              size={14}
              className="text-slate-400 group-focus-within:text-blue-600"
            />
            <input
              type="text"
              placeholder="Search courses..."
              className="bg-transparent border-none focus:ring-0 text-xs! font-medium ml-2 w-32 xl:w-48 outline-none"
            />
          </div>

          {/* Mobile Search Icon */}
          <div className="lg:hidden flex items-center justify-center w-9 h-9 rounded-full hover:bg-slate-100 transition-colors cursor-pointer">
            <Search size={18} className="text-slate-600" />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-3">
              {/* User Stats: Streak & Wallet */}
              <div className="hidden sm:flex items-center gap-3 bg-slate-50 border border-slate-100 px-3 py-1.5 rounded-full">
                <Tooltip label="Daily Streak">
                  <div className="flex items-center gap-1">
                    <Flame
                      size={14}
                      className="text-orange-500 fill-orange-500"
                    />
                    <span className="text-[11px] font-bold">12</span>
                  </div>
                </Tooltip>
                <div className="w-px h-3 bg-slate-200" />
                <Tooltip label="Wallet Balance">
                  <div className="flex items-center gap-1">
                    <Wallet size={14} className="text-blue-600" />
                    <span className="text-[11px] font-bold">₦12.5k</span>
                  </div>
                </Tooltip>
              </div>

              {/* Shopping Cart */}
              <Indicator
                size={20} 
                label="2"
                color="blue"
                withBorder
                offset={4} 
                radius="xl" 
                inline 
                styles={{
                  indicator: {
                    fontSize: rem(9),
                    fontWeight: 900,
                  },
                }}
              >
                <Tooltip label="Your Cart">
                  <UnstyledButton className="w-9 h-9 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">
                    <ShoppingCart size={18} className="text-slate-600" />
                  </UnstyledButton>
                </Tooltip>
              </Indicator>

              {/* User Dropdown */}
              <Menu
                shadow="md"
                width={240}
                radius="xl"
                transitionProps={{ transition: 'pop-top-right' }}
                offset={12}
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
                    >
                      <Avatar
                        src={MOCK_USER.avatar}
                        radius="xl"
                        className="w-8 h-8 md:w-9 md:h-9 border-2 border-transparent group-hover:border-blue-600 transition-all"
                      />
                    </Indicator>
                  </UnstyledButton>
                </Menu.Target>
                <Menu.Dropdown>
                  {/* User Menu Items  */}

                  <Menu.Label className="text-[10px] uppercase tracking-tighter font-black text-slate-400">
                    Account
                  </Menu.Label>

                  <Menu.Item
                    component={Link}
                    href="/dashboard"
                    leftSection={
                      <LayoutDashboard size={14} className="text-blue-600" />
                    }
                  >
                    <span className="text-xs font-bold">Dashboard</span>
                  </Menu.Item>

                  <Menu.Item leftSection={<User size={14} />}>
                    <span className="text-xs font-bold">My Profile</span>
                  </Menu.Item>

                  <Menu.Item
                    leftSection={<Zap size={14} className="text-orange-500" />}
                  >
                    <span className="text-xs font-bold">Upgrade to Pro</span>
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Label className="text-[10px] uppercase tracking-tighter font-black text-slate-400">
                    Settings
                  </Menu.Label>

                  <Menu.Item leftSection={<Settings size={14} />}>
                    <span className="text-xs font-bold">Account Settings</span>
                  </Menu.Item>

                  <Menu.Item
                    onClick={logout}
                    color="red"
                    leftSection={<LogOut size={14} />}
                  >
                    <span className="text-xs font-bold">Sign Out</span>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          ) : (
            <button
              className="bg-slate-900 text-white px-5 py-2! rounded-xl text-sm! font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 cursor-pointer"
              onClick={login}
            >
              Sign In
            </button>
          )}

          {/* 4. Enhanced Mobile Menu with Animated Burger */}
          <div className="md:hidden">
            <Menu
              shadow="md"
              width="100%"
              offset={15}
              radius={0}
              opened={opened} // Bind to state
              onClose={close} // Handle backdrop clicks
            >
              <Menu.Target>
                {/* The Sleek Animated Burger */}
                <Burger
                  opened={opened}
                  onClick={toggle}
                  size="sm"
                  lineSize={2}
                  className="text-slate-900"
                />
              </Menu.Target>

              <Menu.Dropdown className="h-[calc(100vh-64px)] md:h-auto p-4">
                {NAV_LINKS.map((link) => (
                  <Menu.Item
                    key={link.label}
                    component={Link}
                    href={link.href}
                    onClick={close}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest py-2 block">
                      {link.label}
                    </span>
                  </Menu.Item>
                ))}

                {isAuthenticated && (
                  <Menu.Item component={Link} href="/dashboard" onClick={close}>
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 py-2 block">
                      Go to Dashboard
                    </span>
                  </Menu.Item>
                )}

                {!isAuthenticated && (
                  <Menu.Item
                    onClick={() => {
                      login()
                      close()
                    }}
                  >
                    <span className="text-[11px] font-black uppercase tracking-widest text-blue-600 py-2 block">
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
