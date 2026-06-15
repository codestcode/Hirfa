'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Smartphone } from 'lucide-react'
import { OTPInput } from '@/components/shared/OTPInput'

export default function OTPPage() {
  const router = useRouter()
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
    setTimeout(() => router.push('/success'), 800)
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
      className="min-h-screen bg-[var(--color-bg)] flex flex-col font-[var(--font-arabic)] p-4"
    >
      {/* ── Header ── */}
      <div className="flex items-center justify-between py-4">
        <button
          onClick={() => router.back()}
          className="w-10 h-10 flex items-center justify-center rounded-full text-[var(--color-text-secondary)] hover:bg-[var(--neutral-100)] transition-colors"
        >
          <ArrowLeft size={20} className="scale-x-[-1]" />
        </button>

        <span className="text-[var(--text-sm)] font-[var(--weight-semibold)] text-[var(--color-text-primary)]">
          تفعيل الحساب
        </span>

        <div className="w-10" />
      </div>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col items-center justify-center gap-6 px-4">
        
        {/* Icon */}
        <div className="w-20 h-20 rounded-full bg-[var(--color-primary-subtle)] flex items-center justify-center">
          <Smartphone size={36} className="text-[var(--color-primary)]" />
        </div>

        {/* Title + Subtitle */}
        <div className="text-center">
          <h2 className="text-[1.75rem] font-[var(--weight-bold)] text-[var(--color-text-primary)] mb-2">
            أدخل رمز التحقق
          </h2>
          <p 
            className="text-[var(--text-xs)] leading-relaxed" 
            style={{ color: 'var(--color-text-secondary)' }}
          >
            أرسلنا رمزاً مكوناً من 6 أرقام إلى{' '}
            <span className="text-[var(--color-text-primary)] font-[var(--weight-semibold)]">
              010 **** 234
            </span>
          </p>
        </div>

        {/* OTP Input */}
        <OTPInput
          value={otp}
          onChange={setOtp}
          onComplete={handleVerify}
          length={6}
        />

        {/* Timer / Resend */}
        <div className="text-center">
          {!canResend ? (
            <p 
              className="text-[var(--text-xs)]" 
              style={{ color: 'var(--color-text-secondary)' }}
            >
              إعادة الإرسال خلال{' '}
              <span className="text-[var(--color-primary)] font-[var(--weight-semibold)]">
                {formatTime(timeLeft)}
              </span>
            </p>
          ) : (
            <button
              onClick={handleResend}
              className="text-[var(--color-primary)] font-[var(--weight-semibold)] text-[var(--text-xs)] hover:underline bg-transparent border-none p-0 cursor-pointer"
            >
              إعادة الإرسال الآن
            </button>
          )}
        </div>

        {/* Verify Button */}
        <button
          onClick={handleVerify}
          disabled={isLoading || otp.replace(/\s/g, '').length !== 6}
          className="btn btn-primary w-full max-w-[360px] h-12 text-[var(--text-sm)] disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isLoading ? 'جاري التحقق...' : 'تحقق'}
        </button>

        {/* Wrong Number */}
        <p 
          className="text-[var(--text-xs)] text-center" 
          style={{ color: 'var(--color-text-secondary)' }}
        >
          رقم خاطئ؟{' '}
          <button
            onClick={() => router.back()}
            className="text-[var(--color-primary)] font-[var(--weight-semibold)] bg-transparent border-none p-0 cursor-pointer hover:underline"
          >
            تعديل الرقم
          </button>
        </p>
      </div>
    </div>
  )
}