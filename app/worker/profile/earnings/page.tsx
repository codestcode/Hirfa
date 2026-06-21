'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, Wallet, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight, Clock, CheckCircle, XCircle } from 'lucide-react'

const recentTransactions = [
  { label: 'تركيب غرفة نوم', amount: '+450', status: 'completed', time: 'منذ ساعتين' },
  { label: 'تصليح سباكة', amount: '+200', status: 'completed', time: 'منذ 5 ساعات' },
  { label: 'كهرباء منازل', amount: '+350', status: 'pending', time: 'منذ يوم' },
  { label: 'دهان غرفة', amount: '+180', status: 'completed', time: 'منذ يومين' },
  { label: 'تركيب نجف', amount: '+120', status: 'cancelled', time: 'منذ 3 أيام' },
]

export default function EarningsPage() {
  const router = useRouter()

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
          <span className="text-white text-base font-bold leading-6">الأرباح والمحفظة</span>
          <div className="w-10" />
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-8 gap-6 pb-24"
      >
        <div className="flex flex-col gap-4 p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-primary" />
            <span className="text-sm text-white/70">رصيد المحفظة</span>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">8,400</span>
            <span className="text-lg text-white/60">ج.م</span>
          </div>
          <div className="flex items-center gap-1 text-sm text-[#22C55E]">
            <TrendingUp size={16} />
            <span>+12% هذا الشهر</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex flex-col gap-1 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <span className="text-xs text-[#52627A]">هذا الأسبوع</span>
            <div className="flex items-center gap-1">
              <DollarSign size={16} className="text-primary" />
              <span className="text-lg font-bold text-white">2,350</span>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-[#22C55E]">
              <ArrowUpRight size={12} />
              +8%
            </div>
          </div>
          <div className="flex flex-col gap-1 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
            <span className="text-xs text-[#52627A]">الشهر الماضي</span>
            <div className="flex items-center gap-1">
              <DollarSign size={16} className="text-white/50" />
              <span className="text-lg font-bold text-white">7,500</span>
            </div>
            <div className="flex items-center gap-0.5 text-xs text-[#EF4444]">
              <ArrowDownRight size={12} />
              -3%
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          <span className="text-[#52627A] text-sm font-semibold">آخر المعاملات</span>
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {recentTransactions.map((tx, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-4 ${i < recentTransactions.length - 1 ? 'border-b border-white/5' : ''}`}
              >
                <div className="flex items-center gap-3">
                  {tx.status === 'completed' && <CheckCircle size={16} className="text-[#22C55E]" />}
                  {tx.status === 'pending' && <Clock size={16} className="text-[#FFB800]" />}
                  {tx.status === 'cancelled' && <XCircle size={16} className="text-[#EF4444]" />}
                  <div className="flex flex-col">
                    <span className="text-sm text-white">{tx.label}</span>
                    <span className="text-xs text-[#52627A]">{tx.time}</span>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.status === 'cancelled' ? 'text-[#EF4444] line-through' : 'text-[#22C55E]'}`}>
                  {tx.amount} ج.م
                </span>
              </div>
            ))}
          </div>
        </div>
      </motion.main>
    </div>
  )
}
