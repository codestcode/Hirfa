'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'

interface AvailableWorker {
  id: string
  full_name: string | null
  avatar_url: string | null
  profession: string | null
  rating: number | null
  completed_orders: number | null
}

const EMERGENCY_TYPES = [
  { id: 'water', label: 'تسريب مياه', icon: '💧', profession: 'سباكة' },
  { id: 'power', label: 'انقطاع كهرباء', icon: '⚡', profession: 'كهرباء' },
  { id: 'door', label: 'كسر باب', icon: '🚪', profession: 'نجارة' },
  { id: 'fire', label: 'حريق', icon: '🔥', profession: 'صيانة منزلية' },
  { id: 'gas', label: 'تسريب غاز', icon: '💨', profession: 'سباكة' },
  { id: 'other', label: 'أخرى', icon: '🔧', profession: '' },
]

const EMOJI_TO_SVG: Record<string, string> = {
  '💧': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#3B82F6" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L12 22"/><path d="M2 12L22 12"/><path d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12"/><path d="M12 20C7.58172 20 4 16.4183 4 12"/></svg>',
  '⚡': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EAB308" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M13 2L3 14H12L11 22L21 10H12L13 2Z"/></svg>',
  '🚪': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#EF4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 21H21"/><path d="M5 21V5C5 4.46957 5.21071 3.96086 5.58579 3.58579C5.96086 3.21071 6.46957 3 7 3H17C17.5304 3 18.0391 3.21071 18.4142 3.58579C18.7893 3.96086 19 4.46957 19 5V21"/><path d="M15 12H15.01"/><path d="M9 21V19C9 18.4696 9.21071 17.9609 9.58579 17.5858C9.96086 17.2107 10.4696 17 11 17H13C13.5304 17 14.0391 17.2107 14.4142 17.5858C14.7893 17.9609 15 18.4696 15 19V21"/></svg>',
  '🔥': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F97316" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 2L12 10"/><path d="M18.5 10C18.5 13.5899 15.5899 16.5 12 16.5C8.41015 16.5 5.5 13.5899 5.5 10"/><path d="M12 16.5L12 22"/><path d="M8 22L16 22"/></svg>',
  '💨': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#22C55E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3H15"/><path d="M12 3V7"/><path d="M12 7C14.2091 7 16 8.79086 16 11C16 13.2091 14.2091 15 12 15"/><path d="M12 7C9.79086 7 8 8.79086 8 11C8 13.2091 9.79086 15 12 15"/><path d="M5 15H19"/><path d="M7 19H17"/></svg>',
  '🔧': '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.7 6.3C15.1 6.1 15.5 6 16 6C17.1 6 18 6.9 18 8C18 8.5 17.9 8.9 17.7 9.3"/><path d="M9 12L12 15L21 6L18 3L9 12Z"/><path d="M5.5 14.5L3 17L5.5 19.5L8 17L5.5 14.5Z"/><path d="M9 12L6 15"/></svg>',
}

const EMERGENCY_COLORS: Record<string, string> = {
  '💧': 'from-blue-500/20 to-blue-500/5 border-blue-500/30',
  '⚡': 'from-yellow-500/20 to-yellow-500/5 border-yellow-500/30',
  '🚪': 'from-red-600/20 to-red-600/5 border-red-600/30',
  '🔥': 'from-orange-500/20 to-orange-500/5 border-orange-500/30',
  '💨': 'from-green-500/20 to-green-500/5 border-green-500/30',
  '🔧': 'from-gray-500/20 to-gray-500/5 border-gray-500/30',
}

