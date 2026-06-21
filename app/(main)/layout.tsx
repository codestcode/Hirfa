'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Home, ClipboardList, MessageSquare, Wallet, UserCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      const role = profile?.role || user?.user_metadata?.role
      if (role === 'client') {
        router.replace('/login')
      }
    }
  }, [profile, user, loading, router])

  if (loading) return null

  const navItems = [
    { label: 'الرئيسية', href: '/home', icon: Home },
    { label: 'الطلبات', href: '/orders', icon: ClipboardList },
    { label: 'المحادثات', href: '/messages', icon: MessageSquare },
    { label: 'المالية', href: '/wallet', icon: Wallet },
    { label: 'الحساب', href: '/profile', icon: UserCircle },
  ]

  const isActive = (href: string) => {
    if (href === '/home') return pathname === '/home' || pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="relative min-h-screen pb-[100px] bg-[#050814] font-[family-name:var(--font-arabic)] text-white">
      <div className="w-full max-w-[512px] mx-auto relative">
        {children}
      </div>
      
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#020617]/90 backdrop-blur-xl border-t border-white/5">
        <div className="flex items-center justify-between max-w-[512px] mx-auto w-full px-6 py-4 pb-8">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)

            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center relative"
              >
                {active ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center rounded-full w-12 h-12 bg-gradient-to-br from-[#FF8A00] to-[#FFB800] shadow-[0_4px_12px_rgba(255,138,0,0.3)]">
                      <Icon size={20} className="text-white" />
                    </div>
                    <span className="font-bold text-[10px] text-white">
                      {item.label}
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <Icon size={24} className="text-[#94A3B8]" strokeWidth={1.5} />
                    <span className="font-medium text-[10px] text-[#94A3B8]">
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
