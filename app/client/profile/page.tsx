'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { 
  LogOut, Pencil, Home, Wallet, BellRing, HelpCircle, FileText, ShoppingBag
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { StatCard } from '@/components/ui/profile/StatCard'
import { MenuGroup } from '@/components/ui/profile/MenuGroup'
import { MenuLink } from '@/components/ui/profile/MenuLink'

export default function ProfilePage() {
  const { profile } = useAuth()
  const supabase = createClient()
  const router = useRouter()
  const [orderCount, setOrderCount] = useState(0)
  const [walletBalance, setWalletBalance] = useState(0)

  useEffect(() => {
    if (!profile?.id) return
    const fetchData = async () => {
      const { count } = await supabase
        .from('bookings')
        .select('*', { count: 'exact', head: true })
        .eq('client_id', profile.id)

      if (count != null) setOrderCount(count)

      if (profile.wallet_balance != null) {
        setWalletBalance(profile.wallet_balance)
      }
    }
    fetchData()
  }, [profile, supabase])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const menuGroups = [
    {
      title: 'الإعدادات الشخصية',
      items: [
        { title: 'تعديل الملف الشخصي', href: '/client/profile/edit', icon: Pencil, color: '#FF8A00', bg: '#1E1B15' },
        { title: 'العناوين المحفوظة', href: '/client/addresses', icon: Home, color: '#FFB800', bg: '#1A1813' },
        { title: 'طلباتي', href: '/client/orders', icon: ShoppingBag, color: '#FF8A00', bg: '#1E1B15' },
      ]
    },
    {
      title: 'الشؤون المالية',
      items: [
        { title: 'المحفظة', href: '/client/wallet', icon: Wallet, color: '#FFB800', bg: '#1A1813' },
      ]
    },
    {
      title: 'الدعم والخصوصية',
      items: [
        { title: 'الإشعارات', href: '/client/notifications', icon: BellRing, color: '#FF8A00', bg: '#1E1B15' },
        { title: 'مركز المساعدة', href: '/client/help', icon: HelpCircle, color: '#FF8A00', bg: '#1E1B15' },
        { title: 'شروط الخدمة', href: '/client/terms', icon: FileText, color: '#FF8A00', bg: '#1E1B15' },
      ]
    }
  ]

  return (
    <SubPageLayout>
      <PageHeader title="حسابي" showBack={false} />

      <div className="flex flex-col items-center px-6 mb-8 relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF8A00]/10 rounded-full blur-3xl -z-10" />
        
        <div className="relative mb-4">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-[#FF8A00] bg-[#1E2538] shadow-[0_0_20px_rgba(255,138,0,0.3)] p-1">
            <div className="w-full h-full rounded-full overflow-hidden relative">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
                  {profile?.full_name?.charAt(0) || '?'}
                </div>
              )}
            </div>
          </div>
        </div>

        <h2 className="text-xl font-bold mb-1">{profile?.full_name || 'مستخدم'}</h2>
        <div className="flex items-center gap-2 text-sm text-[#6B7A99]">
          <span>{profile?.email || ''}</span>
          {profile?.phone && (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A99]" />
              <span>{profile.phone}</span>
            </>
          )}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 px-6 mb-8 max-w-[280px] mx-auto">
        <StatCard 
          label="الطلبات" 
          value={orderCount.toString()} 
        />
        <StatCard 
          label="الرصيد" 
          value={<span className="text-[#FF8A00]">{walletBalance} <span className="text-[10px] font-normal">ج.م</span></span>} 
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
