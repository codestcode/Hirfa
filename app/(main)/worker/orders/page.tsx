'use client'
import { ClipboardList } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { OrderCard } from '@/components/ui/orders/OrderCard'
import { OrdersTabs } from '@/components/ui/orders/OrdersTabs'
import { useOrders } from '@/hooks/useOrders'
import { PageLoader } from '@/components/ui/PageLoader'

const Empty = () => <div className="bg-[#0A0D1A] rounded-2xl p-10 flex flex-col items-center border border-white/5 text-[#6B7A99]"><ClipboardList size={32} className="mb-3 opacity-50" /><span className="text-xs">لا توجد طلبات في هذا القسم</span></div>

export default function OrdersPage() {
  const { activeTab: t, setActiveTab: sT, orders: o, loading: l, updateStatus: uS } = useOrders()

  return (
    <SubPageLayout>
      <div className="px-4 py-6 mb-2">
        <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]"><ClipboardList size={20} /></div><h1 className="text-xl font-bold">الطلبات</h1></div>
        <OrdersTabs activeTab={t} onTabChange={sT} />
        <div className="flex flex-col gap-4">
          {l ? <PageLoader /> : o.length ? o.map((x: any) => <OrderCard key={x.id} order={x} activeTab={t} onUpdateStatus={uS} />) : <Empty />}
        </div>
      </div>
    </SubPageLayout>
  )
}
