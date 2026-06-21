import React from 'react'
import { Info, Trash2 } from 'lucide-react'

interface SelectedServiceCardProps {
  service: any
  onRemove: (id: string) => void
  onPriceChange: (id: string, price: string) => void
}

export function SelectedServiceCard({ service, onRemove, onPriceChange }: SelectedServiceCardProps) {
  return (
    <div className="bg-[#0A0D1A] border border-white/5 rounded-2xl p-4 flex flex-col gap-4 relative overflow-hidden group">
      <div className="absolute top-0 right-0 w-1 h-full bg-[#FF8A00]/50 group-hover:bg-[#FF8A00] transition-colors" />
      
      <div className="flex items-start justify-between">
        <div className="flex flex-col pr-3">
          <span className="font-bold text-sm mb-1">{service.name}</span>
          <div className="flex items-center gap-1 text-[10px] text-[#6B7A99]">
            <Info size={12} />
            <span>يجب أن لا يقل السعر عن 50 ج.م</span>
          </div>
        </div>
        <button 
          onClick={() => onRemove(service.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>
      
      <div className="flex items-center justify-between bg-[#1E2538]/30 rounded-xl p-3 mt-1">
        <span className="text-xs font-bold text-[#94A3B8]">سعر الزيارة التقديري</span>
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-[#FF8A00]">ج.م</span>
          <input 
            type="number"
            value={service.price}
            onChange={(e) => onPriceChange(service.id, e.target.value)}
            className="bg-[#050814] border border-white/10 rounded-lg w-20 py-1.5 text-center text-sm focus:border-[#FF8A00] outline-none font-bold text-white transition-colors"
            dir="ltr"
            min="50"
          />
        </div>
      </div>
    </div>
  )
}
