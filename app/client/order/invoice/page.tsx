'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface BookingData {
  id: string
  price: number
  payment_method: string | null
  status: string
  created_at: string
  worker: {
    id: string
    full_name: string | null
    avatar_url: string | null
    profession: string | null
    rating: number | null
  } | null
}

function InvoiceContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const bookingId = searchParams.get('id') || ''
  const [booking, setBooking] = useState<BookingData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!bookingId) { setLoading(false); setError(true); return }
    const fetchBooking = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('bookings')
        .select('*, worker:worker_id(id, full_name, avatar_url, profession, rating)')
        .eq('id', bookingId)
        .single()
      if (data) setBooking(data as unknown as BookingData)
      else setError(true)
      setLoading(false)
    }
    fetchBooking()
  }, [bookingId])

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('ar-EG') + ' ج.م'

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FFA504] border-t-transparent rounded-full" />
      </div>
    )
  }

  const worker = booking?.worker
  const inspectionFee = booking ? Math.round(booking.price * 0.3) : 0
  const laborFee = booking ? booking.price - inspectionFee : 0

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md">
        <div className="flex items-center h-16 max-w-[512px] mx-auto px-4 relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.4 14L0 12.6L5.6 7L0 1.4L1.4 0L7 5.6L12.6 0L14 1.4L8.4 7L14 12.6L12.6 14L7 8.4L1.4 14Z" fill="white" />
            </svg>
          </button>
          <h1 className="text-white text-xl font-bold w-full text-center">الفاتورة النهائية</h1>
        </div>
      </div>

      {error ? (
        <div className="max-w-[512px] mx-auto px-4 pt-20 text-center">
          <p className="text-[#EF4444] text-lg">لم يتم العثور على الطلب</p>
        </div>
      ) : (
        <div className="max-w-[512px] mx-auto px-4 pb-32">
          {/* Success Illustration */}
          <div className="flex flex-col items-center pt-10">
            <div className="relative">
              <div className="w-20 h-20 rounded-full bg-[#FFA504] flex items-center justify-center shadow-[0_10px_15px_-3px_rgba(255,165,0,0.20)]">
                <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.3333 24.3333L26.0833 12.5833L23.75 10.25L14.3333 19.6667L9.58333 14.9167L7.25 17.25L14.3333 24.3333ZM16.6667 33.3333C14.3611 33.3333 12.1944 32.8958 10.1667 32.0208C8.13889 31.1458 6.375 29.9583 4.875 28.4583C3.375 26.9583 2.1875 25.1944 1.3125 23.1667C0.4375 21.1389 0 18.9722 0 16.6667C0 14.3611 0.4375 12.1944 1.3125 10.1667C2.1875 8.13889 3.375 6.375 4.875 4.875C6.375 3.375 8.13889 2.1875 10.1667 1.3125C12.1944 0.4375 14.3611 0 16.6667 0C18.9722 0 21.1389 0.4375 23.1667 1.3125C25.1944 2.1875 26.9583 3.375 28.4583 4.875C29.9583 6.375 31.1458 8.13889 32.0208 10.1667C32.8958 12.1944 33.3333 14.3611 33.3333 16.6667C33.3333 18.9722 32.8958 21.1389 32.0208 23.1667C31.1458 25.1944 29.9583 26.9583 28.4583 28.4583C26.9583 29.9583 25.1944 31.1458 23.1667 32.0208C21.1389 32.8958 18.9722 33.3333 16.6667 33.3333Z" fill="white" />
                </svg>
              </div>
            </div>
            <h2 className="text-white text-2xl font-bold mt-4">شكراً لاستخدامك حرفة</h2>
            <p className="text-[#73799F] text-base mt-2 text-center">
              تم إتمام الخدمة بنجاح، إليك تفاصيل التكلفة
            </p>
          </div>

          {/* Receipt Card */}
          <div className="mt-8 bg-white rounded-xl overflow-hidden shadow-[0_4px_12px_rgba(5,11,44,0.08)]">
            <div className="px-6 pt-6 pb-4">
              <p className="text-[#909099] text-xs font-medium text-right">تفاصيل الدفع</p>

              <div className="mt-4 space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-[#020617] text-lg">{formatCurrency(inspectionFee)}</span>
                  <span className="text-[#020617] text-base">سعر المعاينة</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#020617] text-lg">{formatCurrency(laborFee)}</span>
                  <span className="text-[#020617] text-base">تكلفة المصنعية</span>
                </div>
              </div>

              <div className="border-t border-dashed border-[#909099]/20 my-4" />

              <div className="flex justify-between items-center pt-2">
                <span className="text-[#020617] text-xl font-bold">{formatCurrency(booking?.price || 0)}</span>
                <span className="text-[#020617] text-xl font-bold">الإجمالي</span>
              </div>
            </div>

            {/* Status Badge */}
            <div className="px-6 py-4 bg-[#F8FAFC]">
              <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full border border-[#BBF7D0] bg-[#DCFCE7]/50">
                <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M1.16667 9.33333C0.845833 9.33333 0.571181 9.2191 0.342708 8.99063C0.114236 8.76215 0 8.4875 0 8.16667V1.75H1.16667V8.16667H11.0833V9.33333H1.16667ZM3.5 7C3.17917 7 2.90451 6.88576 2.67604 6.65729C2.44757 6.42882 2.33333 6.15417 2.33333 5.83333V1.16667C2.33333 0.845833 2.44757 0.571181 2.67604 0.342708C2.90451 0.114236 3.17917 0 3.5 0H11.6667C11.9875 0 12.2622 0.114236 12.4906 0.342708C12.7191 0.571181 12.8333 0.845833 12.8333 1.16667V5.83333C12.8333 6.15417 12.7191 6.42882 12.4906 6.65729C12.2622 6.88576 11.9875 7 11.6667 7H3.5ZM4.66667 5.83333C4.66667 5.5125 4.55243 5.23785 4.32396 5.00938C4.09549 4.7809 3.82083 4.66667 3.5 4.66667V5.83333H4.66667ZM10.5 5.83333H11.6667V4.66667C11.3458 4.66667 11.0712 4.7809 10.8427 5.00938C10.6142 5.23785 10.5 5.5125 10.5 5.83333ZM7.58333 5.25C8.06944 5.25 8.48264 5.07986 8.82292 4.73958C9.16319 4.39931 9.33333 3.98611 9.33333 3.5C9.33333 3.01389 9.16319 2.60069 8.82292 2.26042C8.48264 1.92014 8.06944 1.75 7.58333 1.75C7.09722 1.75 6.68403 1.92014 6.34375 2.26042C6.00347 2.60069 5.83333 3.01389 5.83333 3.5C5.83333 3.98611 6.00347 4.39931 6.34375 4.73958C6.68403 5.07986 7.09722 5.25 7.58333 5.25ZM3.5 2.33333C3.82083 2.33333 4.09549 2.2191 4.32396 1.99063C4.55243 1.76215 4.66667 1.4875 4.66667 1.16667H3.5V2.33333ZM11.6667 2.33333V1.16667H10.5C10.5 1.4875 10.6142 1.76215 10.8427 1.99063C11.0712 2.2191 11.3458 2.33333 11.6667 2.33333Z" fill="#15803D" />
                </svg>
                <span className="text-[#166534] text-sm font-semibold">
                  {booking?.payment_method === 'cash' ? 'تم الدفع نقداً' : 'تم الدفع'}
                </span>
              </div>
            </div>

            {/* Craftsman Profile */}
            {worker && (
              <div className="px-6 py-4 border-t border-[#F1F5F9] flex items-center gap-4">
                <div className="flex items-center gap-1">
                  <span className="text-[#020617] text-sm font-semibold">{worker.rating?.toFixed(1) || '٤.٩'}</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.23125 11.0833L3.17917 6.98542L0 4.22917L4.2 3.86458L5.83333 0L7.46667 3.86458L11.6667 4.22917L8.4875 6.98542L9.43542 11.0833L5.83333 8.91042L2.23125 11.0833Z" fill="#FFA500" />
                  </svg>
                </div>
                <div className="flex-1 text-right">
                  <p className="text-[#020617] text-sm font-semibold">{worker.full_name || 'حرفي'}</p>
                  <p className="text-[#909099] text-xs font-medium">{worker.profession || 'حرفي معتمد'}</p>
                </div>
                <div className="w-12 h-12 rounded-full border-2 border-white overflow-hidden shadow-sm flex items-center justify-center bg-[#E2E8F0]">
                  {worker.avatar_url ? (
                    <img src={worker.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-[#64748B] font-bold text-sm">
                      {worker.full_name?.charAt(0) || '?'}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Bottom Button */}
      {!error && booking && (
        <div className="fixed bottom-[80px] left-0 right-0 z-40 bg-[#050B2C]/60 backdrop-blur-md">
          <div className="max-w-[512px] mx-auto px-4 py-4">
            {booking.status === 'closed' ? (
              <button
                onClick={() => router.push('/client/home')}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white text-xl font-bold shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20)]"
              >
                العودة للرئيسية
              </button>
            ) : (
              <button
                onClick={() => router.push(`/client/rate-review/${bookingId}`)}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white text-xl font-bold shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20)]"
              >
                إنهاء الطلب وتقييم الحرفي
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default function InvoicePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <InvoiceContent />
    </Suspense>
  )
}
