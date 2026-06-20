'use server'

import { createClient } from '@/lib/supabase/server'
import type { SignUpData } from '@/lib/types'

export async function signUp(data: SignUpData) {
  const supabase = await createClient()

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

  if (error) throw error
  return authData
}

export async function signInWithPassword(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

export async function signIn(identifier: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email: identifier,
    password,
  })

  if (error) throw error
  return data
}

export async function sendOtp(email: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOtp({
    email,
    options: {
      shouldCreateUser: false,
    },
  })

  if (error) throw error
  return data
}

export async function verifyOtp(email: string, token: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) throw error
  return data
}

export async function signOut() {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getSession() {
  const supabase = await createClient()
  const { data: { session } } = await supabase.auth.getSession()
  return session
}
