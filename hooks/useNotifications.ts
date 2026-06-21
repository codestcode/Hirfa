import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function useNotifications() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('notifications').select('*').eq('user_id', profile?.id).order('created_at', { ascending: false })
    if (data) setNotifications(data)
    setLoading(false)
  }, [profile?.id, supabase])

  useEffect(() => {
    if (profile) fetchNotifications()
  }, [profile, fetchNotifications])

  const markAsRead = async (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n))
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }

  const markAllAsRead = async () => {
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })))
    await supabase.from('notifications').update({ is_read: true }).eq('user_id', profile?.id).eq('is_read', false)
  }

  const unreadCount = notifications.filter(n => !n.is_read).length

  return { notifications, loading, markAsRead, markAllAsRead, unreadCount }
}
