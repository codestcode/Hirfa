'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface ServiceWorker {
  id: string
  full_name: string | null
  avatar_url: string | null
  profession: string | null
  rating: number
  completed_orders: number
  is_available: boolean
  min_price: number | null
}

export function useCategoryWorkers(categoryId: string) {
  const supabase = createClient()
  const [workers, setWorkers] = useState<ServiceWorker[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating')

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    const { data: cat } = await supabase.from('categories').select('label_ar').eq('id', categoryId).single()
    if (cat) setCategoryName(cat.label_ar)

    let query = supabase
      .from('profiles')
      .select('id, full_name, avatar_url, profession, rating, completed_orders, is_available')
      .eq('role', 'worker')
      .eq('verified', true)
      .eq('is_available', true)

    if (cat?.label_ar) {
      query = query.eq('profession', cat.label_ar)
    }

    const { data: workersData } = await query

    if (workersData) {
      const workerIds = workersData.map(w => w.id)
      const { data: services } = await supabase
        .from('services')
        .select('craftsman_id, price')
        .in('craftsman_id', workerIds)

      const priceMap: Record<string, number> = {}
      services?.forEach(s => {
        if (!priceMap[s.craftsman_id] || s.price < priceMap[s.craftsman_id]) {
          priceMap[s.craftsman_id] = s.price
        }
      })

      let result: ServiceWorker[] = workersData.map(w => ({
        ...w,
        min_price: priceMap[w.id] || null
      }))

      if (sortBy === 'rating') {
        result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
      } else if (sortBy === 'price_asc') {
        result.sort((a, b) => (a.min_price || 999999) - (b.min_price || 999999))
      } else {
        result.sort((a, b) => (b.min_price || 0) - (a.min_price || 0))
      }

      setWorkers(result)
    }
    setLoading(false)
  }, [supabase, categoryId, sortBy])

  useEffect(() => { fetchWorkers() }, [fetchWorkers])

  return { workers, categoryName, loading, sortBy, setSortBy, refresh: fetchWorkers }
}
