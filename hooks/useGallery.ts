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

  const uploadNewWork = async (title: string, beforeB64: string, afterB64: string) => {
    if (!user) return
    setIsUploading(true)
    try {
      const { data, error } = await supabase.from('worker_gallery').insert([{
        worker_id: user.id,
        before_url: beforeB64,
        after_url: afterB64,
        title: title || 'عمل جديد'
      }]).select().single()
      
      if (error) throw error
      if (data) setImages([{ id: data.id, beforeUrl: data.before_url, afterUrl: data.after_url, title: data.title }, ...images])
    } catch (e) {
      console.error(e)
      alert('فشل الرفع: ' + (e instanceof Error ? e.message : 'خطأ غير معروف'))
    } finally {
      setIsUploading(false)
    }
  }

  const handleDelete = async (id: string) => {
    setImages(images.filter(img => img.id !== id))
    await supabase.from('worker_gallery').delete().eq('id', id)
  }

  return { images, isUploading, fetching, uploadNewWork, handleDelete }
}
