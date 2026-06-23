'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Profile } from '@/lib/types'

export interface ClientCategory {
  id: string
  label_ar: string
  label_en: string | null
  icon: string | null
  usage_count: number
}

export interface WorkerCard {
  id: string
  full_name: string | null
  avatar_url: string | null
  profession: string | null
  rating: number
  completed_orders: number
  is_available: boolean
}

export function useClientHome() {
  const supabase = createClient()
  const [categories, setCategories] = useState<ClientCategory[]>([])
  const [workers, setWorkers] = useState<WorkerCard[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [catRes, workRes] = await Promise.all([
      supabase.from('categories').select('*').order('usage_count', { ascending: false }).limit(8),
      supabase
        .from('profiles')
        .select('id, full_name, avatar_url, profession, rating, completed_orders, is_available')
        .eq('role', 'worker')
        .eq('verified', true)
        .eq('is_available', true)
        .order('rating', { ascending: false })
        .limit(5)
    ])
    if (catRes.data) setCategories(catRes.data)
    if (workRes.data) setWorkers(workRes.data)
    setLoading(false)
  }, [supabase])

  useEffect(() => { fetchData() }, [fetchData])

  return { categories, workers, loading, refresh: fetchData }
}
