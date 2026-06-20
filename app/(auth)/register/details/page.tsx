'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Briefcase, Clock, Building2, MapPin } from 'lucide-react'

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

type FocusField = 'profession' | 'years' | 'governorate' | 'area' | null

export default function CraftsmanDetailsPage() {
  const router = useRouter()

  const [profession, setProfession] = useState('')
  const [years, setYears] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [area, setArea] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focusField, setFocusField] = useState<FocusField>(null)

  useEffect(() => {
    setProfession(localStorage.getItem('pendingProfession') || '')
    setYears(localStorage.getItem('pendingExperience') || '')
    setGovernorate(localStorage.getItem('pendingGovernorate') || '')
    setArea(localStorage.getItem('pendingArea') || '')
  }, [])

  const isValid = profession && years && governorate && area

  const handleNext = () => {
    if (!isValid) return
    setIsLoading(true)

    localStorage.setItem('pendingProfession', profession)
    localStorage.setItem('pendingExperience', years)
    localStorage.setItem('pendingGovernorate', governorate)
    localStorage.setItem('pendingArea', area)

    setTimeout(() => router.push('/register/verify'), 800)
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
            إنشاء حساب حرفي
          </h1>
          <p className="text-xs text-[#6B7A99]">
            بيانات العمل والتخصص
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <label className="text-[13px] font-semibold leading-5 text-white mb-2 block">
              المهنة
            </label>
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
                {PROFESSIONS.map(p => (
                  <option key={p} value={p} className="bg-[#0F1322] text-[#F0F4FF]">
                    {p}
                  </option>
                ))}
              </select>
              <Briefcase size={18} className="text-[#4B5A7A] flex-shrink-0" />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold leading-5 text-white mb-2 block">
              سنوات الخبرة
            </label>
            <div
              className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
                focusField === 'years' ? 'border-[#FF8A00]' : 'border-[#1E2538]'
              }`}
            >
              <input
                type="number"
                min={0}
                max={60}
                placeholder="أدخل عدد سنوات الخبرة"
                value={years}
                onChange={e => setYears(e.target.value)}
                onFocus={() => setFocusField('years')}
                onBlur={() => setFocusField(null)}
                className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] text-sm text-right"
              />
              <Clock size={18} className="text-[#4B5A7A] flex-shrink-0" />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold leading-5 text-white mb-2 block">
              المحافظة
            </label>
            <div
              className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
                focusField === 'governorate' ? 'border-[#FF8A00]' : 'border-[#1E2538]'
              }`}
            >
              <select
                value={governorate}
                onChange={e => setGovernorate(e.target.value)}
                onFocus={() => setFocusField('governorate')}
                onBlur={() => setFocusField(null)}
                className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] text-sm text-right cursor-pointer appearance-none"
                style={{ color: governorate ? '#F0F4FF' : '#4B5A7A' }}
              >
                <option value="" className="bg-[#0F1322] text-[#6B7A99]">اختر المحافظة</option>
                {GOVERNORATES.map(g => (
                  <option key={g} value={g} className="bg-[#0F1322] text-[#F0F4FF]">
                    {g}
                  </option>
                ))}
              </select>
              <Building2 size={18} className="text-[#4B5A7A] flex-shrink-0" />
            </div>
          </div>

          <div>
            <label className="text-[13px] font-semibold leading-5 text-white mb-2 block">
              المنطقة
            </label>
            <div
              className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
                focusField === 'area' ? 'border-[#FF8A00]' : 'border-[#1E2538]'
              }`}
            >
              <input
                type="text"
                placeholder="أدخل المنطقة"
                value={area}
                onChange={e => setArea(e.target.value)}
                onFocus={() => setFocusField('area')}
                onBlur={() => setFocusField(null)}
                className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] text-sm text-right"
              />
              <MapPin size={18} className="text-[#4B5A7A] flex-shrink-0" />
            </div>
          </div>

          <div className="grid grid-cols-[1fr_1.6fr] gap-3 mt-2">
            <button
              onClick={() => router.back()}
              className="h-12 text-sm font-bold text-white bg-[#1E2538] rounded-xl flex items-center justify-center transition-opacity active:opacity-90"
            >
              السابق
            </button>

            <button
              onClick={handleNext}
              disabled={!isValid || isLoading}
              className="h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري...' : 'التالي'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
