import type { Metadata } from 'next'
import { geistSans, geistMono } from './fonts' 
import './globals.css'
import { Navbar } from '@/app/components/layout/Navbar/Navbar'
import { Footer } from '@/app/components/layout/Footer'

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
    <html lang="en" className="scroll-smooth">
      <body
        className={`
          ${geistSans.variable} 
          ${geistMono.variable} 
          min-h-screen antialiased
        `}
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  )
}
