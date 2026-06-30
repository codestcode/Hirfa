'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React from 'react'
import { CreditCard, Plus } from 'lucide-react'
import { PaymentMethodCard } from '@/components/ui/profile/PaymentMethodCard'
import { AddPaymentModal } from '@/components/ui/profile/AddPaymentModal'
import { PageLoader } from '@/components/ui/PageLoader'
import { InfoBanner } from '@/components/ui/InfoBanner'
import { usePaymentMethods } from '@/hooks/usePaymentMethods'

export default function PaymentMethodsPage() {
  const { methods, loading, showAddModal, setShowAddModal, setAsDefault, removeMethod, refresh } = usePaymentMethods()

  return (
    <SubPageLayout>
      <PageHeader title="طرق الدفع" isTransparent />
      <div className="px-6 py-4">
        <InfoBanner 
          icon={CreditCard} 
          title="استقبال الأرباح" 
          description="سيتم تحويل أرباحك أسبوعياً إلى طريقة الدفع الافتراضية الخاصة بك. تأكد من صحة بياناتك."
        />

        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-bold">الحسابات المضافة</h2>
        </div>

        {loading ? <PageLoader /> : (
          <div className="flex flex-col gap-4 mb-8">
            {methods.length > 0 ? methods.map(method => (
              <PaymentMethodCard key={method.id} method={method} onRemove={removeMethod} onSetDefault={setAsDefault} />
            )) : (
              <div className="text-center py-10 bg-[#0A0D1A] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center">
                <CreditCard size={32} className="text-[#6B7A99] mb-3 opacity-50" />
                <span className="text-sm font-bold text-white mb-1">لا توجد طرق دفع</span>
              </div>
            )}
          </div>
        )}

        <button onClick={() => setShowAddModal(true)} className="w-full bg-[#1E2538] border border-white/5 text-white font-bold rounded-2xl py-4 flex items-center justify-center gap-2 hover:bg-[#2A3441] transition-colors">
          <Plus size={20} className="text-[#FF8A00]" /> إضافة طريقة دفع جديدة
        </button>
      </div>
      <AddPaymentModal 
        isOpen={showAddModal} 
        onClose={() => setShowAddModal(false)} 
        onSuccess={() => {
          setShowAddModal(false)
          refresh()
        }}
      />
    </SubPageLayout>
  )
}
