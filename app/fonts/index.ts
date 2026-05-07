// /app/fonts/index.ts


import { Inter, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google'

// The "Standard" for readability and clean UI
export const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
})

// The "Appealing" font - Great for headers and that "Zynith" tech feel
export const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
})

// The "Developer" font - Best for code and stats
export const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains',
  display: 'swap',
})