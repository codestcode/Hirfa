'use client'

import { useAuth } from '@/contexts/AuthContext'

export default function WorkerDashboardPage() {
  const { profile } = useAuth()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4">
      <h1 className="text-2xl font-bold text-white">لوحة التحكم</h1>
      <p className="mt-2 text-gray-400">
        أهلاً {profile?.full_name ?? 'حرفي'}
      </p>
    </main>
  )
}
