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
} from '@mantine/core'
import {
  CreditCard,
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
          {/* Center: Nav Links - Hidden on mobile/tablet */}
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
          {/* Search Bar - hidden on md/lg to prevent overlap, visible on xl */}
          <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg transition-all focus-within:border-blue-400 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-50">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none text-[11px]! focus:outline-none w-28 lg:w-36 font-medium"
            />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 md:gap-3">
              {/* Gamification Stats */}
              <div className="hidden sm:flex items-center gap-2">
                {/* Streak */}
                <Tooltip label="12 Day Streak" withArrow position="bottom">
                  <div className="flex items-center gap-1 px-2 py-1 bg-orange-50 rounded-lg border border-orange-100">
                    <Flame
                      size={12}
                      className="text-orange-500 fill-orange-500"
                    />
                    <span className="text-[10px] font-black text-orange-600">
                      {MOCK_USER.stats.streakDays}
                    </span>
                  </div>
                </Tooltip>

                {/* Points */}
                <div className="flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 rounded-full border border-blue-100">
                  <Zap size={12} className="text-blue-600 fill-blue-600" />
                  <span className="text-[10px] font-black text-blue-600 uppercase hidden lg:inline">
                    {MOCK_USER.stats.points.toLocaleString()} PTS
                  </span>
                  <span className="text-[10px] font-black text-blue-600 lg:hidden">
                    {MOCK_USER.stats.points}
                  </span>
                </div>
              </div>

              {/* Cart */}
              <button className="relative p-2 text-slate-600 hover:text-blue-600 transition-colors">
                <ShoppingCart size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
              </button>

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
                        alt={MOCK_USER.name}
                        radius="xl"
                        className="w-8 h-8 md:w-9 md:h-9 border-2 border-transparent group-hover:border-blue-600 transition-all"
                      />
                    </Indicator>
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown className="border-slate-100 p-2 shadow-xl">
                  {/* Account Header */}
                  <div className="px-3 py-3 mb-2 bg-slate-50 rounded-2xl">
                    <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest mb-1">
                      {MOCK_USER.role} Account
                    </p>
                    <p className="text-xs font-black truncate">
                      {MOCK_USER.name}
                    </p>
                    <p className="text-[10px] font-medium text-slate-500 truncate">
                      {MOCK_USER.email}
                    </p>
                  </div>

                  {/* Wallet Balance */}
                  <div className="px-3 py-2 mb-2 border border-slate-100 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Wallet size={12} className="text-slate-400" />
                      <span className="text-[10px] font-bold text-slate-600">
                        Wallet
                      </span>
                    </div>
                    <span className="text-[10px] font-black text-slate-900">
                      ₦{MOCK_USER.wallet.balance.toLocaleString()}
                    </span>
                  </div>

                  <Menu.Label className="text-[9px] font-black uppercase tracking-widest">
                    Platform
                  </Menu.Label>
                  <Menu.Item
                    component={Link}
                    href="/dashboard"
                    leftSection={
                      <LayoutDashboard
                        style={{ width: rem(14), height: rem(14) }}
                      />
                    }
                  >
                    <span className="text-[11px] font-bold">LMS Dashboard</span>
                  </Menu.Item>

                  <Menu.Label className="text-[9px] font-black uppercase tracking-widest mt-2">
                    Personal
                  </Menu.Label>
                  <Menu.Item
                    leftSection={
                      <User style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    <span className="text-[11px] font-bold">My Profile</span>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <Settings style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    <span className="text-[11px] font-bold">Settings</span>
                  </Menu.Item>

                  <Menu.Divider />

                  <Menu.Item
                    color="red"
                    leftSection={
                      <LogOut style={{ width: rem(14), height: rem(14) }} />
                    }
                    onClick={logout}
                  >
                    <span className="text-[11px] font-bold">Logout</span>
                  </Menu.Item>
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

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Menu shadow="md" width="100%" offset={15} radius={0}>
              <Menu.Target>
                <button className="p-2 text-slate-900">
                  <MenuIcon size={20} />
                </button>
              </Menu.Target>

              <Menu.Dropdown className="h-screen p-4">
                {NAV_LINKS.map((link) => (
                  <Menu.Item key={link.label} component={Link} href={link.href}>
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      {link.label}
                    </span>
                  </Menu.Item>
                ))}
                {isAuthenticated && (
                  <Menu.Item component={Link} href="/dashboard">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-blue-600">
                      Dashboard
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
