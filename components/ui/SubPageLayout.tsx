'use client'

import React from 'react'

export function SubPageLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" className="min-h-screen bg-[#050814] text-white pb-32">
      {children}
    </div>
  )
}
