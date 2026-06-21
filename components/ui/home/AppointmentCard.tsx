import React from 'react'
import { Clock, Navigation } from 'lucide-react'

interface AppointmentCardProps {
  time: string
  clientName: string
  serviceName: string
  address: string
}

export function AppointmentCard({ time, clientName, serviceName, address }: AppointmentCardProps) {
  return (
    <div className="bg-[#0A0D1A] rounded-2xl p-5 border border-white/5 mb-3">
      <div className="flex justify-between items-center mb-6">
        <div className="bg-[#4ADE80]/10 text-[#4ADE80] text-[10px] font-bold py-1 px-3 rounded-full">
          مؤكد
        </div>
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-start text-right">
            <span className="text-sm font-bold">{time}</span>
            <span className="text-[10px] text-[#6B7A99]">الموعد القادم</span>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]">
            <Clock size={18} />
          </div>
        </div>
      </div>

      <div className="relative pr-4 border-r-2 border-white/5 flex flex-col gap-5 mb-6">
        <div className="relative">
          <div className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-[#FF8A00] shadow-[0_0_0_4px_rgba(255,138,0,0.1)]" />
          <div className="flex flex-col items-start text-right">
            <span className="text-[10px] text-[#6B7A99] mb-1">العميل والمهمة</span>
            <span className="text-xs font-bold">{clientName} - {serviceName}</span>
          </div>
        </div>
        <div className="relative">
          <div className="absolute -right-[21px] top-1.5 w-2 h-2 rounded-full bg-[#4B5A7A] ring-4 ring-[#0A0D1A]" />
          <div className="flex flex-col items-start text-right">
            <span className="text-[10px] text-[#6B7A99] mb-1">العنوان</span>
            <span className="text-xs font-bold">{address}</span>
          </div>
        </div>
      </div>

      <button className="w-full bg-[#1E2538] text-white text-xs font-bold py-3.5 rounded-xl flex items-center justify-center gap-2 hover:bg-[#2A344A] transition-colors">
        فتح الخريطة
        <Navigation size={14} className="rotate-45" />
      </button>
    </div>
  )
}
