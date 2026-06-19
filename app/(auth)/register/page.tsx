'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, User, Smartphone, Mail, Lock, MapPin } from 'lucide-react'
import { AuthInput } from '@/components/shared/AuthInput'

const locationData: Record<string, string[]> = {
  'القاهرة': ['مدينة نصر', 'مصر الجديدة', 'المعادي', 'التجمع الخامس', 'شبرا'],
  'الجيزة': ['الدقي', 'المهندسين', 'الهرم', '6 أكتوبر', 'الشيخ زايد'],
  'الإسكندرية': ['سموحة', 'المنتزه', 'محرم بك', 'لوران', 'جليم']
}

function RegisterPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'client'

  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [governorate, setGovernorate] = useState('')
  const [area, setArea] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusField, setFocusField] = useState<'governorate' | 'area' | null>(null)

  const isClient = role === 'client'
  const isFormValid =
    name.trim() !== '' &&
    phone.trim().length >= 10 &&
    (!isClient || (governorate !== '' && area !== '')) &&
    password.length >= 8 &&
    password === confirmPassword

  const handleRegister = () => {
    if (!isFormValid) return
    setIsLoading(true)

    if (isClient) {
      setTimeout(() => {
        router.push(`/otp?phone=${encodeURIComponent(phone)}&role=client`)
      }, 800)
    } else {
      setTimeout(() => {
        router.push(`/register/details?phone=${encodeURIComponent(phone)}`)
      }, 800)
    }
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
            {isClient ? 'إنشاء حساب عميل' : 'إنشاء حساب حرفي'}
          </h1>
          <p className="text-xs text-[#6B7A99]">
            أدخل بياناتك الأساسية للبدء
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <AuthInput
            type="text"
            placeholder="الاسم الكامل"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            rightIcon={User}
          />

          <AuthInput
            type="tel"
            placeholder="رقم الهاتف"
            value={phone}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
            dir="ltr"
            rightIcon={Smartphone}
          />

          <AuthInput
            type="email"
            placeholder="البريد الإلكتروني (اختياري)"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            dir="ltr"
            rightIcon={Mail}
          />

          {isClient && (
            <>
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
                >
                  <option value="" className="bg-[#0F1322] text-[#6B7A99]">اختر المحافظة</option>
                  {Object.keys(locationData).map(gov => (
                    <option key={gov} value={gov} className="bg-[#0F1322] text-[#F0F4FF]">
                      {gov}
                    </option>
                  ))}
                </select>
                <MapPin size={18} className="text-[#4B5A7A] flex-shrink-0" />
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
                >
                  <option value="" className="bg-[#0F1322] text-[#6B7A99]">اختر المنطقة</option>
                  {governorate &&
                    locationData[governorate].map(loc => (
                      <option key={loc} value={loc} className="bg-[#0F1322] text-[#F0F4FF]">
                        {loc}
                      </option>
                    ))}
                </select>
                <MapPin size={18} className="text-[#4B5A7A] flex-shrink-0" />
              </div>
            </>
          )}

          <AuthInput
            type={showPassword ? 'text' : 'password'}
            placeholder="كلمة المرور"
            value={password}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
            rightIcon={Lock}
            leftIcon={
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="bg-transparent border-0 cursor-pointer text-[#4B5A7A] p-0 flex items-center"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          <AuthInput
            type={showConfirm ? 'text' : 'password'}
            placeholder="تأكيد كلمة المرور"
            value={confirmPassword}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
            rightIcon={Lock}
            leftIcon={
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="bg-transparent border-0 cursor-pointer text-[#4B5A7A] p-0 flex items-center"
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            }
          />

          {confirmPassword && password !== confirmPassword && (
            <p className="text-xs text-[#FF4D4D] text-right">
              كلمة المرور غير متطابقة
            </p>
          )}

          <button
            onClick={handleRegister}
            disabled={isLoading || !isFormValid}
            className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? 'جاري...' : isClient ? 'إنشاء الحساب' : 'التالي'}
          </button>
        </div>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-[#1E2538]" />
          <span className="text-xs text-[#6B7A99] whitespace-nowrap">أو التسجيل بواسطة</span>
          <div className="flex-1 h-px bg-[#1E2538]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center h-12 bg-[#0B0F19] border border-[#1E2538] rounded-xl cursor-pointer hover:bg-slate-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F0F4FF">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.53 3.23zM12.003 7.3c-.15-2.23 1.66-4.07 3.74-4.3.29 2.58-2.34 4.5-3.74 4.3z" />
            </svg>
          </button>

          <button className="flex items-center justify-center h-12 bg-[#0B0F19] border border-[#1E2538] rounded-xl cursor-pointer hover:bg-slate-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
          </button>
        </div>

        <div className="text-center mt-8">
          <p className="text-sm text-[#6B7A99]">
            لديك حساب بالفعل؟{' '}
            <Link href={`/login?role=${role}`} className="text-[#FF8A00] font-bold no-underline">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function RegisterPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050814] flex items-center justify-center" />
    }>
      <RegisterPageContent />
    </Suspense>
  )
}
