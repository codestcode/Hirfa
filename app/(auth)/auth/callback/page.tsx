'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'

export default function AuthCallback() {
  const router = useRouter()
  const { user, profile, loading } = useAuth()

  useEffect(() => {
    if (!loading && user) {
      if (profile?.role === 'admin') {
        router.push('/admin')
      } else if (profile?.role === 'worker') {
        router.push('/worker/home')
      } else {
        router.push('/client/home')
      }
    } else if (!loading && !user) {
      // If loading is done and no user, there was an error or no code
      const timer = setTimeout(() => {
        router.push('/login')
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [user, profile, loading, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050814] text-white">
       <div className="animate-spin w-8 h-8 border-2 border-[#FF8A00] border-t-transparent rounded-full mb-4" />
       <p className="text-sm text-[#6B7A99]">جاري التحقق من تسجيل الدخول...</p>
    </div>
  )
}
