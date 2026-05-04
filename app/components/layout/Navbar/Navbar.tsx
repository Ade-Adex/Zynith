'use client'

import React from 'react'
import {
  Search,
  ShoppingCart,
  Menu as MenuIcon,
  User,
  LogOut,
  Settings,
  CreditCard,
} from 'lucide-react'
import { Menu, UnstyledButton, rem } from '@mantine/core'
import { NAV_LINKS } from '@/app/data'

export const Navbar = () => {
  // Toggle this to see the different states
  const isAuthenticated = true

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between relative">
        {/* Left: Logo */}
        <div className="flex items-center z-10">
          <span className="text-lg font-black tracking-tighter uppercase italic">
            Zynith<span className="text-blue-600">.</span>
          </span>
        </div>

        {/* Center: Nav Links */}
        <div className="hidden md:flex absolute left-1/2 -translate-x-1/2 items-center gap-8 text-[11px] font-bold uppercase tracking-widest text-slate-500">
          {NAV_LINKS.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-blue-600 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-4 z-10">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg">
            <Search size={14} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent border-none text-[11px]! focus:outline-none w-24 lg:w-40 font-medium"
            />
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              <button className="relative p-2 text-slate-600 hover:text-blue-600">
                <ShoppingCart size={18} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-blue-600 rounded-full border-2 border-white" />
              </button>

              {/* Mantine User Dropdown */}
              <Menu
                shadow="md"
                width={200}
                radius="md"
                transitionProps={{ transition: 'pop-top-right' }}
              >
                <Menu.Target>
                  <UnstyledButton className="w-9 h-9 rounded-xl bg-slate-900 flex items-center justify-center text-white hover:bg-blue-600 transition-colors">
                    <User size={18} />
                  </UnstyledButton>
                </Menu.Target>

                <Menu.Dropdown className="border-slate-100 p-2">
                  <Menu.Label className="text-[10px] font-black uppercase tracking-widest mb-1">
                    Account
                  </Menu.Label>
                  <Menu.Item
                    leftSection={
                      <User style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    <span className="text-[11px] font-bold">Profile</span>
                  </Menu.Item>
                  <Menu.Item
                    leftSection={
                      <CreditCard style={{ width: rem(14), height: rem(14) }} />
                    }
                  >
                    <span className="text-[11px] font-bold">Billing</span>
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
                  >
                    <span className="text-[11px] font-bold">Logout</span>
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </div>
          ) : (
            <button className="bg-slate-900 text-white px-5 py-2 rounded-xl text-xs! font-bold! uppercase tracking-widest hover:bg-blue-600 transition-all">
              Sign In
            </button>
          )}

          {/* Mantine Mobile Menu */}
          <div className="md:hidden">
            <Menu shadow="md" width="100%" offset={15}>
              <Menu.Target>
                <button className="p-2 text-slate-900">
                  <MenuIcon size={20} />
                </button>
              </Menu.Target>

              <Menu.Dropdown className="md:hidden border-slate-100 rounded-none! h-screen p-4">
                {NAV_LINKS.map((link) => (
                  <Menu.Item key={link.label} component="a" href={link.href}>
                    <span className="text-[11px] font-bold uppercase tracking-widest">
                      {link.label}
                    </span>
                  </Menu.Item>
                ))}
              </Menu.Dropdown>
            </Menu>
          </div>
        </div>
      </div>
    </nav>
  )
}
