import React from 'react'
import Image from 'next/image'
import { ShieldCheck } from 'lucide-react'

interface ProfileAvatarInfoProps {
  avatarUrl?: string
  fullName: string
  profession?: string
  categoryLevel?: string
  onClick?: () => void
}

export function ProfileAvatarInfo({ avatarUrl, fullName, profession, categoryLevel, onClick }: ProfileAvatarInfoProps) {
  return (
    <div className="flex flex-col items-center px-6 mb-8 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-[#FF8A00]/10 rounded-full blur-3xl -z-10" />
      
      <div 
        className={`relative mb-4 ${onClick ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`} 
        onClick={onClick}
      >
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-[3px] border-[#FF8A00] bg-[#1E2538] shadow-[0_0_20px_rgba(255,138,0,0.3)] p-1">
          <div className="w-full h-full rounded-full overflow-hidden relative">
            <Image src={avatarUrl || "/craftsman_avatar.png"} alt="Profile" fill className="object-cover" />
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-7 h-7 bg-[#FF8A00] rounded-full border-[3px] border-[#050814] flex items-center justify-center shadow-lg">
          <ShieldCheck size={14} className="text-[#050814] fill-[#050814]" strokeWidth={3} />
        </div>
      </div>

      <h2 className="text-xl font-bold mb-1">{fullName}</h2>
      <div className="flex items-center gap-2 text-sm text-[#6B7A99]">
        <span>{profession || 'بدون تخصص'}</span>
        <span className="w-1.5 h-1.5 rounded-full bg-[#6B7A99]" />
        <span className="bg-white/5 px-2 py-0.5 rounded text-white/80">{categoryLevel || 'جديد'}</span>
      </div>
    </div>
  )
}
