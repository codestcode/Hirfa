'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Calendar,
  AlertTriangle,
  User,
} from 'lucide-react'

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()

  const navItems = [
    { label: 'الرئيسية', href: '/client/home', icon: Home },
    { label: 'حجوزاتي', href: '/client/bookings', icon: Calendar },
    { label: 'طوارئ', href: '/client/emergency', icon: AlertTriangle, isEmergency: true },
    { label: 'حسابي', href: '/client/profile', icon: User },
  ]

  const isActive = (href: string) => {
    if (href === '/client/home') return pathname === '/client/home' || pathname === '/client'
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
          className="flex items-center max-w-[512px] mx-auto w-full"
          style={{
            gap: '20.2px',
            padding: '8px 26.14px 32px 26.11px',
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
                {item.isEmergency ? (
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                    className="flex flex-col items-center justify-center w-[48px] h-[48px] rounded-[20px] bg-red-500"
                    style={{ boxShadow: '0 10px 15px rgba(239, 68, 68, 0.3)' }}
                  >
                    <AlertTriangle size={18} className="text-white" />
                  </motion.div>
                ) : active ? (
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
