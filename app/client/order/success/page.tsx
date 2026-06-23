'use client'

import { useEffect, useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

interface BookingData {
  id: string
  appointment_date: string | null
  appointment_time: string | null
  status: string
  price: number
  address: string | null
  worker: {
    id: string
    full_name: string | null
    avatar_url: string | null
    profession: string | null
    rating: number | null
  } | null
}

const STEPS = [
  { label: 'تم الاستلام', key: 'received' },
  { label: 'جاري التعيين', key: 'assigning' },
  { label: 'الحرفي في الطريق', key: 'en_route' },
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

  const getActiveStep = (status: string) => {
    if (status === 'pending') return 0
    if (status === 'confirmed') return 1
    return 2
  }

  const steps = STEPS.map((s, i) => ({
    ...s,
    completed: i < getActiveStep(booking?.status || 'pending'),
    active: i === getActiveStep(booking?.status || 'pending'),
  }))

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FFA504] border-t-transparent rounded-full" />
      </div>
    )
  }

  const worker = booking?.worker

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-14 max-w-[512px] mx-auto px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-semibold">تتبع الطلب</h1>
          <div className="w-6" />
        </div>
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
            <h2 className="text-white text-base font-bold mt-4">تم إرسال طلبك بنجاح!</h2>
            <p className="text-[#C7C5CF] text-sm mt-2 text-center whitespace-nowrap overflow-hidden text-ellipsis max-w-full px-4">
              طلبك رقم #{bookingId.slice(0, 8)} قيد المعالجة الآن، الحرفي في الطريق إليك.
            </p>
          </div>

          {worker && (
            <div className="mt-6 bg-[#0F172A]/60 rounded-xl p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button className="w-10 h-10 rounded-full bg-[#FFA504] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M22 16.92V19.92C22.0001 20.1985 21.9384 20.4731 21.8197 20.7243C21.7009 20.9754 21.5282 21.1965 21.3141 21.3707C21.0999 21.545 20.8502 21.6679 20.5829 21.7296C20.3155 21.7914 20.0376 21.7903 19.7707 21.7264C16.6332 21.0051 13.6817 19.5438 11.16 17.46C9.22028 15.8468 7.61768 13.8741 6.43 11.67C4.61994 8.45677 3.63892 4.81587 3.59 1.09C3.59037 0.826519 3.64973 0.566638 3.76365 0.330439C3.87757 0.0942394 4.04285 -0.112037 4.24624 -0.275053C4.44963 -0.43807 4.68604 -0.553333 4.93808 -0.612342C5.19012 -0.671352 5.45128 -0.672413 5.70379 -0.61544L8.70379 0.0445602C9.23142 0.15548 9.70283 0.449404 10.0405 0.875296C10.3782 1.30119 10.5616 1.8324 10.56 2.37956C10.5354 3.501 10.6402 4.62109 10.872 5.71956C10.969 6.16957 10.9937 6.63525 10.9445 7.095C10.8954 7.55476 10.7734 7.99994 10.585 8.40956L9.28 11.0896C10.9121 14.4332 13.683 17.1152 17.09 18.6396L19.39 17.3296C19.7969 17.1286 20.2432 16.9971 20.704 16.9429C21.1648 16.8888 21.6327 16.9131 22.0844 17.0144C22.5361 17.1158 22.9632 17.2922 23.3451 17.534C23.727 17.7758 24.0562 18.0784 24.3157 18.4266C24.5752 18.7748 24.76 19.1611 24.8597 19.5688C24.9594 19.9765 24.972 20.3973 24.8968 20.8063C24.8216 21.2152 24.6601 21.6041 24.4215 21.9464C24.1829 22.2887 23.8721 22.5773 23.5128 22.7934L22 16.92Z" fill="#0F172A" />
                    </svg>
                  </button>
                  <button className="w-10 h-10 rounded-full border border-[#FFA504] flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 15C21 15.5304 20.7893 16.0391 20.4142 16.4142C20.0391 16.7893 19.5304 17 19 17H7L3 21V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H19C19.5304 3 20.0391 3.21071 20.4142 3.58579C20.7893 3.96086 21 4.46957 21 5V15Z" stroke="#FFA504" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
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

          <div className="mt-6">
            <h3 className="text-[#C7C5CF] text-base mb-4">حالة الطلب المباشرة</h3>
            <div className="pr-4 relative">
              <div className="absolute right-2 top-0 w-0.5 h-full bg-[#46464E]" />
              <div className="space-y-8">
                {steps.map((step, idx) => (
                  <div key={idx} className="flex items-center gap-4 relative">
                    <div className={`w-4 h-4 rounded-full border-2 border-white flex-shrink-0 relative z-10 ${
                      step.active ? 'bg-[#FFA504]' : step.completed ? 'bg-green-500' : 'bg-[#46464E]'
                    }`} />
                    <div>
                      <p className={`text-base ${step.active ? 'text-[#FFA504]' : 'text-white'}`}>{step.label}</p>
                      <p className="text-[#C7C5CF] text-sm">جاري التحديث...</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-6 h-56 rounded-xl border border-[#46464E]/30 bg-[#1F1F22] overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-b from-[#050B2C]/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm rounded-lg p-2 flex items-center justify-between">
              <div className="bg-[#FFDDB7] rounded px-2 py-1">
                <span className="text-[#653E00] text-sm">2.4 كم</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[#050B2C] text-sm">{booking?.address || 'مركز بلقاس - المنصوره'}</span>
                <div className="w-8 h-8 rounded-full bg-[#FFA504]/20 flex items-center justify-center">
                  <svg width="10" height="12" viewBox="0 0 10 12" fill="none"><path d="M4.66667 5.83333C4.9875 5.83333 5.26215 5.7191 5.49062 5.49062C5.7191 5.26215 5.83333 4.9875 5.83333 4.66667C5.83333 4.34583 5.7191 4.07118 5.49062 3.84271C5.26215 3.61424 4.9875 3.5 4.66667 3.5C4.34583 3.5 4.07118 3.61424 3.84271 3.84271C3.61424 4.07118 3.5 4.34583 3.5 4.66667C3.5 4.9875 3.61424 5.26215 3.84271 5.49062C4.07118 5.7191 4.34583 5.83333 4.66667 5.83333ZM4.66667 10.1208C5.85278 9.03194 6.73264 8.04271 7.30625 7.15312C7.87986 6.26354 8.16667 5.47361 8.16667 4.78333C8.16667 3.72361 7.82882 2.8559 7.15312 2.18021C6.47743 1.50451 5.64861 1.16667 4.66667 1.16667C3.68472 1.16667 2.8559 1.50451 2.18021 2.18021C1.50451 2.8559 1.16667 3.72361 1.16667 4.78333C1.16667 5.47361 1.45347 6.26354 2.02708 7.15312C2.60069 8.04271 3.48056 9.03194 4.66667 10.1208Z" fill="#FFA504"/></svg>
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
