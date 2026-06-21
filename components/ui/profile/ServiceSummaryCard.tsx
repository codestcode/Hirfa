import React from 'react'
import { LucideIcon } from 'lucide-react'

interface ServiceSummaryCardProps {
  name: string
  price: string
  icon: LucideIcon
}

export function ServiceSummaryCard({ name, price, icon: Icon }: ServiceSummaryCardProps) {
  return (
    <div className="bg-[#1E2538]/30 border border-white/5 rounded-xl p-3 flex items-center gap-3">
      <div className="w-8 h-8 rounded-full bg-[#1E2538] flex items-center justify-center text-[#FF8A00]">
        <Icon size={14} />
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold">{name}</span>
        <span className="text-[10px] text-[#6B7A99]">يبدأ من {price} ج.م</span>
      </div>
    </div>
  )
}
