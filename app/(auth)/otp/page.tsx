'use client'

import React, { useState, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft } from 'lucide-react'
import { sendOtp, verifyOtp } from '@/services/auth'

function OTPPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''

  const [otp, setOtp] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [sending, setSending] = useState(false)

  const handleSendOtp = useCallback(async () => {
    if (!email || sending) return
    setSending(true)
    setError('')
    try {
      await sendOtp(email)
    } catch (err: any) {
      setError('خدمة إرسال رمز التحقق غير متاحة. الرجاء استخدام تسجيل الدخول بكلمة المرور.')
    } finally {
      setSending(false)
    }
  }, [email, sending])

  const handleVerify = async () => {
    if (otp.length !== 6) return
    setIsLoading(true)
    setError('')
    try {
      const result = await verifyOtp(email, otp)
      const userRole = result.user?.user_metadata?.role || 'client'
      router.push(userRole === 'worker' ? '/dashboard' : '/home')
    } catch {
      setError('رمز التحقق غير صحيح. حاول مرة أخرى')
      setIsLoading(false)
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
          <ArrowLeft size={32} className="text-[#FF8A00]" />
        </div>

        <h1 className="text-[1.75rem] font-bold text-white mb-3">
          رمز التحقق غير متاح
        </h1>

        <p className="text-sm text-[#6B7A99] leading-relaxed mb-8">
          خدمة إرسال رمز التحقق عبر البريد الإلكتروني غير متاحة حالياً.
          الرجاء استخدام البريد الإلكتروني وكلمة المرور لتسجيل الدخول.
        </p>

        <div className="flex flex-col gap-3 w-full">
          <button
            onClick={() => router.push('/login')}
            className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90"
          >
            تسجيل الدخول
          </button>

          <button
            onClick={() => router.push('/register')}
            className="w-full h-12 text-sm font-bold text-white bg-[#1E2538] rounded-xl flex items-center justify-center transition-opacity active:opacity-90"
          >
            إنشاء حساب جديد
          </button>
        </div>
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
