'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogin = async () => {
    if (!phone || !password) return
    setIsLoading(true)
    setTimeout(() => {
      router.push('/otp')
    }, 800)
  }

  return (
    <div
      dir="rtl"
      style={{
        minHeight: '100vh',
        backgroundColor: 'var(--color-bg)',
        display: 'flex',
        flexDirection: 'column',
        padding: 'var(--space-4)',
        fontFamily: 'var(--font-arabic)',
      }}
    >
      {/* ── Header ── */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingBlock: 'var(--space-4)',
        }}
      >
        <button
          onClick={() => router.back()}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: 'var(--color-text-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-full)',
            transition: 'background var(--transition-fast)',
          }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = 'var(--neutral-100)')}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = 'transparent')}
        >
          <ArrowLeft size={20} style={{ transform: 'scaleX(-1)' }} />
        </button>

        <span
          style={{
            fontSize: '1.5rem',
            fontWeight: 'var(--weight-extrabold)',
            color: 'var(--color-primary)',
            letterSpacing: '-0.5px',
          }}
        >
          حِرفة
        </span>

        <div style={{ width: 40 }} />
      </div>

      {/* ── Main ── */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '100%', maxWidth: 400 }}>

          {/* Title */}
          <div style={{ textAlign: 'center', marginBottom: 'var(--space-8)' }}>
            <h2
              style={{
                fontSize: '1.75rem',
                fontWeight: 'var(--weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--space-2)',
              }}
            >
              تسجيل الدخول
            </h2>
            <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)' }}>
              أدخل رقم هاتفك وكلمة المرور
            </p>
          </div>

          {/* Form */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>

            {/* Phone */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                رقم الهاتف
              </label>
              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                <Input
                  type="tel"
                  placeholder="010 0000 0000"
                  value={phone}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPhone(e.target.value)}
                  dir="ltr"
                  style={{ flex: 1, height: 48 }}
                  className="input"
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    paddingInline: 'var(--space-3)',
                    backgroundColor: 'var(--neutral-100)',
                    border: '1.5px solid var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--weight-semibold)',
                    color: 'var(--color-text-primary)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  🇪🇬 +20
                </div>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: 'var(--text-xs)',
                  fontWeight: 'var(--weight-medium)',
                  color: 'var(--color-text-primary)',
                  marginBottom: 'var(--space-2)',
                }}
              >
                كلمة المرور
              </label>
              <div style={{ position: 'relative' }}>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  style={{ height: 48, paddingLeft: 44 }}
                  className="input"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    left: 'var(--space-3)',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--color-text-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {/* Forgot password */}
              <div style={{ textAlign: 'left', marginTop: 'var(--space-2)' }}>
                <Link
                  href="/forgot-password"
                  style={{
                    fontSize: '0.8rem',
                    color: 'var(--color-primary)',
                    textDecoration: 'none',
                  }}
                >
                  هل نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            {/* Login button */}
            <button
              onClick={handleLogin}
              disabled={isLoading || !phone || !password}
              className="btn btn-primary"
              style={{
                width: '100%',
                height: 48,
                fontSize: 'var(--text-sm)',
                borderRadius: 'var(--radius-md)',
                opacity: isLoading || !phone || !password ? 0.6 : 1,
                cursor: isLoading || !phone || !password ? 'not-allowed' : 'pointer',
              }}
            >
              {isLoading ? 'جاري...' : 'تسجيل الدخول'}
            </button>
          </div>
         {/* Divider */}
<div className="relative flex items-center my-8">
  <div className="flex-1 h-px bg-[var(--color-border)]" />

  <span className="px-3 text-xs text-[var(--color-text-secondary)] bg-background">
    أو
  </span>

  <div className="flex-1 h-px bg-[var(--color-border)]" />
</div>

{/* Social Login */}
<div className="flex flex-col gap-3">

  {/* Google */}
  <Button
    variant="outline"
    className="
      w-full h-11
      flex items-center justify-center gap-3
      rounded-xl
      border border-[var(--color-border)]
      bg-white
      text-[var(--color-text-primary)]
      font-medium
      hover:bg-gray-50
      active:scale-[0.99]
      transition
    "
  >
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
    <span>المتابعة مع Google</span>
  </Button>

  {/* Apple */}
  <Button
    variant="outline"
    className="
      w-full h-11
      flex items-center justify-center gap-3
      rounded-xl
      border border-[var(--color-border)]
      bg-white
      text-[var(--color-text-primary)]
      font-medium
      hover:bg-gray-50
      active:scale-[0.99]
      transition
    "
  >
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.48-2.53 3.23l-.35-.28z"/>
    </svg>
    <span>المتابعة مع Apple</span>
  </Button>

</div>

{/* Register */}
<div className="mt-8 text-center">
  <p className="text-sm text-[var(--color-text-secondary)]">
    ليس لديك حساب؟
  </p>

  <Link
    href="/register"
    className="
      inline-block mt-1
      text-[var(--color-primary)]
      font-semibold
      text-xs
      hover:underline
      transition
    "
  >
    إنشاء حساب جديد
  </Link>
</div>
        </div>
      </div>
    </div>
  )
}