import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface QuickLinkCardProps {
  label: string
  href: string
  icon: LucideIcon
  badge?: string
}

export function QuickLinkCard({ label, href, icon: Icon, badge }: QuickLinkCardProps) {
  return (
    <Link href={href} className="bg-[#0A0D1A] rounded-2xl p-5 flex flex-col items-center justify-center gap-3 border border-white/5 hover:bg-[#0F1322] transition-colors shadow-sm">
      <div className="relative w-12 h-12 rounded-full bg-[#1E2538] flex items-center justify-center text-[#FF8A00]">
        <Icon size={20} />
        {badge && badge !== '0' && (
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF8A00] rounded-full text-white text-[10px] font-bold flex items-center justify-center border-2 border-[#0A0D1A]">
            {badge}
          </div>
        )}
      </div>
      <span className="text-xs font-bold">{label}</span>
    </Link>
  )
}
