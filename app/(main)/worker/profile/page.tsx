'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { 
  LogOut, Star, Pencil, Fingerprint, LayoutGrid, Calendar, Wallet, CreditCard,
  Headphones, FileText, Image as ImageIcon, CalendarDays
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { StatCard } from '@/components/ui/profile/StatCard'
import { MenuGroup } from '@/components/ui/profile/MenuGroup'
import { MenuLink } from '@/components/ui/profile/MenuLink'
import { ProfileAvatarInfo } from '@/components/ui/profile/ProfileAvatarInfo'

export default function ProfilePage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const router = useRouter()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuGroups = [
    {
      title: 'الإعدادات الشخصية',
      items: [
        { title: 'تعديل الملف الشخصي', href: '/worker/profile/edit', icon: Pencil, color: '#FF8A00', bg: '#1E1B15' },
        { title: 'معرض الأعمال', href: '/worker/profile/gallery', icon: ImageIcon, color: '#FFB800', bg: '#1A1813' },
        ...(profile?.verification_status !== 'verified' && !profile?.verified ? [{ title: 'التوثيق والهوية', href: '/worker/profile/verification', icon: Fingerprint, color: '#FFB800', bg: '#1A1813' }] : [])
      ]
    },
    {
      title: 'إعدادات الخدمة',
      items: [
        { title: 'تخصصات الخدمات', href: '/worker/profile/services', icon: LayoutGrid, color: '#FF8A00', bg: '#1E1B15' },
        { title: 'جدول العمل والتوافر', href: '/worker/profile/schedule', icon: Calendar, color: '#FF8A00', bg: '#1E1B15' },
        { title: 'المواعيد والحجوزات', href: '/worker/profile/calendar', icon: CalendarDays, color: '#FF8A00', bg: '#1E1B15' }
      ]
    },
    {
      title: 'الشؤون المالية',
      items: [
        { title: 'الأرباح والمحفظة', href: '/worker/wallet', icon: Wallet, color: '#FFB800', bg: '#1A1813' },
        { title: 'طرق الدفع', href: '/worker/profile/payment-methods', icon: CreditCard, color: '#FFB800', bg: '#1A1813' }
      ]
    },
    {
      title: 'الدعم والخصوصية',
      items: [
        { title: 'مركز المساعدة', href: '/worker/profile/help', icon: Headphones, color: '#FF8A00', bg: '#1E1B15' },
        { title: 'شروط الخدمة', href: '/worker/profile/terms', icon: FileText, color: '#FF8A00', bg: '#1E1B15' }
      ]
    }
  ]

  return (
    <SubPageLayout>
      <PageHeader title="الحساب الشخصي" showBack={false} />

      <ProfileAvatarInfo 
        avatarUrl={profile?.avatar_url || undefined}
        fullName={profile?.full_name || 'حرفي'}
        profession={profile?.profession || 'بدون تخصص'}
        categoryLevel={profile?.category_level || 'جديد'}
        onClick={() => router.push('/worker/profile/summary')}
      />

      <div className="grid grid-cols-3 gap-3 px-6 mb-8">
        <StatCard 
          label="التقييم" 
          value={<><Star size={14} className="text-[#FFB800] fill-[#FFB800]" /> {profile?.rating || '0.0'}</>} 
        />
        <StatCard 
          label="المهام" 
          value={profile?.completed_orders || '0'} 
        />
        <StatCard 
          label="الرصيد" 
          value={<span className="text-[#FF8A00]">{profile?.total_earnings || '0'} <span className="text-[10px] font-normal">ج.م</span></span>} 
        />
      </div>

      <div className="flex flex-col gap-6 px-6 mb-8">
        {menuGroups.map((group, i) => (
          <MenuGroup key={i} title={group.title} items={group.items} />
        ))}

        <div className="flex flex-col bg-[#0A0D1A] rounded-2xl border border-white/5 overflow-hidden">
          <MenuLink 
            title="تسجيل الخروج" 
            icon={LogOut} 
            color="#EF4444" 
            bg="#1E1212" 
            isLast 
            onClick={handleLogout}
            isDestructive
          />
        </div>
      </div>

      <div className="flex justify-center mb-8">
        <span className="text-xs text-[#4B5A7A]">حرفة - الإصدار 2.4.0</span>
      </div>
    </SubPageLayout>
  )
}
