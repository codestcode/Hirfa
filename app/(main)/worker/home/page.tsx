'use client'
import { ClipboardCheck, Banknote, Star, Clock, Calendar, MessageSquare, Wallet, LayoutGrid } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { HomeHeader, AvailabilityToggle, NewRequestCard, AppointmentCard, QuickLinkCard, PerformanceMetrics } from '@/components/ui/home'
import { useHome } from '@/hooks/useHome'
import Link from 'next/link'

const Empty = ({ I, t }: any) => <div className="bg-[#0A0D1A] rounded-2xl p-8 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]"><I size={32} className="mb-2 opacity-50" /><span className="text-xs">{t}</span></div>
const Title = ({ t, c }: any) => <div className="flex items-center gap-2"><h2 className="text-sm font-bold">{t}</h2><div className={`w-1 h-4 bg-[${c}] rounded-full`} /></div>

export default function CraftsmanHome() {
  const { profile: p, newRequests: reqs, appointments: apps, isAvailable: isAv, toggleAvailability: tAv, handleRequest: hReq, handleLogout: hLog } = useHome()
  const stats = [{ l: 'طلبات اليوم', v: p?.completed_orders || 0, i: ClipboardCheck, c: '#FF8A00' }, { l: 'الأرباح', v: p?.total_earnings || 0, i: Banknote, c: '#FFB800' }, { l: 'التقييم', v: p?.rating || 0, i: Star, c: '#FFB800' }]
  const links = [{ l: 'الجدول', h: '/worker/schedule', i: Calendar }, { l: 'الرسائل', h: '/worker/messages', i: MessageSquare }, { l: 'المحفظة', h: '/worker/wallet', i: Wallet }, { l: 'المعرض', h: '/worker/profile/gallery', i: LayoutGrid }]

  return (
    <SubPageLayout>
      <div className="px-4 py-6 flex flex-col gap-6">
        <HomeHeader name={p?.full_name || 'حرفي'} avatar={p?.avatar_url || '/craftsman_avatar.png'} isAvailable={isAv} onLogout={hLog} />
        <AvailabilityToggle isAvailable={isAv} onToggle={tAv} />
        
        <div className="grid grid-cols-3 gap-3">{stats.map((s, i) => <div key={i} className="bg-[#0A0D1A] rounded-2xl p-4 flex flex-col items-center gap-2 border border-white/5"><s.i size={20} color={s.c}/><span className="text-[10px] text-[#6B7A99]">{s.l}</span><span className="text-base font-bold">{s.v}</span></div>)}</div>
        
        <div>
          <div className="flex justify-between items-center mb-4"><Link href="/worker/orders" className="text-xs text-[#FF8A00] font-bold">عرض الكل</Link><Title t="طلبات جديدة" c="#FF8A00" /></div>
          {reqs.length ? reqs.map((r: any) => <NewRequestCard key={r.id} {...r} clientName={r.client?.full_name} onAction={hReq} />) : <Empty I={ClipboardCheck} t="لا توجد طلبات جديدة" />}
        </div>

        <div>
          <div className="flex justify-end items-center mb-4"><Title t="مواعيد اليوم" c="#FF8A00" /></div>
          {apps.length ? apps.map((a: any) => <AppointmentCard key={a.id} {...a} time={a.appointment_time?.slice(0,5)} clientName={a.client?.full_name} />) : <Empty I={Clock} t="لا توجد مواعيد اليوم" />}
        </div>

        <div className="grid grid-cols-2 gap-3">{links.map((q, i) => <QuickLinkCard key={i} label={q.l} href={q.h} icon={q.i} />)}</div>
        
        <div>
          <div className="flex justify-end items-center mb-4"><Title t="أداؤك الشهري" c="#FFB800" /></div>
          <PerformanceMetrics completedOrders={p?.completed_orders || 0} rating={p?.rating || 0} responseRate={p?.response_rate || 100} earnings={p?.total_earnings || 0} />
        </div>
      </div>
    </SubPageLayout>
  )
}
