'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [focusField, setFocusField] = useState(false)
  const [error, setError] = useState('')

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isValid = emailRegex.test(email.trim())

  const handleSend = async () => {
    if (!isValid) return
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim().toLowerCase() })
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'حدث خطأ أثناء إرسال الرمز')
      } else {
        router.push(`/forgot-password/verify?email=${encodeURIComponent(email.trim().toLowerCase())}`)
      }
    } catch (err) {
      setError('حدث خطأ في الشبكة. الرجاء المحاولة لاحقاً.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4 font-[family-name:var(--font-arabic)]"
    >
      <div className="w-full max-w-[400px] flex flex-col flex-1 justify-center relative">
        <button
          onClick={() => router.back()}
          className="absolute top-4 right-0 w-10 h-10 flex items-center justify-center rounded-full text-[#6B7A99] hover:bg-slate-900 transition-colors"
        >
          <ArrowLeft size={20} className="scale-x-[-1]" />
        </button>

        <div className="flex justify-center mb-8">
          <Image
            src="/hirfa_logo.svg"
            alt="Logo"
            width={84}
            height={84}
            priority
          />
        </div>

        <div className="text-center mb-8">
          <h2 className="text-[1.75rem] font-bold text-white mb-2">
            نسيت كلمة المرور؟
          </h2>
          <p className="text-sm text-[#6B7A99] leading-relaxed">
            أدخل البريد الإلكتروني المرتبط بحسابك وسنرسل لك رمزاً لتغيير كلمة المرور.
          </p>
        </div>

        <div className="flex flex-col gap-5 w-full">
          <div
            className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
              focusField ? 'border-[#FF8A00]' : 'border-[#1E2538]'
            }`}
          >
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onFocus={() => setFocusField(true)}
              onBlur={() => setFocusField(false)}
              dir="ltr"
              className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] placeholder-[#6B7A99] text-sm text-left"
            />
            <Mail size={18} className="text-[#4B5A7A] flex-shrink-0" />
          </div>

          {error && (
            <p className="text-xs text-[#FF4D4D] text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleSend}
            disabled={isLoading || !isValid}
            className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري الإرسال...' : 'إرسال رمز التحقق'}
          </button>
        </div>
      </div>
    </div>
  )
}
