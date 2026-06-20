'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Mail } from 'lucide-react'

function OTPPageContent() {
  const router = useRouter()

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4 font-[family-name:var(--font-arabic)]"
    >
      <div className="w-full max-w-[400px] flex flex-col items-center text-center">
        <div className="flex justify-center mb-6">
          <Image
            src="/hirfa_logo.svg"
            alt="Logo"
            width={84}
            height={84}
            priority
          />
        </div>

        <div className="w-16 h-16 rounded-full bg-[#FF8A00]/10 flex items-center justify-center mb-6">
          <Mail size={32} className="text-[#FF8A00]" />
        </div>

        <h1 className="text-[1.75rem] font-bold text-white mb-3">
          تحقق من بريدك الإلكتروني
        </h1>

        <p className="text-sm text-[#6B7A99] leading-relaxed mb-8">
          تم إرسال رابط التأكيد إلى بريدك الإلكتروني. يرجى التحقق
          وتأكيد حسابك باستخدام الرابط الذي أرسلناه لك.
        </p>

        <p className="text-xs text-[#4B5A7A] mb-8">
          لم تستلم البريد؟ تحقق من مجلد البريد الغير مرغوب (Spam)
        </p>

        <button
          onClick={() => router.push('/login')}
          className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90"
        >
          تسجيل الدخول
        </button>
      </div>
    </div>
  )
}

export default function OTPPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050814] flex items-center justify-center" />
    }>
      <OTPPageContent />
    </Suspense>
  )
}
