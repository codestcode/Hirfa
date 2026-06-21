import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Bell } from 'lucide-react'

interface HomeHeaderProps {
  name: string
  avatar: string
  isAvailable: boolean
  onLogout: () => void
}

export function HomeHeader({ name, avatar, isAvailable, onLogout }: HomeHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="relative">
          <div className="relative w-11 h-11 rounded-full overflow-hidden border-2 border-[#1E2538] flex items-center justify-center bg-[#0F1322]">
            <Image src={avatar} alt="Profile" fill className="object-cover" />
          </div>
          <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#050814] ${isAvailable ? 'bg-[#4ADE80]' : 'bg-[#94A3B8]'}`} />
        </div>
        <div className="flex flex-col text-right items-start">
          <span className="text-xs text-[#6B7A99]">مرحباً،</span>
          <span className="text-sm font-bold flex items-center gap-1">
            {name} <span className="text-lg">👋</span>
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-2">
        <Link href="/notifications" className="relative bg-[#0F1322] w-10 h-10 rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1E2538] transition-colors">
          <Bell size={20} className="text-[#94A3B8]" />
          <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-[#FF8A00] rounded-full border-2 border-[#0F1322]" />
        </Link>
        <button onClick={onLogout} className="w-10 h-10 rounded-full bg-[#1E2538]/50 flex items-center justify-center text-[#EF4444] hover:bg-[#1E2538] transition-colors border border-white/5">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
        </button>
      </div>
    </div>
  )
}
