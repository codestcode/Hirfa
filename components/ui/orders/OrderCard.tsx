import React from 'react'
import Image from 'next/image'
import { ClipboardCheck, Clock, MapPin, Banknote, Navigation } from 'lucide-react'

type TabType = 'pending' | 'confirmed' | 'completed'

interface OrderCardProps {
  order: any
  activeTab: TabType
  onUpdateStatus: (id: string, status: string) => void
}

export function OrderCard({ order, activeTab, onUpdateStatus }: OrderCardProps) {
  return (
    <div className="bg-gradient-to-b from-[#1A1410] to-[#0A0D1A] rounded-2xl p-4 border border-[#FF8A00]/20 shadow-[0_0_20px_rgba(255,138,0,0.05)]">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          {order.is_emergency ? (
            <div className="bg-[#ED4C5C]/15 text-[#ED4C5C] text-[10px] px-2 py-1 rounded-full font-bold">طوارئ</div>
          ) : null}
          <div className={`text-[10px] px-2 py-1 rounded-full ${
            activeTab === 'pending' ? 'bg-[#FF8A00]/10 text-[#FF8A00]' :
            activeTab === 'confirmed' ? 'bg-[#4ADE80]/10 text-[#4ADE80]' :
            'bg-white/10 text-white/60'
          }`}>
            {activeTab === 'pending' ? 'جديد' : activeTab === 'confirmed' ? 'مؤكد' : 'مكتمل'}
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start text-right">
            <span className="text-sm font-bold">{order.client?.full_name || 'عميل'}</span>
            <span className="text-[10px] text-[#6B7A99] flex items-center gap-1">
              {order.service_name} <ClipboardCheck size={10} />
            </span>
          </div>
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-[#1E2538]">
            <Image src={order.client?.avatar_url || "/client_avatar.png"} alt="Client" fill className="object-cover" />
          </div>
        </div>
      </div>
      
      <div className="flex items-center justify-between bg-[#050814]/50 rounded-xl p-3 mb-4 text-xs">
        <div className="flex items-center gap-1.5 text-[#FFB800] font-bold">
          <span>{order.price} ج.م</span>
          <Banknote size={14} />
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-1.5 text-white">
            <span>{order.appointment_date} - {order.appointment_time?.slice(0,5)}</span>
            <Clock size={12} className="text-[#FF8A00]" />
          </div>
          <div className="flex items-center gap-1.5 text-[#94A3B8] text-[10px]">
            <span>{order.address}</span>
            <MapPin size={10} className="text-[#FF8A00]" />
          </div>
        </div>
      </div>

      {activeTab === 'pending' && (
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <button onClick={() => onUpdateStatus(order.id, 'cancelled')} className="bg-[#1E2538] text-white text-xs font-bold py-3 rounded-xl hover:opacity-90 transition-opacity">
            رفض
          </button>
          <button onClick={() => onUpdateStatus(order.id, 'confirmed')} className="bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white text-xs font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.3)] hover:opacity-90 transition-opacity">
            قبول الطلب
          </button>
        </div>
      )}

      {activeTab === 'confirmed' && (
        <div className="grid grid-cols-[1fr_2fr] gap-3">
          <button className="bg-[#1E2538] text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
            الخريطة <Navigation size={14} className="rotate-45" />
          </button>
          <button onClick={() => onUpdateStatus(order.id, 'completed')} className="bg-[#4ADE80] text-[#050814] text-xs font-bold py-3 rounded-xl shadow-[0_4px_12px_rgba(74,222,128,0.3)] hover:opacity-90 transition-opacity">
            إكمال الطلب
          </button>
        </div>
      )}
    </div>
  )
}
