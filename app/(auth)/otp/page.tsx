'use client'

import React, { useState, useEffect, Suspense, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Pencil } from 'lucide-react'
import { OTPInput } from '@/components/shared/OTPInput'
import { sendOtp, verifyOtp, signUp } from '@/services/auth'

function OTPPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialEmail = searchParams.get('email') || localStorage.getItem('pendingEmail') || ''
  const flow = searchParams.get('flow') || 'login'
  const roleParam = searchParams.get('role') || localStorage.getItem('pendingRole') || 'client'

  const [otp, setOtp] = useState('')
  const [timeLeft, setTimeLeft] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [otpSent, setOtpSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [editingEmail, setEditingEmail] = useState(false)
  const [editValue, setEditValue] = useState(initialEmail)

  const email = editingEmail ? editValue : initialEmail

  useEffect(() => {
    if (timeLeft === 0) {
      setCanResend(true)
      return
    }
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000)
    return () => clearInterval(timer)
  }, [timeLeft])

  const handleSendOtp = useCallback(async (e?: string) => {
    const target = e || email
    if (!target || sending) return
    setSending(true)
    setError('')
    try {
      await sendOtp(target)
      setOtpSent(true)
      setTimeLeft(60)
      setCanResend(false)
      setEditingEmail(false)
    } catch (err: any) {
      const msg = err?.message?.toLowerCase?.() || ''
      if (msg.includes('email')) {
        setError('البريد الإلكتروني غير صحيح. تأكد من الكتابة')
      } else {
        setError('فشل إرسال رمز التحقق')
      }
    } finally {
      setSending(false)
    }
  }, [email, sending])

  useEffect(() => {
    if (email && !otpSent && !sending && !editingEmail) {
      handleSendOtp()
    }
  }, [email])

  const handleVerify = async () => {
    if (otp.length !== 6) return
    setIsLoading(true)
    setError('')

    try {
      if (flow === 'register') {
        const name = localStorage.getItem('pendingName') || ''
        const password = localStorage.getItem('pendingPassword') || ''
        const governorate = localStorage.getItem('pendingGovernorate') || undefined
        const area = localStorage.getItem('pendingArea') || undefined
        const phone = localStorage.getItem('pendingPhone') || undefined

        try {
          await signUp({
            email,
            password,
            fullName: name,
            phone,
            role: roleParam as 'client' | 'worker',
            governorate,
            area,
          })
        } catch (err: any) {
          const msg = err?.message?.toLowerCase?.() || ''
          if (!msg.includes('already') && !msg.includes('exists')) throw err
        }
      }

      const result = await verifyOtp(email, otp)
      const userRole = result.user?.user_metadata?.role || roleParam

      localStorage.removeItem('pendingEmail')
      localStorage.removeItem('pendingPassword')
      localStorage.removeItem('pendingName')
      localStorage.removeItem('pendingPhone')
      localStorage.removeItem('pendingRole')
      localStorage.removeItem('pendingGovernorate')
      localStorage.removeItem('pendingArea')

      router.push(userRole === 'worker' ? '/dashboard' : '/home')
    } catch (err: any) {
      const msg = err?.message?.toLowerCase?.() || ''
      if (msg.includes('token') || msg.includes('otp') || msg.includes('code')) {
        setError('رمز التحقق غير صحيح. حاول مرة أخرى')
      } else {
        setError('فشل التحقق. حاول مرة أخرى')
      }
      setIsLoading(false)
    }
  }

  const handleResend = async () => {
    setOtp('')
    setError('')
    await handleSendOtp(email)
  }

  const handleEditSubmit = () => {
    if (!editValue.includes('@')) {
      setError('البريد الإلكتروني غير صحيح')
      return
    }
    setOtpSent(false)
    setOtp('')
    setError('')
    localStorage.setItem('pendingEmail', editValue)
    handleSendOtp(editValue)
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
            تأكيد البريد الإلكتروني
          </h2>

          {editingEmail ? (
            <div className="flex flex-col items-center gap-3">
              <p className="text-sm text-[#6B7A99]">
                أدخل البريد الإلكتروني الصحيح
              </p>
              <div className="flex items-center gap-2 w-full max-w-[320px]">
                <input
                  type="email"
                  dir="ltr"
                  value={editValue}
                  onChange={e => setEditValue(e.target.value)}
                  className="flex-1 h-12 px-4 bg-[#0B0F19] border border-[#FF8A00] rounded-xl text-white text-center text-sm font-semibold outline-none"
                  placeholder="example@email.com"
                  autoFocus
                />
                <button
                  onClick={handleEditSubmit}
                  disabled={!editValue.trim()}
                  className="h-12 px-4 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl disabled:opacity-50"
                >
                  تأكيد
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-[#6B7A99] leading-relaxed">
              أدخل رمز التحقق المكون من 6 أرقام المرسل إلى{' '}
              <button
                onClick={() => { setEditingEmail(true); setEditValue(initialEmail) }}
                className="inline-flex items-center gap-1 text-[#F0F4FF] font-semibold hover:text-[#FF8A00] transition-colors bg-transparent border-none p-0 cursor-pointer"
                dir="ltr"
              >
                {email}
                <Pencil size={12} className="text-[#6B7A99]" />
              </button>
            </p>
          )}
        </div>

        {!editingEmail && (
          <>
            <div className="flex justify-center mb-8 bg-transparent">
              <OTPInput
                value={otp}
                onChange={setOtp}
                onComplete={handleVerify}
                length={6}
              />
            </div>

            {error && (
              <p className="text-xs text-[#FF4D4D] text-center mb-4">{error}</p>
            )}

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
          </>
        )}
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
