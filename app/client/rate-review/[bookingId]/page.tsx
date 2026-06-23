'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Star, Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'

export default function RateReviewPage() {
  const router = useRouter()
  const params = useParams()
  const bookingId = params.bookingId as string
  const supabase = createClient()

  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState('')
  const [workerName, setWorkerName] = useState('')
  const [workerProfession, setWorkerProfession] = useState('')
  const [workerAvatar, setWorkerAvatar] = useState('')
  const [workerId, setWorkerId] = useState('')
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    if (!bookingId) return
    const fetchBooking = async () => {
      const { data } = await supabase
        .from('bookings')
        .select('*, worker:worker_id(id, full_name, avatar_url, profession)')
        .eq('id', bookingId)
        .single()
      if (data) {
        const w = data.worker
        if (w) {
          setWorkerId(w.id)
          setWorkerName(w.full_name || 'حرفي')
          setWorkerProfession(w.profession || '')
          setWorkerAvatar(w.avatar_url || '')
        }
      }
      setLoading(false)
    }
    fetchBooking()
  }, [bookingId, supabase])

  const handleSubmit = async () => {
    if (rating === 0 || !workerId) return
    setSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSubmitting(false); return }

    const { error } = await supabase
      .from('reviews')
      .insert({
        client_id: user.id,
        craftsman_id: workerId,
        booking_id: bookingId,
        rating,
        text: reviewText.trim() || null,
      })

    if (error) {
      alert('فشل إرسال التقييم: ' + error.message)
      setSubmitting(false)
      return
    }

    createNotification(user.id, 'تم إضافة تقييم', `قيمت ${workerName} بتقييم ${rating} نجوم`)
    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#FFA504] border-t-transparent rounded-full" />
      </div>
    )
  }

  if (submitted) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex flex-col items-center justify-center px-4">
        <div className="w-20 h-20 rounded-full bg-green-500/10 border-2 border-green-500 flex items-center justify-center mb-6">
          <svg width="35" height="26" viewBox="0 0 35 26" fill="none">
            <path d="M12.3044 25.8871L0 13.5827L3.78266 9.8L12.3044 18.3217L30.6261 0L34.4088 3.78266L12.3044 25.8871Z" fill="#22C55E" />
          </svg>
        </div>
        <h2 className="text-white text-2xl font-bold mb-2">شكراً لتقييمك!</h2>
        <p className="text-[#94A3B8] text-sm text-center whitespace-nowrap mb-8">
          نحن نقدر وقتك في مشاركة رأيك، سنعمل على تحسين الخدمة باستمرار
        </p>
        <button
          onClick={() => router.push(`/client/order/invoice?id=${bookingId}`)}
          className="w-full max-w-[320px] py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white font-bold text-lg shadow-lg shadow-[#FF8A00]/20"
        >
          العودة للفاتورة
        </button>
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      <div className="bg-[#020617]">
        <div className="flex items-center justify-center h-14 max-w-[512px] mx-auto px-4 relative">
          <button onClick={() => router.back()} className="absolute right-4">
            <ArrowLeft size={16} className="text-[#E4E1E5]" />
          </button>
          <h1 className="text-[#E4E1E5] text-xl font-bold">تقييم الحرفي</h1>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-40">
        <div className="flex flex-col items-center pt-20">
          <div className="w-24 h-24 rounded-full border-2 border-[#FFA504] bg-[#2A2A2C] flex items-center justify-center text-white font-bold text-3xl shadow-lg overflow-hidden">
            {workerAvatar ? (
              <img src={workerAvatar} alt="" className="w-full h-full object-cover" />
            ) : (
              workerName.charAt(0) || '?'
            )}
          </div>
          <h2 className="text-white text-lg font-bold mt-2">{workerName}</h2>
          {workerProfession && (
            <p className="text-[#C7C5CF] text-sm font-bold">{workerProfession}</p>
          )}
        </div>

        <div className="flex flex-col items-center mt-8 gap-4">
          <div className="flex gap-4">
            {[1, 2, 3, 4, 5].map((star) => {
              const filled = star <= (hoverRating || rating)
              return (
                <button
                  key={star}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                >
                  <Star
                    size={34}
                    className={filled ? 'text-[#FFA504] fill-[#FFA504]' : 'text-[#909099]'}
                  />
                </button>
              )
            })}
          </div>
          <span className="text-[#FFA504] text-sm font-bold">المس لتقييم الخدمة</span>
        </div>

        <div className="mt-8">
          <textarea
            value={reviewText}
            onChange={e => setReviewText(e.target.value)}
            placeholder="اكتب تقييمك هنا..."
            className="w-full h-40 p-4 rounded-xl bg-[#0F172A]/60 text-white text-base text-right outline-none placeholder-[#6B7A99]/60 resize-none"
          />
        </div>

        <div className="flex gap-4 mt-4">
          <div className="w-20 h-20 rounded-xl border border-[#46464E] bg-[#1F1F22] overflow-hidden relative">
            <div className="absolute top-1 left-1 w-5 h-5 rounded-full bg-[#93000A]/80 flex items-center justify-center">
              <X size={9} className="text-white" />
            </div>
          </div>
          <div className="w-20 h-20 rounded-xl border-2 border-dashed border-[#909099] flex flex-col items-center justify-center">
            <Plus size={14} className="text-[#909099]" />
            <span className="text-[#909099] text-[10px] font-bold mt-1">إضافة صور</span>
          </div>
        </div>
      </div>

      <div className="fixed bottom-[80px] left-0 right-0 bg-gradient-to-b from-transparent to-[#050B2C] p-4">
        <div className="max-w-[512px] mx-auto">
          <button
            onClick={handleSubmit}
            disabled={rating === 0 || submitting}
            className="w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white font-bold text-xl shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50"
          >
            {submitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
          </button>
        </div>
      </div>
    </div>
  )
}
