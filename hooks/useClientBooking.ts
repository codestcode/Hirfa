'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
import { createNotification } from '@/lib/notifications'

export interface BookingInput {
  worker_id: string
  service_name: string
  appointment_date: string
  appointment_time: string
  address: string
  notes?: string
  payment_method?: string
  total_amount: number
}

export function useClientBooking() {
  const supabase = createClient()
  const { profile } = useAuth()
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const createBooking = useCallback(async (data: BookingInput) => {
    if (!profile) { setError('يجب تسجيل الدخول أولاً'); return null }
    setSubmitting(true)
    setError('')
    const { data: booking, error: err } = await supabase.from('bookings').insert({
      client_id: profile.id,
      worker_id: data.worker_id,
      craftsman_id: data.worker_id,
      service_name: data.service_name,
      appointment_date: data.appointment_date,
      appointment_time: data.appointment_time,
      address: data.address,
      price: data.total_amount,
      status: 'pending'
    }).select('id').single()

    if (err) { setError(err.message); setSubmitting(false); return null }
    if (booking && profile) {
      createNotification(data.worker_id, 'طلب خدمة جديد', `لديك طلب خدمة جديد من ${profile.full_name || 'عميل'}`)
    }
    setSubmitting(false)
    return booking
  }, [supabase, profile])

  const cancelBooking = useCallback(async (bookingId: string) => {
    setSubmitting(true)
    setError('')
    const { data: booking } = await supabase
      .from('bookings')
      .select('worker_id')
      .eq('id', bookingId)
      .single()
    const { error: err } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', bookingId)
    if (err) { setError(err.message); setSubmitting(false); return false }
    if (booking) {
      createNotification(booking.worker_id, 'تم إلغاء الحجز من قبل العميل', `قام ${profile?.full_name || 'العميل'} بإلغاء الحجز`)
    }
    setSubmitting(false)
    return true
  }, [supabase, profile])

  return { createBooking, cancelBooking, submitting, error }
}
