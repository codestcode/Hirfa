import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function useCalendar() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [filter, setFilter] = useState<'all' | 'upcoming' | 'completed'>('upcoming')
  const [appointments, setAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAppointments = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('bookings').select('*, client:client_id(*)').eq('worker_id', profile?.id).in('status', ['confirmed', 'completed']).order('appointment_date', { ascending: true })
    
    if (data) {
      setAppointments(data.map(b => ({
        id: b.id,
        clientName: b.client?.full_name || 'عميل',
        service: b.service_name,
        date: new Date(b.appointment_date).toLocaleDateString('ar-EG', { month: 'short', day: 'numeric' }),
        time: b.appointment_time?.slice(0, 5) || '10:00',
        address: b.address || 'عنوان غير محدد',
        status: b.status === 'completed' ? 'completed' : 'upcoming'
      })))
    }
    setLoading(false)
  }, [profile?.id, supabase])

  useEffect(() => {
    if (profile) fetchAppointments()
  }, [profile, fetchAppointments])

  const filteredAppointments = filter === 'all' ? appointments : appointments.filter(app => app.status === filter)

  return { filter, setFilter, filteredAppointments, loading }
}
