'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Image from 'next/image'
import {
  ChevronLeft, ChevronRight, Star, User, ShieldCheck, Layers,
  CalendarClock, Wallet, CreditCard, HelpCircle, FileText, LogOut,
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

const statCards = [
  { label: 'التقييمات', value: '4.9', icon: Star },
  { label: 'المهام', value: '150+' },
]

const personalSettings = [
  { icon: User, label: 'تعديل الملف الشخصي', href: '/worker/profile/edit' },
  { icon: ShieldCheck, label: 'التوثيق والهوية', href: '/worker/profile/verification' },
]

const professionalSettings = [
  { icon: Layers, label: 'تخصصات الخدمات', href: '/worker/profile/specialties' },
  { icon: CalendarClock, label: 'جدول العمل والتوافر', href: '/worker/profile/schedule' },
]

const financialSettings = [
  { icon: Wallet, label: 'الأرباح والمحفظة', href: '/worker/profile/earnings' },
  { icon: CreditCard, label: 'طرق الدفع', href: '/worker/profile/payment' },
]

const supportSettings = [
  { icon: HelpCircle, label: 'مركز المساعدة', href: '/worker/help' },
  { icon: FileText, label: 'شروط الخدمة', href: '/worker/terms' },
]

export default function WorkerProfilePage() {
  const router = useRouter()
  const { user, profile, signOut } = useAuth()
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    await signOut()
    router.push('/login')
  }

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'مستخدم'
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || 'https://i.pravatar.cc/150?img=4&s=150'

  function SettingsGroup({ title, items }: { title: string; items: { icon: React.ElementType; label: string; href: string }[] }) {
    return (
      <div className="flex flex-col gap-3 self-stretch">
        <div className="flex px-2 self-stretch">
          <span className="text-[#52627A] text-base font-normal leading-6">{title}</span>
        </div>
        <div className="flex flex-col self-stretch overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
          {items.map(({ icon: Icon, label, href }, i) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className={`flex items-center justify-between self-stretch px-4 py-4 cursor-pointer border-none bg-transparent ${i < items.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-primary/10">
                  <Icon size={18} className="text-primary" />
                </div>
                <span className="text-white text-base font-normal leading-6">{label}</span>
              </div>
              <ChevronLeft size={16} className="text-[#757680]" />
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full z-[2] border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <button onClick={() => router.back()} className="flex items-center justify-center rounded-full p-2">
            <ChevronRight size={20} className="text-white" />
          </button>
          <span className="text-white text-base font-bold leading-6">الحساب الشخصي</span>
          <button onClick={() => router.push('/worker/profile/edit')} className="flex items-center justify-center rounded-full p-2">
            <ChevronLeft size={20} className="text-white" />
          </button>
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-10 gap-8 pb-[140px]"
      >
        <div className="flex flex-col items-center self-stretch gap-6">
          <div className="relative">
            <div className="flex items-center justify-center rounded-full w-[112px] h-[112px] p-[4px] border-4 border-primary bg-[#000419]">
              <div className="w-full h-full rounded-full overflow-hidden">
                <Image src={avatarUrl} alt={displayName} width={104} height={104} className="object-cover w-full h-full" />
              </div>
            </div>
            <div className="absolute flex items-center justify-center rounded-full p-[4px_4px_10px_4px] border-2 border-[#000419] bg-primary left-1 bottom-1">
              <Star size={16} fill="#000419" color="#000419" />
            </div>
          </div>

          <div className="flex flex-col items-center gap-1">
            <h2 className="text-white text-base font-normal leading-6">{displayName}</h2>
            <div className="flex items-center justify-center gap-1">
              <div className="flex px-2 py-0.5 rounded bg-white/5">
                <span className="text-white/70 text-base font-normal leading-6">فئة أ</span>
              </div>
              <span className="text-base font-normal leading-6 text-primary opacity-50">•</span>
              <span className="text-[#52627A] text-base font-normal leading-6">5 سنوات خبرة</span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((i) => (
                <Star key={i} size={16} fill={i <= 4 ? '#FF8A00' : 'none'} color="#FF8A00" className={i > 4 ? 'opacity-30' : ''} />
              ))}
            </div>
            <span className="text-white text-base font-bold leading-6">4.9</span>
          </div>

          <div className="flex items-center self-stretch gap-3">
            {statCards.map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex-1 flex flex-col items-center gap-1 rounded-xl px-4 py-4 border border-white/10 bg-white/[0.03] backdrop-blur-sm"
              >
                <span className="text-[#52627A] text-base font-normal leading-6">{label}</span>
                <div className="flex items-center gap-1">
                  {Icon && <Icon size={16} className="text-primary" />}
                  <span className="text-white text-base font-bold leading-6">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col self-stretch gap-6">
          <SettingsGroup title="الإعدادات الشخصية" items={personalSettings} />
          <SettingsGroup title="إعدادات الخدمة" items={professionalSettings} />
          <SettingsGroup title="الشؤون المالية" items={financialSettings} />
        </div>

        <div className="flex flex-col gap-3 self-stretch">
          <div className="flex px-2 self-stretch">
            <span className="text-[#52627A] text-base font-normal leading-6">الدعم والخصوصية</span>
          </div>
          <div className="flex flex-col self-stretch overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm">
            {supportSettings.map(({ icon: Icon, label, href }, i) => (
              <button
                key={label}
                onClick={() => router.push(href)}
                className={`flex items-center justify-between self-stretch px-4 py-4 cursor-pointer border-none bg-transparent ${i < supportSettings.length - 1 ? 'border-b border-white/[0.05]' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-primary/10">
                    <Icon size={18} className="text-primary" />
                  </div>
                  <span className="text-white text-base font-normal leading-6">{label}</span>
                </div>
                <ChevronLeft size={16} className="text-[#757680]" />
              </button>
            ))}
            <button
              onClick={handleLogout}
              disabled={isLoading}
              className="flex items-center justify-between self-stretch px-4 py-4 cursor-pointer border-none bg-transparent"
            >
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center rounded-lg w-9 h-9 bg-[rgba(186,26,26,0.1)]">
                  <LogOut size={18} className="text-[#BA1A1A]" />
                </div>
                <span className="text-[#BA1A1A] text-base font-normal leading-6">تسجيل الخروج</span>
              </div>
            </button>
          </div>
        </div>

        <div className="flex justify-center self-stretch pt-4 opacity-30">
          <span className="text-white text-base font-normal leading-6">حرفة - الإصدار 2.4.0</span>
        </div>
      </motion.main>
    </div>
  )
}
