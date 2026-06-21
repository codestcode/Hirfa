import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function useVerification() {
  const { user } = useAuth()
  const supabase = createClient()
  const [frontImage, setFrontImage] = useState<string | null>(null)
  const [backImage, setBackImage] = useState<string | null>(null)
  const [selfieImage, setSelfieImage] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [status, setStatus] = useState<'unverified' | 'pending' | 'verified'>('unverified')

  useEffect(() => {
    if (!user) return
    supabase.from('profiles').select('verification_status, id_front_url, id_back_url, selfie_url').eq('id', user.id).single()
      .then(({ data }) => {
        if (data) {
          setStatus(data.verification_status as any || 'unverified')
          setFrontImage(data.id_front_url); setBackImage(data.id_back_url); setSelfieImage(data.selfie_url);
        }
        setFetching(false)
      })
  }, [user, supabase])

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>, setter: any) => {
    const file = e.target.files?.[0]
    if (file) { const reader = new FileReader(); reader.onloadend = () => setter(reader.result as string); reader.readAsDataURL(file) }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setLoading(true)
    await supabase.from('profiles').update({ verification_status: 'pending', id_front_url: frontImage, id_back_url: backImage, selfie_url: selfieImage }).eq('id', user.id)
    setStatus('pending')
    setLoading(false)
  }

  return { frontImage, setFrontImage, backImage, setBackImage, selfieImage, setSelfieImage, loading, fetching, status, handleImage, handleSubmit }
}
