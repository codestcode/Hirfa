'use client'

import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import React from 'react'
import { CalendarDays, Power } from 'lucide-react'
import { DayToggleCard } from '@/components/ui/profile/DayToggleCard'
import { PageLoader } from '@/components/ui/PageLoader'
import { SaveButton } from '@/components/ui/forms/SaveButton'
import { useSchedule, DAYS } from '@/hooks/useSchedule'

export default function SchedulePage() {
  const { isAvailableNow, setIsAvailableNow, schedule, toggleDay, handleTimeChange, loading, fetching, handleSave } = useSchedule()

  return (
    <SubPageLayout>
      <PageHeader title="جدول العمل والتوافر" isTransparent />
      <div className="px-6 py-4">
        {fetching ? <PageLoader /> : (
          <>
            <div className="bg-gradient-to-br from-[#1A1410] to-[#0A0D1A] rounded-2xl p-5 border border-[#FF8A00]/20 shadow-[0_0_20px_rgba(255,138,0,0.05)] mb-8">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isAvailableNow ? 'bg-[#4ADE80]/10 text-[#4ADE80]' : 'bg-white/5 text-[#6B7A99]'}`}><Power size={20} /></div>
                  <div className="flex flex-col">
                    <span className="font-bold text-sm">متاح للعمل حالياً</span>
                    <span className="text-[10px] text-[#6B7A99]">استقبال الطلبات الفورية الآن</span>
                  </div>
                </div>
                <button onClick={() => setIsAvailableNow(!isAvailableNow)} className={`w-12 h-7 rounded-full p-1 flex items-center ${isAvailableNow ? 'bg-[#4ADE80] justify-start' : 'bg-[#1E2538] justify-end'}`}>
                  <div className="w-5 h-5 bg-[#050814] rounded-full shadow-sm" />
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-3 mb-8">
              <div className="flex items-center gap-2 mb-2"><CalendarDays size={18} className="text-[#FF8A00]" /><h2 className="text-sm font-bold">أوقات العمل الأسبوعية</h2></div>
              {DAYS.map(day => <DayToggleCard key={day.id} day={day} isActive={schedule[day.id]?.active} start={schedule[day.id]?.start} end={schedule[day.id]?.end} onToggle={toggleDay} onTimeChange={handleTimeChange} />)}
            </div>

            <SaveButton loading={loading} onClick={handleSave} />
          </>
        )}
      </div>
    </SubPageLayout>
  )
}
