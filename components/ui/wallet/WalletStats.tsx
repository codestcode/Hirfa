import { ArrowDownRight, ClipboardCheck } from 'lucide-react'

export const WalletStats = ({ totalEarnings: t, completedOrders: c }: any) => (
  <div className="grid grid-cols-2 gap-3 mb-8">
    <div className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex flex-col gap-2"><div className="w-8 h-8 rounded-full bg-[#4ADE80]/10 flex items-center justify-center text-[#4ADE80]"><ArrowDownRight size={16} /></div><span className="text-[10px] text-[#6B7A99]">إجمالي الأرباح</span><span className="text-sm font-bold">{t.toLocaleString()} ج.م</span></div>
    <div className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex flex-col gap-2"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white"><ClipboardCheck size={16} /></div><span className="text-[10px] text-[#6B7A99]">المهام المكتملة</span><span className="text-sm font-bold">{c} مهمة</span></div>
  </div>
)
