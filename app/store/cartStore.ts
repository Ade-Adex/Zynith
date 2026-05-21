// /app/store/cartStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Course } from '@/app/types'

interface CartState {
  cartItems: Course[]
  addToCart: (course: Course) => void
  removeFromCart: (courseId: string) => void
  clearCart: () => void
  isInCart: (courseId: string) => boolean
  getCartTotal: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cartItems: [],

      addToCart: (course) => {
        const currentItems = get().cartItems
        const exists = currentItems.some(
          (item) => String(item._id) === String(course._id),
        )
        if (!exists) {
          set({ cartItems: [...currentItems, course] })
        }
      },

      removeFromCart: (courseId) => {
        set({
          cartItems: get().cartItems.filter(
            (item) => String(item._id) !== String(courseId),
          ),
        })
      },

      clearCart: () => set({ cartItems: [] }),

      isInCart: (courseId) => {
        return get().cartItems.some(
          (item) => String(item._id) === String(courseId),
        )
      },

      getCartTotal: () => {
        return get().cartItems.reduce(
          (total, item) => total + parseFloat(item.price || '0'),
          0,
        )
      },
    }),
    {
      name: 'zynith-cart-storage', // saves cart state in localStorage
    },
  ),
)
