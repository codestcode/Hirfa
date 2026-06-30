'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

interface PageHeaderProps {
  title: string;
  showBack?: boolean;
  leftElement?: React.ReactNode;
  isTransparent?: boolean;
}

export function PageHeader({ title, showBack = true, leftElement, isTransparent = false }: PageHeaderProps) {
  const router = useRouter()

  return (
    <div dir="rtl" className={`flex items-center justify-between px-6 py-6 ${isTransparent ? 'mb-2' : 'border-b border-white/5 sticky top-0 bg-[#050814]/80 backdrop-blur-xl z-20'}`}>
      {showBack ? (
        <button 
          onClick={() => router.back()} 
          className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/5 transition-colors"
        >
          <ArrowRight size={22} className="text-white" />
        </button>
      ) : (
        <div className="w-10 h-10" />
      )}
      
      <h1 className="text-lg font-bold text-center flex-1">{title}</h1>
      
      {leftElement ? (
        <div className="w-10 h-10 flex items-center justify-center">
          {leftElement}
        </div>
      ) : (
        <div className="w-10 h-10" />
      )}
    </div>
  )
}
