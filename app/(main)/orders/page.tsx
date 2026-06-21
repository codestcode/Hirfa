'use client'

import React from 'react'
import { ClipboardList } from 'lucide-react'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { OrderCard } from '@/components/ui/orders/OrderCard'
import { useOrders, TabType } from '@/hooks/useOrders'
import { PageLoader } from '@/components/ui/PageLoader'

export default function OrdersPage() {
  const { activeTab, setActiveTab, orders, loading, updateStatus } = useOrders()
  const tabs = [{ id: 'pending', label: 'جديدة' }, { id: 'confirmed', label: 'قيد التنفيذ' }, { id: 'completed', label: 'مكتملة' }]

  return (
    <SubPageLayout>
      <div className="px-4 py-6 mb-2">
        <div className="flex items-center gap-3 mb-8"><div className="w-10 h-10 rounded-full bg-[#FF8A00]/10 flex items-center justify-center text-[#FF8A00]"><ClipboardList size={20} /></div><h1 className="text-xl font-bold">الطلبات</h1></div>
        
        <div className="flex bg-[#0A0D1A] rounded-xl p-1 mb-6 border border-white/5">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as TabType)} className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${activeTab === tab.id ? 'bg-[#FF8A00] text-white shadow-[0_4px_12px_rgba(255,138,0,0.3)]' : 'text-[#6B7A99] hover:text-white'}`}>{tab.label}</button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {loading ? <PageLoader /> : orders.length ? orders.map(order => <OrderCard key={order.id} order={order} activeTab={activeTab} onUpdateStatus={updateStatus} />) : (
            <div className="bg-[#0A0D1A] rounded-2xl p-10 flex flex-col items-center justify-center border border-white/5 text-[#6B7A99]"><ClipboardList size={32} className="mb-3 opacity-50" /><span className="text-xs">لا توجد طلبات في هذا القسم</span></div>
          )}
        </div>
      </div>
    </SubPageLayout>
  )
}
