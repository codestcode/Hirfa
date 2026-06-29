'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useAuth } from '@/contexts/AuthContext'
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
  governorate?: string | null
  area?: string | null
}

export function useClientHome() {
  const supabase = createClient()
  const { profile: clientProfile } = useAuth()
  const [categories, setCategories] = useState<ClientCategory[]>([])
  const [workers, setWorkers] = useState<WorkerCard[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    const [catRes, workRes] = await Promise.all([
      supabase.from('categories').select('*').order('usage_count', { ascending: false }).limit(8),
      supabase
        .from('profiles')
        .select('id, full_name, avatar_url, profession, rating, completed_orders, is_available, governorate, area')
        .eq('role', 'worker')
        .eq('verified', true)
        .eq('is_available', true)
        .order('rating', { ascending: false })
        .limit(50)
    ])
    if (catRes.data) setCategories(catRes.data)
    if (workRes.data) {
      let result = [...workRes.data] as WorkerCard[]
      if (clientProfile) {
        const getProximityScore = (w: WorkerCard) => {
          if (w.governorate === clientProfile.governorate && w.area === clientProfile.area) return 3
          if (w.governorate === clientProfile.governorate) return 2
          return 1
        }
        result.sort((a, b) => {
          const scoreA = getProximityScore(a)
          const scoreB = getProximityScore(b)
          if (scoreA !== scoreB) return scoreB - scoreA
          return (b.rating || 0) - (a.rating || 0)
        })
      }
      setWorkers(result.slice(0, 5))
    }
    setLoading(false)
  }, [supabase, clientProfile])

  useEffect(() => { fetchData() }, [fetchData])

  return { categories, workers, loading, refresh: fetchData }
}
