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
  hasHydrated: boolean // Add this flag
  authenticatedAt: number | null
  setHasHydrated: (val: boolean) => void // Add this setter
  login: (userData: UserData) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      hasHydrated: false, // Default to false
      authenticatedAt: null,
      setHasHydrated: (val) => set({ hasHydrated: val }),
      login: (userData) =>
        set({
          user: userData,
          isAuthenticated: true,
          authenticatedAt: Date.now(),
        }),
      logout: () =>
        set({ user: null, isAuthenticated: false, authenticatedAt: null }),
    }),
    {
      name: 'zynith-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // This ensures we know when the store is fully loaded
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true)
      },
    },
  ),
)