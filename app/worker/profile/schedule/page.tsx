'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ChevronRight, CalendarClock, Clock, Sun, Moon, ToggleLeft, ToggleRight } from 'lucide-react'

const days = [
  'السبت', 'الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة',
]

export default function SchedulePage() {
  const router = useRouter()
  const [schedule, setSchedule] = useState<Record<string, { active: boolean; from: string; to: string }>>(
    Object.fromEntries(
      days.map((day) => [day, { active: day !== 'الجمعة', from: '09:00', to: '17:00' }])
    )
  )

  const toggleDay = (day: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], active: !prev[day].active },
    }))
  }

  const updateTime = (day: string, field: 'from' | 'to', value: string) => {
    setSchedule((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: value },
    }))
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center font-arabic bg-[#000419]">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full z-[2] border-b border-white/5 bg-[#000419]/95 backdrop-blur-md"
      >
        <div className="h-16 max-w-[512px] w-full flex items-center justify-between px-4 mx-auto">
          <button onClick={() => router.back()} className="flex items-center justify-center rounded-full p-2">
            <ChevronRight size={20} className="text-white" />
          </button>
          <span className="text-white text-base font-bold leading-6">جدول العمل والتوافر</span>
          <div className="w-10" />
        </div>
      </motion.div>

      <motion.main
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[448px] mx-auto px-4 pt-8 gap-6 pb-24"
      >
        <div className="flex items-center gap-3 p-4 rounded-2xl border border-white/10 bg-white/[0.03]">
          <CalendarClock size={20} className="text-primary shrink-0" />
          <p className="text-sm text-white/60 leading-6">
            حدد أيام وساعات العمل المتاحة لديك
          </p>
        </div>

        <div className="flex flex-col gap-3">
          {days.map((day) => {
            const s = schedule[day]
            return (
              <div
                key={day}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-colors ${
                  s.active ? 'border-white/10 bg-white/[0.03]' : 'border-white/5 bg-white/[0.01] opacity-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <button onClick={() => toggleDay(day)} className="bg-transparent border-none cursor-pointer p-0">
                    {s.active ? <ToggleRight size={24} className="text-primary" /> : <ToggleLeft size={24} className="text-[#52627A]" />}
                  </button>
                  <span className={`text-sm font-semibold ${s.active ? 'text-white' : 'text-white/40'}`}>{day}</span>
                </div>
                {s.active && (
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                      <Sun size={12} className="text-[#FFB800]" />
                      <input
                        type="time"
                        value={s.from}
                        onChange={(e) => updateTime(day, 'from', e.target.value)}
                        className="w-[60px] bg-transparent border-none outline-none text-white text-xs text-center"
                      />
                    </div>
                    <span className="text-[#52627A] text-xs">إلى</span>
                    <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5 border border-white/10">
                      <Moon size={12} className="text-[#60A5FA]" />
                      <input
                        type="time"
                        value={s.to}
                        onChange={(e) => updateTime(day, 'to', e.target.value)}
                        className="w-[60px] bg-transparent border-none outline-none text-white text-xs text-center"
                      />
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <button className="w-full h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center gap-2 border-none cursor-pointer mt-2">
          حفظ الجدول
        </button>
      </motion.main>
    </div>
  )
}
