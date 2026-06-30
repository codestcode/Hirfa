'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'
import { AlertTriangle, ShieldAlert } from 'lucide-react'

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
  const [step, setStep] = useState<'select' | 'details' | 'searching' | 'fallback' | 'workers'>('select')
  const [selectedType, setSelectedType] = useState<typeof EMERGENCY_TYPES[0] | null>(null)
  
  const [description, setDescription] = useState('')
  const [clientLat, setClientLat] = useState(30.0444)
  const [clientLng, setClientLng] = useState(31.2357)
  
  const [countdown, setCountdown] = useState(60)
  const [currentEmergencyId, setCurrentEmergencyId] = useState<string | null>(null)

  const [workers, setWorkers] = useState<AvailableWorker[]>([])
  const [loading, setLoading] = useState(false)
  const [creating, setCreating] = useState(false)

  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const channelRef = useRef<any>(null)

  // Geolocation is now requested on user interaction in handleTypeSelect

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
      if (channelRef.current) {
        const supabase = createClient()
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [])

  const handleTypeSelect = async (type: typeof EMERGENCY_TYPES[0]) => {
    setSelectedType(type)
    setStep('details')
    
    try {
      if (typeof window !== 'undefined') {
        const { Geolocation } = await import('@capacitor/geolocation')
        const permissions = await Geolocation.checkPermissions()
        
        if (permissions.location !== 'granted') {
          const req = await Geolocation.requestPermissions()
          if (req.location !== 'granted') {
            console.warn('Location permission denied')
            return
          }
        }
        
        const pos = await Geolocation.getCurrentPosition({ enableHighAccuracy: true })
        setClientLat(pos.coords.latitude)
        setClientLng(pos.coords.longitude)
      }
    } catch (err) {
      console.error('Geolocation error:', err)
      // Fallback or ignore
    }
  }

  const startSOSSearch = async () => {
    if (!selectedType) return
    setStep('searching')
    setCountdown(60)
    
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('يجب تسجيل الدخول أولاً')
      setStep('select')
      return
    }

    const { data: emergency, error: err } = await supabase
      .from('emergencies')
      .insert({
        client_id: user.id,
        type: selectedType.id,
        description: description.trim() || `نداء استغاثة: ${selectedType.label}`,
        status: 'pending',
        latitude: clientLat,
        longitude: clientLng
      })
      .select('id')
      .single()

    if (err || !emergency) {
      alert('فشل إرسال البلاغ: ' + (err?.message || 'خطأ غير معروف'))
      setStep('select')
      return
    }

    setCurrentEmergencyId(emergency.id)

    if (selectedType.profession) {
      const { data: matchedWorkers } = await supabase
        .from('profiles')
        .select('id')
        .eq('role', 'worker')
        .eq('profession', selectedType.profession)
        .eq('is_available', true)
      
      if (matchedWorkers) {
        matchedWorkers.forEach(w => {
          createNotification(w.id, 'طلب طوارئ عاجل!', `مطلوب ${selectedType.label} فوراً بالقرب منك: ${description || 'اضغط للتفاصيل'}`)
        })
      }
    }

    const channel = supabase
      .channel(`emergency-listen-${emergency.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', filter: `id=eq.${emergency.id}`, schema: 'public', table: 'emergencies' },
        (payload) => {
          const updated = payload.new as any
          if (updated.status === 'confirmed' && updated.booking_id) {
            if (timerRef.current) clearInterval(timerRef.current)
            supabase.removeChannel(channel)
            router.push(`/client/order/success?id=${updated.booking_id}`)
          }
        }
      )
      .subscribe()

    channelRef.current = channel

    timerRef.current = setInterval(async () => {
      setCountdown(prev => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current)
          supabase.removeChannel(channel)
          supabase.from('emergencies').update({ status: 'cancelled' }).eq('id', emergency.id)
          setStep('fallback')
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  const loadManualWorkers = async () => {
    if (!selectedType) return
    setLoading(true)
    setStep('workers')

    const supabase = createClient()
    let query = supabase
      .from('profiles')
      .select('id, full_name, avatar_url, profession, rating, completed_orders')
      .eq('role', 'worker')
      .eq('verified', true)
      .eq('verification_status', 'verified')
      .eq('is_available', true)

    if (selectedType.profession) {
      query = query.eq('profession', selectedType.profession)
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
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      alert('يجب تسجيل الدخول أولاً')
      setCreating(false)
      return
    }

    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert({
        client_id: user.id,
        worker_id: workerId,
        service_name: selectedType.label,
        status: 'confirmed',
        price: 200,
        is_emergency: true,
        emergency_type: selectedType.id,
        notes: description || 'طلب طوارئ فوري مباشر',
        payment_method: 'cash',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        address: 'موقع الطوارئ المحدد',
      })
      .select('id')
      .single()

    setCreating(false)
    if (bookErr || !booking) {
      alert('تعذر إنشاء الطلب: ' + bookErr?.message)
      return
    }

    createNotification(user.id, 'تم إرسال طلب طوارئ', `طلب مساعدة عاجلة: ${selectedType.label}`)
    createNotification(workerId, 'طلب طوارئ جديد', 'تم اختيارك لطلب مساعدة عاجلة فورية.')
    router.push(`/client/order/success?id=${booking.id}`)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] text-right">
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center h-14 max-w-[512px] mx-auto px-4 relative">
          <button 
            onClick={() => {
              if (step === 'details') setStep('select')
              else if (step === 'searching' || step === 'fallback') setStep('details')
              else if (step === 'workers') setStep('fallback')
              else router.back()
            }} 
            className="absolute right-4"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold w-full text-center">
            {step === 'select' ? 'طلب طوارئ عاجل' :
             step === 'details' ? 'تفاصيل الاستغاثة' :
             step === 'searching' ? 'جاري البحث الحقيقي' :
             step === 'fallback' ? 'لم نجد حرفي' : 'اختيار يدوي'}
          </h1>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-32">
        {step === 'select' && (
          <>
            <div className="mt-4 bg-gradient-to-r from-[#ED4C5C]/15 to-[#ED4C5C]/5 border border-[#ED4C5C]/30 rounded-xl p-4 flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-[#ED4C5C]/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <AlertTriangle size={16} className="text-[#ED4C5C]" />
              </div>
              <div>
                <p className="text-[#ED4C5C] font-bold text-sm">نداء استغاثة SOS فوري</p>
                <p className="text-[#ED4C5C]/70 text-xs mt-1">اختر نوع المشكلة وسنقوم ببث النداء فوراً لجميع الحرفيين المتاحين من حولك</p>
              </div>
            </div>

            <p className="text-[#94A3B8] text-sm text-center mt-6 mb-4">ما هو نوع المشكلة الطارئة؟</p>

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
        )}

        {step === 'details' && selectedType && (
          <div className="mt-6 flex flex-col gap-5">
            <div className="bg-[#0F172A]/60 rounded-xl p-4 flex items-center gap-3 border border-[#ED4C5C]/20">
              <div className="w-10 h-10 rounded-full bg-[#ED4C5C]/20 flex items-center justify-center">
                <span dangerouslySetInnerHTML={{ __html: EMOJI_TO_SVG[selectedType.icon] }} />
              </div>
              <div>
                <p className="text-white font-bold">{selectedType.label}</p>
                <p className="text-slate-400 text-xs">نداء استغاثة SOS</p>
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-2">
              <label className="text-xs font-bold text-[#94A3B8] text-right">اكتب تفاصيل المشكلة الطارئة</label>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="مثال: تسريب مياه شديد من محبس الحمام الرئيسي..."
                className="w-full min-h-[100px] p-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-white text-sm outline-none placeholder-[#4B5A7A] focus:border-[#ED4C5C]/50 focus:bg-white/10 transition-all text-right shadow-inner shadow-black/20"
              />
            </div>

            <button
              onClick={startSOSSearch}
              className="mt-6 w-full py-4 rounded-2xl bg-gradient-to-r from-[#FF3366] to-[#FF9933] text-white font-bold text-base shadow-[0_0_20px_rgba(255,51,102,0.4)] transition-all flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98]"
            >
              <ShieldAlert size={20} className="animate-pulse" />
              <span>بث نداء الاستغاثة SOS الآن</span>
            </button>
          </div>
        )}

        {step === 'searching' && selectedType && (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="relative w-64 h-64 flex items-center justify-center mb-8">
              {/* Radar animation */}
              <div className="absolute inset-0 rounded-full bg-gray-800/50 border-2 border-gray-700"></div>
              <div className="absolute inset-0 rounded-full bg-transparent border-t-2 border-green-400 animate-spin-slow"></div>
              <div className="absolute w-full h-px bg-gradient-to-r from-transparent via-green-400 to-transparent animate-radar-sweep"></div>
              
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#ED4C5C] to-[#EF4444] flex items-center justify-center text-white font-bold text-3xl shadow-xl shadow-[#ED4C5C]/30 relative z-10 animate-pulse">
                SOS
              </div>
            </div>

            <h3 className="text-white text-2xl font-bold">جاري البحث عن أقرب حرفي متاح...</h3>
            <p className="text-slate-400 text-sm mt-2 max-w-xs leading-5">
              نقوم ببث النداء للأجهزة والحرفيين المتواجدين في منطقتك حالياً. يرجى الانتظار.
            </p>

            <div className="mt-12 bg-gray-800/50 border border-gray-700 px-8 py-5 rounded-2xl flex flex-col gap-2 items-center">
              <span className="text-sm text-slate-400 font-bold uppercase tracking-wider">الوقت المتبقي للقبول</span>
              <span className="text-5xl font-bold text-red-500 mt-1">{countdown}</span>
            </div>
          </div>
        )}

        {step === 'fallback' && (
          <div className="flex flex-col items-center justify-center pt-16 text-center">
            <div className="w-16 h-16 rounded-full bg-[#ED4C5C]/10 flex items-center justify-center mb-4 text-[#ED4C5C]">
              <AlertTriangle size={32} />
            </div>
            <h3 className="text-white text-lg font-bold">عذراً، لم نتمكن من العثور على حرفي</h3>
            <p className="text-slate-400 text-xs mt-2 max-w-xs leading-5">
              انتهى وقت البحث التلقائي ولم يستجب أي حرفي لنداء الاستغاثة في هذه اللحظة.
            </p>

            <div className="mt-8 flex flex-col gap-3 w-full">
              <button
                onClick={startSOSSearch}
                className="w-full py-3.5 rounded-xl bg-gradient-to-l from-[#ED4C5C] to-[#EF4444] text-white font-bold text-sm shadow-md"
              >
                إعادة محاولة البث SOS
              </button>
              <button
                onClick={loadManualWorkers}
                className="w-full py-3.5 rounded-xl bg-[#1E2538] border border-white/5 text-white font-bold text-sm hover:bg-[#2A3441] transition-colors"
              >
                البحث والاختيار اليدوي من القائمة
              </button>
              <button
                onClick={() => setStep('select')}
                className="w-full py-3 text-slate-400 text-xs hover:underline text-center"
              >
                العودة للرئيسية
              </button>
            </div>
          </div>
        )}

        {step === 'workers' && selectedType && (
          <>
            <div className="mt-4 bg-[#0F172A]/60 rounded-xl p-4 flex items-center gap-3 border border-[#ED4C5C]/20">
              <div className="w-10 h-10 rounded-full bg-[#ED4C5C]/20 flex items-center justify-center">
                <span dangerouslySetInnerHTML={{ __html: EMOJI_TO_SVG[selectedType.icon] }} />
              </div>
              <div className="flex-1 text-right">
                <p className="text-white font-bold">{selectedType.label}</p>
                <p className="text-[#94A3B8] text-xs">قائمة الحرفيين المتاحين حالياً</p>
              </div>
            </div>

            {loading ? (
              <div className="space-y-3 mt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="bg-[#0F172A]/60 rounded-2xl p-4 h-24 animate-pulse" />
                ))}
              </div>
            ) : workers.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-16 text-center">
                <p className="text-[#94A3B8] text-base font-bold">لا يوجد حرفيون متاحون حالياً</p>
                <button
                  onClick={() => setStep('select')}
                  className="mt-6 px-8 py-3 rounded-xl bg-[#FFA504] text-[#050B2C] font-bold"
                >
                  العودة للاختيار
                </button>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
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
                        <div className="flex-1 min-w-0 text-right">
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
