// /app/(marketing)/layout.tsx
import { Navbar } from '@/app/components/layout/Navbar/Navbar'
import { Footer } from '@/app/components/layout/Footer'

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
    </>
  )
}
