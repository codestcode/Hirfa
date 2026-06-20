'use client'

import { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { LogOut } from 'lucide-react'

export default function ClientHomePage() {
  const router = useRouter()
  const { profile, user, signOut } = useAuth()
  const [loggingOut, setLoggingOut] = useState(false)

  const displayName = profile?.full_name || user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'مستخدم'

  const handleLogout = useCallback(async () => {
    if (loggingOut) return
    setLoggingOut(true)
    try {
      await signOut()
      router.push('/login')
    } catch {
      setLoggingOut(false)
    }
  }, [loggingOut, signOut, router])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 relative">
      <button
        onClick={handleLogout}
        disabled={loggingOut}
        className="absolute top-4 left-4 flex items-center justify-center rounded-full w-10 h-10 bg-[#1E2538] hover:bg-[#FF4D4D]/20 transition-colors"
      >
        <LogOut size={18} className="text-[#FF4D4D]" />
      </button>

      <h1 className="text-2xl font-bold text-white">لوحة تحكم المستخدم</h1>
      <p className="mt-2 text-gray-400">
        أهلاً {displayName}
      </p>
    </main>
  )
}
