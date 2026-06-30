'use client'
import { ClipboardCheck, Banknote, Star, Clock, Calendar, MessageSquare, Wallet, LayoutGrid } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { HomeHeader, AvailabilityToggle, NewRequestCard, AppointmentCard, QuickLinkCard, PerformanceMetrics } from '@/components/ui/home'
import { useHome } from '@/hooks/useHome'
import Link from 'next/link'

const Empty = ({ I, t }: any) => <div className="bg-[#0A0D1A] rounded-2xl p-8 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]"><I size={32} className="mb-2 opacity-50" /><span className="text-xs">{t}</span></div>
const Title = ({ t, c }: any) => <div className="flex items-center gap-2"><h2 className="text-sm font-bold">{t}</h2><div className={`w-1 h-4 bg-[${c}] rounded-full`} /></div>

export default function CraftsmanHome() {
  const { profile: p, newRequests: reqs, appointments: apps, isAvailable: isAv, activeEmergency: actEm, acceptEmergency: accEm, toggleAvailability: tAv, handleRequest: hReq, handleLogout: hLog } = useHome()
  const stats = [{ l: 'طلبات اليوم', v: p?.completed_orders || 0, i: ClipboardCheck, c: '#FF8A00' }, { l: 'الأرباح', v: p?.total_earnings || 0, i: Banknote, c: '#FFB800' }, { l: 'التقييم', v: p?.rating || 0, i: Star, c: '#FFB800' }]
  const links = [{ l: 'الجدول', h: '/worker/schedule', i: Calendar }, { l: 'الرسائل', h: '/worker/messages', i: MessageSquare }, { l: 'المحفظة', h: '/worker/wallet', i: Wallet }, { l: 'المعرض', h: '/worker/profile/gallery', i: LayoutGrid }]

  return (
    <SubPageLayout>
      <div className="px-4 py-6 flex flex-col gap-6">
        <HomeHeader name={p?.full_name || 'حرفي'} avatar={p?.avatar_url || '/craftsman_avatar.png'} isAvailable={isAv} onLogout={hLog} />
        <AvailabilityToggle isAvailable={isAv} onToggle={tAv} />

        {actEm && (
          <div className="bg-[#ED4C5C]/10 border border-[#ED4C5C]/20 rounded-2xl p-5 flex flex-col gap-4 animate-pulse">
            <div className="flex items-center justify-between">
              <span className="text-[10px] bg-[#ED4C5C]/20 text-[#ED4C5C] px-2 py-1 rounded-full font-bold">حالة طوارئ حرجة</span>
              <span className="text-xs text-[#94A3B8] font-bold">بلاغ SOS نشط</span>
            </div>
            <div className="text-right">
              <h4 className="text-sm font-bold text-white mb-1">المطلوب: {actEm.description}</h4>
              <p className="text-xs text-[#6B7A99]">العميل: {actEm.client?.full_name || actEm.client?.email || 'عميل'}</p>
            </div>
            <button
              onClick={() => accEm(actEm.id)}
              className="w-full bg-[#ED4C5C] hover:bg-[#ED4C5C]/90 text-white font-bold py-3.5 rounded-xl text-xs transition-colors shadow-lg shadow-[#ED4C5C]/20"
            >
              قبول البلاغ والتحرك فوراً
            </button>
          </div>
        )}

        {p && p.verification_status !== 'verified' && (
          <div className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400">حالة توثيق الحساب</span>
              <span className={`text-[11px] px-2 py-[2px] rounded-full font-bold ${
                p.verification_status === 'pending' ? 'bg-yellow-500/10 text-yellow-500' :
                p.verification_status === 'rejected' ? 'bg-red-500/10 text-red-500' :
                'bg-slate-500/10 text-slate-400'
              }`}>
                {p.verification_status === 'pending' ? 'قيد المراجعة' :
                 p.verification_status === 'rejected' ? 'مرفوض' :
                 'غير موثق'}
              </span>
            </div>
            {p.verification_status === 'rejected' && p.rejection_reason && (
              <p className="text-xs text-red-400 leading-5 text-right font-medium">
                سبب الرفض: {p.rejection_reason}
              </p>
            )}
            {p.verification_status === 'pending' ? (
              <p className="text-xs text-slate-400 leading-5 text-right">
                مستنداتك قيد المراجعة حالياً من قبل الإدارة. سنقوم بتوثيق حسابك فور التحقق منها.
              </p>
            ) : (
              <div className="flex justify-start">
                <Link
                  href="/Verification"
                  className="text-xs text-[#FF8A00] hover:underline font-bold flex items-center gap-1"
                >
                  {p.verification_status === 'rejected' ? 'إعادة رفع المستندات والتوثيق' : 'ابدأ عملية توثيق الحساب الآن'} &larr;
                </Link>
              </div>
            )}
          </div>
        )}
        
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
