import React from 'react'
import { Trash2, CheckCircle2 } from 'lucide-react'

interface PaymentMethodCardProps {
  method: any
  onRemove: (id: string) => void
  onSetDefault: (id: string) => void
}

export function PaymentMethodCard({ method, onRemove, onSetDefault }: PaymentMethodCardProps) {
  return (
    <div 
      className={`bg-[#0A0D1A] rounded-2xl p-4 border transition-colors relative overflow-hidden group ${method.isDefault ? 'border-[#FF8A00]/30 shadow-[0_4px_15px_rgba(255,138,0,0.03)]' : 'border-white/5 hover:border-white/10'}`}
    >
      {method.isDefault && (
        <div className="absolute top-0 right-0 w-1 h-full bg-[#FF8A00]" />
      )}
      
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center bg-white/5" style={{ color: method.color }}>
            <method.icon size={24} />
          </div>
          <div className="flex flex-col">
            <span className="font-bold text-sm">{method.name}</span>
            <span className="text-xs text-[#6B7A99]" dir="ltr">{method.number}</span>
          </div>
        </div>
        <button 
          onClick={() => onRemove(method.id)}
          className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all shrink-0"
        >
          <Trash2 size={14} />
        </button>
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/5">
        {method.isDefault ? (
          <div className="flex items-center gap-1.5 text-[#FF8A00] text-xs font-bold bg-[#FF8A00]/10 px-3 py-1.5 rounded-full">
            <CheckCircle2 size={14} />
            <span>الحساب الافتراضي</span>
          </div>
        ) : (
          <button 
            onClick={() => onSetDefault(method.id)}
            className="text-xs font-bold text-[#6B7A99] hover:text-white transition-colors"
          >
            تعيين كافتراضي
          </button>
        )}
      </div>
    </div>
  )
}
