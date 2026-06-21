'use client'

import { motion } from 'framer-motion'
import { Wallet, TrendingUp, ArrowUpRight, ArrowDownRight, DollarSign, Plus, Clock, CheckCircle, XCircle, Copy } from 'lucide-react'

const transactions = [
  { label: 'تركيب غرفة نوم', amount: '+450', status: 'completed', time: 'منذ ساعتين' },
  { label: 'تصليح سباكة', amount: '+200', status: 'completed', time: 'منذ 5 ساعات' },
  { label: 'سحب أرباح', amount: '-1,000', status: 'completed', time: 'منذ يوم' },
  { label: 'كهرباء منازل', amount: '+350', status: 'pending', time: 'منذ يوم' },
  { label: 'عمولة منصة', amount: '-67.5', status: 'completed', time: 'منذ يوم' },
  { label: 'دهان غرفة', amount: '+180', status: 'completed', time: 'منذ يومين' },
  { label: 'سحب أرباح', amount: '-500', status: 'cancelled', time: 'منذ 3 أيام' },
]

export default function WalletPage() {
  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <div className="flex items-center gap-2">
            <Wallet size={20} className="text-primary" />
            <span className="text-white text-base font-bold">المحفظة المالية</span>
          </div>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-white text-xs font-bold border-none cursor-pointer">
            <Plus size={14} />
            إيداع
          </button>
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[512px] mx-auto px-4 pt-6 gap-6 pb-24"
      >
        <div className="flex flex-col gap-6 p-6 rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 border border-primary/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wallet size={20} className="text-primary" />
              <span className="text-sm text-white/70">الرصيد الحالي</span>
            </div>
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[rgba(34,197,94,0.10)] border border-[rgba(34,197,94,0.20)]">
              <TrendingUp size={12} className="text-[#22C55E]" />
              <span className="text-[10px] font-bold text-[#22C55E]">+12%</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-white">8,400</span>
            <span className="text-lg text-white/60">ج.م</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex-1 h-11 rounded-xl bg-primary text-white text-sm font-bold border-none cursor-pointer">
              سحب الأرباح
            </button>
            <button className="flex-1 h-11 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold cursor-pointer">
              تحويل
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'أرباح هذا الأسبوع', value: '2,350', change: '+8%', up: true },
            { label: 'الشهر الماضي', value: '7,500', change: '-3%', up: false },
          ].map(({ label, value, change, up }) => (
            <div key={label} className="flex flex-col gap-1 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
              <span className="text-xs text-[#52627A]">{label}</span>
              <div className="flex items-center gap-1">
                <DollarSign size={16} className="text-primary" />
                <span className="text-lg font-bold text-white">{value}</span>
              </div>
              <div className={`flex items-center gap-0.5 text-xs ${up ? 'text-[#22C55E]' : 'text-[#EF4444]'}`}>
                {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {change}
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2">
            <span className="text-sm text-white">رقم الحساب البنكي</span>
            <button className="flex items-center gap-1 px-2 py-1 rounded-lg bg-primary/10 text-primary text-xs">
              <Copy size={12} />
              نسخ
            </button>
          </div>
          <span className="text-sm font-bold text-white" dir="ltr">**** 4582</span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[#52627A] text-sm font-semibold">سجل المعاملات</span>
            <span className="text-xs text-primary">عرض الكل</span>
          </div>
          <div className="flex flex-col rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden">
            {transactions.map((tx, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-4 ${i < transactions.length - 1 ? 'border-b border-white/5' : ''}`}
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
                <span className={`text-sm font-bold ${tx.amount.startsWith('+') ? 'text-[#22C55E]' : 'text-[#EF4444]'} ${tx.status === 'cancelled' ? 'line-through' : ''}`}>
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
