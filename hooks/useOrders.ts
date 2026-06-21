import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

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
    await supabase.from('bookings').update({ status }).eq('id', id)
    fetchOrders()
  }

  return { activeTab, setActiveTab, orders, loading, updateStatus }
}
