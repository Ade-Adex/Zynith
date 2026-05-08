import {
  LayoutDashboard,
  BookOpen,
  Award,
  Users,
  Wallet,
  Settings,
  HelpCircle,
} from 'lucide-react'

export const SIDEBAR_DATA = [
  { icon: LayoutDashboard, label: 'Overview', href: '/dashboard' },
  { icon: BookOpen, label: 'My Learning', href: '/dashboard/courses' },
  { icon: Users, label: 'Peer Review', href: '/dashboard/p2p', badge: 2 },
  { icon: Award, label: 'Certificates', href: '/dashboard/certificates' },
  { icon: Wallet, label: 'Marketplace', href: '/dashboard/wallet' },
  { icon: Settings, label: 'Settings', href: '/dashboard/settings' },
]
