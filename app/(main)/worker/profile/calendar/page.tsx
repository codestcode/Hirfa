'use client'

import React from 'react'
import { CalendarDays } from 'lucide-react'
import { PageHeader } from '@/components/ui/PageHeader'
import { SubPageLayout } from '@/components/ui/SubPageLayout'
import { PageLoader } from '@/components/ui/PageLoader'
import { AppointmentCard } from '@/components/ui/calendar/AppointmentCard'
import { useCalendar } from '@/hooks/useCalendar'

export default function CalendarPage() {
  const { filter, setFilter, filteredAppointments, loading } = useCalendar()

  return (
    <SubPageLayout>
      <PageHeader title="جداول المواعيد" isTransparent />
      <div className="px-6 py-4">
        
        <div className="flex bg-[#0A0D1A] rounded-xl p-1 mb-6 border border-white/5">
          {[{ id: 'upcoming', label: 'القادمة' }, { id: 'completed', label: 'المكتملة' }, { id: 'all', label: 'الكل' }].map(tab => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as any)}
              className={`flex-1 py-2.5 text-xs font-bold rounded-lg transition-colors ${filter === tab.id ? 'bg-[#1E2538] text-white' : 'text-[#6B7A99] hover:text-white'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          {loading ? <PageLoader /> : filteredAppointments.length ? filteredAppointments.map((app) => (
            <AppointmentCard
              key={app.id}
              id={app.id}
              clientName={app.clientName}
              service={app.service}
              date={app.date}
              time={app.time}
              address={app.address}
              status={app.status}
            />
          )) : (
            <div className="text-center py-12 bg-[#0A0D1A] rounded-2xl border border-dashed border-white/10 flex flex-col items-center justify-center">
              <CalendarDays size={32} className="text-[#6B7A99] mb-3 opacity-50" />
              <span className="text-sm font-bold text-white mb-1">لا توجد مواعيد</span>
              <span className="text-xs text-[#6B7A99]">لا يوجد لديك مواعيد مجدولة حالياً</span>
            </div>
          )}
        </div>
      </div>
    </SubPageLayout>
  )
}
