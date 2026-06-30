'use client'
import { Wallet, Banknote } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { TransactionCard } from '@/components/ui/wallet/TransactionCard'
import { WalletBalanceCard } from '@/components/ui/wallet/WalletBalanceCard'
import { WalletStats } from '@/components/ui/wallet/WalletStats'
import { useWallet } from '@/hooks/useWallet'
import { PageLoader } from '@/components/ui/PageLoader'

const Empty = () => <div className="bg-[#0A0D1A] rounded-2xl p-10 flex flex-col items-center border border-white/5 text-[#6B7A99]"><Banknote size={32} className="mb-3 opacity-50" /><span className="text-xs">لا توجد معاملات سابقة</span></div>

export default function WalletPage() {
  const { profile: p, transactions: t, loading: l, availableBalance: b } = useWallet()
  const router = useRouter()

  return (
    <SubPageLayout>
      <div className="px-4 py-6 mb-2">
        <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-full bg-[#FFB800]/10 flex items-center justify-center text-[#FFB800]"><Wallet size={20} /></div><h1 className="text-xl font-bold">المالية والمحفظة</h1></div>
        <WalletBalanceCard balance={b} onWithdraw={() => router.push('/worker/wallet/withdraw')} />
        <WalletStats totalEarnings={p?.total_earnings || 0} completedOrders={p?.completed_orders || 0} />
        <div>
          <h3 className="font-bold text-sm mb-4 flex justify-between"><span>سجل المعاملات</span><span className="text-[10px] text-[#FF8A00] bg-[#FF8A00]/10 px-2 py-1 rounded-full">آخر 30 يوم</span></h3>
          <div className="flex flex-col gap-3">
            {l ? <PageLoader /> : t.length ? t.map((x: any) => <TransactionCard key={x.id} description={x.description} date={new Date(x.created_at).toLocaleDateString('ar-EG', { year: 'numeric', month: 'short', day: 'numeric' })} amount={x.amount} />) : <Empty />}
          </div>
        </div>
      </div>
    </SubPageLayout>
  )
}
