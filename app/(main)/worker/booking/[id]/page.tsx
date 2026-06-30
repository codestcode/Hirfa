'use client'
import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowRight, MapPin, Clock, CalendarDays, Phone, MessageSquare, CheckCircle2, Truck, Hammer, XCircle, Map as MapIcon, Image as ImageIcon } from 'lucide-react'
import { PageLoader } from '@/components/ui/PageLoader'
import { BookingStatusBadge } from '@/components/ui/BookingStatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'
import { Geolocation } from '@capacitor/geolocation'
import dynamic from 'next/dynamic'
const LeafletTrackingMap = dynamic(
  () => import('@/components/shared/LeafletTrackingMap'),
  { ssr: false }
)
export default function WorkerBookingDetailsPage() {
  const { id } = useParams()
  const router = useRouter()
  const { profile } = useAuth()
  const supabase = createClient()
  const [booking, setBooking] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [watchId, setWatchId] = useState<string | null>(null)
  const [clientLat, setClientLat] = useState(30.0444)
  const [clientLng, setClientLng] = useState(31.2357)
  const [displayAddress, setDisplayAddress] = useState('عنوان غير محدد')
  const [notesText, setNotesText] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [statusNote, setStatusNote] = useState('')
  const fetchBooking = useCallback(async () => {
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*, client:client_id(*)')
      .eq('id', id)
      .single()
    if (error) {
      console.error(error)
      router.push('/worker/schedule')
      return
    }
    if (data) {
      setBooking(data)
      let addr = data.address || 'عنوان غير محدد'
      if (addr.includes('|')) {
        const parts = addr.split('|')
        addr = parts[0].trim()
        const coordsStr = parts[1]?.trim()
        if (coordsStr) {
          const [latStr, lngStr] = coordsStr.split(',')
          const parsedLat = parseFloat(latStr)
          const parsedLng = parseFloat(lngStr)
          if (!isNaN(parsedLat) && !isNaN(parsedLng)) {
            setClientLat(parsedLat)
            setClientLng(parsedLng)
          }
        }
      }
      setDisplayAddress(addr)
      if (data.notes) {
        if (data.notes.trim().startsWith('{')) {
          try {
            const parsed = JSON.parse(data.notes)
            setNotesText(parsed.text || '')
            if (Array.isArray(parsed.images)) setImages(parsed.images)
          } catch (e) {
            setNotesText(data.notes)
          }
        } else {
          setNotesText(data.notes)
        }
      }
    }
    setLoading(false)
  }, [id, supabase, router])
  useEffect(() => {
    fetchBooking()
  }, [fetchBooking])
  useEffect(() => {
    return () => {
      if (watchId) Geolocation.clearWatch({ id: watchId })
    }
  }, [watchId])
  const stopTracking = async () => {
    if (watchId) {
      await Geolocation.clearWatch({ id: watchId })
      setWatchId(null)
    }
  }
  const startTracking = async () => {
    try {
      const perm = await Geolocation.checkPermissions()
      if (perm.location !== 'granted') {
        const req = await Geolocation.requestPermissions()
        if (req.location !== 'granted') {
          alert('يجب الموافقة على صلاحية الموقع لتفعيل التتبع المباشر')
          return
        }
      }
      const wid = await Geolocation.watchPosition({ enableHighAccuracy: true }, (pos, err) => {
        if (pos) {
          supabase.from('bookings').update({
            craftsman_lat: pos.coords.latitude,
            craftsman_lng: pos.coords.longitude
          }).eq('id', id).then()
        }
      })
      setWatchId(wid)
    } catch (e) {
      console.error(e)
    }
  }
  const openMaps = () => {
    if (booking?.address?.includes('|')) {
      const coordsStr = booking.address.split('|')[1]?.trim()
      if (coordsStr) {
        window.open(`https://maps.google.com/?q=${coordsStr}`)
        return
      }
    }
    window.open(`https://maps.google.com/?q=${encodeURIComponent(booking?.address || '')}`)
  }
  const updateTrackingStatus = async (nextStatus: string, label: string) => {
    try {
      const currentHistory = Array.isArray(booking?.status_history) ? booking.status_history : []
      const newHistoryEntry = {
        tracking_status: nextStatus,
        notes: statusNote.trim() || null,
        timestamp: new Date().toISOString()
      }

      const updates: any = { 
        tracking_status: nextStatus,
        status_history: [...currentHistory, newHistoryEntry]
      }
      if (statusNote.trim()) {
        updates.status_notes = statusNote.trim()
      }
      if (nextStatus === 'accepted' && booking.status === 'pending') {
        updates.status = 'confirmed'
      }
      const { error } = await supabase.from('bookings').update(updates).eq('id', booking.id)
      if (error) throw error
      await createNotification(
        booking.client_id,
        'تحديث حالة الطلب',
        `حالة طلبك (${booking.service_name}) تغيرت إلى: ${label}`
      )
      if (nextStatus === 'on_the_way') {
        await startTracking()
      } else if (['arrived', 'work_started', 'completed'].includes(nextStatus)) {
        await stopTracking()
      }
      fetchBooking()
      setStatusNote('')
    } catch (err) {
      alert('فشل تحديث الحالة')
    }
  }
  const completeBooking = async () => {
    try {
      await stopTracking()
      const { processBookingCompletion } = await import('@/lib/supabase/booking-payments')
      await processBookingCompletion(supabase, booking.id)
      const currentHistory = Array.isArray(booking?.status_history) ? booking.status_history : []
      const newHistoryEntry = {
        tracking_status: 'completed',
        timestamp: new Date().toISOString()
      }

      const { error } = await supabase
        .from('bookings')
        .update({ 
          status: 'completed', 
          tracking_status: 'completed',
          status_history: [...currentHistory, newHistoryEntry]
        })
        .eq('id', booking.id)
      if (error) throw error
      await createNotification(
        booking.client_id,
        'اكتملت الخدمة',
        `تم إكمال خدمة ${booking.service_name} بنجاح.`
      )
      fetchBooking()
    } catch (err) {
      alert('فشل إنهاء الطلب')
    }
  }
  const cancelBooking = async () => {
    try {
      await stopTracking()
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', booking.id)
      if (error) throw error
      await createNotification(
        booking.client_id,
        'تم إلغاء الموعد',
        `تم إلغاء موعد خدمة ${booking.service_name} بواسطة الحرفي.`
      )
      fetchBooking()
    } catch (err) {
      alert('فشل إلغاء الطلب')
    }
  }
  if (loading) return <PageLoader />
  if (!booking) return null
  return (
    <div dir="rtl" className="min-h-screen bg-[#020617] text-right pb-32">
      <div className="sticky top-0 z-40 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5 h-16 flex items-center justify-between px-4">
        <button onClick={() => router.back()} className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-white">
          <ArrowRight size={20} />
        </button>
        <h1 className="text-white font-bold text-lg">تفاصيل الطلب #{booking.id.slice(0,6)}</h1>
        <div className="w-10" />
      </div>
      <div className="px-4 pt-6 flex flex-col gap-6">
        <div className="bg-[#0A0D1A] rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-slate-400 text-xs mb-1">العميل</p>
              <h2 className="text-white font-bold text-lg">{booking.client?.full_name}</h2>
            </div>
            <div className="flex gap-2">
              <button onClick={() => window.open(`tel:${booking.client?.phone}`)} className="w-10 h-10 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
                <Phone size={18} />
              </button>
              <button onClick={async () => {
                const { data: { user } } = await supabase.auth.getUser()
                if (!user) return
                const { data: existing } = await supabase.from('conversations').select('id').eq('worker_id', user.id).eq('client_id', booking.client_id).single()
                if (existing) {
                  router.push(`/worker/messages/${existing.id}`)
                } else {
                  const { data: newConv } = await supabase.from('conversations').insert({ worker_id: user.id, client_id: booking.client_id }).select('id').single()
                  if (newConv) router.push(`/worker/messages/${newConv.id}`)
                }
              }} className="w-10 h-10 rounded-full bg-[#FF8A00]/20 text-[#FF8A00] flex items-center justify-center">
                <MessageSquare size={18} />
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2 mb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-white font-bold text-lg">تفاصيل الحجز #{booking.id.slice(0, 8)}</h2>
            <BookingStatusBadge status={booking.status} />
          </div>
          {booking.is_emergency && (
            <span className="self-start text-[10px] font-bold bg-[#EF4444]/10 text-[#EF4444] px-2 py-1 rounded-full flex items-center gap-1 border border-[#EF4444]/20 animate-pulse">
              طلب طوارئ عاجل
            </span>
          )}
        </div>
        <div className="bg-[#0A0D1A] rounded-2xl p-5 border border-white/5 flex flex-col gap-4">
          <div className="flex items-center justify-between pb-4 border-b border-white/5">
            <div>
              <p className="text-slate-400 text-xs mb-1">الخدمة المطلوبة</p>
              <p className="text-white font-bold">{booking.service_name}</p>
            </div>
            <div className="text-left">
              <p className="text-slate-400 text-xs mb-1">التكلفة الإجمالية</p>
              <p className="text-[#FF8A00] font-bold">{booking.price} ج.م</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="flex items-center gap-2">
              <CalendarDays size={18} className="text-[#FF8A00]" />
              <div>
                <p className="text-slate-400 text-[10px]">التاريخ</p>
                <p className="text-white text-xs font-bold">{booking.appointment_date}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={18} className="text-[#FF8A00]" />
              <div>
                <p className="text-slate-400 text-[10px]">الوقت</p>
                <p className="text-white text-xs font-bold">{booking.appointment_time?.slice(0,5)}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#0A0D1A] rounded-2xl overflow-hidden border border-white/5">
          <div className="p-4 border-b border-white/5 flex justify-between items-start">
            <div className="flex gap-3">
              <MapPin size={20} className="text-[#FF8A00] shrink-0 mt-0.5" />
              <div>
                <p className="text-slate-400 text-xs mb-1">الموقع</p>
                <p className="text-white text-sm leading-6">{displayAddress}</p>
              </div>
            </div>
            <button onClick={openMaps} className="bg-blue-500/10 text-blue-400 px-3 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold hover:bg-blue-500/20 shrink-0">
              <MapIcon size={14} /> الخريطة
            </button>
          </div>
          <div className="h-48 relative">
            <LeafletTrackingMap 
              clientLat={clientLat} 
              clientLng={clientLng} 
              workerLat={booking.craftsman_lat}
              workerLng={booking.craftsman_lng}
            />
          </div>
        </div>
        {(notesText || images.length > 0) && (
          <div className="bg-[#0A0D1A] rounded-2xl p-5 border border-white/5">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <ImageIcon size={16} className="text-[#FF8A00]" />
              التفاصيل المرفقة
            </h3>
            {notesText && (
              <p className="text-slate-300 text-sm leading-6 mb-4">{notesText}</p>
            )}
            {images.length > 0 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {images.map((img, i) => (
                  <img key={i} src={img} alt="مرفق" className="h-24 w-24 object-cover rounded-xl border border-white/10 shrink-0" />
                ))}
              </div>
            )}
          </div>
        )}
        <div className="bg-[#0A0D1A] rounded-2xl p-5 border border-white/5">
          <h3 className="text-slate-400 text-xs mb-4">إدارة حالة الطلب</h3>
          {(booking.status === 'confirmed' || booking.status === 'pending') && (
            <div className="mb-4">
              <label className="text-xs text-[#94A3B8] mb-2 block">إضافة ملاحظة للعميل (تظهر في صفحة التتبع)</label>
              <textarea
                value={statusNote}
                onChange={e => setStatusNote(e.target.value)}
                placeholder="مثال: سأتأخر 10 دقائق بسبب الزحام..."
                className="w-full bg-[#1E2538]/50 border border-white/5 rounded-xl p-3 text-sm text-white placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 outline-none resize-none h-20"
              />
            </div>
          )}
          <div className="flex flex-col gap-3">
            {booking.status === 'pending' && (
              <>
                <button onClick={() => updateTrackingStatus('accepted', 'تم تأكيد الطلب')} className="w-full bg-gradient-to-r from-[#22C55E]/90 to-[#22C55E] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                  <CheckCircle2 size={18} /> قبول الموعد
                </button>
                <button onClick={cancelBooking} className="w-full bg-red-500/10 text-red-400 border border-red-500/20 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                  <XCircle size={18} /> إلغاء الموعد
                </button>
              </>
            )}
            {booking.status === 'confirmed' && (
              <>
                {(!booking.tracking_status || booking.tracking_status === 'accepted') && (
                  <button onClick={() => updateTrackingStatus('preparing_to_leave', 'جاري التجهيز')} className="w-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} /> بدء التجهيز
                  </button>
                )}
                {booking.tracking_status === 'preparing_to_leave' && (
                  <button onClick={() => updateTrackingStatus('on_the_way', 'في الطريق إليك')} className="w-full bg-orange-500/20 text-orange-400 border border-orange-500/30 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                    <Truck size={18} /> تحركت في الطريق (بدء التتبع)
                  </button>
                )}
                {booking.tracking_status === 'on_the_way' && (
                  <button onClick={() => updateTrackingStatus('arrived', 'وصلت للموقع')} className="w-full bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                    <MapPin size={18} /> وصلت للموقع (إيقاف التتبع)
                  </button>
                )}
                {booking.tracking_status === 'arrived' && (
                  <button onClick={() => updateTrackingStatus('work_started', 'جاري العمل')} className="w-full bg-purple-500/20 text-purple-400 border border-purple-500/30 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                    <Hammer size={18} /> بدء العمل
                  </button>
                )}
                {booking.tracking_status === 'work_started' && (
                  <button onClick={completeBooking} className="w-full bg-gradient-to-r from-[#22C55E]/90 to-[#22C55E] text-white font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} /> إكمال الخدمة بنجاح
                  </button>
                )}
              </>
            )}
            {booking.status === 'completed' && (
              <div className="bg-[#4ADE80]/10 text-[#4ADE80] font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                <CheckCircle2 size={18} /> الطلب مكتمل
              </div>
            )}
            {booking.status === 'cancelled' && (
              <div className="bg-red-500/10 text-red-500 font-bold py-3.5 rounded-xl flex items-center justify-center gap-2">
                <XCircle size={18} /> الطلب ملغي
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
