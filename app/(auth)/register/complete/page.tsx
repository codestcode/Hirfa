'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Building2, MapPin, Briefcase, Phone, Save } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { AuthInput } from '@/components/shared/AuthInput'

const GOVERNORATES = [
  'القاهرة', 'الجيزة', 'الإسكندرية', 'الدقهلية', 'البحيرة', 'الشرقية',
  'المنوفية', 'الغربية', 'كفر الشيخ', 'دمياط', 'بورسعيد', 'الإسماعيلية',
  'السويس', 'شمال سيناء', 'جنوب سيناء', 'الفيوم', 'بني سويف', 'المنيا',
  'أسيوط', 'سوهاج', 'قنا', 'الأقصر', 'أسوان', 'البحر الأحمر',
  'الوادي الجديد', 'مطروح',
]

const PROFESSIONS = [
  'كهربائي', 'سباك', 'نجار', 'حداد', 'دهان', 'مقاول بناء',
  'تكييف وتبريد', 'صيانة أجهزة كهربائية', 'تركيب سيراميك',
  'ألومنيوم وزجاج', 'حارس أمن', 'شغل الحدائق', 'أخرى',
]

const locationData: Record<string, string[]> = {
  'القاهرة': ['مدينة نصر', 'مصر الجديدة', 'المعادي', 'التجمع الخامس', 'شبرا'],
  'الجيزة': ['الدقي', 'المهندسين', 'الهرم', '6 أكتوبر', 'الشيخ زايد'],
  'الإسكندرية': ['سموحة', 'المنتزه', 'محرم بك', 'لوران', 'جليم']
}

export function CompleteOAuthPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'client'
  
  const [phone, setPhone] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [area, setArea] = useState('')
  const [profession, setProfession] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [focusField, setFocusField] = useState<string | null>(null)
  const [professionsList, setProfessionsList] = useState<string[]>(PROFESSIONS)

  useEffect(() => {
    const supabase = createClient()
    const fetchCategories = async () => {
      const { data } = await supabase.from('categories').select('label_ar')
      if (data && data.length > 0) {
        setProfessionsList(data.map(c => c.label_ar))
      }
    }
    fetchCategories()
  }, [])

  const isClient = role === 'client'
  const isWorker = role === 'worker'

  const isValid = phone.trim() !== '' && governorate !== '' && area !== '' && (isClient || profession !== '')

  const handleSubmit = async () => {
    if (!isValid) return
    setIsLoading(true)
    setError('')

    const supabase = createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      setError('حدث خطأ في المصادقة. يرجى تسجيل الدخول مجدداً.')
      setIsLoading(false)
      return
    }

    const updates: any = {
      id: user.id,
      phone,
      governorate,
      area,
      role,
      full_name: user.user_metadata?.full_name || user.user_metadata?.name || 'مستخدم جديد',
      email: user.email,
      avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture || null,
    }

    if (isWorker) {
      updates.profession = profession
    }

    const { error: updateError } = await supabase.from('profiles').upsert(updates)

    if (updateError) {
      setError('حدث خطأ أثناء حفظ البيانات.')
      setIsLoading(false)
      return
    }

    router.push(isWorker ? '/worker/home' : '/client/home')
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4 font-[family-name:var(--font-arabic)] overflow-y-auto"
    >
      <div className="w-full max-w-[400px] flex flex-col my-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/hirfa_logo.svg"
            alt="Logo"
            width={72}
            height={72}
            priority
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[1.75rem] font-bold text-white mb-2">
            إكمال البيانات
          </h1>
          <p className="text-xs text-[#6B7A99]">
            نحتاج لبعض البيانات الإضافية لإكمال إعداد حسابك
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div dir="ltr">
            <AuthInput
              type="tel"
              placeholder="رقم الهاتف"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              rightIcon={Phone}
            />
          </div>

          <div
            className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
              focusField === 'governorate' ? 'border-[#FF8A00]' : 'border-[#1E2538]'
            }`}
          >
            <select
              value={governorate}
              onChange={e => {
                setGovernorate(e.target.value)
                setArea('')
              }}
              onFocus={() => setFocusField('governorate')}
              onBlur={() => setFocusField(null)}
              className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] text-sm text-right cursor-pointer appearance-none"
              style={{ color: governorate ? '#F0F4FF' : '#4B5A7A' }}
            >
              <option value="" className="bg-[#0F1322] text-[#6B7A99]">اختر المحافظة</option>
              {GOVERNORATES.map(gov => (
                <option key={gov} value={gov} className="bg-[#0F1322] text-[#F0F4FF]">
                  {gov}
                </option>
              ))}
            </select>
            <Building2 size={18} className="text-[#4B5A7A] flex-shrink-0" />
          </div>

          <div
            className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
              focusField === 'area' ? 'border-[#FF8A00]' : 'border-[#1E2538]'
            }`}
          >
            <select
              value={area}
              onChange={e => setArea(e.target.value)}
              onFocus={() => setFocusField('area')}
              onBlur={() => setFocusField(null)}
              disabled={!governorate}
              className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] text-sm text-right cursor-pointer appearance-none disabled:opacity-50"
              style={{ color: area ? '#F0F4FF' : '#4B5A7A' }}
            >
              <option value="" className="bg-[#0F1322] text-[#6B7A99]">اختر المنطقة</option>
              {governorate && locationData[governorate] ? (
                locationData[governorate].map(loc => (
                  <option key={loc} value={loc} className="bg-[#0F1322] text-[#F0F4FF]">
                    {loc}
                  </option>
                ))
              ) : (
                <option value="المنطقة الرئيسية" className="bg-[#0F1322] text-[#F0F4FF]">المنطقة الرئيسية</option>
              )}
            </select>
            <MapPin size={18} className="text-[#4B5A7A] flex-shrink-0" />
          </div>

          {isWorker && (
            <div
              className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
                focusField === 'profession' ? 'border-[#FF8A00]' : 'border-[#1E2538]'
              }`}
            >
              <select
                value={profession}
                onChange={e => setProfession(e.target.value)}
                onFocus={() => setFocusField('profession')}
                onBlur={() => setFocusField(null)}
                className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] text-sm text-right cursor-pointer appearance-none"
                style={{ color: profession ? '#F0F4FF' : '#4B5A7A' }}
              >
                <option value="" className="bg-[#0F1322] text-[#6B7A99]">اختر مهنتك الأساسية</option>
                {professionsList.map(p => (
                  <option key={p} value={p} className="bg-[#0F1322] text-[#F0F4FF]">
                    {p}
                  </option>
                ))}
              </select>
              <Briefcase size={18} className="text-[#4B5A7A] flex-shrink-0" />
            </div>
          )}

          {error && (
            <p className="text-xs text-[#FF4D4D] text-right mt-2">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!isValid || isLoading}
            className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {isLoading ? 'جاري الحفظ...' : 'حفظ ومتابعة'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-[#050814] flex items-center justify-center text-white">جاري التحميل...</div>}>
      <CompleteOAuthPage />
    </React.Suspense>
  )
}
