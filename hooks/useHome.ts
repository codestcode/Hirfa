import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

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
    await supabase.from('bookings').update({ status }).eq('id', id)
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
