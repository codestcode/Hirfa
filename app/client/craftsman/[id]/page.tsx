'use client'

import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Heart, Share2, Star, MapPin, Shield } from 'lucide-react'
import { useCraftsmanProfile } from '@/hooks/useCraftsmanProfile'

export default function CraftsmanPage() {
  const router = useRouter()
  const params = useParams()
  const { profile, gallery, reviews, loading } = useCraftsmanProfile(params.id as string)

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white">الحرفي غير موجود</div>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] pb-32">
      <div className="sticky top-0 z-10 bg-[#020617] px-4 h-14 flex items-center justify-between max-w-[512px] mx-auto">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="pb-1.5">
            <ArrowLeft size={18} className="text-[#E4E1E5]" />
          </button>
          <button className="pb-1.5">
            <Share2 size={18} className="text-[#E4E1E5]" />
          </button>
          <button className="pb-1.5">
            <Heart size={18} className="text-[#E4E1E5]" />
          </button>
        </div>
        <h1 className="text-[#E4E1E5] text-xl">الملف الشخصي</h1>
      </div>

      <div className="max-w-[512px] mx-auto px-4">
        <div className="flex flex-col items-center pt-8">
          <div className="w-32 h-32 rounded-full border-4 border-[#2A2A2C] overflow-hidden bg-[#1E2538]">
            {profile.avatar_url ? (
              <Image src={profile.avatar_url} alt="" width={128} height={128} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-white font-bold text-3xl">
                {profile.full_name?.charAt(0) || '?'}
              </div>
            )}
          </div>
          <h2 className="text-white text-2xl mt-4">{profile.full_name}</h2>
          <p className="text-[#C7C5CF] text-base mt-1">{profile.profession || 'حرفي'}</p>
        </div>

        <div className="flex items-center justify-center gap-3 mt-6">
          <div className="flex-1 bg-[#0C1222] rounded-2xl py-4 text-center">
            <p className="text-white font-bold">5 سنوات</p>
            <p className="text-white/70 text-sm">خبرة</p>
          </div>
          <div className="flex-1 bg-[#0C1222] rounded-2xl py-4 text-center">
            <p className="text-white font-bold">+{profile.completed_orders || 0}</p>
            <p className="text-white/70 text-sm">عميل</p>
          </div>
          <div className="flex-1 bg-[#0F172A] rounded-2xl py-4 text-center">
            <p className="text-white font-bold">⭐ {profile.rating || 0}</p>
            <p className="text-white/70 text-sm">التقييم</p>
          </div>
        </div>

        {gallery.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-bold text-base mb-4">الاعمال السابقة</h3>
            <div className="grid grid-cols-2 gap-4">
              {gallery.map(item => (
                <div key={item.id} className="rounded-2xl overflow-hidden aspect-square bg-[#1E2538]">
                  {item.image_url ? (
                    <Image src={item.image_url} alt={item.title || ''} width={200} height={200} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6B7A99] text-sm">صورة</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {reviews.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-bold text-base mb-4">التقييمات</h3>
            <div className="space-y-3">
              {reviews.map(review => (
                <div key={review.id} className="bg-[#0F172A]/60 rounded-2xl p-4 border border-white/5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-[#FFA504] fill-[#FFA504]" />
                      <span className="text-[#FFA504] text-sm font-bold">{review.rating}</span>
                    </div>
                    <span className="text-white font-medium text-sm">{review.client_name || 'عميل'}</span>
                  </div>
                  {review.text && <p className="text-[#C7C5CF] text-xs mt-2">{review.text}</p>}
                </div>
              ))}
            </div>
          </div>
        )}

        {profile.governorate && (
          <div className="mt-8 flex items-center gap-2 text-[#C7C5CF] text-sm">
            <MapPin size={16} />
            <span>{profile.governorate}{profile.area ? ` - ${profile.area}` : ''}</span>
          </div>
        )}
      </div>

      <div className="fixed bottom-28 left-0 right-0 bg-[#020617] backdrop-blur-lg border-t border-white/5 p-4">
        <div className="max-w-[512px] mx-auto">
          <button
            onClick={() => router.push(`/client/booking/${params.id}`)}
            className="w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white text-xl font-medium shadow-lg shadow-[#FF8A00]/20"
          >
            احجز الان
          </button>
        </div>
      </div>
    </div>
  )
}
