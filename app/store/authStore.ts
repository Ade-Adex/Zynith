// /app/store/authStore.ts
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

export interface UserData {
  _id: string
  name: string
  firstName?: string
  lastName?: string
  email: string
  username: string
  avatar: string
  role: string
  joinedAt?: string
  stats?: { streakDays?: number }
  wallet?: { balance?: number; currency?: string }
}

interface AuthState {
  user: UserData | null
  isAuthenticated: boolean
  authenticatedAt: number | null // Tracks exact login instance
  login: (userData: UserData) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      authenticatedAt: null,
      login: (userData) =>
        set({ user: userData, isAuthenticated: true, authenticatedAt: Date.now() }),
      logout: () => set({ user: null, isAuthenticated: false, authenticatedAt: null }),
    }),
    {
      name: 'zynith-auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
)