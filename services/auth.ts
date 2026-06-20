'use server'

import { createClient } from '@/lib/supabase/server'
import type { SignUpData } from '@/lib/types'

export async function signUp(data: SignUpData) {
  try {
    const supabase = await createClient()

    console.log('[signUp] Creating user:', data.email)
    const { data: authData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          full_name: data.fullName,
          email: data.email,
          phone: data.phone ?? null,
          role: data.role,
          governorate: data.governorate ?? null,
          area: data.area ?? null,
        },
      },
    })

    if (error) {
      console.error('[signUp] Supabase error:', error)
      if (error.code === 'over_email_send_rate_limit') {
        return { error: 'لقد تجاوزت الحد المسموح به. الرجاء الانتظار بضع دقائق قبل المحاولة مرة أخرى.' }
      }
      return { error: error.message }
    }

    return { error: null }
  } catch (err: any) {
    console.error('[signUp] Unexpected error:', err)
    return { error: err?.message || 'حدث خطأ غير متوقع' }
  }
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('[signInWithPassword] Error:', error.message)
    throw new Error(error.message)
  }
  return data
}

export async function signIn(identifier: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password,
  })

  if (error) {
    console.error('[signIn] Error:', error.message)
    throw new Error(error.message)
  }
  return data
}

export async function sendOtp(email: string) {
  try {
    const supabase = await createClient()

    console.log('[sendOtp] Sending OTP to:', email)
    const { data, error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        shouldCreateUser: true,
      },
    })

    if (error) {
      console.error('[sendOtp] Error:', error.message)
      const msg = error.message.toLowerCase()

      if (msg.includes('email rate limit')) {
        throw new Error('لقد تجاوزت الحد المسموح به من محاولات الإرسال. الرجاء الانتظار دقيقة كاملة قبل المحاولة مرة أخرى.')
      }

      if (msg.includes('signups not allowed')) {
        throw new Error('تعذر إرسال رمز التحقق. تأكد من تفعيل "السماح بالتسجيل" في لوحة تحكم Supabase.')
      }

      if (msg.includes('already') || msg.includes('exists')) {
        throw new Error('هذا البريد الإلكتروني مسجل بالفعل. الرجاء تسجيل الدخول.')
      }

      throw new Error(error.message)
    }

    console.log('[sendOtp] OTP sent successfully to:', email)
    return data
  } catch (err: any) {
    if (err instanceof Error) {
      console.error('[sendOtp] Rethrowing:', err.message)
      throw err
    }
    console.error('[sendOtp] Unexpected non-Error:', err)
    throw new Error('حدث خطأ غير متوقع أثناء إرسال رمز التحقق')
  }
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient()

  console.log('[verifyOtp] Verifying OTP for:', email, 'token:', token)
  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    console.error('[verifyOtp] Error:', error.message)
    throw new Error(error.message)
  }

  console.log('[verifyOtp] Success. User:', data.user?.id, 'Session:', !!data.session)
  return data
}

export async function createUserProfile(
  userId: string,
  profile: {
    full_name: string
    email: string
    phone?: string | null
    role: string
    governorate?: string | null
    area?: string | null
  }
) {
  const supabase = await createClient()

  console.log('[createUserProfile] Creating profile for user:', userId)
  const { error } = await supabase.from('profiles').insert({
    id: userId,
    ...profile,
  })

  if (error) {
    console.error('[createUserProfile] Error:', error.message)
    throw new Error(error.message)
  }

  console.log('[createUserProfile] Profile created for user:', userId)
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()
  if (error) {
    console.error('[signOut] Error:', error.message)
    throw new Error(error.message)
  }
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
