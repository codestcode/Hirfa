import React from 'react'
import { ArrowDownRight, ArrowUpLeft } from 'lucide-react'

interface TransactionCardProps {
  serviceName?: string
  description?: string
  date: string
  price?: string | number
  amount?: number
}

export function TransactionCard({ serviceName, description, date, price, amount }: TransactionCardProps) {
  const finalAmount = amount !== undefined ? amount : (typeof price === 'string' ? parseFloat(price) : (price || 0))
  const isPositive = finalAmount >= 0
  const absAmount = Math.abs(finalAmount)
  const displayTitle = description || serviceName || 'معاملة مالية'

  return (
    <div className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
          isPositive ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-[#EF4444]/10 text-[#EF4444]'
        }`}>
          {isPositive ? <ArrowDownRight size={16} /> : <ArrowUpLeft size={16} />}
        </div>
        <div className="flex flex-col text-right">
          <span className="text-xs font-bold mb-1">{displayTitle}</span>
          <span className="text-[10px] text-[#6B7A99]">{date}</span>
        </div>
      </div>
      <div className={`text-sm font-bold ${isPositive ? 'text-[#4ADE80]' : 'text-[#EF4444]'}`}>
        {isPositive ? '+' : '-'}{absAmount.toLocaleString('ar-EG')} ج.م
      </div>
    </div>
  )
}
