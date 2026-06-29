import React from 'react'
import { Banknote, ArrowUpRight } from 'lucide-react'

interface WalletBalanceCardProps {
  balance: number
  onWithdraw?: () => void
}

export function WalletBalanceCard({ balance, onWithdraw }: WalletBalanceCardProps) {
  return (
    <div className="bg-gradient-to-br from-[#1E2538] to-[#0A0D1A] rounded-3xl p-6 border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)] mb-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#FFB800]/5 rounded-full blur-2xl" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#4ADE80]/5 rounded-full blur-2xl" />
      
      <div className="relative z-10">
        <p className="text-xs text-[#94A3B8] mb-2 flex items-center justify-between">
          <span>الرصيد المتاح للسحب</span>
          <Banknote size={16} className="text-[#4ADE80]" />
        </p>
        <div className="flex items-end gap-2 mb-6">
          <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">
            {balance.toLocaleString()}
          </h2>
          <span className="text-sm font-medium text-[#6B7A99] mb-1">ج.م</span>
        </div>
        
        <div className="flex gap-3">
          <button 
            onClick={onWithdraw}
            className="flex-1 bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-[#050814] text-sm font-bold py-3.5 rounded-xl shadow-[0_4px_12px_rgba(255,138,0,0.3)] hover:opacity-90 flex justify-center items-center gap-2 transition-opacity"
          >
            سحب الرصيد <ArrowUpRight size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
