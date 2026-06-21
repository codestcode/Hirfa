'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, CreditCard, Plus, Check, Building2, Smartphone, Trash2 } from 'lucide-react'

const savedMethods = [
  { id: '1', type: 'card', label: 'بطاقة ائتمان', detail: '**** 4582', expiry: '12/26' },
  { id: '2', type: 'wallet', label: 'محفظة إلكترونية', detail: '010 **** 482', provider: 'فودافون كاش' },
]

export default function PaymentPage() {
  const router = useRouter()
  const [selected, setSelected] = useState('1')

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full z-[2] border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <button onClick={() => router.back()} className="flex items-center justify-center rounded-full p-2">
            <ChevronRight size={20} className="text-white" />
          </button>
          <span className="text-white text-base font-bold leading-6">طرق الدفع</span>
          <div className="w-10" />
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-8 gap-6 pb-24"
      >
        <div className="flex flex-col gap-3">
          <span className="text-[#52627A] text-sm font-semibold">طرق الدفع المحفوظة</span>
          <div className="flex flex-col gap-2">
            {savedMethods.map((method) => (
              <div
                key={method.id}
                onClick={() => setSelected(method.id)}
                className={`flex items-center justify-between p-4 rounded-2xl border cursor-pointer transition-colors ${
                  selected === method.id ? 'border-primary/30 bg-primary/5' : 'border-white/10 bg-white/[0.03]'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-white/5 border border-white/10">
                    {method.type === 'card' ? <CreditCard size={18} className="text-primary" /> : <Smartphone size={18} className="text-primary" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm text-white">{method.label}</span>
                    <span className="text-xs text-[#52627A]">
                      {method.detail}{method.expiry ? ` - ${method.expiry}` : ''}{method.provider ? ` - ${method.provider}` : ''}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="bg-transparent border-none cursor-pointer p-1">
                    <Trash2 size={16} className="text-[#EF4444]" />
                  </button>
                  <div className={`flex items-center justify-center w-5 h-5 rounded-full border-2 ${selected === method.id ? 'border-primary bg-primary' : 'border-white/20'}`}>
                    {selected === method.id && <Check size={12} className="text-white" />}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button className="flex items-center justify-center gap-2 w-full h-12 rounded-xl border border-dashed border-white/10 bg-white/[0.02] text-sm text-white/60 cursor-pointer hover:border-primary/30 hover:text-primary transition-colors">
          <Plus size={18} />
          إضافة طريقة دفع جديدة
        </button>

        <div className="flex flex-col gap-3">
          <span className="text-[#52627A] text-sm font-semibold">طرق الدفع المتاحة</span>
          <div className="flex flex-wrap gap-2">
            {['بطاقة بنكية', 'فودافون كاش', 'إنستاباي', 'محفظة إلكترونية'].map((method) => (
              <div key={method} className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-white/10 bg-white/[0.03]">
                <Building2 size={14} className="text-primary" />
                <span className="text-xs text-white/70">{method}</span>
              </div>
            ))}
          </div>
        </div>
      </motion.main>
    </div>
  )
}
