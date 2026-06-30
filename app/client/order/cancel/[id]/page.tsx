'use client'

import { Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { useClientBooking } from '@/hooks/useClientBooking'

function CancelContent() {
  const router = useRouter()
  const params = useParams()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/client/home'
  const { cancelBooking, submitting } = useClientBooking()
  const bookingId = (params.id as string) || ''

  const handleConfirmCancel = async () => {
    if (!bookingId) {
      router.push(returnTo)
      return
    }
    await cancelBooking(bookingId)
    router.push(returnTo)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      <div className="bg-[#020617]">
        <div className="flex items-center h-14 max-w-[512px] mx-auto px-4">
          <div className="flex items-center gap-4">
            <button onClick={() => router.back()}>
              <ArrowLeft size={16} className="text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 min-h-[calc(100vh-56px)] flex flex-col items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 rounded-full bg-[#FFA504]/20 flex items-center justify-center relative">
            <div className="w-24 h-24 rounded-full bg-[#FF1414]/80 flex items-center justify-center">
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path d="M12.8 30L20 22.8L27.2 30L30 27.2L22.8 20L30 12.8L27.2 10L20 17.2L12.8 10L10 12.8L17.2 20L10 27.2L12.8 30ZM20 40C17.2333 40 14.6333 39.475 12.2 38.425C9.76667 37.375 7.65 35.95 5.85 34.15C4.05 32.35 2.625 30.2333 1.575 27.8C0.525 25.3667 0 22.7667 0 20C0 17.2333 0.525 14.6333 1.575 12.2C2.625 9.76667 4.05 7.65 5.85 5.85C7.65 4.05 9.76667 2.625 12.2 1.575C14.6333 0.525 17.2333 0 20 0C22.7667 0 25.3667 0.525 27.8 1.575C30.2333 2.625 32.35 4.05 34.15 5.85C35.95 7.65 37.375 9.76667 38.425 12.2C39.475 14.6333 40 17.2333 40 20C40 22.7667 39.475 25.3667 38.425 27.8C37.375 30.2333 35.95 32.35 34.15 34.15C32.35 35.95 30.2333 37.375 27.8 38.425C25.3667 39.475 22.7667 40 20 40Z" fill="#FFCCCB"/>
              </svg>
            </div>
          </div>

          <h2 className="text-white text-2xl mt-6 text-center">تم إلغاء طلب الحجز بنجاح</h2>
          <p className="text-[#C7C5CF] text-base mt-2 text-center">يمكنك إعادة الحجز في أي وقت آخر</p>
        </div>

        <div className="w-full mt-12 space-y-4">
          <button
            onClick={handleConfirmCancel}
            disabled={submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white font-bold text-base shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50"
          >
            {submitting ? 'جاري...' : 'العودة لملف الحرفي'}
          </button>
          <button
            onClick={() => router.push('/client/home')}
            className="w-full py-4 rounded-xl bg-gradient-to-l from-[#44474E] to-[#C4C6CF]/30 text-white font-bold text-base"
          >
            العودة للشاشة الرئيسية
          </button>
        </div>
      </div>
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <CancelContent />
    </Suspense>
  )
}
