'use client'

import React from 'react'
import { WorkerBottomNav } from '@/components/ui/WorkerBottomNav'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen w-full bg-[#050814] flex justify-center text-white/80 overflow-x-hidden">
      <div className="w-full max-w-[480px] bg-[#050814] min-h-screen relative pb-20">
        {children}
        <WorkerBottomNav />
      </div>
    </div>
  )
}
