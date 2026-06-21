import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/lib/supabase/client'

export function useGallery() {
  const { user } = useAuth()
  const supabase = createClient()

  const [images, setImages] = useState<any[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [fetching, setFetching] = useState(true)

  useEffect(() => {
    if (!user) return
    supabase.from('worker_gallery').select('*').eq('worker_id', user.id).order('created_at', { ascending: false })
      .then(({ data }) => {
        if (data) setImages(data.map(img => ({ id: img.id, beforeUrl: img.before_url, afterUrl: img.after_url, title: img.title })))
        setFetching(false)
      })
  }, [user, supabase])

  const handleUploadClick = async () => {
    if (!user) return
    setIsUploading(true)
    setTimeout(async () => {
      const { data } = await supabase.from('worker_gallery').insert([{
        worker_id: user.id,
        before_url: 'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?w=500&h=500&fit=crop&grayscale=1',
        after_url: 'https://images.unsplash.com/photo-1534398079543-7ae6d016b86a?w=500&h=500&fit=crop',
        title: 'عمل جديد (قبل وبعد)'
      }]).select().single()
      
      if (data) setImages([{ id: data.id, beforeUrl: data.before_url, afterUrl: data.after_url, title: data.title }, ...images])
      setIsUploading(false)
    }, 1500)
  }

  const handleDelete = async (id: string) => {
    setImages(images.filter(img => img.id !== id))
    await supabase.from('worker_gallery').delete().eq('id', id)
  }

  return { images, isUploading, fetching, handleUploadClick, handleDelete }
}
