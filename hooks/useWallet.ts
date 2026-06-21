import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function useWallet() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTransactions = useCallback(async () => {
    setLoading(true)
    const { data } = await supabase.from('bookings').select('*, client:client_id(*)').eq('worker_id', profile?.id).eq('status', 'completed').order('created_at', { ascending: false })
    if (data) setTransactions(data)
    setLoading(false)
  }, [profile?.id, supabase])

  useEffect(() => {
    if (profile) fetchTransactions()
  }, [profile, fetchTransactions])

  const availableBalance = (profile?.total_earnings || 0) * 0.9

  return { profile, transactions, loading, availableBalance }
}
