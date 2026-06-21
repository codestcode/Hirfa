'use client'

import React from 'react'
import Link from 'next/link'
import { ClipboardCheck, Banknote, Star, Clock, Calendar, MessageSquare, Wallet, LayoutGrid } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { HomeHeader } from '@/components/ui/home/HomeHeader'
import { AvailabilityToggle } from '@/components/ui/home/AvailabilityToggle'
import { NewRequestCard } from '@/components/ui/home/NewRequestCard'
import { AppointmentCard } from '@/components/ui/home/AppointmentCard'
import { QuickLinkCard } from '@/components/ui/home/QuickLinkCard'
import { PerformanceMetrics } from '@/components/ui/home/PerformanceMetrics'
import { useHome } from '@/hooks/useHome'

export default function CraftsmanHome() {
  const { profile, newRequests, appointments, isAvailable, toggleAvailability, handleRequest, handleLogout } = useHome()

  const stats = [
    { label: 'طلبات اليوم', value: profile?.completed_orders || 0, icon: ClipboardCheck, color: '#FF8A00' },
    { label: 'الأرباح', value: profile?.total_earnings || 0, icon: Banknote, color: '#FFB800' },
    { label: 'التقييم', value: profile?.rating || 0, icon: Star, color: '#FFB800' }
  ]

  return (
    <SubPageLayout>
      <div className="px-4 py-6 flex flex-col gap-6">
        <HomeHeader name={profile?.full_name || 'حرفي'} avatar={profile?.avatar_url || '/craftsman_avatar.png'} isAvailable={isAvailable} onLogout={handleLogout} />
        <AvailabilityToggle isAvailable={isAvailable} onToggle={toggleAvailability} />

        <div className="grid grid-cols-3 gap-3">
          {stats.map((stat, i) => (
            <div key={i} className="bg-[#0A0D1A] rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/5 shadow-sm">
              <stat.icon size={20} color={stat.color} /><span className="text-[10px] text-[#6B7A99] font-medium">{stat.label}</span><span className="text-base font-bold">{stat.value}</span>
            </div>
          ))}
        </div>

        <div>
          <div className="flex justify-between items-center mb-4"><Link href="/orders" className="text-xs text-[#FF8A00] font-bold">عرض الكل</Link><div className="flex items-center gap-2"><h2 className="text-sm font-bold">طلبات جديدة</h2><div className="w-1 h-4 bg-[#FF8A00] rounded-full" /></div></div>
          {newRequests.length ? newRequests.map(req => <NewRequestCard key={req.id} id={req.id} clientName={req.client?.full_name || 'عميل'} clientAvatarUrl={req.client?.avatar_url} serviceName={req.service_name} price={req.price} distanceKm={req.distance_km} onAction={handleRequest} />) : <div className="bg-[#0A0D1A] rounded-2xl p-8 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]"><ClipboardCheck size={32} className="mb-2 opacity-50" /><span className="text-xs">لا توجد طلبات جديدة حالياً</span></div>}
        </div>

        <div>
          <div className="flex justify-end items-center mb-4 gap-2"><h2 className="text-sm font-bold">مواعيد اليوم</h2><div className="w-1 h-4 bg-[#FF8A00] rounded-full" /></div>
          {appointments.length ? appointments.map(app => <AppointmentCard key={app.id} time={app.appointment_time?.slice(0, 5) || '10:00'} clientName={app.client?.full_name || 'عميل'} serviceName={app.service_name} address={app.address || 'عنوان غير محدد'} />) : <div className="bg-[#0A0D1A] rounded-2xl p-8 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]"><Clock size={32} className="mb-2 opacity-50" /><span className="text-xs">لا توجد مواعيد اليوم</span></div>}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <QuickLinkCard label="الجدول" href="/profile/schedule" icon={Calendar} />
          <QuickLinkCard label="الرسائل" href="/messages" icon={MessageSquare} badge="0" />
          <QuickLinkCard label="المحفظة" href="/wallet" icon={Wallet} />
          <QuickLinkCard label="المعرض" href="/profile/gallery" icon={LayoutGrid} />
        </div>

        <div>
          <div className="flex justify-end items-center mb-4 gap-2"><h2 className="text-sm font-bold">أداؤك الشهري</h2><div className="w-1 h-4 bg-[#FFB800] rounded-full" /></div>
          <PerformanceMetrics completedOrders={profile?.completed_orders || 0} rating={profile?.rating || 0} responseRate={profile?.response_rate || 100} earnings={profile?.total_earnings || 0} />
        </div>
      </div>
    </SubPageLayout>
  )
}
