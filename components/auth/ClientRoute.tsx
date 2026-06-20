'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, type ReactNode } from 'react'

export function ClientRoute({ children }: { children: ReactNode }) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.push('/login')
    } else if (profile && profile.role !== 'client') {
      router.push('/dashboard')
    }
  }, [user, profile, loading, router])

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#FF8A00] border-t-transparent" />
      </div>
    )
  }

  if (!user || !profile || profile.role !== 'client') return null

  return <>{children}</>
}
