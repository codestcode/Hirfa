'use client'

import React from 'react'
import { Wallet, Banknote, ArrowDownRight, ClipboardCheck } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { TransactionCard } from '@/components/ui/wallet/TransactionCard'
import { WalletBalanceCard } from '@/components/ui/wallet/WalletBalanceCard'
import { useWallet } from '@/hooks/useWallet'
import { PageLoader } from '@/components/ui/PageLoader'

export default function WalletPage() {
  const { profile, transactions, loading, availableBalance } = useWallet()

  return (
    <SubPageLayout>
      <div className="px-4 py-6 mb-2">
        <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center text-[#FFB800]"><Wallet size={20} /></div><h1 className="text-xl font-bold">المالية والمحفظة</h1></div>
        <WalletBalanceCard balance={availableBalance} />

        <div className="grid grid-cols-2 gap-3 mb-8">
          <div className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex flex-col gap-2"><div className="w-8 h-8 rounded-full bg-[#4ADE80]/10 flex items-center justify-center text-[#4ADE80]"><ArrowDownRight size={16} /></div><span className="text-[10px] text-[#6B7A99]">إجمالي الأرباح</span><span className="text-sm font-bold">{profile?.total_earnings?.toLocaleString() || 0} ج.م</span></div>
          <div className="bg-[#0A0D1A] rounded-2xl p-4 border border-white/5 flex flex-col gap-2"><div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-white"><ClipboardCheck size={16} /></div><span className="text-[10px] text-[#6B7A99]">المهام المكتملة</span><span className="text-sm font-bold">{profile?.completed_orders || 0} مهمة</span></div>
        </div>

        <div>
          <h3 className="font-bold text-sm mb-4 flex items-center justify-between"><span>سجل المعاملات</span><span className="text-[10px] text-[#FF8A00] bg-[#FF8A00]/10 px-2 py-1 rounded-full">آخر 30 يوم</span></h3>
          <div className="flex flex-col gap-3">
            {loading ? <PageLoader /> : transactions.length ? transactions.map(tx => <TransactionCard key={tx.id} serviceName={tx.service_name} date={new Date(tx.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })} price={tx.price} />) : <div className="bg-[#0A0D1A] rounded-2xl p-10 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]"><Banknote size={32} className="mb-3 opacity-50" /><span className="text-xs">لا توجد معاملات سابقة</span></div>}
          </div>
        </div>
      </div>
    </SubPageLayout>
  )
}
