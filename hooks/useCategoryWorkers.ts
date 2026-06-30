'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

export interface ServiceWorker {
  id: string
  full_name: string | null
  avatar_url: string | null
  profession: string | null
  rating: number
  completed_orders: number
  is_available: boolean
  min_price: number | null
  governorate: string | null
  area: string | null
}

export function useCategoryWorkers(categoryId: string) {
  const supabase = createClient()
  const { profile: clientProfile } = useAuth()
  const [workers, setWorkers] = useState<ServiceWorker[]>([])
  const [categoryName, setCategoryName] = useState('')
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState<'rating' | 'price_asc' | 'price_desc'>('rating')

  const fetchWorkers = useCallback(async () => {
    setLoading(true)
    const HARDCODED_CATEGORIES = [
      { id: 'painting', label_ar: 'دهان' },
      { id: 'carpentry', label_ar: 'نجارة' },
      { id: 'plumbing', label_ar: 'سباكة' },
      { id: 'electricity', label_ar: 'كهرباء' },
    ]

    let label = ''
    const { data: cat } = await supabase.from('categories').select('label_ar').eq('id', categoryId).single()
    if (cat?.label_ar) {
      label = cat.label_ar
    } else {
      const hc = HARDCODED_CATEGORIES.find(c => c.id === categoryId)
      if (hc) label = hc.label_ar
    }

    if (label) setCategoryName(label)

    let query = supabase
      .from('profiles')
      .select('id, full_name, avatar_url, profession, rating, completed_orders, is_available, governorate, area')
      .eq('role', 'worker')
      .eq('verified', true)
      .eq('is_available', true)

    if (label) {
      query = query.eq('profession', label)
    } else if (categoryId && categoryId !== 'all') {
      query = query.eq('profession', categoryId)
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

      const getProximityScore = (worker: ServiceWorker) => {
        if (!clientProfile) return 1
        if (worker.governorate === clientProfile.governorate && worker.area === clientProfile.area) {
          return 3
        }
        if (worker.governorate === clientProfile.governorate) {
          return 2
        }
        return 1
      }

      result.sort((a, b) => {
        const scoreA = getProximityScore(a)
        const scoreB = getProximityScore(b)
        if (scoreA !== scoreB) {
          return scoreB - scoreA
        }
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0)
        } else if (sortBy === 'price_asc') {
          return (a.min_price || 999999) - (b.min_price || 999999)
        } else {
          return (b.min_price || 0) - (a.min_price || 0)
        }
      })

      setWorkers(result)
    }
    setLoading(false)
  }, [supabase, categoryId, sortBy, clientProfile])

  useEffect(() => { fetchWorkers() }, [fetchWorkers])

  return { workers, categoryName, loading, sortBy, setSortBy, refresh: fetchWorkers }
}
