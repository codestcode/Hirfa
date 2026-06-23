'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { FormInput } from '@/components/ui/forms/FormInput'

type AddressType = 'home' | 'work' | 'other'

export default function AddNewAddressPage() {
  const router = useRouter()
  const supabase = createClient()
  const { profile } = useAuth()

  const [type, setType] = useState<AddressType>('home')
  const [label, setLabel] = useState('')
  const [city, setCity] = useState('')
  const [street, setStreet] = useState('')
  const [building, setBuilding] = useState('')
  const [apartment, setApartment] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const types: { key: AddressType; label: string; icon: string }[] = [
    { key: 'home', label: 'المنزل', icon: '🏠' },
    { key: 'work', label: 'العمل', icon: '💼' },
    { key: 'other', label: 'أخرى', icon: '📍' },
  ]

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profile) return
    if (!city.trim() || !street.trim()) return
    setSaving(true)

    const { error } = await supabase.from('addresses').insert({
      user_id: profile.id,
      type,
      label: label || null,
      city: city.trim(),
      street: street.trim(),
      building: building.trim() || null,
      apartment: apartment.trim() || null,
      notes: notes.trim() || null,
    })

    setSaving(false)
    if (error) {
      alert('حدث خطأ أثناء الحفظ')
      return
    }
    router.push('/client/addresses')
    router.refresh()
  }

  return (
    <SubPageLayout>
      <PageHeader title="إضافة عنوان جديد" />

      <form onSubmit={handleSave} className="flex flex-col gap-6 px-6 pt-2">
        <div className="h-32 rounded-2xl bg-gradient-to-br from-[#1E2538] to-[#0A0D1A] border border-white/5 overflow-hidden relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-12 h-12 rounded-full bg-[#FF8A00]/20 flex items-center justify-center">
              <MapPin size={22} className="text-[#FF8A00]" />
            </div>
          </div>
          <div className="absolute bottom-3 left-3 right-3 text-center">
            <span className="text-[10px] text-[#4B5A7A]">الخريطة قريباً</span>
          </div>
        </div>

        <div>
          <label className="text-xs text-[#6B7A99] font-bold block mb-3">نوع العنوان</label>
          <div className="grid grid-cols-3 gap-3">
            {types.map(t => (
              <button
                key={t.key}
                type="button"
                onClick={() => setType(t.key)}
                className={`h-12 rounded-xl font-bold text-sm transition-all ${
                  type === t.key
                    ? 'bg-[#FF8A00] text-[#050814] shadow-[0_0_15px_rgba(255,138,0,0.3)]'
                    : 'bg-[#0A0D1A] border border-white/10 text-[#6B7A99] hover:border-white/20'
                }`}
              >
                <span className="ml-1">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <FormInput label="المدينة / المنطقة" value={city} onChange={(e) => setCity(e.target.value)} placeholder="مثال: القاهرة، التجمع الخامس" required />
          <FormInput label="اسم الشارع ورقم المبنى" value={street} onChange={(e) => setStreet(e.target.value)} placeholder="مثال: شارع التسعين، مبنى ٢٠٤" required />
          <div className="grid grid-cols-2 gap-4">
            <FormInput label="رقم المبنى" value={building} onChange={(e) => setBuilding(e.target.value)} placeholder="اختياري" />
            <FormInput label="رقم الشقة / الطابق" value={apartment} onChange={(e) => setApartment(e.target.value)} placeholder="اختياري" />
          </div>
          <div>
            <label className="text-xs text-[#6B7A99] font-bold block mb-2">ملاحظات إضافية (اختياري)</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="أي تفاصيل إضافية تساعد في الوصول..."
              className="w-full h-24 px-4 py-3 rounded-xl bg-[#0A0D1A] border border-white/10 text-white text-sm text-right outline-none placeholder-[#4B5A7A] resize-none focus:border-[#FF8A00]/50 transition-colors"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={saving || !city.trim() || !street.trim()}
          className="w-full py-4 rounded-2xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-[#050814] font-bold text-base shadow-lg shadow-[#FF8A00]/20 hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {saving ? 'جاري الحفظ...' : 'حفظ العنوان'}
        </button>
      </form>
    </SubPageLayout>
  )
}
