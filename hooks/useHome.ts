import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'

export function useHome() {
  const { profile, user } = useAuth()
  const supabase = createClient()
  const [newRequests, setNewRequests] = useState<any[]>([])
  const [appointments, setAppointments] = useState<any[]>([])
  const [isAvailable, setIsAvailable] = useState(true)

  const fetchBookings = useCallback(async () => {
    if (!profile?.id) return
    const { data: reqs } = await supabase.from('bookings').select('*, client:client_id(*)').eq('worker_id', profile.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(3)
    if (reqs) setNewRequests(reqs)

    const { data: apps } = await supabase.from('bookings').select('*, client:client_id(*)').eq('worker_id', profile.id).eq('status', 'confirmed').order('appointment_date', { ascending: true }).order('appointment_time', { ascending: true }).limit(3)
    if (apps) setAppointments(apps)
  }, [profile?.id, supabase])

  useEffect(() => {
    if (profile) {
      setIsAvailable(profile.is_available ?? true)
      fetchBookings()
    }
  }, [profile, fetchBookings])

  const toggleAvailability = async () => {
    const newVal = !isAvailable
    setIsAvailable(newVal)
    if (profile?.id) await supabase.from('profiles').update({ is_available: newVal }).eq('id', profile.id)
  }

  const handleRequest = async (id: string, status: string) => {
    const { data: booking } = await supabase
      .from('bookings')
      .select('client_id')
      .eq('id', id)
      .single()

    await supabase.from('bookings').update({ status }).eq('id', id)

    if (booking) {
      if (status === 'confirmed') {
        createNotification(booking.client_id, 'قام الحرفي بقبول الخدمة', `تم قبول طلب الخدمة بواسطة ${profile?.full_name || 'الحرفي'}`)
      } else if (status === 'cancelled') {
        createNotification(booking.client_id, 'تم رفض طلب الخدمة', 'نأسف، تم رفض طلب الخدمة الخاص بك')
      }
    }

    fetchBookings()
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  return {
    profile,
    newRequests,
    appointments,
    isAvailable,
    toggleAvailability,
    handleRequest,
    handleLogout
  }
}
