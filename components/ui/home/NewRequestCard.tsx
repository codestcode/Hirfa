import React from 'react'
import Image from 'next/image'
import { ClipboardCheck, Banknote, MapPin } from 'lucide-react'

interface NewRequestCardProps {
  id: string
  clientName: string
  clientAvatarUrl?: string
  serviceName: string
  price: number | string
  distanceKm?: number
  onAction: (id: string, status: string) => void
}

export function NewRequestCard({ 
  id, clientName, clientAvatarUrl, serviceName, price, distanceKm, onAction 
}: NewRequestCardProps) {
  return (
    <div className="bg-gradient-to-b from-[#1A1410] to-[#0A0D1A] rounded-2xl p-4 border border-[#FF8A00]/20 shadow-[0_0_20px_rgba(255,138,0,0.05)] mb-3">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#1E2538]">
            <Image src={clientAvatarUrl || "/client_avatar.png"} alt="Client" fill className="object-cover" />
          </div>
          <div className="flex flex-col items-start text-right">
            <span className="text-sm font-bold">{clientName}</span>
            <span className="text-[10px] text-[#6B7A99] flex items-center gap-1">
              <ClipboardCheck size={10} /> {serviceName}
            </span>
          </div>
        </div>
        <div className="bg-white/5 text-white/60 text-[10px] px-2 py-1 rounded-full">
          جديد
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-[#050814]/50 rounded-xl p-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5 text-[#FFB800] font-bold">
          <span>{price} ج.م</span>
          <Banknote size={14} />
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex items-center gap-1.5 text-[#94A3B8]">
          <span>{distanceKm || 0} كم</span>
          <MapPin size={14} className="text-[#FF8A00]" />
        </div>
      </div>

      <div className="grid grid-cols-[1fr_2fr] gap-3">
        <button onClick={() => onAction(id, 'cancelled')} className="bg-[#1E2538] text-white text-xs font-bold py-3.5 rounded-xl hover:opacity-90 transition-opacity">
          رفض
        </button>
        <button onClick={() => onAction(id, 'confirmed')} className="bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white text-xs font-bold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.3)] hover:opacity-90 transition-opacity">
          قبول الطلب
        </button>
      </div>
    </div>
  )
}
