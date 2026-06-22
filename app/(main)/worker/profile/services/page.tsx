'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React from 'react'
import { Droplet, Zap, Wrench, Home, Scissors, LayoutGrid } from 'lucide-react'
import { ServiceDropdown } from '@/components/ui/profile/ServiceDropdown'
import { SelectedServiceCard } from '@/components/ui/profile/SelectedServiceCard'
import { PageLoader } from '@/components/ui/PageLoader'
import { SaveButton } from '@/components/ui/forms/SaveButton'
import { useServices } from '@/hooks/useServices'

const AVAILABLE_SERVICES = [
  { id: 's1', name: 'صيانة سباكة', icon: Droplet }, { id: 's2', name: 'كهرباء', icon: Zap },
  { id: 's3', name: 'تكييف', icon: Wrench }, { id: 's5', name: 'نجارة', icon: Home },
  { id: 's6', name: 'دهانات', icon: Scissors }
]

export default function ServicesPage() {
  const { myServices, handleRemove, handleAdd, handlePrice, loading, fetching, handleSave } = useServices()

  return (
    <SubPageLayout>
      <PageHeader title="تخصصات الخدمات" isTransparent />
      <div className="px-6 py-4">
        {fetching ? <PageLoader /> : (
          <>
            <ServiceDropdown availableServices={AVAILABLE_SERVICES} myServices={myServices} onAddService={handleAdd} />
            <div className="flex items-center justify-between mb-4"><h2 className="text-sm font-bold">تخصصاتك الحالية</h2><span className="text-[10px] font-bold bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-1 rounded-md">{myServices.length} خدمات</span></div>
            <div className="flex flex-col gap-3 mb-8">
              {myServices.length ? myServices.map(s => <SelectedServiceCard key={s.id} service={s} onRemove={handleRemove} onPriceChange={handlePrice} />) : (
                <div className="text-center py-12 bg-[#0A0D1A] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center">
                  <LayoutGrid size={32} className="text-[#6B7A99] mb-3 opacity-50" /><span className="text-sm font-bold text-white mb-1">لا يوجد تخصصات</span>
                </div>
              )}
            </div>
            <SaveButton loading={loading} onClick={handleSave} />
          </>
        )}
      </div>
    </SubPageLayout>
  )
}
