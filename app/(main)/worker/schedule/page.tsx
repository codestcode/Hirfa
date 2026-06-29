'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CalendarDays, Clock, MapPin, CheckCircle2, XCircle, User } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'

export default function WorkerSchedulePage() {
  const { profile } = useAuth()
  const supabase = createClient()

  const [filter, setFilter] = useState<'upcoming' | 'completed' | 'all'>('upcoming')
  const [bookings, setBookings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchBookings = useCallback(async () => {
    if (!profile?.id) return
    setLoading(true)
    const { data, error } = await supabase
      .from('bookings')
      .select('*, client:client_id(full_name, phone)')
      .eq('worker_id', profile.id)
      .order('appointment_date', { ascending: true })
      .order('appointment_time', { ascending: true })

    if (error) {
      console.error(error)
    } else if (data) {
      setBookings(data)
    }
    setLoading(false)
  }, [profile?.id, supabase])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  const updateStatus = async (bookingId: string, status: string, clientId: string, serviceName: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status })
        .eq('id', bookingId)

      if (error) throw error

      // Notify the client
      if (status === 'completed') {
        await createNotification(
          clientId,
          'اكتملت الخدمة',
          `تم إكمال خدمة ${serviceName} بواسطة الحرفي بنجاح.`
        )
      } else if (status === 'cancelled') {
        await createNotification(
          clientId,
          'تم إلغاء الموعد',
          `تم إلغاء موعد خدمة ${serviceName} بواسطة الحرفي.`
        )
      }

      fetchBookings()
    } catch (err) {
      alert('فشل تحديث حالة الطلب')
    }
  }

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true
    if (filter === 'completed') return b.status === 'completed'
    // 'upcoming' includes both 'confirmed' and 'pending'
    return b.status === 'confirmed' || b.status === 'pending'
  })

  return (
    <SubPageLayout>
      <PageHeader title="جدول المواعيد والحجوزات" isTransparent />
      <div className="px-6 py-4">
        
        {/* Navigation Tabs */}
        <div className="flex bg-[#0A0D1A] rounded-2xl p-1 mb-6 border border-white/5">
          {[
            { id: 'upcoming' as const, label: 'القادمة' },
            { id: 'completed' as const, label: 'المكتملة' },
            { id: 'all' as const, label: 'الكل' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`flex-1 py-3 text-xs font-bold rounded-xl transition-colors ${
                filter === tab.id 
                  ? 'bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-black shadow-md' 
                  : 'text-[#6B7A99] hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        <div className="flex flex-col gap-4">
          {loading ? (
            <PageLoader />
          ) : filteredBookings.length ? (
            filteredBookings.map((booking) => (
              <div 
                key={booking.id} 
                className="bg-[#0A0D1A] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden hover:border-white/10 transition-colors"
              >
                <div className={`absolute top-0 right-0 w-1.5 h-full ${
                  booking.status === 'completed' 
                    ? 'bg-[#4ADE80]' 
                    : booking.status === 'cancelled' 
                      ? 'bg-red-500' 
                      : 'bg-[#FF8A00]'
                }`} />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E2538] flex items-center justify-center text-white font-bold">
                      <User size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-right">{booking.client?.full_name || 'عميل'}</span>
                      <span className="text-[10px] text-[#6B7A99] text-right">{booking.service_name}</span>
                    </div>
                  </div>
                  
                  {booking.status === 'completed' && (
                    <span className="text-[10px] font-bold bg-[#4ADE80]/10 text-[#4ADE80] px-2.5 py-1 rounded-full flex items-center gap-1">
                      <CheckCircle2 size={10} /> مكتمل
                    </span>
                  )}
                  {booking.status === 'cancelled' && (
                    <span className="text-[10px] font-bold bg-red-500/10 text-red-400 px-2.5 py-1 rounded-full flex items-center gap-1">
                      <XCircle size={10} /> ملغي
                    </span>
                  )}
                  {booking.status === 'confirmed' && (
                    <span className="text-[10px] font-bold bg-[#FF8A00]/10 text-[#FF8A00] px-2.5 py-1 rounded-full">
                      مؤكد
                    </span>
                  )}
                  {booking.status === 'pending' && (
                    <span className="text-[10px] font-bold bg-yellow-500/10 text-yellow-500 px-2.5 py-1 rounded-full">
                      انتظار التأكيد
                    </span>
                  )}
                </div>

                <div className="bg-[#1E2538]/30 rounded-xl p-3 flex flex-col gap-2 mt-1">
                  <div className="flex items-center justify-between text-white/90">
                    <div className="flex items-center gap-2 text-xs">
                      <CalendarDays size={14} className="text-[#FF8A00]" />
                      <span>{booking.appointment_date}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      <Clock size={14} className="text-[#FF8A00]" />
                      <span>{booking.appointment_time?.slice(0, 5)}</span>
                    </div>
                  </div>
                  
                  <div className="w-full h-px bg-white/5 my-1" />
                  
                  <div className="flex items-center gap-2 text-xs text-[#94A3B8] text-right">
                    <MapPin size={14} className="shrink-0" />
                    <span>{booking.address || 'عنوان غير محدد'}</span>
                  </div>
                  {booking.notes && (
                    <p className="text-[11px] text-[#6B7A99] mt-1 text-right">
                      <strong>ملاحظات العميل:</strong> {booking.notes}
                    </p>
                  )}
                </div>

                {/* Booking Status Action Buttons */}
                {(booking.status === 'confirmed' || booking.status === 'pending') && (
                  <div className="flex gap-2.5 mt-2">
                    <button
                      onClick={() => updateStatus(booking.id, 'completed', booking.client_id, booking.service_name)}
                      className="flex-1 bg-gradient-to-r from-[#22C55E]/90 to-[#22C55E] text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      <CheckCircle2 size={13} /> إكمال الخدمة
                    </button>
                    <button
                      onClick={() => updateStatus(booking.id, 'cancelled', booking.client_id, booking.service_name)}
                      className="flex-1 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 hover:bg-red-500/20 active:scale-[0.98] transition-all"
                    >
                      <XCircle size={13} /> إلغاء الموعد
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-16 bg-[#0A0D1A] rounded-3xl border border-dashed border-white/5 flex flex-col items-center justify-center">
              <CalendarDays size={36} className="text-[#6B7A99] mb-3 opacity-50" />
              <span className="text-sm font-bold text-white mb-1">لا توجد مواعيد</span>
              <span className="text-xs text-[#6B7A99]">لا يوجد لديك مواعيد مجدولة حالياً</span>
            </div>
          )}
        </div>
      </div>
    </SubPageLayout>
  )
}
