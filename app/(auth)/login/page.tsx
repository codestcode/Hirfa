'use client'

import React, { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'
import { AuthInput } from '@/components/shared/AuthInput'
import { signIn } from '@/services/auth'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const role = searchParams.get('role') || 'client'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email || !password) return
    setIsLoading(true)
    setError('')

    try {
      const result = await signIn(email, password)
      const userRole = result.user?.user_metadata?.role || role
      router.push(userRole === 'worker' ? '/home' : '/client-home')
    } catch (err) {
      setError('البريد الإلكتروني أو كلمة المرور غير صحيحة')
      setIsLoading(false)
    }
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4 font-[family-name:var(--font-arabic)]"
    >
      <div className="w-full max-w-[400px] flex flex-col flex-1 justify-center">
        <div className="flex justify-center mb-8">
          <Image
            src="/hirfa_logo.svg"
            alt="Logo"
            width={96}
            height={96}
            priority
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            أهلاً بك مجدداً
          </h1>
          <p className="text-sm text-[#6B7A99]">
            خدماتك، مبسطة
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <AuthInput
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
            rightIcon={Mail}
          />

          <div>
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

            <div className="text-right mt-2.5">
              <Link href="/forgot-password" className="text-xs text-[#FF8A00] no-underline">
                نسيت كلمة المرور؟
              </Link>
            </div>
          </div>

          {error && (
            <p className="text-xs text-[#FF4D4D] text-center">
              {error}
            </p>
          )}

          <button
            onClick={handleLogin}
            disabled={isLoading || !email || !password}
            className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'جاري تسجيل الدخول...' : 'تسجيل الدخول'}
          </button>
        </div>

        <div className="flex items-center gap-3 my-8">
          <div className="flex-1 h-px bg-[#1E2538]" />
          <span className="text-xs text-[#6B7A99] whitespace-nowrap">
            أو الدخول بواسطة
          </span>
          <div className="flex-1 h-px bg-[#1E2538]" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button className="flex items-center justify-center h-12 bg-[#0B0F19] border border-[#1E2538] rounded-xl cursor-pointer hover:bg-slate-900 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="#F0F4FF">
              <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.53 3.23zM12.003 7.3c-.15-2.23 1.66-4.07 3.74-4.3.29 2.58-2.34 4.5-3.74 4.3z" />
            </svg>
          </button>

          <button 
            onClick={async () => {
              try {
                setIsLoading(true)
                const { createClient } = await import('@/lib/supabase/client')
                const supabase = createClient()
                const { error } = await supabase.auth.signInWithOAuth({
                  provider: 'google',
                  options: {
                    redirectTo: `${window.location.origin}/api/auth/callback?role=${role}`
                  }
                })
                if (error) throw error
              } catch (err) {
                setError('حدث خطأ أثناء الاتصال بحساب جوجل')
                setIsLoading(false)
              }
            }}
            className="flex items-center justify-center h-12 bg-[#0B0F19] border border-[#1E2538] rounded-xl cursor-pointer hover:bg-slate-900 transition-colors"
          >
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
            ليس لديك حساب؟{' '}
            <Link href={`/register?role=${role}`} className="text-[#FF8A00] font-bold no-underline">
              سجل الآن
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050814] flex items-center justify-center" />
    }>
      <LoginPageContent />
    </Suspense>
  )
}
