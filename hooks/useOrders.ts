import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { createNotification } from '@/lib/notifications'

export type TabType = 'pending' | 'confirmed' | 'completed'

export function useOrders() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [activeTab, setActiveTab] = useState<TabType>('pending')
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchOrders = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('bookings').select('*, client:client_id(*)').eq('worker_id', profile?.id).eq('status', activeTab).order('created_at', { ascending: false })
    if (data) setOrders(data)
    setLoading(false)
  }, [profile?.id, activeTab, supabase])

  useEffect(() => {
    if (profile) fetchOrders()
  }, [profile, activeTab, fetchOrders])

  const updateStatus = async (id: string, status: string) => {
    const { data: booking } = await supabase
      .from('bookings')
      .select('client_id')
      .eq('id', id)
      .single()

    if (status === 'completed') {
      const { processBookingCompletion } = await import('@/lib/supabase/booking-payments')
      await processBookingCompletion(supabase, id)
    }

    await supabase.from('bookings').update({ status }).eq('id', id)

    if (booking) {
      if (status === 'confirmed') {
        createNotification(booking.client_id, 'قام الحرفي بقبول الخدمة', `تم قبول طلب الخدمة بواسطة ${profile?.full_name || 'الحرفي'}`)
      } else if (status === 'cancelled') {
        createNotification(booking.client_id, 'تم رفض طلب الخدمة', 'نأسف، تم رفض طلب الخدمة الخاص بك')
      } else if (status === 'completed') {
        createNotification(booking.client_id, 'تم إكمال طلب الخدمة', 'تم إكمال طلب الخدمة بنجاح، يمكنك تقييم الحرفي الآن')
      }
    }

    fetchOrders()
  }

  const updateTracking = async (
    id: string, 
    tracking_status: string, 
    eta?: string | null, 
    status_notes?: string | null, 
    work_progress?: string | null
  ) => {
    const { data: currentBooking } = await supabase.from('bookings').select('status_history, client_id, service_name').eq('id', id).single()
    const currentHistory = Array.isArray(currentBooking?.status_history) ? currentBooking.status_history : []
    const newHistoryEntry = {
      tracking_status,
      eta: eta || null,
      notes: status_notes || null,
      work_progress: work_progress || null,
      timestamp: new Date().toISOString()
    }
    
    const updates: any = { 
      tracking_status,
      status_history: [...currentHistory, newHistoryEntry]
    }
    if (eta !== undefined) updates.eta = eta
    if (status_notes !== undefined) updates.status_notes = status_notes
    if (work_progress !== undefined) updates.work_progress = work_progress

    if (tracking_status === 'completed') {
      const { processBookingCompletion } = await import('@/lib/supabase/booking-payments')
      await processBookingCompletion(supabase, id)
      await supabase.from('bookings').update({ status: 'completed', ...updates }).eq('id', id)
      
      const { data: booking } = await supabase.from('bookings').select('client_id').eq('id', id).single()
      if (booking) {
        createNotification(booking.client_id, 'تم إكمال طلب الخدمة', 'تم إكمال طلب الخدمة بنجاح، يمكنك تقييم الحرفي الآن')
      }
    } else {
      await supabase.from('bookings').update(updates).eq('id', id)
      
      const booking = currentBooking
      if (booking) {
        let label = 'تحديث حالة الطلب'
        let msg = `قام الحرفي بتحديث حالة طلب ${booking.service_name}`
        if (tracking_status === 'preparing_to_leave') {
          label = 'تجهيز للتحرك'
          msg = `قام الحرفي بالتجهيز للتحرك للطلب الخاص بك`
        } else if (tracking_status === 'on_the_way') {
          label = 'الحرفي في الطريق'
          msg = `الحرفي في الطريق إليك الآن.`
          if (eta) msg += ` الوقت المقدر للوصول: ${eta}`
        } else if (tracking_status === 'arrived') {
          label = 'وصل الحرفي'
          msg = `وصل الحرفي لموقع العمل.`
        } else if (tracking_status === 'work_started') {
          label = 'بدء العمل'
          msg = `بدأ الحرفي في تنفيذ الخدمة المطلوبة.`
        }
        createNotification(booking.client_id, label, msg)
      }
    }
    fetchOrders()
  }

  return { activeTab, setActiveTab, orders, loading, updateStatus, updateTracking }
}
