'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle2, Power, Briefcase, Star } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { StatCard } from '@/components/ui/profile/StatCard'
import { ReviewCard } from '@/components/ui/profile/ReviewCard'
import { ServiceSummaryCard } from '@/components/ui/profile/ServiceSummaryCard'
import { ContactInfoCard } from '@/components/ui/profile/ContactInfoCard'
import { useProfileSummary } from '@/hooks/useProfileSummary'
import { PageLoader } from '@/components/ui/PageLoader'

export default function ProfileSummaryPage() {
  const router = useRouter()
  const { profile, services, reviews, loading } = useProfileSummary()

  return (
    <SubPageLayout>
      <PageHeader title="ملخص الحساب" />
      <div className="px-6 py-6">
        <div className="bg-[#0A0D1A] border border-white/5 rounded-3xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8A00]/10 rounded-full blur-[50px] -z-10" />
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#1E2538] bg-[#1E2538] shrink-0">
              {profile?.avatar_url ? <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" /> : <div className="w-full h-full flex items-center justify-center text-[#6B7A99]"><Briefcase size={24} /></div>}
            </div>
            <div className="flex flex-col pt-1">
              <h2 className="text-lg font-bold mb-1">{profile?.full_name || 'حرفي'}</h2>
              <div className="flex items-center gap-2 text-sm text-[#6B7A99] mb-3"><span>{profile?.profession || 'بدون تخصص'}</span><span className="w-1 h-1 rounded-full bg-[#6B7A99]" /><span className="bg-white/5 px-2 py-0.5 rounded text-white/80 text-xs">{profile?.category_level || 'جديد'}</span></div>
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-[#4ADE80]/10 text-[#4ADE80] px-2 py-1 rounded-full text-[10px] font-bold"><CheckCircle2 size={12} /><span>حساب موثق</span></div>
                <div className="flex items-center gap-1 bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-1 rounded-full text-[10px] font-bold"><Power size={12} /><span>متاح للعمل</span></div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard label="التقييم العام" value={<><Star size={16} className="text-[#FFB800] fill-[#FFB800]" /> {profile?.rating || '0.0'}</>} />
          <StatCard label="المهام المنجزة" value={profile?.completed_orders || '0'} />
          <StatCard label="إجمالي الأرباح" value={<span className="text-[#FF8A00]">{profile?.total_earnings || '0'} <span className="text-[10px] text-[#FF8A00]/70 font-normal">ج.م</span></span>} />
        </div>

        <ContactInfoCard phone={profile?.phone || undefined} governorate={profile?.governorate || undefined} area={profile?.area || undefined} />

        {loading ? <PageLoader /> : (
          <>
            <div className="mb-8 mt-8">
              <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm">التخصصات والخدمات</h3><button onClick={() => router.push('/profile/services')} className="text-[10px] font-bold text-[#FF8A00] hover:underline">تعديل الخدمات</button></div>
              <div className="grid grid-cols-2 gap-3">
                {services.length ? services.map((s) => <ServiceSummaryCard key={s.id} name={s.name} price={s.price} icon={s.icon} />) : <div className="col-span-2 text-center text-[#6B7A99] text-xs py-4 border border-dashed border-white/10 rounded-2xl">لا يوجد خدمات مضافة</div>}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-4"><h3 className="font-bold text-sm">أحدث التقييمات</h3><span className="text-[10px] font-bold text-[#6B7A99] bg-white/5 px-2 py-1 rounded-md">آخر 30 يوم</span></div>
              <div className="flex flex-col gap-3">
                {reviews.length ? reviews.map(r => <ReviewCard key={r.id} name={r.name} rating={r.rating} comment={r.comment} />) : <div className="text-center text-[#6B7A99] text-xs py-4 border border-dashed border-white/10 rounded-2xl">لا توجد تقييمات حتى الآن</div>}
              </div>
            </div>
          </>
        )}
      </div>
    </SubPageLayout>
  )
}
