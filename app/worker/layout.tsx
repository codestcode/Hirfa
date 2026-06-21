'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  ClipboardList,
  MessageCircle,
  Wallet,
  User,
} from 'lucide-react'

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { label: 'الرئيسية', href: '/worker/home', icon: Home },
    { label: 'الطلبات', href: '/worker/orders', icon: ClipboardList },
    { label: 'المحادثات', href: '/worker/messages', icon: MessageCircle },
    { label: 'المالية', href: '/worker/wallet', icon: Wallet },
    { label: 'الحساب', href: '/worker/profile', icon: User },
  ]

  const isActive = (href: string) => {
    if (href === '/worker/home') return pathname === '/worker/home' || pathname === '/worker'
    if (href === '/worker/profile') return pathname.startsWith('/worker/profile')
    return pathname.startsWith(href)
  }

  return (
    <div className="relative min-h-screen pb-[140px]" style={{ backgroundColor: 'rgb(0, 4, 25)' }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      <div
        className="fixed bottom-0 left-0 right-0 z-[3] pt-px"
        style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          background: 'rgba(2, 6, 23, 0.90)',
          backdropFilter: 'blur(20px)',
        }}
      >
        <div
          className="flex items-center justify-center max-w-[512px] mx-auto w-full"
          style={{
            gap: '25px',
            padding: '0 26.11px 32px 26.14px',
            height: '121px',
          }}
        >
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center relative shrink-0"
                style={{ padding: '8px' }}
              >
                {active ? (
                  <div className="flex flex-col items-center" style={{ gap: '4px' }}>
                    <div
                      className="flex items-center justify-center rounded-[20px] w-[48px] h-[48px]"
                      style={{
                        background: 'linear-gradient(135deg, #FF8A00 0%, #FFB800 100%)',
                        boxShadow: '0 4px 12px 0 rgba(255, 138, 0, 0.30)',
                      }}
                    >
                      <Icon size={18} className="text-white" />
                    </div>
                    <span className="font-bold text-[10px] text-white leading-[15px]">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center" style={{ gap: '4px' }}>
                    <Icon size={20} style={{ color: '#94A3B8' }} />
                    <span className="font-medium text-[10px] leading-[15px]" style={{ color: '#94A3B8' }}>
                      {item.label}
                    </span>
                  </div>
                )}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
