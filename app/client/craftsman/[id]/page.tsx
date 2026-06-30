'use client'

import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { useState } from 'react'
import { ArrowLeft, Heart, Share2, Star, MapPin, X, ChevronLeft, ChevronRight } from 'lucide-react'
import { useCraftsmanProfile } from '@/hooks/useCraftsmanProfile'

export default function CraftsmanPage() {
  const router = useRouter()
  const params = useParams()
  const { profile, gallery, services, reviews, loading } = useCraftsmanProfile(params.id as string)
  const [modalIndex, setModalIndex] = useState<number | null>(null)
  const [selectedService, setSelectedService] = useState<any>(null)

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    )
  }

  if (!profile || !profile.verified) {
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

        {(profile.governorate || profile.area || profile.address) && (
          <div className="mt-6 flex items-center justify-center gap-2 text-[#C7C5CF] text-sm">
            <MapPin size={16} className="text-[#FF8A00]" />
            <span>{[profile.governorate, profile.area, profile.address].filter(Boolean).join(' - ')}</span>
          </div>
        )}

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

        {/* Services Catalog (Food-delivery application style) */}
        <div className="mt-8">
          <h3 className="text-white font-bold text-base mb-4 block text-right">كتالوج الخدمات</h3>
          {services && services.length > 0 ? (
            <div className="flex flex-col gap-3">
              {services.map(service => {
                const isSelected = selectedService?.id === service.id
                return (
                  <div 
                    key={service.id}
                    onClick={() => setSelectedService(isSelected ? null : service)}
                    className={`bg-[#0C1222] border rounded-2xl p-4 flex items-start justify-between cursor-pointer transition-all active:scale-[0.99] ${
                      isSelected ? 'border-[#FF8A00] bg-[#FF8A00]/5' : 'border-white/5'
                    }`}
                  >
                    <div className="flex-1 pr-1 text-right flex flex-col gap-1">
                      <span className="font-bold text-sm text-white">{service.name}</span>
                      {service.description && (
                        <p className="text-[#C7C5CF] text-xs leading-5">{service.description}</p>
                      )}
                      <div className="flex flex-wrap items-center gap-3 mt-2">
                        {service.duration && (
                          <span className="text-[10px] bg-white/5 text-[#94A3B8] px-2 py-0.5 rounded-md font-medium">
                            ⏳ {service.duration}
                          </span>
                        )}
                        {service.price_range ? (
                          <span className="text-[10px] bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-0.5 rounded-md font-bold">
                            {service.price_range}
                          </span>
                        ) : (
                          <span className="text-[10px] bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-0.5 rounded-md font-bold">
                            {service.price} ج.م
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-center mr-4 self-center">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-colors ${
                        isSelected ? 'bg-[#FF8A00] text-white' : 'bg-white/10 text-white hover:bg-[#FF8A00]/20'
                      }`}>
                        {isSelected ? '✓' : '+'}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-8 bg-[#0C1222]/50 rounded-2xl border border-dashed border-white/5 flex flex-col items-center justify-center">
              <span className="text-xs text-[#6B7A99]">لا توجد خدمات محددة في الكتالوج حالياً.</span>
            </div>
          )}
        </div>

        {gallery.length > 0 && (
          <div className="mt-8">
            <h3 className="text-white font-bold text-base mb-4">معرض الأعمال</h3>
            <div className="grid grid-cols-2 gap-3">
              {gallery.map((item, i) => (
                <div key={item.id} onClick={() => setModalIndex(i)} className="bg-[#0C1222] rounded-2xl overflow-hidden border border-white/5 cursor-pointer active:scale-[0.98] transition-transform">
                  <div className="grid grid-cols-2 gap-px bg-white/10">
                    <div className="aspect-square bg-[#1E2538] relative">
                      {item.before_url ? (
                        <Image src={item.before_url} alt="قبل" width={200} height={200} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B7A99] text-xs">قبل</div>
                      )}
                      <span className="absolute bottom-1 left-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded">قبل</span>
                    </div>
                    <div className="aspect-square bg-[#1E2538] relative">
                      {item.after_url ? (
                        <Image src={item.after_url} alt="بعد" width={200} height={200} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#6B7A99] text-xs">بعد</div>
                      )}
                      <span className="absolute bottom-1 right-1 bg-[#FF8A00]/80 text-white text-[10px] px-1.5 py-0.5 rounded">بعد</span>
                    </div>
                  </div>
                  {item.title && (
                    <div className="px-3 py-2">
                      <p className="text-white/70 text-xs">{item.title}</p>
                    </div>
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

      </div>

      {modalIndex !== null && gallery[modalIndex] && (
        <div 
          onClick={() => setModalIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.8)' }}
        >
          <div 
            onClick={e => e.stopPropagation()}
            className="w-full flex flex-col"
            style={{ backgroundColor: '#0A0D1A', borderRadius: 24, maxWidth: 440, border: '1px solid rgba(255,255,255,0.1)', maxHeight: '85vh' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'white', fontWeight: 700, fontSize: 18 }}>
                {gallery[modalIndex].title || 'معرض الأعمال'}
              </span>
              <button onClick={() => setModalIndex(null)} style={{ color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
              <div className="grid grid-cols-2 gap-1 rounded-2xl overflow-hidden" style={{ borderRadius: 16, overflow: 'hidden' }}>
                <div className="aspect-square bg-[#1E2538] relative">
                  {gallery[modalIndex].before_url ? (
                    <Image src={gallery[modalIndex].before_url} alt="قبل" width={400} height={400} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6B7A99] text-sm">قبل</div>
                  )}
                  <span className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded">قبل</span>
                </div>
                <div className="aspect-square bg-[#1E2538] relative">
                  {gallery[modalIndex].after_url ? (
                    <Image src={gallery[modalIndex].after_url} alt="بعد" width={400} height={400} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[#6B7A99] text-sm">بعد</div>
                  )}
                  <span className="absolute bottom-2 right-2 bg-[#FF8A00]/80 text-white text-xs px-2 py-1 rounded">بعد</span>
                </div>
              </div>

              <div className="flex items-center justify-between gap-2">
                <button
                  disabled={modalIndex === 0}
                  onClick={() => setModalIndex(modalIndex - 1)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: modalIndex > 0 ? 'pointer' : 'not-allowed',
                    backgroundColor: modalIndex > 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                    color: modalIndex > 0 ? 'white' : 'rgba(255,255,255,0.3)',
                    fontSize: 14, fontWeight: 500
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <ChevronRight size={16} />
                    <span>السابق</span>
                  </div>
                </button>

                <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12, whiteSpace: 'nowrap' }}>{modalIndex + 1} / {gallery.length}</span>

                <button
                  disabled={modalIndex === gallery.length - 1}
                  onClick={() => setModalIndex(modalIndex + 1)}
                  style={{
                    flex: 1, padding: '10px 0', borderRadius: 12, border: 'none', cursor: modalIndex < gallery.length - 1 ? 'pointer' : 'not-allowed',
                    backgroundColor: modalIndex < gallery.length - 1 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.05)',
                    color: modalIndex < gallery.length - 1 ? 'white' : 'rgba(255,255,255,0.3)',
                    fontSize: 14, fontWeight: 500
                  }}
                >
                  <div className="flex items-center justify-center gap-1">
                    <span>التالي</span>
                    <ChevronLeft size={16} />
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="fixed bottom-28 left-0 right-0 bg-[#020617] backdrop-blur-lg border-t border-white/5 p-4">
        <div className="max-w-[512px] mx-auto">
          <button
            onClick={() => {
              let url = `/client/booking/${params.id}`
              if (selectedService) {
                url += `?serviceName=${encodeURIComponent(selectedService.name)}&servicePrice=${selectedService.price}`
              }
              router.push(url)
            }}
            className="w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white text-xl font-medium shadow-lg shadow-[#FF8A00]/20"
          >
            {selectedService ? `حجز ${selectedService.name}` : 'احجز الان'}
          </button>
        </div>
      </div>
    </div>
  )
}
