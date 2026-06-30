'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

export interface CraftsmanProfile {
  id: string
  full_name: string | null
  avatar_url: string | null
  profession: string | null
  rating: number
  completed_orders: number
  is_available: boolean
  verified: boolean
  governorate: string | null
  area: string | null
  phone: string | null
  address: string | null
}

export interface GalleryItem {
  id: string
  before_url: string | null
  after_url: string | null
  title: string | null
}

export interface WorkerServiceItem {
  id: string
  name: string
  price: number
  description?: string | null
  price_range?: string | null
  duration?: string | null
  icon?: string | null
}

export interface ReviewItem {
  id: string
  client_name: string | null
  rating: number
  text: string | null
  created_at: string
}

export function useCraftsmanProfile(workerId: string) {
  const supabase = createClient()
  const [profile, setProfile] = useState<CraftsmanProfile | null>(null)
  const [gallery, setGallery] = useState<GalleryItem[]>([])
  const [services, setServices] = useState<WorkerServiceItem[]>([])
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async () => {
    setLoading(true)

    const [profRes, servRes, galleryRes] = await Promise.all([
      supabase.from('profiles').select('id, full_name, avatar_url, profession, rating, completed_orders, is_available, verified, governorate, area, phone').eq('id', workerId).single(),
      supabase.from('services').select('id, name, price, description, price_range, duration, icon').eq('craftsman_id', workerId).order('price', { ascending: true }),
      supabase.from('worker_gallery').select('id, before_url, after_url, title').eq('worker_id', workerId).order('created_at', { ascending: false })
    ])

    if (profRes.data) {
      const p = profRes.data as any

      const { data: addr } = await supabase
        .from('addresses')
        .select('city, street, building, apartment')
        .eq('user_id', workerId)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle()

      let fullAddress: string | null = null
      if (addr) {
        const parts = [addr.city, '، ', addr.street]
        if (addr.building) parts.push('، مبنى ', addr.building)
        if (addr.apartment) parts.push('، شقة ', addr.apartment)
        fullAddress = parts.join('')
      }
      setProfile({
        id: p.id,
        full_name: p.full_name,
        avatar_url: p.avatar_url,
        profession: p.profession,
        rating: p.rating || 0,
        completed_orders: p.completed_orders || 0,
        is_available: p.is_available ?? true,
        verified: p.verified ?? false,
        governorate: p.governorate,
        area: p.area,
        phone: p.phone,
        address: fullAddress
      })
    }

    if (servRes.data) setServices(servRes.data)
    if (galleryRes.data) setGallery(galleryRes.data)

    const { data: reviewsData } = await supabase
      .from('reviews')
      .select('id, rating, text, created_at, client_id')
      .eq('craftsman_id', workerId)
      .order('created_at', { ascending: false })

    if (reviewsData && reviewsData.length > 0) {
      const clientIds = [...new Set(reviewsData.map(r => r.client_id))]
      const { data: clients } = await supabase
        .from('profiles')
        .select('id, full_name')
        .in('id', clientIds)

      const clientMap: Record<string, string> = {}
      clients?.forEach(c => { clientMap[c.id] = c.full_name || 'عميل' })

      setReviews(reviewsData.map(r => ({
        id: r.id,
        rating: r.rating,
        text: r.text,
        client_name: clientMap[r.client_id] || 'عميل',
        created_at: r.created_at
      })))
    }

    setLoading(false)
  }, [supabase, workerId])

  useEffect(() => { fetchProfile() }, [fetchProfile])

  return { profile, gallery, services, reviews, loading, refresh: fetchProfile }
}
