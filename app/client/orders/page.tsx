'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Booking {
  id: string
  created_at: string
  appointment_date: string
  appointment_time: string
  status: string
  price: number
  worker_id: string
  worker: {
    full_name: string
    avatar_url: string | null
    profession: string | null
  } | null
}

type TabKey = 'all' | 'in_progress' | 'completed' | 'cancelled'

const TABS: { key: TabKey; label: string }[] = [
  { key: 'all', label: 'الطلبات' },
  { key: 'in_progress', label: 'قيد التنفيذ' },
  { key: 'completed', label: 'المكتملة' },
  { key: 'cancelled', label: 'الملغاة' },
]

const STATUS_MAP: Record<TabKey, string[]> = {
  all: ['pending', 'confirmed', 'in_progress', 'completed', 'closed', 'cancelled'],
  in_progress: ['confirmed', 'in_progress'],
  completed: ['completed', 'closed'],
  cancelled: ['cancelled'],
}

const STATUS_STYLES: Record<string, { label: string; color: string }> = {
  pending: { label: 'انتظار', color: '#FFA504' },
  confirmed: { label: 'قيد التنفيذ', color: '#3854CD' },
  in_progress: { label: 'قيد التنفيذ', color: '#3854CD' },
  completed: { label: 'مكتمل (بانتظار التقييم)', color: '#22C55E' },
  closed: { label: 'مكتمل ومقيم', color: '#22C55E' },
  cancelled: { label: 'ملغاة', color: '#EF4444' },
}

export default function OrdersPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<TabKey>('all')

  useEffect(() => {
    const fetchBookings = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const { data } = await supabase
        .from('bookings')
        .select('*, worker:worker_id(full_name, avatar_url, profession)')
        .eq('client_id', user.id)
        .order('created_at', { ascending: false })

      if (data) setBookings(data as unknown as Booking[])
      setLoading(false)
    }
    fetchBookings()
  }, [])

  const filteredBookings = bookings.filter((b) =>
    STATUS_MAP[activeTab].includes(b.status)
  )

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FFA504] border-t-transparent rounded-full" />
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md">
        <div className="flex items-center h-14 max-w-[512px] mx-auto px-4 relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z" fill="white" />
            </svg>
          </button>
          <h1 className="text-white text-xl w-full text-center">طلباتي</h1>
        </div>

        {/* Filter Tabs */}
        <div className="max-w-[512px] mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex gap-2 min-w-max">
            {TABS.map((tab) => {
              const isActive = activeTab === tab.key
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`px-5 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                    isActive
                      ? 'bg-[#FFA504] text-[#050B2C] font-semibold'
                      : 'bg-[#353437]/10 border border-[#C7C5CF]/20 text-[#C7C5CF] font-semibold'
                  }`}
                >
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="max-w-[512px] mx-auto px-4 pb-32">
        {filteredBookings.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh]">
            <div className="w-20 h-20 rounded-full bg-[#FFA504]/10 flex items-center justify-center mb-4">
              <svg width="32" height="32" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 18V6L8 0L16 6V18H10V11H6V18H0Z" fill="#FFA504" />
              </svg>
            </div>
            <p className="text-[#94A3B8] text-base">لا توجد طلبات</p>
          </div>
        ) : (
          <div className="space-y-4 mt-2">
            {filteredBookings.map((booking) => {
              const statusInfo = STATUS_STYLES[booking.status] || { label: booking.status, color: '#94A3B8' }
              return (
                <div
                  key={booking.id}
                  className="bg-[#0F172A]/60 rounded-2xl p-4 cursor-pointer active:scale-[0.98] transition-transform shadow-[0_4px_12px_rgba(5,11,44,0.08)]"
                  onClick={() => {
                    const target = booking.status === 'completed'
                      ? `/client/rate-review/${booking.id}`
                      : booking.status === 'closed'
                      ? `/client/order/invoice?id=${booking.id}`
                      : `/client/order/success?id=${booking.id}`
                    router.push(target)
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className="w-16 h-16 rounded-full border-2 border-[#FFA504]/10 overflow-hidden bg-[#1E2538] flex items-center justify-center text-white font-bold text-lg">
                        {booking.worker?.avatar_url ? (
                          <img src={booking.worker.avatar_url} alt="" className="w-full h-full object-cover" />
                        ) : (
                          booking.worker?.full_name?.charAt(0) || '؟'
                        )}
                      </div>
                      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white bg-[#22C55E]" />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h3 className="text-white text-xl font-semibold truncate">
                          {booking.worker?.profession || 'خدمة'}
                        </h3>
                        <span style={{ color: statusInfo.color }} className="text-sm font-bold whitespace-nowrap">
                          {statusInfo.label}
                        </span>
                      </div>
                      <p className="text-[#73799F] text-sm font-semibold mt-0.5">
                        {booking.worker?.full_name || 'حرفي'}
                      </p>

                      {/* Date & Time */}
                      <div className="flex items-center gap-3 mt-3">
                        <div className="flex items-center gap-1 text-[#73799F] text-xs font-semibold">
                          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M10.6667 1.33337V4.00004M5.33333 1.33337V4.00004M2 6.66671H14M3.33333 2.66671H12.6667C13.403 2.66671 14 3.26366 14 4.00004V13.3334C14 14.0698 13.403 14.6667 12.6667 14.6667H3.33333C2.59695 14.6667 2 14.0698 2 13.3334V4.00004C2 3.26366 2.59695 2.66671 3.33333 2.66671Z" stroke="#73799F" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{booking.appointment_date ? new Date(booking.appointment_date).toLocaleDateString('ar-EG', { weekday: 'long', day: 'numeric', month: 'long' }) : ''}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#73799F] text-xs font-semibold">
                          <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7.5 3.75V7.5L10 8.75M13.75 7.5C13.75 10.9518 10.9518 13.75 7.5 13.75C4.04822 13.75 1.25 10.9518 1.25 7.5C1.25 4.04822 4.04822 1.25 7.5 1.25C10.9518 1.25 13.75 4.04822 13.75 7.5Z" stroke="#73799F" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          <span>{booking.appointment_time || ''}</span>
                        </div>
                        {booking.price > 0 && (
                          <span className="text-[#FFA504] font-bold text-sm">{booking.price} ج.م</span>
                        )}
                      </div>

                      {/* View Details */}
                      <div className="flex justify-end mt-2">
                        <span className="text-[#FFA504] text-sm font-semibold border-b border-[#FFA504]">
                          عرض التفاصيل
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
