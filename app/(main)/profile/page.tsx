'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  LogOut, Bell, Wallet, Settings, Image as ImageIcon, Star,
  ChevronLeft,
} from 'lucide-react'
import { mockUser } from '@/lib/mock-data'

const quickActions = [
  { icon: ImageIcon, label: 'المعرض', href: '/gallery' },
  { icon: Wallet, label: 'المحفظة', href: '/wallet' },
  { icon: Settings, label: 'الإعدادات', href: '/settings' },
]

const monthlyStats = [
  { label: 'الطلبات المكتملة', value: '24' },
  { label: 'متوسط التقييم', value: '4.9', icon: Star },
  { label: 'سرعة الرد', value: '98%' },
  { label: 'صافي الأرباح', value: '8,400', currency: 'ج.م' },
]

export default function ProfilePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = () => {
    setIsLoading(true)
    setTimeout(() => router.push('/login'), 500)
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen relative isolate flex flex-col items-start w-full font-arabic"
      style={{ 
        background: 'linear-gradient(90deg, rgb(0, 4, 25) 0%, rgb(0, 4, 25) 100%)'
      }}
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="backdrop-blur-lg relative shrink-0 w-full z-[2]"
        style={{ 
          background: 'rgba(15, 23, 42, 0.8)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="h-[80px] max-w-[512px] w-full flex items-center justify-between px-5">
          <button
            onClick={() => router.back()}
            className="relative flex items-center justify-center rounded-full w-10 h-10"
            style={{ background: 'rgba(255, 255, 255, 0.05)' }}
          >
            <ChevronLeft size={20} className="text-white" />
            <div className="absolute start-2 top-2 w-[10px] h-[10px] rounded-full bg-[#ff8a00]" />
          </button>

          <span className="font-bold text-lg text-white">
            الملف الشخصي
          </span>

          <div className="flex items-center justify-center rounded-full w-10 h-10" style={{ background: 'rgba(255, 255, 255, 0.05)' }}>
            <Bell size={18} className="text-white" />
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col items-start relative shrink-0 w-full px-5 pt-6"
        style={{ gap: '20px' }}
      >
        {/* Profile Section */}
        <div className="flex flex-col items-start relative shrink-0 w-full" style={{ gap: '16px' }}>
          <div className="flex flex-col items-start relative shrink-0 w-full" style={{ gap: '12px' }}>
            <div className="flex items-center relative shrink-0 w-full" style={{ gap: '16px' }}>
              <div className="relative flex-shrink-0 overflow-hidden rounded-[28px] w-[72px] h-[72px]" style={{ border: '2px solid rgba(255, 138, 0, 0.3)' }}>
                <Image
                  src={mockUser.avatar || 'https://i.pravatar.cc/150?img=4&s=150'}
                  alt={mockUser.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <p className="font-bold text-[18px] text-white leading-[28px]">
                  {mockUser.name}
                </p>
                <p className="mt-1 text-[14px]" style={{ color: '#7285bc' }}>
                  {mockUser.phone}
                </p>
              </div>

              <button
                onClick={() => router.push('/profile/edit')}
                className="flex items-center justify-center rounded-[20px] w-10 h-10"
                style={{ 
                  background: 'linear-gradient(135deg, rgb(255, 138, 0) 0%, rgb(255, 184, 0) 100%)',
                  boxShadow: '0px 4px 6px rgba(255, 138, 0, 0.3)'
                }}
              >
                <Settings size={18} className="text-white" />
              </button>
            </div>

            <div className="text-[14px] leading-[22px]" style={{ color: '#7285bc' }}>
              نجار محترف متخصص في الأثاث الخشبي والتشطيبات الدقيقة
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col items-start relative shrink-0 w-full" style={{ gap: '12px' }}>
            <div className="flex items-start relative shrink-0 w-full" style={{ gap: '12px' }}>
              {quickActions.map(({ icon: Icon, label, href }) => (
                <button
                  key={label}
                  onClick={() => router.push(href)}
                  className="flex-1 flex flex-col items-center backdrop-blur-lg"
                  style={{ 
                    gap: '8px',
                    padding: '21px',
                    borderRadius: '28px',
                    background: 'rgba(30, 41, 59, 0.5)',
                    border: '1px solid rgba(255, 255, 255, 0.05)'
                  }}
                >
                  <div className="flex items-center justify-center rounded-[20px] w-[56px] h-[56px]"
                    style={{ 
                      background: 'linear-gradient(44.999999999999986deg, rgba(168, 85, 247, 0.1) 0%, rgba(192, 132, 252, 0.1) 100%)',
                      border: '1px solid rgba(168, 85, 247, 0.2)'
                    }}
                  >
                    <Icon size={24} style={{ color: '#c084fc' }} />
                  </div>
                  <span className="font-bold text-[14px] text-white">
                    {label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="flex flex-col items-start relative shrink-0 w-full" style={{ gap: '16px' }}>
          <div className="flex items-center w-full" style={{ gap: '8px' }}>
            <span className="font-bold text-[18px] text-white leading-[28px]">
              أداؤك الشهري
            </span>
            <div className="rounded-full w-[6px] h-[20px] bg-[#ffb800]" />
          </div>

          <div 
            className="flex flex-col items-start relative shrink-0 w-full overflow-hidden"
            style={{ 
              padding: '29px',
              borderRadius: '28px',
              background: 'linear-gradient(149.88626684901757deg, rgb(15, 23, 42) 0%, rgb(30, 41, 59) 100%)',
              border: '1px solid rgba(255, 255, 255, 0.05)'
            }}
          >
            <div className="grid grid-cols-2 relative w-full" style={{ gap: '32px' }}>
              {monthlyStats.map(({ label, value, icon: Icon, currency }) => (
                <div key={label} className="flex flex-col items-start" style={{ gap: '4px' }}>
                  <span className="font-bold uppercase text-[11px] leading-[16.5px]" style={{ 
                    letterSpacing: '0.48px',
                    color: '#7285bc'
                  }}>
                    {label}
                  </span>
                  <div className="flex items-center" style={{ gap: '6px' }}>
                    {Icon && <Star size={15} className="text-yellow-400" />}
                    <span className="font-bold text-[30px] text-white leading-[36px]">
                      {value}
                    </span>
                    {currency && (
                      <span className="text-[12px] leading-[16px] opacity-60 text-white">
                        {currency}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>


    </div>
  )
}