'use client'
import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Clock, MapPin, Home } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import dynamic from 'next/dynamic'
const LeafletTrackingMap = dynamic(
  () => import('@/components/shared/LeafletTrackingMap'),
  { ssr: false }
)
interface BookingData {
  id: string
  appointment_date: string | null
  appointment_time: string | null
  status: string
  price: number
  address: string | null
  tracking_status: string | null
  eta: string | null
  status_notes: string | null
  worker: {
    id: string
    full_name: string | null
    avatar_url: string | null
    profession: string | null
    rating: number | null
    phone?: string | null
  } | null
}
const STEPS = [
  { label: 'تم قبول الطلب', key: 'accepted', desc: 'تم تأكيد موعد الخدمة بنجاح.' },
  { label: 'جاري تجهيز المعدات', key: 'preparing_to_leave', desc: 'الحرفي يجهز الأدوات اللازمة للتحرك.' },
  { label: 'في الطريق إليك', key: 'on_the_way', desc: 'الحرفي في الطريق إلى موقع العمل.' },
  { label: 'وصل لموقع العمل', key: 'arrived', desc: 'وصل الحرفي وبدأ بمعاينة المشكلة.' },
  { label: 'بدء تنفيذ الخدمة', key: 'work_started', desc: 'الحرفي يعمل على إصلاح المشكلة حالياً.' },
  { label: 'اكتمل العمل بنجاح', key: 'completed', desc: 'تم إنجاز الخدمة وإغلاق الطلب.' }
]
function SuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id') || ''
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  useEffect(() => {
    if (!bookingId) { setLoading(false); setError(true); return }
    const supabase = createClient()
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, worker:worker_id(id, full_name, avatar_url, profession, rating, phone)')
        .eq('id', bookingId)
        .single()
      if (data) {
        setBooking(data as unknown as BookingData)
      } else {
        setError(true)
      }
      setLoading(false)
    }
    fetchBooking()
    const channel = supabase
      .channel(`live-booking-${bookingId}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', filter: `id=eq.${bookingId}`, schema: 'public', table: 'bookings' },
        () => {
          fetchBooking()
        }
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [bookingId])
  const getActiveStep = (status: string, trackingStatus: string | null) => {
    if (status === 'completed') return 5
    if (!trackingStatus || trackingStatus === 'accepted') return 0
    if (trackingStatus === 'preparing_to_leave') return 1
    if (trackingStatus === 'on_the_way') return 2
    if (trackingStatus === 'arrived') return 3
    if (trackingStatus === 'work_started') return 4
    return 0
  }
  const activeIdx = getActiveStep(booking?.status || 'pending', booking?.tracking_status || '')
  const steps = STEPS.map((s, i) => ({
    ...s,
    completed: i < activeIdx,
    active: i === activeIdx,
  }))
  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FFA504] border-t-transparent rounded-full" />
      </div>
    )
  }
  const worker = booking?.worker
  let clientLat = 30.0444
  let clientLng = 31.2357
  let displayAddress = booking?.address || 'موقع العمل'
  if (booking?.address && booking.address.includes('|')) {
    const parts = booking.address.split('|')
    displayAddress = parts[0].trim()
    const coordsStr = parts[1]?.trim()
    if (coordsStr) {
      const [latStr, lngStr] = coordsStr.split(',')
      const parsedLat = parseFloat(latStr)
      const parsedLng = parseFloat(lngStr)
      if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
        clientLat = parsedLat
        clientLng = parsedLng
      }
    }
  }
  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] text-right">
      <div className="fixed top-0 left-0 right-0 h-20 bg-[#020617]/80 backdrop-blur-md z-40 flex items-center justify-between px-6 border-b border-white/5">
        <button onClick={() => router.push('/client/home')} className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-white active:scale-95 transition-transform">
          <Home size={20} />
        </button>
        <h1 className="text-white font-bold">تتبع الطلب</h1>
        <div className="w-10 h-10" />
      </div>
      {error ? (
        <div className="max-w-[512px] mx-auto px-4 pt-20 text-center">
          <p className="text-[#EF4444] text-lg">لم يتم العثور على الطلب</p>
        </div>
      ) : (
        <div className="max-w-[512px] mx-auto px-4 pb-32">
          <div className="flex flex-col items-center pt-6">
            <div className="w-20 h-20 rounded-full border-2 border-green-500 bg-green-500/10 flex items-center justify-center">
              <svg width="35" height="26" viewBox="0 0 35 26" fill="none">
                <path d="M12.3044 25.8871L0 13.5827L3.78266 9.8L12.3044 18.3217L30.6261 0L34.4088 3.78266L12.3044 25.8871Z" fill="#22C55E" />
              </svg>
            </div>
            <h2 className="text-white text-base font-bold mt-4">حالة تتبع الطلب</h2>
            <p className="text-[#C7C5CF] text-xs mt-2 text-center max-w-full px-4 leading-5">
              طلبك رقم #{bookingId.slice(0, 8)} قيد المتابعة الحية.
            </p>
          </div>
          {booking?.status_notes && (
            <div className="mt-4 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20 text-right">
              <span className="text-[10px] text-orange-400 font-bold block mb-1">ملاحظة الحرفي الحالية:</span>
              <p className="text-xs text-white leading-5">{booking.status_notes}</p>
            </div>
          )}
          {worker && (
            <div className="mt-6 bg-[#0F172A]/60 rounded-xl p-4 border border-white/5 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-[#FFA504]/20 text-[#FFA504] border border-[#FFA504]/20 flex items-center justify-center font-bold text-xs" onClick={() => window.open(`tel:${worker.phone || ''}`)}>
                    اتصال
                  </button>
                  <button 
                    onClick={async () => {
                      const { data: { user } } = await supabase.auth.getUser()
                      if (!user) return
                      const { data: existing } = await supabase.from('conversations').select('id').eq('client_id', user.id).eq('worker_id', worker.id).single()
                      if (existing) {
                        router.push(`/client/chat/${existing.id}`)
                      } else {
                        const { data: newConv } = await supabase.from('conversations').insert({ client_id: user.id, worker_id: worker.id }).select('id').single()
                        if (newConv) router.push(`/client/chat/${newConv.id}`)
                      }
                    }}
                    className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-white text-xs hover:bg-white/5 transition-colors"
                  >
                    محادثة
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-white font-medium">{worker.full_name || 'حرفي'}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-[#94A3B8] text-sm">{worker.profession || 'حرفي'} • </span>
                      <span className="text-[#F97316] text-sm">★ {worker.rating?.toFixed(1) || '4.9'}</span>
                    </div>
                  </div>
                  <div className="w-14 h-14 rounded-full border-2 border-[#FFA504] overflow-hidden bg-[#1E2538] flex items-center justify-center text-white font-bold">
                    {worker.avatar_url ? (
                      <img src={worker.avatar_url} alt="" className="w-full h-full object-cover" />
                    ) : (
                      worker.full_name?.charAt(0) || '?'
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="mt-8 bg-[#0F172A]/30 p-5 rounded-2xl border border-white/5">
            <h3 className="text-white font-bold text-sm mb-6">حالة الطلب المباشرة</h3>
            <div className="pr-4 relative">
              <div className="absolute right-[7px] top-2 bottom-2 w-0.5 bg-white/10" />
              <div className="flex flex-col gap-6">
                {steps.map((step, idx) => {
                  const showEta = step.key === 'on_the_way' && booking?.eta && step.active
                  return (
                    <div key={idx} className="flex items-start gap-4 relative">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 relative z-10 transition-colors ${
                        step.active ? 'bg-[#FFA504] border-[#FFA504]' : step.completed ? 'bg-green-500 border-green-500' : 'bg-[#020617] border-white/20'
                      }`} />
                      <div className="flex-1 text-right flex flex-col gap-1 -mt-1">
                        <p className={`text-sm font-bold ${step.active ? 'text-[#FFA504]' : step.completed ? 'text-white' : 'text-slate-400'}`}>
                          {step.label}
                        </p>
                        <p className="text-[11px] text-slate-400 leading-4">
                          {showEta ? `الوقت المقدر للوصول: ${booking.eta}` : step.desc}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
          <div className="mt-6 h-56 rounded-xl border border-white/5 bg-[#1F1F22] overflow-hidden relative">
            <LeafletTrackingMap
              clientLat={clientLat}
              clientLng={clientLng}
              workerLat={booking?.craftsman_lat}
              workerLng={booking?.craftsman_lng}
            />
            <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-lg p-3 flex items-center justify-between shadow-lg">
              <div className="bg-orange-100 rounded px-2.5 py-1">
                <span className="text-orange-800 text-xs font-bold">موقعك</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#050B2C] text-xs font-bold">{displayAddress}</span>
                <div className="w-8 h-8 rounded-full bg-[#FFA504]/20 flex items-center justify-center">
                  <MapPin size={14} className="text-[#FFA504]" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
export default function SuccessPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <SuccessContent />
    </Suspense>
  )
}
