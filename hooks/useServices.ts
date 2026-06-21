import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function useServices() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [myServices, setMyServices] = useState<{id: string, name: string, price: string}[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('worker_services').select('*').eq('worker_id', user.id).then(({ data }) => {
      if (data) setMyServices(data.map(s => ({ id: s.service_id, name: s.name, price: s.price.toString() })))
      setFetching(false)
    })
  }, [user, supabase])

  const handleRemove = (id: string) => setMyServices(p => p.filter(s => s.id !== id))
  const handleAdd = (s: any) => { if (!myServices.find(x => x.id === s.id)) setMyServices(p => [...p, { id: s.id, name: s.name, price: '50' }]) }
  const handlePrice = (id: string, price: string) => setMyServices(p => p.map(s => s.id === id ? { ...s, price } : s))

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    await supabase.from('worker_services').delete().eq('worker_id', user.id)
    if (myServices.length) {
      await supabase.from('worker_services').insert(myServices.map(s => ({ worker_id: user.id, service_id: s.id, name: s.name, price: parseFloat(s.price) || 0 })))
    }
    router.back()
  }

  return { myServices, handleRemove, handleAdd, handlePrice, loading, fetching, handleSave }
}
