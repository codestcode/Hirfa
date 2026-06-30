import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Smartphone, Landmark } from 'lucide-react'

export function usePaymentMethods() {
  const { user } = useAuth()
  const supabase = createClient()

  const [showAddModal, setShowAddModal] = useState(false)
  const [methods, setMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchMethods = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const { data } = await supabase
      .from('withdrawal_methods')
      .select('*')
      .eq('worker_id', user.id)
      .order('created_at', { ascending: false })
    
    if (data) {
      setMethods(data.map(m => ({
        id: m.id,
        type: m.type,
        name: m.type === 'bank_account' ? `${m.bank_name} - ${m.holder_name}` : 'فودافون كاش',
        number: m.account_number,
        isDefault: m.is_default,
        icon: m.type === 'vodafone_cash' ? Smartphone : Landmark,
        color: m.type === 'vodafone_cash' ? '#E60000' : '#005A32'
      })))
    }
    setLoading(false)
  }, [user, supabase])

  useEffect(() => {
    if (user) fetchMethods()
  }, [user, fetchMethods])

  const setAsDefault = async (id: string) => {
    if (!user) return
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })))
    await supabase.from('withdrawal_methods').update({ is_default: false }).eq('worker_id', user.id)
    await supabase.from('withdrawal_methods').update({ is_default: true }).eq('id', id)
    fetchMethods()
  }

  const removeMethod = async (id: string) => {
    if (!user) return
    setMethods(methods.filter(m => m.id !== id))
    await supabase.from('withdrawal_methods').delete().eq('id', id)
    fetchMethods()
  }

  return { methods, loading, showAddModal, setShowAddModal, setAsDefault, removeMethod, refresh: fetchMethods }
}
