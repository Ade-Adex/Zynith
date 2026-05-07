// /app/layout.tsx


import type { Metadata } from 'next'
import { jakarta, inter, jetbrains } from './fonts'
import './globals.css'
import { Navbar } from '@/app/components/layout/Navbar/Navbar'
import { Footer } from '@/app/components/layout/Footer'
import { AppProviders } from './providers'

export const metadata: Metadata = {
  title: 'Zynith | High-Fidelity LMS',
  description: 'Reach the peak of your skills.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      className={`scroll-smooth ${jakarta.variable} ${inter.variable} ${jetbrains.variable}`}
    >
      <body className="min-h-screen font-sans antialiased">
        <AppProviders>
          <Navbar />
          <main>{children}</main>
          <Footer />
        </AppProviders>
      </body>
    </html>
  )
}