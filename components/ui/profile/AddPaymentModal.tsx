import React from 'react'
import { Smartphone, Landmark } from 'lucide-react'

interface AddPaymentModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AddPaymentModal({ isOpen, onClose }: AddPaymentModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 backdrop-blur-sm transition-opacity">
      <div className="bg-[#0A0D1A] w-full max-w-[512px] rounded-t-3xl border-t border-white/10 p-6 flex flex-col max-h-[85vh] animate-in slide-in-from-bottom-full duration-300">
        <div className="w-12 h-1.5 bg-white/20 rounded-full mx-auto mb-6" />
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold">طريقة دفع جديدة</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            ✕
          </button>
        </div>
        
        <div className="flex flex-col gap-4">
          <button className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#1E2538]/30 hover:bg-[#1E2538] transition-colors text-right group">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#4ADE80] group-hover:scale-110 transition-transform">
              <Smartphone size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm mb-1">محفظة إلكترونية</span>
              <span className="text-[10px] text-[#6B7A99]">فودافون كاش، اتصالات كاش، انستا باي</span>
            </div>
          </button>

          <button className="flex items-center gap-4 p-4 rounded-2xl border border-white/5 bg-[#1E2538]/30 hover:bg-[#1E2538] transition-colors text-right group">
            <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#FFB800] group-hover:scale-110 transition-transform">
              <Landmark size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-sm mb-1">حساب بنكي</span>
              <span className="text-[10px] text-[#6B7A99]">إضافة رقم الحساب البنكي أو الايبان (IBAN)</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
