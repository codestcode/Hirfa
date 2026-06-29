'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Lock, Eye, EyeOff, CheckCircle2, Circle } from 'lucide-react'

function ResetPasswordPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get('email') || ''
  const token = searchParams.get('token') || ''

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [focusField, setFocusField] = useState<'password' | 'confirm' | null>(null)
  const [error, setError] = useState('')

  const hasMinLength = password.length >= 8
  const hasNumber = /\d/.test(password)
  const hasSpecial = /[!@#$%]/.test(password)

  const isPasswordValid = hasMinLength && hasNumber && hasSpecial
  const matchesConfirm = password === confirmPassword && confirmPassword.length > 0
  const canSubmit = isPasswordValid && matchesConfirm

  const handleSubmit = async () => {
    if (!canSubmit) return
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, password })
      })
      const result = await res.json()
      if (!res.ok) {
        setError(result.error || 'حدث خطأ أثناء تعيين كلمة المرور الجديدة')
      } else {
        alert('تم تغيير كلمة المرور بنجاح! يمكنك الآن تسجيل الدخول بها.')
        router.push('/login')
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
            كلمة مرور جديدة
          </h2>
          <p className="text-sm text-[#6B7A99] leading-relaxed">
            أدخل كلمة مرور جديدة قوية لحماية حسابك.
          </p>
        </div>

        <div className="w-full flex flex-col gap-4">
          <div
            className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
              focusField === 'password' ? 'border-[#FF8A00]' : 'border-[#1E2538]'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="bg-transparent border-0 cursor-pointer text-[#4B5A7A] p-0 flex items-center"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="كلمة المرور الجديدة"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onFocus={() => setFocusField('password')}
              onBlur={() => setFocusField(null)}
              className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] placeholder-[#6B7A99] text-sm text-right"
            />
            <Lock size={18} className="text-[#4B5A7A] flex-shrink-0" />
          </div>

          <div
            className={`flex items-center gap-3 h-[52px] px-4 bg-[#0F1322] border rounded-xl transition-colors duration-200 ${
              focusField === 'confirm' ? 'border-[#FF8A00]' : 'border-[#1E2538]'
            }`}
          >
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="bg-transparent border-0 cursor-pointer text-[#4B5A7A] p-0 flex items-center"
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="تأكيد كلمة المرور"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              onFocus={() => setFocusField('confirm')}
              onBlur={() => setFocusField(null)}
              className="flex-1 bg-transparent border-none outline-none text-[#F0F4FF] placeholder-[#6B7A99] text-sm text-right"
            />
            <Lock size={18} className="text-[#4B5A7A] flex-shrink-0" />
          </div>

          <div className="bg-[#0B0F19] border border-[#1E2538] rounded-xl p-4 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <span className={`text-xs ${hasMinLength ? 'text-[#F0F4FF]' : 'text-[#6B7A99]'}`}>
                على الأقل 8 أحرف
              </span>
              {hasMinLength ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Circle size={16} className="text-[#4B5A7A]" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs ${hasNumber ? 'text-[#F0F4FF]' : 'text-[#6B7A99]'}`}>
                يجب أن تحتوي على رقم واحد على الأقل
              </span>
              {hasNumber ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Circle size={16} className="text-[#4B5A7A]" />
              )}
            </div>

            <div className="flex items-center justify-between">
              <span className={`text-xs ${hasSpecial ? 'text-[#F0F4FF]' : 'text-[#6B7A99]'}`}>
                يجب أن تحتوي على حرف خاص (!@#$%)
              </span>
              {hasSpecial ? (
                <CheckCircle2 size={16} className="text-green-500" />
              ) : (
                <Circle size={16} className="text-[#4B5A7A]" />
              )}
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#FF4D4D] text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={!canSubmit || isLoading}
            className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري تعيين كلمة المرور...' : 'تأكيد وحفظ'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050814] flex items-center justify-center" />
    }>
      <ResetPasswordPageContent />
    </Suspense>
  )
}
