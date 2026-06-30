import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export function useServices() {
  const router = useRouter()
  const { user } = useAuth()
  const supabase = createClient()
  const [myServices, setMyServices] = useState<{
    id: string
    name: string
    price: string
    description: string
    price_range: string
    duration: string
    icon: string
  }[]>([])
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('services').select('*').eq('craftsman_id', user.id).then(({ data }) => {
      if (data) {
        setMyServices(data.map(s => ({
          id: s.id,
          name: s.name,
          price: s.price ? s.price.toString() : '50',
          description: s.description || '',
          price_range: s.price_range || '',
          duration: s.duration || '',
          icon: s.icon || 'Wrench'
        })))
      }
      setFetching(false)
    })
  }, [user, supabase])

  const handleRemove = (id: string) => setMyServices(p => p.filter(s => s.id !== id))
  
  const handleAdd = (s: any) => {
    const existing = myServices.find(x => x.id === s.id || x.name === s.name)
    if (!existing) {
      setMyServices(p => [...p, {
        id: s.id || 'service_' + Date.now(),
        name: s.name,
        price: '50',
        description: '',
        price_range: '',
        duration: '',
        icon: s.icon || 'Wrench'
      }])
    }
  }

  const handlePrice = (id: string, price: string) => setMyServices(p => p.map(s => s.id === id ? { ...s, price } : s))

  const handleUpdateField = (id: string, field: string, value: string) => {
    setMyServices(p => p.map(s => s.id === id ? { ...s, [field]: value } : s))
  }

  const handleAddCustom = () => {
    setMyServices(p => [...p, {
      id: 'custom_' + Date.now(),
      name: '',
      price: '50',
      description: '',
      price_range: '',
      duration: '',
      icon: 'Wrench'
    }])
  }

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    
    // Delete existing services
    await supabase.from('services').delete().eq('craftsman_id', user.id)
    
    // Insert new ones, filtering out empty names
    const toSave = myServices.filter(s => s.name.trim() !== '')
    if (toSave.length) {
      const rows = toSave.map(s => ({
        craftsman_id: user.id,
        name: s.name,
        price: parseFloat(s.price) || 0,
        description: s.description || null,
        price_range: s.price_range || null,
        duration: s.duration || null,
        icon: s.icon || 'Wrench'
      }))
      await supabase.from('services').insert(rows)
    }
    router.back()
  }

  return {
    myServices,
    handleRemove,
    handleAdd,
    handlePrice,
    handleUpdateField,
    handleAddCustom,
    loading,
    fetching,
    handleSave
  }
}
