import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Smartphone, Landmark } from 'lucide-react'

export function usePaymentMethods() {
  const { user } = useAuth()
  const supabase = createClient()

  const [showAddModal, setShowAddModal] = useState(false)
  const [methods, setMethods] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('payment_methods').select('*').eq('worker_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setMethods(data.map(m => ({
          id: m.id, type: m.method_type, name: m.name, number: m.number, isDefault: m.is_default,
          icon: m.method_type === 'wallet' ? Smartphone : Landmark,
          color: m.method_type === 'wallet' ? '#E60000' : '#005A32'
        })))
        setLoading(false)
      })
  }, [user, supabase])

  const setAsDefault = async (id: string) => {
    if (!user) return
    setMethods(methods.map(m => ({ ...m, isDefault: m.id === id })))
    await supabase.from('payment_methods').update({ is_default: false }).eq('worker_id', user.id)
    await supabase.from('payment_methods').update({ is_default: true }).eq('id', id)
  }

  const removeMethod = async (id: string) => {
    if (!user) return
    setMethods(methods.filter(m => m.id !== id))
    await supabase.from('payment_methods').delete().eq('id', id)
  }

  return { methods, loading, showAddModal, setShowAddModal, setAsDefault, removeMethod }
}
