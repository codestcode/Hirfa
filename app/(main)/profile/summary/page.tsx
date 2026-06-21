'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { CheckCircle2, Power, Briefcase, Droplet, Zap, Star } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { StatCard } from '@/components/ui/profile/StatCard'
import { ReviewCard } from '@/components/ui/profile/ReviewCard'
import { ServiceSummaryCard } from '@/components/ui/profile/ServiceSummaryCard'
import { ContactInfoCard } from '@/components/ui/profile/ContactInfoCard'

export default function ProfileSummaryPage() {
  const router = useRouter()
  const { profile } = useAuth()
  const dummyServices = [
    { id: '1', name: 'صيانة سباكة', icon: Droplet, price: '150' },
    { id: '2', name: 'تأسيس كهرباء', icon: Zap, price: '200' },
  ]
  const dummyReviews = [
    { id: '1', name: 'أحمد محمود', rating: 5, comment: 'شغل ممتاز ومواعيد مظبوطة جداً.' },
    { id: '2', name: 'سارة خالد', rating: 4, comment: 'شغل جيد بس اتأخر ربع ساعة عن الموعد.' },
  ]

  return (
    <SubPageLayout>
      <PageHeader title="ملخص الحساب" />

      <div className="px-6 py-6">
        
        <div className="bg-[#0A0D1A] border border-white/5 rounded-3xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#FF8A00]/10 rounded-full blur-[50px] -z-10" />
          
          <div className="flex items-start gap-4">
            <div className="relative w-20 h-20 rounded-full overflow-hidden border-2 border-[#1E2538] bg-[#1E2538] shrink-0">
              {profile?.avatar_url ? (
                <Image src={profile.avatar_url} alt="Profile" fill className="object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#6B7A99]">
                  <Briefcase size={24} />
                </div>
              )}
            </div>
            
            <div className="flex flex-col pt-1">
              <h2 className="text-lg font-bold mb-1">{profile?.full_name || 'حرفي'}</h2>
              <div className="flex items-center gap-2 text-sm text-[#6B7A99] mb-3">
                <span>{profile?.profession || 'بدون تخصص'}</span>
                <span className="w-1 h-1 rounded-full bg-[#6B7A99]" />
                <span className="bg-white/5 px-2 py-0.5 rounded text-white/80 text-xs">{profile?.category_level || 'جديد'}</span>
              </div>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1 bg-[#4ADE80]/10 text-[#4ADE80] px-2 py-1 rounded-full text-[10px] font-bold">
                  <CheckCircle2 size={12} />
                  <span>حساب موثق</span>
                </div>
                <div className="flex items-center gap-1 bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-1 rounded-full text-[10px] font-bold">
                  <Power size={12} />
                  <span>متاح للعمل</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mb-8">
          <StatCard 
            label="التقييم العام" 
            value={<><Star size={16} className="text-[#FFB800] fill-[#FFB800]" /> {profile?.rating || '0.0'}</>} 
          />
          <StatCard 
            label="المهام المنجزة" 
            value={profile?.completed_orders || '0'} 
          />
          <StatCard 
            label="إجمالي الأرباح" 
            value={<span className="text-[#FF8A00]">{profile?.total_earnings || '0'} <span className="text-[10px] text-[#FF8A00]/70 font-normal">ج.م</span></span>} 
          />
        </div>

        <ContactInfoCard 
          phone={profile?.phone || undefined} 
          governorate={profile?.governorate || undefined} 
          area={profile?.area || undefined} 
        />

        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">التخصصات والخدمات</h3>
            <button onClick={() => router.push('/profile/services')} className="text-[10px] font-bold text-[#FF8A00] hover:underline">
              تعديل الخدمات
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {dummyServices.map((service) => (
              <ServiceSummaryCard 
                key={service.id} 
                name={service.name} 
                price={service.price} 
                icon={service.icon} 
              />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-sm">أحدث التقييمات</h3>
            <span className="text-[10px] font-bold text-[#6B7A99] bg-white/5 px-2 py-1 rounded-md">
              آخر 30 يوم
            </span>
          </div>
          
          <div className="flex flex-col gap-3">
            {dummyReviews.map(review => (
              <ReviewCard 
                key={review.id} 
                name={review.name} 
                rating={review.rating} 
                comment={review.comment} 
              />
            ))}
          </div>
        </div>

      </div>
    </SubPageLayout>
  )
}
