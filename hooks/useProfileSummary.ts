import { useState, useEffect, useCallback } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { Droplet, Zap, Wrench, Home, Scissors, LayoutGrid } from 'lucide-react'

const getIconForService = (name: string) => {
  if (name.includes('سباكة')) return Droplet
  if (name.includes('كهرباء')) return Zap
  if (name.includes('تكييف')) return Wrench
  if (name.includes('نجارة')) return Home
  if (name.includes('دهانات')) return Scissors
  return LayoutGrid
}

export function useProfileSummary() {
  const { profile } = useAuth()
  const supabase = createClient()
  const [services, setServices] = useState<any[]>([])
  const [reviews, setReviews] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setLoading(true)
    if (!profile?.id) return

    const [servicesRes, reviewsRes] = await Promise.all([
      supabase.from('worker_services').select('*').eq('worker_id', profile.id),
      supabase.from('worker_reviews').select('*').eq('worker_id', profile.id).order('created_at', { ascending: false }).limit(3)
    ])

    if (servicesRes.data) {
      setServices(servicesRes.data.map(s => ({ id: s.id, name: s.name, price: s.price.toString(), icon: getIconForService(s.name) })))
    }

    if (reviewsRes.data) {
      setReviews(reviewsRes.data.map(r => ({ id: r.id, name: r.client_name || 'عميل', rating: r.rating, comment: r.comment })))
    }

    setLoading(false)
  }, [profile?.id, supabase])

  useEffect(() => {
    if (profile) fetchData()
  }, [profile, fetchData])

  return { profile, services, reviews, loading }
}
