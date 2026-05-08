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
import { useState } from 'react'

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
          {/* ... Search Bar (Same as before) ... */}

          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-3">
              {/* ... Stats & Cart (Same as before) ... */}

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
                  {/* ... User Menu Items (Same as before) ... */}
                </Menu.Dropdown>
              </Menu>
            </div>
          ) : (
            <button
              className="bg-slate-900 text-white px-5 py-1.5! rounded-xl text-xs font-black uppercase tracking-widest hover:bg-blue-600 transition-all shadow-md active:scale-95 cursor-pointer"
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

              <Menu.Dropdown className="h-[calc(100vh-64px)] p-4">
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
