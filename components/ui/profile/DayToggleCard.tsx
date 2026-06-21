import React from 'react'
import { Clock } from 'lucide-react'

interface DayToggleCardProps {
  day: { id: string, name: string }
  isActive: boolean
  start: string
  end: string
  onToggle: (id: string) => void
  onTimeChange: (id: string, field: 'start' | 'end', value: string) => void
}

export function DayToggleCard({ day, isActive, start, end, onToggle, onTimeChange }: DayToggleCardProps) {
  return (
    <div 
      className={`rounded-2xl p-4 border transition-all ${isActive ? 'bg-[#0A0D1A] border-[#FF8A00]/30 shadow-[0_4px_15px_rgba(255,138,0,0.03)]' : 'bg-[#050814] border-white/5 opacity-60'}`}
    >
      <div className="flex items-center justify-between mb-4">
        <span className={`font-bold text-sm ${isActive ? 'text-white' : 'text-[#6B7A99]'}`}>
          {day.name}
        </span>
        <button 
          onClick={() => onToggle(day.id)}
          className={`w-10 h-6 rounded-full p-1 transition-colors flex items-center ${isActive ? 'bg-[#FF8A00] justify-start' : 'bg-[#1E2538] justify-end'}`}
        >
          <div className="w-4 h-4 bg-[#050814] rounded-full shadow-sm" />
        </button>
      </div>

      <div className={`flex items-center gap-3 transition-all overflow-hidden ${isActive ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[10px] text-[#6B7A99] font-bold px-1">من الساعة</label>
          <div className="relative">
            <Clock size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#FF8A00]" />
            <input 
              type="time" 
              value={start}
              onChange={(e) => onTimeChange(day.id, 'start', e.target.value)}
              className="w-full bg-[#1E2538]/50 border border-white/5 rounded-xl py-2.5 pr-9 pl-3 text-sm focus:border-[#FF8A00] outline-none text-left"
              dir="ltr"
            />
          </div>
        </div>
        
        <div className="flex-1 flex flex-col gap-1">
          <label className="text-[10px] text-[#6B7A99] font-bold px-1">إلى الساعة</label>
          <div className="relative">
            <Clock size={14} className="absolute top-1/2 -translate-y-1/2 right-3 text-[#FF8A00]" />
            <input 
              type="time" 
              value={end}
              onChange={(e) => onTimeChange(day.id, 'end', e.target.value)}
              className="w-full bg-[#1E2538]/50 border border-white/5 rounded-xl py-2.5 pr-9 pl-3 text-sm focus:border-[#FF8A00] outline-none text-left"
              dir="ltr"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
