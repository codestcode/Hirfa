import React from 'react'
import { CalendarDays, Clock, MapPin, CheckCircle2 } from 'lucide-react'

interface AppointmentCardProps {
  id: string
  clientName: string
  service: string
  date: string
  time: string
  address: string
  status: 'upcoming' | 'completed'
}

export function AppointmentCard({ clientName, service, date, time, address, status }: AppointmentCardProps) {
  return (
    <div className="bg-[#0A0D1A] border border-white/5 rounded-2xl p-4 flex flex-col gap-3 relative overflow-hidden group hover:border-white/10 transition-colors">
      <div className={`absolute top-0 right-0 w-1 h-full ${status === 'upcoming' ? 'bg-[#FF8A00]' : 'bg-[#4ADE80]'}`} />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1E2538] flex items-center justify-center text-white font-bold">
            {clientName.charAt(0)}
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">{clientName}</span>
            <span className="text-[10px] text-[#6B7A99]">{service}</span>
          </div>
        </div>
        
        {status === 'upcoming' ? (
          <span className="text-[10px] font-bold bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-1 rounded-full">قريباً</span>
        ) : (
          <span className="text-[10px] font-bold bg-[#4ADE80]/10 text-[#4ADE80] px-2 py-1 rounded-full flex items-center gap-1">
            <CheckCircle2 size={10} /> مكتمل
          </span>
        )}
      </div>

      <div className="bg-[#1E2538]/30 rounded-xl p-3 flex flex-col gap-2 mt-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs">
            <CalendarDays size={14} className="text-[#FF8A00]" />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <Clock size={14} className="text-[#FF8A00]" />
            <span>{time}</span>
          </div>
        </div>
        
        <div className="w-full h-px bg-white/5 my-1" />
        
        <div className="flex items-center gap-2 text-xs text-[#6B7A99]">
          <MapPin size={14} />
          <span>{address}</span>
        </div>
      </div>
    </div>
  )
}
