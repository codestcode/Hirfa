'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { CalendarDays, Clock, MapPin, User, ChevronLeft } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { BookingStatusBadge } from '@/components/ui/BookingStatusBadge'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'

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

  const filteredBookings = bookings.filter(b => {
    if (filter === 'all') return true
    if (filter === 'completed') return b.status === 'completed'
    return b.status === 'confirmed' || b.status === 'pending'
  })

  return (
    <SubPageLayout>
      <PageHeader title="جدول المواعيد والحجوزات" isTransparent />
      <div className="px-6 py-4 pb-24">
        
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

        <div className="flex flex-col gap-4">
          {loading ? (
            <PageLoader />
          ) : filteredBookings.length ? (
            filteredBookings.map((booking) => (
              <Link
                href={`/worker/booking/${booking.id}`}
                key={booking.id} 
                className="bg-[#0A0D1A] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden hover:border-white/10 transition-colors cursor-pointer group"
              >
                <div className={`absolute top-0 right-0 w-1.5 h-full transition-colors ${
                  booking.status === 'completed' 
                    ? 'bg-[#4ADE80]' 
                    : booking.status === 'cancelled' 
                      ? 'bg-red-500' 
                      : 'bg-[#FF8A00]'
                }`} />
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#1E2538] flex items-center justify-center text-white font-bold group-hover:scale-105 transition-transform">
                      <User size={16} />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm text-right">{booking.client?.full_name || 'عميل'}</span>
                      <span className="text-[10px] text-[#6B7A99] text-right">{booking.service_name}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <BookingStatusBadge status={booking.status} />
                    <ChevronLeft size={16} className="text-[#6B7A99] mr-1" />
                  </div>
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
                    <span className="truncate">{booking.address?.split('|')[0] || 'عنوان غير محدد'}</span>
                  </div>
                </div>
              </Link>
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
