'use client'

import React, { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { Mail } from 'lucide-react'
import { OTPInput } from '@/components/shared/OTPInput'
import { createClient } from '@/lib/supabase/client'

function OTPPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const role = searchParams.get('role') || 'client'

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [otpType, setOtpType] = useState<'signup' | 'magiclink'>('signup')

  const handleVerify = async (code: string) => {
    if (code.length !== 6) return
    setIsLoading(true)
    setError('')

    const supabase = createClient()
    let { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token: code,
      type: otpType
    })

    if (verifyError && otpType === 'magiclink') {
      const { error: fallbackError } = await supabase.auth.verifyOtp({
        email,
        token: code,
        type: 'signup'
      })
      verifyError = fallbackError
    }

    if (verifyError) {
      setError('الرمز غير صحيح أو منتهي الصلاحية')
      setIsLoading(false)
      return
    }

    if (role === 'craftsman') {
      router.push('/home')
    } else {
      router.push('/home')
    }
  }

  const handleResend = async () => {
    setError('')
    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const result = await res.json()
      
      if (!res.ok) {
        setError(result.error || 'حدث خطأ أثناء إعادة إرسال الرمز')
      } else {
        setOtpType('magiclink')
        alert('تم إرسال رمز جديد إلى بريدك')
      }
    } catch (err) {
      setError('حدث خطأ أثناء إعادة إرسال الرمز')
    }
  }

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
          أدخل رمز التحقق
        </h1>

        <p className="text-sm text-[#6B7A99] leading-relaxed mb-6">
          أدخل الرمز المكون من 6 أرقام المرسل إلى <br />
          <span className="text-[#FF8A00] font-semibold" dir="ltr">{email}</span>
        </p>

        <div className="w-full mb-8">
          <OTPInput
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            length={6}
          />
        </div>

        {error && (
          <p className="text-xs text-[#FF4D4D] text-center mb-4">
            {error}
          </p>
        )}

        <button
          onClick={() => handleVerify(otp)}
          disabled={otp.length !== 6 || isLoading}
          className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mb-4"
        >
          {isLoading ? 'جاري التحقق...' : 'تأكيد الحساب'}
        </button>

        <p className="text-sm text-[#6B7A99]">
          لم تستلم الرمز؟{' '}
          <button onClick={handleResend} className="text-[#FF8A00] font-bold bg-transparent border-none cursor-pointer p-0">
            إعادة إرسال
          </button>
        </p>
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
