import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function useMessages() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [conversations, setConversations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchConversations = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('conversations').select('*, client:client_id(*)').eq('worker_id', profile?.id).order('last_message_at', { ascending: false })
    if (data) setConversations(data)
    setLoading(false)
  }, [profile?.id, supabase])

  useEffect(() => {
    if (profile) fetchConversations()
  }, [profile, fetchConversations])

  return { conversations, loading }
}
