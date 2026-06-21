import React from 'react'

interface AvailabilityToggleProps {
  isAvailable: boolean
  onToggle: () => void
}

export function AvailabilityToggle({ isAvailable, onToggle }: AvailabilityToggleProps) {
  return (
    <div className="bg-[#0A0D1A] rounded-2xl p-5 border border-white/5">
      <div className="flex justify-between items-start mb-3">
        <div 
          onClick={onToggle}
          className={`w-12 h-7 rounded-full p-1 cursor-pointer flex transition-colors ${isAvailable ? 'bg-[#FF8A00] justify-start' : 'bg-[#1E2538] justify-end'}`}
        >
          <div className="w-5 h-5 bg-white rounded-full shadow-sm" />
        </div>
        <div className="flex items-center gap-2">
          <h3 className="font-bold text-base">حالة التوفر</h3>
          <div className={`w-2 h-2 rounded-full ${isAvailable ? 'bg-[#4ADE80]' : 'bg-[#94A3B8]'}`} />
        </div>
      </div>
      <p className="text-xs text-[#6B7A99] text-right mb-4 leading-relaxed">
        {isAvailable ? 'يمكن للعملاء إرسال طلبات صيانة جديدة إليك الآن' : 'أنت الآن غير متاح لاستقبال طلبات جديدة'}
      </p>
      <div className={`text-xs font-bold py-1.5 px-3 rounded-full w-fit mr-auto ${isAvailable ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-white/10 text-white/50'}`}>
        {isAvailable ? 'متاح لاستقبال العمل' : 'غير متاح'}
      </div>
    </div>
  )
}