export default function EmergencyPage() {
  const router = useRouter()
  const [step, setStep] = useState<'select' | 'workers'>('select')
  const [selectedType, setSelectedType] = useState<typeof EMERGENCY_TYPES[0] | null>(null)
  const [workers, setWorkers] = useState<AvailableWorker[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const handleTypeSelect = async (type: typeof EMERGENCY_TYPES[0]) => {
    setSelectedType(type)
    setLoading(true)
    setStep('workers')

    const supabase = createClient()
    let query = supabase
      .from('profiles')
      .select('id, full_name, avatar_url, profession, rating, completed_orders')
      .eq('role', 'worker')
      .eq('verified', true)
      .eq('is_available', true)

    if (type.profession) {
      query = query.eq('profession', type.profession)
    }

    const { data } = await query
      .order('rating', { ascending: false })
      .limit(20)

    setWorkers(data as unknown as AvailableWorker[] || [])
    setLoading(false)
  }

  const handleRequestWorker = async (workerId: string) => {
    if (!selectedType || creating) return
    setCreating(true)

    const supabase = createClient()
    const { data: { user }, error: userErr } = await supabase.auth.getUser()
    if (userErr || !user) {
      console.error('Auth error:', userErr)
      alert('يجب تسجيل الدخول أولاً')
      setCreating(false)
      return
    }

    const { data: address } = await supabase
      .from('addresses')
      .select('city, street, building, apartment')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    const fullAddress = address
      ? `${address.city}، ${address.street}${address.building ? `، مبنى ${address.building}` : ''}${address.apartment ? `، شقة ${address.apartment}` : ''}`
      : 'طلب طوارئ'

    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert({
        client_id: user.id,
        worker_id: workerId,
        service_name: selectedType.label,
        status: 'confirmed',
        price: 0,
        is_emergency: true,
        emergency_type: selectedType.id,
        notes: 'طلب طوارئ فوري',
        payment_method: 'cash',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        address: fullAddress,
      })
      .select('id')
      .single()

    setCreating(false)
    if (bookErr || !booking) {
      console.error('Booking insert error:', bookErr)
      alert('حدث خطأ: ' + (bookErr?.message || 'تعذر إنشاء الطلب'))
      return
    }

    createNotification(user.id, 'تم إرسال طلب طوارئ', `طلب مساعدة عاجلة: ${selectedType.label}`)
    const { data: worker } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', workerId)
      .single()
    createNotification(workerId, 'طلب طوارئ جديد', `طلب مساعدة عاجلة من ${user.email || 'عميل'}`)
    router.push(`/client/order/success?id=${booking.id}`)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center h-14 max-w-[512px] mx-auto px-4 relative">
          <button onClick={() => step === 'workers' ? setStep('select') : router.back()} className="absolute left-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold w-full text-center">
            {step === 'select' ? 'طلب طوارئ' : 'اختيار حرفي'}
          </h1>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-32">
        {step === 'select' ? (
          <>
            {/* Emergency Banner */}
            <div className="mt-4 bg-gradient-to-r from-[#ED4C5C]/15 to-[#ED4C5C]/5 border border-[#ED4C5C]/30 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ED4C5C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ED4C5C" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 9V14M12 17V17.01M5.5 2L2 5.5L5.5 9"/>
                  <path d="M18.5 2L22 5.5L18.5 9"/>
                  <path d="M12 2C7.58172 2 4 5.58172 4 10C4 12.5286 5.01314 14.0093 7 16L12 22L17 16C18.9869 14.0093 20 12.5286 20 10C20 5.58172 16.4183 2 12 2Z"/>
                </svg>
              </div>
              <div>
                <p className="text-[#ED4C5C] font-bold text-sm">طلب مساعدة عاجلة</p>
                <p className="text-[#ED4C5C]/70 text-xs mt-1">اختر نوع المشكلة وسنرسل لك أقرب حرفي متاح فوراً</p>
              </div>
            </div>

            <p className="text-[#94A3B8] text-sm text-center mt-6 mb-4">ما نوع المشكلة التي تواجهها؟</p>

            {/* Emergency Type Grid */}
            <div className="grid grid-cols-2 gap-3">
              {EMERGENCY_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => handleTypeSelect(type)}
                  className={`relative overflow-hidden rounded-xl border p-4 flex flex-col items-center gap-3 transition-all bg-gradient-to-b ${EMERGENCY_COLORS[type.icon]} hover:scale-[1.02] active:scale-[0.98]`}
                >
                  <div className="w-12 h-12 rounded-full bg-black/20 flex items-center justify-center">
                    <span dangerouslySetInnerHTML={{ __html: EMOJI_TO_SVG[type.icon] }} />
                  </div>
                  <span className="text-white text-sm font-bold">{type.label}</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            {/* Selected Type Indicator */}
            <div className="mt-4 bg-[#0F172A]/60 rounded-xl p-4 flex items-center gap-3 border border-[#ED4C5C]/20">
              <div className="w-10 h-10 rounded-full bg-[#ED4C5C]/20 flex items-center justify-center">
                <span dangerouslySetInnerHTML={{ __html: EMOJI_TO_SVG[selectedType?.icon || '🔧'] }} />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold">{selectedType?.label}</p>
                <p className="text-[#94A3B8] text-xs">جاري البحث عن حرفيين متاحين...</p>
              </div>
              <div className="w-5 h-5 rounded-full border-2 border-[#22C55E] flex items-center justify-center">
                <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
              </div>
            </div>

            {/* Workers List */}
            {loading ? (
              <div className="space-y-3 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#0F172A]/60 rounded-2xl p-4 animate-pulse">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-full bg-[#1E2538]" />
                      <div className="flex-1 space-y-2">
                        <div className="h-4 w-24 bg-[#1E2538] rounded" />
                        <div className="h-3 w-32 bg-[#1E2538] rounded" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : workers.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16">
                <div className="w-16 h-16 rounded-full bg-[#ED4C5C]/10 flex items-center justify-center mb-4">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#ED4C5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <path d="M12 8V12M12 16H12.01"/>
                  </svg>
                </div>
                <p className="text-[#94A3B8] text-base font-bold">لا يوجد حرفيون متاحون حالياً</p>
                <p className="text-[#73799F] text-sm mt-2 text-center">حاول مرة أخرى لاحقاً أو اختر نوع مشكلة آخر</p>
                <button
                  onClick={() => setStep('select')}
                  className="mt-6 px-8 py-3 rounded-xl bg-[#FFA504] text-[#050B2C] font-bold"
                >
                  العودة للاختيار
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                <p className="text-[#94A3B8] text-sm">
                  تم العثور على <span className="text-white font-bold">{workers.length}</span> حرفي متاح
                </p>
                {workers.map((worker) => (
                  <div
                    key={worker.id}
                    className="w-full bg-[#0F172A]/60 rounded-2xl p-4 text-right hover:bg-[#0F172A]/80 transition-colors"
                  >
                    <div onClick={() => router.push(`/client/craftsman/${worker.id}`)} className="cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="relative flex-shrink-0">
                          <div className="w-14 h-14 rounded-full border-2 border-[#22C55E]/30 overflow-hidden bg-[#1E2538] flex items-center justify-center text-white font-bold text-lg">
                            {worker.avatar_url ? (
                              <img src={worker.avatar_url} alt="" className="w-full h-full object-cover" />
                            ) : (
                              worker.full_name?.charAt(0) || '؟'
                            )}
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-[#020617] bg-[#22C55E]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h3 className="text-white text-base font-bold truncate">
                              {worker.full_name || 'حرفي'}
                            </h3>
                            {worker.rating && (
                              <div className="flex items-center gap-1">
                                <span className="text-[#FFA504] text-sm font-bold">{worker.rating.toFixed(1)}</span>
                                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                                  <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="#FFA504"/>
                                </svg>
                              </div>
                            )}
                          </div>
                          <p className="text-[#94A3B8] text-sm mt-0.5">{worker.profession || 'حرفي'}</p>
                          <div className="flex items-center gap-3 mt-2">
                            <div className="flex items-center gap-1 text-[#22C55E] text-xs">
                              <div className="w-2 h-2 rounded-full bg-[#22C55E]" />
                              <span>متاح الآن</span>
                            </div>
                            {worker.completed_orders != null && (
                              <span className="text-[#73799F] text-xs">
                                {worker.completed_orders} طلب مكتمل
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex-shrink-0">
                          <div className="w-9 h-9 rounded-full bg-[#FFA504]/15 flex items-center justify-center">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                              <path d="M6 12L10 8L6 4" stroke="#FFA504" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => handleRequestWorker(worker.id)}
                      disabled={creating}
                      className="mt-3 w-full py-2.5 rounded-xl bg-gradient-to-l from-[#ED4C5C] to-[#ED4C5C]/80 text-white text-sm font-bold disabled:opacity-50"
                    >
                      {creating ? 'جاري...' : 'طلب عاجل'}
                    </button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
