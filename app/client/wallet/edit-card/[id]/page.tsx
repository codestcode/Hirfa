'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CARD_BRANDS = ['visa', 'mastercard', 'mada']

export default function EditCardPage() {
  const router = useRouter()
  const params = useParams()
  const supabase = createClient()
  const cardId = params.id as string
  const [cardHolder, setCardHolder] = useState('')
  const [cardNumber, setCardNumber] = useState('')
  const [expiryDate, setExpiryDate] = useState('')
  const [brand, setBrand] = useState('visa')
  const [isDefault, setIsDefault] = useState(false)
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!cardId) return
    const fetchCard = async () => {
      const { data } = await supabase.from('saved_cards').select('*').eq('id', cardId).single()
      if (data) {
        setCardHolder(data.card_holder)
        setCardNumber('**** **** **** ' + data.last_four)
        setExpiryDate(data.expiry_date)
        setBrand(data.brand)
        setIsDefault(data.is_default)
      }
      setLoading(false)
    }
    fetchCard()
  }, [cardId, supabase])

  const handleSave = async () => {
    if (!cardHolder.trim()) return
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setSaving(false); return }
    if (isDefault) {
      await supabase.from('saved_cards').update({ is_default: false }).eq('user_id', user.id).neq('id', cardId)
    }
    const { error } = await supabase.from('saved_cards').update({
      card_holder: cardHolder.trim(),
      brand,
      expiry_date: expiryDate,
      is_default: isDefault,
    }).eq('id', cardId)
    setSaving(false)
    if (error) { alert('فشل تحديث البطاقة: ' + error.message); return }
    router.back()
  }

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من حذف هذه البطاقة؟')) return
    const { error } = await supabase.from('saved_cards').delete().eq('id', cardId)
    if (error) { alert('فشل حذف البطاقة: ' + error.message); return }
    router.back()
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#FF8A00] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center h-14 max-w-[512px] mx-auto px-4 relative">
          <button onClick={() => router.back()} className="absolute left-4">
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-bold w-full text-center">تعديل البطاقة</h1>
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-32">
        <div className="mt-6 p-6 rounded-2xl bg-gradient-to-br from-[#0F172A]/80 to-[#0A0D1A] border border-white/5">
          <div className="space-y-5">
            <div>
              <label className="text-[#94A3B8] text-xs font-bold block mb-2">اسم حامل البطاقة</label>
              <input
                value={cardHolder}
                onChange={e => setCardHolder(e.target.value)}
                placeholder="الاسم على البطاقة"
                className="w-full h-12 px-4 rounded-xl bg-[#020617] border border-white/10 text-white text-sm outline-none placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-[#94A3B8] text-xs font-bold block mb-2">رقم البطاقة</label>
              <input
                value={cardNumber}
                disabled
                className="w-full h-12 px-4 rounded-xl bg-[#020617] border border-white/10 text-white text-sm outline-none opacity-60 cursor-not-allowed"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-[#94A3B8] text-xs font-bold block mb-2">تاريخ الانتهاء</label>
                <input
                  value={expiryDate}
                  onChange={e => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 4)
                    setExpiryDate(digits.length > 2 ? digits.slice(0, 2) + '/' + digits.slice(2) : digits)
                  }}
                  placeholder="MM/YY"
                  dir="ltr"
                  className="w-full h-12 px-4 rounded-xl bg-[#020617] border border-white/10 text-white text-sm outline-none placeholder-[#4B5A7A] focus:border-[#FF8A00]/50 transition-colors text-left"
                />
              </div>
              <div />
            </div>
            <div>
              <label className="text-[#94A3B8] text-xs font-bold block mb-2">نوع البطاقة</label>
              <div className="grid grid-cols-3 gap-2">
                {CARD_BRANDS.map(b => (
                  <button
                    key={b}
                    onClick={() => setBrand(b)}
                    className={`py-3 rounded-xl text-sm font-bold transition border ${
                      brand === b ? 'border-[#FF8A00] bg-[#FF8A00]/10 text-[#FF8A00]' : 'border-white/10 bg-[#020617] text-[#94A3B8]'
                    }`}
                  >
                    {b === 'visa' ? 'Visa' : b === 'mastercard' ? 'Mastercard' : 'مدى'}
                  </button>
                ))}
              </div>
            </div>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                onClick={() => setIsDefault(!isDefault)}
                className={`w-5 h-5 rounded border-2 flex items-center justify-center transition ${
                  isDefault ? 'bg-[#FF8A00] border-[#FF8A00]' : 'border-[#46464E]'
                }`}
              >
                {isDefault && <svg width="10" height="8" viewBox="0 0 10 8" fill="none"><path d="M3.325 7.01458L0 3.68958L0.83125 2.85833L3.325 5.35208L8.67708 0L9.50833 0.83125L3.325 7.01458Z" fill="#282E50"/></svg>}
              </div>
              <span className="text-white text-sm">تعيين كبطكة افتراضية</span>
            </label>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button
            onClick={handleDelete}
            className="flex-1 py-4 rounded-xl bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] font-bold text-lg flex items-center justify-center gap-2"
          >
            <Trash2 size={18} />
            حذف البطاقة
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !cardHolder.trim()}
            className="flex-1 py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white font-bold text-lg shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50"
          >
            {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
          </button>
        </div>
      </div>
    </div>
  )
}


export function generateStaticParams() {
  return [];
}
