'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Smartphone } from 'lucide-react'
import { OTPInput } from '@/components/shared/OTPInput'

function OTPPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const phoneParam = searchParams.get('phone')
  const formattedPhone = phoneParam ? `+20 ${phoneParam.slice(0, 3)} *** ${phoneParam.slice(-4)}` : '010 **** 234'

  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true)
      return
    }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleVerify = () => {
    if (otp.length !== 6) return
    setIsLoading(true)

    const flow = searchParams.get('flow')
    const roleParam = searchParams.get('role') || localStorage.getItem('role') || 'client'

    setTimeout(() => {
      if (flow === 'reset') {
        router.push('/reset-password')
      } else {
        router.push(`/home?role=${roleParam}`)
      }
    }, 800)
  }

  const handleResend = () => {
    setTimeLeft(60)
    setCanResend(false)
    setOtp('')
  }

  const formatTime = (s: number) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`

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
            تأكيد الرمز
          </h2>
          <p className="text-sm text-[#6B7A99] leading-relaxed">
            أدخل رمز التحقق المكون من 6 أرقام المرسل إلى{' '}
            <span className="text-[#F0F4FF] font-semibold" dir="ltr">
              {formattedPhone}
            </span>
          </p>
        </div>

        <div className="flex justify-center mb-8 bg-transparent">
          <OTPInput
            value={otp}
            onChange={setOtp}
            onComplete={handleVerify}
            length={6}
          />
        </div>

        <div className="text-center mb-8">
          {!canResend ? (
            <p className="text-sm text-[#6B7A99]">
              إعادة الإرسال خلال{' '}
              <span className="text-[#FF8A00] font-semibold">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-[#FF8A00] font-semibold text-sm hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              إعادة الإرسال الآن
            </button>
          )}
        </div>

        <button
          onClick={handleVerify}
          disabled={isLoading || otp.replace(/\s/g, '').length !== 6}
          className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري التحقق...' : 'تأكيد الرمز'}
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