'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React from 'react'
import { Droplet, Zap, Wrench, Home, Scissors, LayoutGrid, Plus, Trash2 } from 'lucide-react'
import { ServiceDropdown } from '@/components/ui/profile/ServiceDropdown'
import { PageLoader } from '@/components/ui/PageLoader'
import { SaveButton } from '@/components/ui/forms/SaveButton'
import { useServices } from '@/hooks/useServices'

const AVAILABLE_SERVICES = [
  { id: 's1', name: 'صيانة سباكة', icon: Droplet },
  { id: 's2', name: 'كهرباء', icon: Zap },
  { id: 's3', name: 'تكييف وتبريد', icon: Wrench },
  { id: 's5', name: 'نجارة', icon: Home },
  { id: 's6', name: 'دهانات', icon: Scissors }
]

export default function ServicesPage() {
  const {
    myServices,
    handleRemove,
    handleAdd,
    handlePrice,
    handleUpdateField,
    handleAddCustom,
    loading,
    fetching,
    handleSave
  } = useServices()

  return (
    <SubPageLayout>
      <PageHeader title="كتالوج الخدمات" isTransparent />
      <div className="px-6 py-4 pb-24">
        {fetching ? <PageLoader /> : (
          <div className="flex flex-col gap-6">
            <div>
              <label className="text-xs font-bold text-slate-400 mb-2 block text-right">أضف من الخدمات الشائعة</label>
              <ServiceDropdown availableServices={AVAILABLE_SERVICES} myServices={myServices} onAddService={handleAdd} />
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={handleAddCustom}
                className="flex items-center gap-1 text-xs font-bold text-[#FF8A00] bg-[#FF8A00]/10 px-3 py-2 rounded-xl border border-[#FF8A00]/20 hover:bg-[#FF8A00]/20 transition-all"
              >
                <Plus size={14} />
                <span>إضافة خدمة مخصصة</span>
              </button>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold bg-[#FF8A00]/10 text-[#FF8A00] px-2 py-1 rounded-md">
                  {myServices.length} خدمات
                </span>
                <h2 className="text-sm font-bold">خدماتك الحالية</h2>
              </div>
            </div>

            <div className="flex flex-col gap-4">
              {myServices.length ? myServices.map(s => {
                const isCustom = s.id.startsWith('custom_')
                return (
                  <div
                    key={s.id}
                    className="bg-[#0A0D1A] border border-white/5 rounded-2xl p-5 flex flex-col gap-4 relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 w-1 h-full bg-[#FF8A00]/50 group-hover:bg-[#FF8A00] transition-colors" />
                    
                    <div className="flex items-start justify-between">
                      <div className="flex-1 pl-4">
                        {isCustom ? (
                          <input
                            type="text"
                            placeholder="اسم الخدمة المخصصة"
                            value={s.name}
                            onChange={(e) => handleUpdateField(s.id, 'name', e.target.value)}
                            className="bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-sm text-right outline-none w-full focus:border-[#FF8A00] text-white"
                          />
                        ) : (
                          <span className="font-bold text-sm text-white">{s.name}</span>
                        )}
                      </div>
                      <button 
                        onClick={() => handleRemove(s.id)}
                        className="w-8 h-8 flex items-center justify-center rounded-full bg-[#EF4444]/10 text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all shrink-0"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-400 font-bold text-right">سعر الزيارة التقديري (ج.م)</label>
                        <input 
                          type="number"
                          value={s.price}
                          onChange={(e) => handlePrice(s.id, e.target.value)}
                          className="bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-center text-sm focus:border-[#FF8A00] outline-none font-bold text-white transition-colors"
                          dir="ltr"
                          min="50"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-[11px] text-slate-400 font-bold text-right">نطاق السعر الإجمالي (اختياري)</label>
                        <input 
                          type="text"
                          placeholder="مثال: 150 - 300 ج.م"
                          value={s.price_range}
                          onChange={(e) => handleUpdateField(s.id, 'price_range', e.target.value)}
                          className="bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-right text-sm focus:border-[#FF8A00] outline-none text-white transition-colors"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-400 font-bold text-right">وصف الخدمة</label>
                      <textarea 
                        placeholder="اكتب تفاصيل الخدمة وما تشمله للمشترين..."
                        value={s.description}
                        onChange={(e) => handleUpdateField(s.id, 'description', e.target.value)}
                        rows={2}
                        className="bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-right text-sm focus:border-[#FF8A00] outline-none text-white transition-colors resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label className="text-[11px] text-slate-400 font-bold text-right">المدة المتوقعة للعمل</label>
                      <input 
                        type="text"
                        placeholder="مثال: ساعة إلى ساعتين"
                        value={s.duration}
                        onChange={(e) => handleUpdateField(s.id, 'duration', e.target.value)}
                        className="bg-[#050814] border border-white/10 rounded-xl px-3 py-2 text-right text-sm focus:border-[#FF8A00] outline-none text-white transition-colors"
                      />
                    </div>
                  </div>
                )
              }) : (
                <div className="text-center py-12 bg-[#0A0D1A] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center">
                  <LayoutGrid size={32} className="text-[#6B7A99] mb-3 opacity-50" />
                  <span className="text-sm font-bold text-white mb-1">لا توجد خدمات حالياً</span>
                  <span className="text-xs text-slate-400">أضف خدمات من القائمة أو أنشئ خدمة مخصصة</span>
                </div>
              )}
            </div>
            
            <SaveButton loading={loading} onClick={handleSave} />
          </div>
        )}
      </div>
    </SubPageLayout>
  )
}
