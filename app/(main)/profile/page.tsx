'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  LogOut, MapPin, CreditCard, Bell, Globe, Shield,
  HelpCircle, MessageCircle, Info, Edit, ArrowLeft,
  Star, Heart, Calendar, ChevronLeft,
} from 'lucide-react'
import { mockUser } from '@/lib/mock-data'

const menuItems = [
  { icon: Edit,          label: 'تعديل الملف',      href: '/profile/edit' },
  { icon: MapPin,        label: 'عناوين محفوظة',     href: '/profile/addresses' },
  { icon: CreditCard,    label: 'طرق الدفع',         href: '/profile/payments' },
  { icon: Globe,         label: 'اللغة',             href: '/profile/language' },
  { icon: Bell,          label: 'الإشعارات',         href: '/profile/notifications' },
  { icon: Shield,        label: 'الخصوصية',          href: '/profile/privacy' },
  { icon: HelpCircle,    label: 'مركز المساعدة',     href: '/profile/help' },
  { icon: MessageCircle, label: 'تواصل مع الدعم',    href: '/profile/support' },
  { icon: Info,          label: 'عن التطبيق',        href: '/profile/about' },
]

const stats = [
  { value: '12', label: 'حجز',      icon: Calendar },
  { value: '5',  label: 'تقييمات',  icon: Star },
  { value: '8',  label: 'مفضلة',    icon: Heart },
]

const quickActions = [
  { icon: Calendar, label: 'حجوزاتي', href: '/bookings' },
  { icon: Heart,    label: 'المفضلة', href: '/favorites' },
  { icon: Star,     label: 'تقييماتي', href: '/reviews' },
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
      className="min-h-screen bg-[var(--color-bg)] pb-30 font-[var(--font-arabic)]"
      style={{ color: 'var(--color-text-primary)' }}   // ← Force main color
    >
      {/* Sticky Header */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 bg-[var(--color-bg-elevated)] border-b border-[var(--color-border)] px-4 py-4 flex items-center justify-between"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-[var(--neutral-100)] transition-colors"
          style={{ color: 'var(--color-text-secondary)' }}
        >
          <ArrowLeft size={20} className="scale-x-[-1]" />
        </button>

        <span className="font-[var(--weight-bold)] text-lg" style={{ color: 'var(--color-text-primary)' }}>
          حسابي
        </span>

        <div className="w-10" />
      </motion.div>

      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-6 border-b border-[var(--color-border)]"
        style={{ color: 'var(--color-text-primary)' }}
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="relative w-[68px] h-[68px] flex-shrink-0 rounded-full border-[2.5px] border-[var(--color-primary)] overflow-hidden">
            <Image
              src={mockUser.avatar || 'https://i.pravatar.cc/150?img=4&s=150'}
              alt={mockUser.name}
              fill
              className="object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="font-[var(--weight-bold)] text-[1.1rem]" style={{ color: 'var(--color-text-primary)' }}>
              {mockUser.name}
            </p>
            <p className="text-[var(--text-xs)] mt-1" style={{ color: 'var(--color-text-secondary)' }}>
              {mockUser.phone}
            </p>
          </div>

          <button
            onClick={() => router.push('/profile/edit')}
            className="w-9 h-9 flex items-center justify-center border border-[var(--color-border)] rounded-[var(--radius-md)] bg-[var(--color-bg-elevated)] hover:bg-[var(--neutral-100)] transition-colors"
            style={{ color: 'var(--color-text-secondary)' }}
          >
            <Edit size={16} />
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          {stats.map(({ value, label, icon: Icon }) => (
            <div
              key={label}
              className="bg-[var(--color-primary-subtle)] rounded-[var(--radius-md)] p-3 text-center"
            >
              <p className="text-[1.5rem] font-[var(--weight-extrabold)]" style={{ color: 'var(--color-primary)' }}>
                {value}
              </p>
              <p className="text-[0.7rem] mt-1" style={{ color: 'var(--color-text-secondary)' }}>
                {label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3 px-4 py-6 border-b border-[var(--color-border)]"
      >
        {quickActions.map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="flex flex-col items-center gap-2 py-4 px-2 bg-[var(--color-bg-elevated)] border border-[var(--color-border)] rounded-[var(--radius-md)] hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-subtle)] transition-all active:scale-[0.97]"
          >
            <Icon size={22} style={{ color: 'var(--color-primary)' }} />
            <span className="text-[0.75rem] font-[var(--weight-medium)]" style={{ color: 'var(--color-text-primary)' }}>
              {label}
            </span>
          </button>
        ))}
      </motion.div>

      {/* Menu Items */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4 py-4 flex flex-col gap-2"
      >
        {menuItems.map(({ icon: Icon, label, href }) => (
          <button
            key={label}
            onClick={() => router.push(href)}
            className="flex items-center justify-between w-full h-13 px-4 rounded-[var(--radius-md)] hover:bg-[var(--color-primary-subtle)] transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-[var(--radius-sm)] bg-[var(--color-primary-subtle)] flex items-center justify-center">
                <Icon size={18} style={{ color: 'var(--color-primary)' }} />
              </div>
              <span className="text-[var(--text-xs)] font-[var(--weight-medium)]" style={{ color: 'var(--color-text-primary)' }}>
                {label}
              </span>
            </div>
            <ChevronLeft size={16} style={{ color: 'var(--color-text-secondary)' }} />
          </button>
        ))}
      </motion.div>

      {/* Logout */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="px-4 pb-6"
      >
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="w-full h-12 flex items-center justify-center gap-2 bg-red-50 border border-red-200 rounded-[var(--radius-md)] font-[var(--weight-semibold)] text-[var(--text-xs)] hover:bg-red-100 active:scale-[0.97] transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ color: '#dc2626' }}
        >
          <LogOut size={16} style={{ color: '#dc2626' }} />
          {isLoading ? 'جاري...' : 'تسجيل الخروج'}
        </button>
      </motion.div>

      {/* Version */}
      <p className="text-center text-[0.7rem] pb-4" style={{ color: 'var(--color-text-secondary)' }}>
        حِرفة v1.0.0
      </p>
    </div>
  )
}