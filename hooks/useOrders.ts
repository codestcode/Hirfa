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

  return { activeTab, setActiveTab, orders, loading, updateStatus }
}
