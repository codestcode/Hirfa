import React from 'react'
import { ArrowDownRight } from 'lucide-react'

interface TransactionCardProps {
  serviceName: string
  date: string
  price: string | number
}

export function TransactionCard({ serviceName, date, price }: TransactionCardProps) {
  return (
    <div className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#4ADE80]/10 flex items-center justify-center text-[#4ADE80]">
          <ArrowDownRight size={16} />
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold mb-1">إضافة رصيد - {serviceName}</span>
          <span className="text-[10px] text-[#6B7A99]">{date}</span>
        </div>
      </div>
      <div className="text-sm font-bold text-[#4ADE80]">
        +{price} ج.م
      </div>
    </div>
  )
}
