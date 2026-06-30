'use client'

import { useState, Suspense, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ArrowLeft, Shield, Calendar, Wrench } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useCraftsmanProfile } from '@/hooks/useCraftsmanProfile'
import { useClientBooking } from '@/hooks/useClientBooking'
import { createNotification } from '@/lib/notifications'

function ConfirmContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const workerId = searchParams.get('workerId') || ''
  const date = searchParams.get('date') || ''
  const time = searchParams.get('time') || ''
  const notes = searchParams.get('notes') || ''
  const serviceName = searchParams.get('serviceName') || ''
  const servicePriceParam = searchParams.get('servicePrice') || ''
  const address = searchParams.get('address') || ''
  const lat = searchParams.get('lat') || null
  const lng = searchParams.get('lng') || null

  const supabase = createClient()
  const { profile } = useCraftsmanProfile(workerId)
  const { createBooking, submitting } = useClientBooking()
  const [paymentMethod, setPaymentMethod] = useState('cash')
  const [savedCards, setSavedCards] = useState<any[]>([])
  const [selectedCardId, setSelectedCardId] = useState<string>('')
  const [images, setImages] = useState<string[]>([])

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('bookingImages')
      if (stored) {
        setImages(JSON.parse(stored))
      }
    } catch (e) {
      console.error(e)
    }
  }, [])

  useEffect(() => {
    async function loadCards() {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data } = await supabase
          .from('saved_cards')
          .select('*')
          .eq('user_id', user.id)
          .order('is_default', { ascending: false })
        if (data) {
          setSavedCards(data)
          if (data.length > 0) {
            setSelectedCardId(data[0].id)
          }
        }
      }
    }
    loadCards()
  }, [supabase])

  const servicePrice = servicePriceParam ? parseFloat(servicePriceParam) : 150
  const totalAmount = servicePrice

  const handleConfirm = async () => {
    if (!profile) return
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      alert('يجب تسجيل الدخول أولاً')
      return
    }

    if (paymentMethod === 'card' && !selectedCardId) {
      alert('يرجى اختيار بطاقة دفع أو إضافة بطاقة جديدة.')
      return
    }

    if (paymentMethod === 'wallet') {
      const { data: clientProfile } = await supabase
        .from('profiles')
        .select('wallet_balance')
        .eq('id', user.id)
        .single()
      
      const balance = clientProfile?.wallet_balance || 0
      if (balance < totalAmount) {
        alert(`رصيد المحفظة غير كافٍ. رصيدك الحالي: ${balance} ج.م. يرجى شحن المحفظة أو اختيار طريقة دفع أخرى.`)
        return
      }

      await supabase
        .from('profiles')
        .update({ wallet_balance: balance - totalAmount })
        .eq('id', user.id)
    }

    const finalAddress = (lat && lng) ? `${address} | ${lat},${lng}` : address

    const booking = await createBooking({
      worker_id: workerId,
      service_name: serviceName || profile.profession || 'خدمة',
      appointment_date: date,
      appointment_time: time,
      address: finalAddress,
      notes,
      payment_method: paymentMethod,
      total_amount: totalAmount,
      lat: lat ? parseFloat(lat) : undefined,
      lng: lng ? parseFloat(lng) : undefined,
      images: images
    })

    if (booking) {
      if (paymentMethod === 'wallet') {
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'payment',
          amount: -totalAmount,
          description: `دفع من المحفظة للحجز #${booking.id}`
        })
      } else if (paymentMethod === 'card') {
        await supabase.from('transactions').insert({
          user_id: user.id,
          type: 'payment',
          amount: -totalAmount,
          description: `دفع بالبطاقة للحجز #${booking.id}`
        })
      }
      
      createNotification(user.id, 'تم تأكيد الحجز', `تم حجز ${serviceName || profile?.profession || 'خدمة'} بنجاح في ${dateStr}`)
      sessionStorage.removeItem('bookingImages')
      router.replace(`/client/order/success?id=${booking.id}`)
    }
  }

  if (!workerId) return <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white text-sm">بيانات غير صالحة</div>

  const dateObj = new Date(date)
  const dateStr = dateObj.toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-14 max-w-[512px] mx-auto px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-semibold">ملخص الحجز</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-40">
        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-3 py-5 rounded-xl border-2 border-dashed border-[#FFA504]/30 bg-[#FFA504]/5 mb-6">
            <div className="w-10 h-10 rounded-full bg-[#FFA504]/20 flex items-center justify-center">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="2" width="16" height="16" rx="3" stroke="#FFA504" strokeWidth="1.5"/>
                <circle cx="10" cy="10" r="2.5" stroke="#FFA504" strokeWidth="1.2"/>
                <path d="M6 2V4" stroke="#FFA504" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M14 2V4" stroke="#FFA504" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M2 7H18" stroke="#FFA504" strokeWidth="1.2"/>
              </svg>
            </div>
            <span className="text-[#FFA504] text-base font-medium">مسح QR الخاص بالحرفي</span>
          </button>
        </div>

        <div className="mt-4 bg-[#0F172A]/60 rounded-xl p-4 shadow-[0_4px_12px_rgba(5,11,44,0.08)]">
          <div className="flex items-start gap-4 pb-4 border-b border-white/5">
            <div className="w-16 h-16 rounded-lg bg-[#FFA504]/10 flex items-center justify-center flex-shrink-0">
              <Wrench size={22} className="text-[#FFA504]" />
            </div>
            <div className="flex-1">
              <h3 className="text-white text-base font-medium">{serviceName || profile?.profession || 'خدمة'}</h3>
              <div className="flex items-center gap-1 mt-1">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M4.66667 4.66667C4.025 4.66667 3.47569 4.43819 3.01875 3.98125C2.56181 3.52431 2.33333 2.975 2.33333 2.33333C2.33333 1.69167 2.56181 1.14236 3.01875 0.685417C3.47569 0.228472 4.025 0 4.66667 0C5.30833 0 5.85764 0.228472 6.31458 0.685417C6.77153 1.14236 7 1.69167 7 2.33333C7 2.975 6.77153 3.52431 6.31458 3.98125C5.85764 4.43819 5.30833 4.66667 4.66667 4.66667ZM0 9.33333V7.7C0 7.36944 0.0850694 7.06563 0.255208 6.78854C0.425347 6.51146 0.651389 6.3 0.933333 6.15417C1.53611 5.85278 2.14861 5.62674 2.77083 5.47604C3.39306 5.32535 4.025 5.25 4.66667 5.25C5.30833 5.25 5.94028 5.32535 6.5625 5.47604C7.18472 5.62674 7.79722 5.85278 8.4 6.15417C8.68194 6.3 8.90799 6.51146 9.07812 6.78854C9.24826 7.06563 9.33333 7.36944 9.33333 7.7V9.33333H0Z" fill="#94A3B8"/></svg>
                <span className="text-[#94A3B8] text-sm">{profile?.full_name || 'الحرفي'}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 py-4 border-b border-white/5">
            <Calendar size={15} className="text-[#94A3B8]" />
            <span className="text-white text-sm">{dateStr} - {time}</span>
          </div>

          <div className="pt-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[#94A3B8] text-sm">{servicePrice} جنيه</span>
              <span className="text-[#94A3B8] text-sm">سعر المعاينة</span>
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/5">
              <span className="text-white text-sm font-bold">{totalAmount} جنيه</span>
              <span className="text-white text-sm font-bold">إجمالي المبلغ</span>
            </div>
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-[#E4E1E5] font-bold text-base mb-4">طريقة الدفع</h3>
          <div className="space-y-2">
            <button
              onClick={() => setPaymentMethod('cash')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                paymentMethod === 'cash' ? 'border-[#FFA504] bg-white/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                paymentMethod === 'cash' ? 'bg-[#FFA504]' : 'border-2 border-[#46464E]'
              }`}>
                {paymentMethod === 'cash' && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M3.325 7.01458L0 3.68958L0.83125 2.85833L3.325 5.35208L8.67708 0L9.50833 0.83125L3.325 7.01458Z" fill="#282E50"/></svg>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#E4E1E5] text-base">نقداً (كاش)</span>
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none"><path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9Z" fill="#FFCB8D"/></svg>
              </div>
            </button>
            <button
              onClick={() => setPaymentMethod('card')}
              className={`w-full flex items-center justify-between p-4 rounded-xl border transition ${
                paymentMethod === 'card' ? 'border-[#FFA504] bg-white/10' : 'border-white/10 bg-white/5'
              }`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                paymentMethod === 'card' ? 'bg-[#FFA504]' : 'border-2 border-[#46464E]'
              }`}>
                {paymentMethod === 'card' && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M3.325 7.01458L0 3.68958L0.83125 2.85833L3.325 5.35208L8.67708 0L9.50833 0.83125L3.325 7.01458Z" fill="#282E50"/></svg>
                )}
              </div>
              <div className="flex items-center gap-4">
                <span className="text-[#E4E1E5] text-base">بطاقة ائتمان</span>
                <svg width="20" height="16" viewBox="0 0 20 16" fill="none"><path d="M2 4H18V2H2V4ZM2 8V14H18V8H2Z" fill="#909099"/></svg>
              </div>
            </button>

            {paymentMethod === 'card' && (
              <div className="mt-3 mr-6 pl-4 border-r border-[#FFA504]/30 flex flex-col gap-3">
                {savedCards.length > 0 ? (
                  <>
                    <p className="text-xs text-[#94A3B8] font-semibold text-right">اختر من بطاقاتك المحفوظة:</p>
                    {savedCards.map(c => {
                      const isSel = selectedCardId === c.id
                      return (
                        <div
                          key={c.id}
                          onClick={() => setSelectedCardId(c.id)}
                          className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition ${
                            isSel ? 'border-[#FF8A00] bg-[#FF8A00]/5' : 'border-white/5 bg-white/3'
                          }`}
                        >
                          <span className="text-xs text-white/50">{c.expiry_date}</span>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold text-white">•••• {c.last_four}</span>
                            <span className="text-xs font-bold uppercase text-[#FFA504]">{c.brand}</span>
                          </div>
                        </div>
                      )
                    })}
                  </>
                ) : (
                  <p className="text-xs text-red-400 text-right">لا توجد بطاقات محفوظة لديك.</p>
                )}
                <button
                  onClick={() => router.push('/client/wallet/add-card')}
                  className="text-xs text-[#FF8A00] hover:underline font-bold text-right self-start"
                >
                  + إضافة بطاقة دفع جديدة
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center opacity-50">
          <Shield size={24} className="text-white" />
          <p className="text-white text-sm mt-2 text-center">عملية دفع آمنة بنسبة ١٠٠٪<br />جميع حقوقك محفوظة لدى حرفة</p>
        </div>
      </div>

      <div className="fixed bottom-28 left-0 right-0 bg-[#020617] backdrop-blur-lg border-t border-white/5 p-4">
        <div className="max-w-[512px] mx-auto flex gap-3">
          <button
            onClick={() => router.back()}
            className="flex-1 py-4 rounded-xl bg-gradient-to-l from-[#44474E] to-[#C4C6CF]/30 text-white text-lg font-medium"
          >
            إلغاء الحجز
          </button>
          <button
            onClick={handleConfirm}
            disabled={submitting}
            className="flex-1 py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white text-lg font-medium shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50"
          >
            {submitting ? 'جاري...' : 'تأكيد الحجز والدفع'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ConfirmBookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#020617]" />}>
      <ConfirmContent />
    </Suspense>
  )
}
