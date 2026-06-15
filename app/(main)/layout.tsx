'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home,
  Calendar,
  AlertTriangle,
  MessageCircle,
  User,
} from 'lucide-react'

export default function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const navItems = [
    { label: 'الرئيسية', href: '/home', icon: Home },
    { label: 'حجوزاتي', href: '/bookings', icon: Calendar },
    { label: 'طوارئ', href: '/emergency', icon: AlertTriangle, isEmergency: true },
    { label: 'رسائل', href: '/messages', icon: MessageCircle },
    { label: 'حسابي', href: '/profile', icon: User },
  ]

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home' || pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="relative min-h-screen bg-background">
      {/* Page Content */}
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

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-border">
        <div className="flex items-center justify-around h-20 max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <motion.div key={item.href} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link
                  href={item.href}
                  className={`flex flex-col items-center justify-center w-14 h-14 rounded-lg transition-all ${
                    active
                      ? item.isEmergency
                        ? 'bg-red-100 text-red-600'
                        : 'bg-primary/10 text-primary'
                      : 'text-muted-foreground'
                  } ${item.isEmergency ? 'relative -top-4' : ''}`}
                >
                  {item.isEmergency ? (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="flex flex-col items-center justify-center w-16 h-16 bg-red-500 rounded-full text-white shadow-lg"
                    >
                      <Icon className="w-6 h-6" />
                    </motion.div>
                  ) : (
                    <>
                      <Icon className="w-6 h-6" />
                      <span className="text-xs font-cairo mt-1 text-center whitespace-nowrap">
                        {item.label}
                      </span>
                    </>
                  )}
                </Link>
              </motion.div>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
