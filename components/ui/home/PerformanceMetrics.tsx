import React from 'react'
import { Star } from 'lucide-react'

interface PerformanceMetricsProps {
  completedOrders: number | string
  rating: number | string
  responseRate: number | string
  earnings: number | string
}

export function PerformanceMetrics({ completedOrders, rating, responseRate, earnings }: PerformanceMetricsProps) {
  return (
    <div className="bg-[#0A0D1A] rounded-2xl p-5 border border-white/5 grid grid-cols-2 gap-y-6 gap-x-4 shadow-sm">
      <div className="flex flex-col items-start text-right gap-1">
        <span className="text-[10px] text-[#6B7A99]">الطلبات المكتملة</span>
        <span className="text-lg font-bold">{completedOrders}</span>
      </div>
      <div className="flex flex-col items-start text-right gap-1">
        <span className="text-[10px] text-[#6B7A99]">متوسط التقييم</span>
        <span className="text-lg font-bold flex items-center gap-1">
          {rating} <Star size={14} className="text-[#FFB800] fill-[#FFB800]" />
        </span>
      </div>
      <div className="flex flex-col items-start text-right gap-1">
        <span className="text-[10px] text-[#6B7A99]">سرعة الرد</span>
        <span className="text-lg font-bold">{responseRate}%</span>
      </div>
      <div className="flex flex-col items-start text-right gap-1">
        <span className="text-[10px] text-[#6B7A99]">صافي الأرباح</span>
        <span className="text-lg font-bold">{earnings} <span className="text-[10px] font-normal text-[#6B7A99]">ج.م</span></span>
      </div>
    </div>
  )
}
