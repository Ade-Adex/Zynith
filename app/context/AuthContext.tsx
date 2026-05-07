'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { UserType } from '@/app/types/user'
import { MOCK_USER } from '@/app/data/mockUser'

interface AuthContextType {
  user: UserType | null
  isAuthenticated: boolean
  login: () => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()

  // 1. Use a Lazy Initializer to avoid the useEffect warning
  const [user, setUser] = useState<UserType | null>(() => {
    // Check if we are in the browser (Next.js server-side check)
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('zynith_user')
      return savedUser ? JSON.parse(savedUser) : null
    }
    return null
  })

  const login = () => {
    setUser(MOCK_USER)
    localStorage.setItem('zynith_user', JSON.stringify(MOCK_USER))
    router.push('/dashboard')
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('zynith_user')
    router.push('/')
  }

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
