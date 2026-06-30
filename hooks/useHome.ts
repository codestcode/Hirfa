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

  const [activeEmergency, setActiveEmergency] = useState<any>(null)

  const fetchBookings = useCallback(async () => {
    if (!profile?.id) return
    const { data: reqs } = await supabase.from('bookings').select('*, client:client_id(*)').eq('worker_id', profile.id).eq('status', 'pending').order('created_at', { ascending: false }).limit(3)
    if (reqs) setNewRequests(reqs)

    const { data: apps } = await supabase.from('bookings').select('*, client:client_id(*)').eq('worker_id', profile.id).eq('status', 'confirmed').order('appointment_date', { ascending: true }).order('appointment_time', { ascending: true }).limit(3)
    if (apps) setAppointments(apps)
  }, [profile?.id, supabase])

  function getEmergencyTypeFromProfession(profession: string) {
    if (profession === 'سباكة') return ['water', 'gas']
    if (profession === 'كهرباء') return ['power']
    if (profession === 'نجارة') return ['door']
    return ['fire', 'other']
  }

  const fetchActiveEmergency = useCallback(async () => {
    if (!profile?.id || !profile.profession || !isAvailable) {
      setActiveEmergency(null)
      return
    }
    
    const types = getEmergencyTypeFromProfession(profile.profession)
    const { data } = await supabase
      .from('emergencies')
      .select('*, client:client_id(full_name, email)')
      .eq('status', 'pending')
      .is('assigned_craftsman_id', null)
      .in('type', types)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    
    setActiveEmergency(data)
  }, [profile?.id, profile?.profession, isAvailable, supabase])

  useEffect(() => {
    if (profile) {
      setIsAvailable(profile.is_available ?? true)
      fetchBookings()
      fetchActiveEmergency()

      const channel = supabase
        .channel('global-emergencies')
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'emergencies' },
          () => {
            fetchActiveEmergency()
          }
        )
        .subscribe()

      const bookingsChannel = supabase
        .channel(`worker-bookings-sync-${profile.id}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'bookings', filter: `worker_id=eq.${profile.id}` },
          () => {
            fetchBookings()
          }
        )
        .subscribe()

      return () => {
        supabase.removeChannel(channel)
        supabase.removeChannel(bookingsChannel)
      }
    }
  }, [profile, fetchBookings, fetchActiveEmergency])

  const acceptEmergency = async (emergencyId: string) => {
    if (!profile?.id) return

    const { data: emergency, error: fetchErr } = await supabase
      .from('emergencies')
      .select('*')
      .eq('id', emergencyId)
      .single()
    
    if (fetchErr || !emergency || emergency.status !== 'pending') {
      alert('نأسف، تم قبول طلب الطوارئ هذا بالفعل بواسطة حرفي آخر أو تم إلغاؤه.')
      setActiveEmergency(null)
      return
    }

    const { data: booking, error: bookErr } = await supabase
      .from('bookings')
      .insert({
        client_id: emergency.client_id,
        worker_id: profile.id,
        service_name: 'خدمة طوارئ عاجلة',
        status: 'confirmed',
        price: 200,
        is_emergency: true,
        emergency_type: emergency.type,
        notes: emergency.description || 'طلب طوارئ عاجل',
        payment_method: 'cash',
        appointment_date: new Date().toISOString().split('T')[0],
        appointment_time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
        address: 'موقع الطوارئ المحدد',
        craftsman_lat: profile.latitude || null,
        craftsman_lng: profile.longitude || null
      })
      .select()
      .single()
    
    if (bookErr || !booking) {
      alert('فشل إنشاء الحجز: ' + bookErr?.message)
      return
    }

    await supabase
      .from('emergencies')
      .update({
        assigned_craftsman_id: profile.id,
        booking_id: booking.id,
        status: 'confirmed'
      })
      .eq('id', emergencyId)

    createNotification(emergency.client_id, 'تم قبول طلب الطوارئ', `الحرفي ${profile.full_name} في طريقه إليك الآن!`)

    alert('تم قبول طلب الطوارئ بنجاح، يرجى التوجه لموقع العميل.')
    window.location.reload()
  }

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
    activeEmergency,
    acceptEmergency,
    toggleAvailability,
    handleRequest,
    handleLogout
  }
}
