'use client'

import { useState, useMemo, use } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Plus } from 'lucide-react'

const DAY_NAMES = ['الأحد', 'الاثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت']

function getWeekDates(): { date: Date; dayName: string; dayNumber: number; dateStr: string }[] {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const days: { date: Date; dayName: string; dayNumber: number; dateStr: string }[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - dayOfWeek + i)
    days.push({
      date: d,
      dayName: DAY_NAMES[d.getDay()],
      dayNumber: d.getDate(),
      dateStr: d.toISOString().split('T')[0]
    })
  }
  return days
}

const TIME_SLOTS = [
  '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00'
]

export default function BookingPage({ params }: { params: Promise<{ workerId: string }> }) {
  const router = useRouter()
  const { workerId } = use(params)
  const weekDates = useMemo(() => getWeekDates(), [])
  const [selectedDate, setSelectedDate] = useState(weekDates[0].dateStr)
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')

  const selectedDateObj = weekDates.find(d => d.dateStr === selectedDate)
  const monthYear = selectedDateObj
    ? `${selectedDateObj.date.toLocaleDateString('ar-EG', { month: 'long' })} ${selectedDateObj.date.getFullYear()}`
    : ''

  const handleContinue = () => {
    if (!selectedTime) return
    router.push(`/client/booking/confirm?workerId=${workerId}&date=${selectedDate}&time=${selectedTime}&notes=${encodeURIComponent(notes)}`)
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#020617]">
      <div className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-xl border-b border-white/5">
        <div className="flex items-center justify-between h-14 max-w-[512px] mx-auto px-4">
          <button onClick={() => router.back()}>
            <ArrowLeft size={16} className="text-white" />
          </button>
          <h1 className="text-white text-xl font-semibold">تحديد الموعد</h1>
          <div className="w-6" />
        </div>
      </div>

      <div className="max-w-[512px] mx-auto px-4 pb-40">
        <div className="mt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#909099"/></svg>
              <svg width="8" height="12" viewBox="0 0 8 12" fill="none"><path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#909099"/></svg>
            </div>
            <span className="text-[#E4E1E5] text-sm">{monthYear}</span>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-2">
            {weekDates.map(d => {
              const isSelected = d.dateStr === selectedDate
              return (
                <button
                  key={d.dateStr}
                  onClick={() => { setSelectedDate(d.dateStr); setSelectedTime('') }}
                  className={`flex flex-col items-center justify-center w-16 h-20 rounded-2xl flex-shrink-0 transition ${
                    isSelected ? 'bg-[#FFA504] shadow-lg shadow-[#FFA504]/20' : 'bg-[#2A2A2C]'
                  }`}
                >
                  <span className={`text-xs ${isSelected ? 'text-[#462A00]' : 'text-[#C7C5CF]'}`}>
                    {d.dayName}
                  </span>
                  <span className={`text-sm font-bold mt-1 ${isSelected ? 'text-[#462A00]' : 'text-white'}`}>
                    {d.dayNumber}
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-[#E4E1E5] font-bold text-sm mb-4">المواعيد المتاحة</h3>
          <div className="grid grid-cols-3 gap-4">
            {TIME_SLOTS.map(time => {
              const isSelected = selectedTime === time
              const isPast = selectedDateObj && selectedDateObj.date < new Date(new Date().toDateString())
              return (
                <button
                  key={time}
                  disabled={isPast}
                  onClick={() => setSelectedTime(time)}
                  className={`h-12 rounded-xl font-bold text-sm transition ${
                    isSelected
                      ? 'bg-[#FFA504] text-white'
                      : 'bg-white text-[#050B2C]'
                  } ${isPast ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-[#E4E1E5] font-bold text-sm mb-4">ملاحظات إضافية</h3>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            placeholder="اشرح المشكلة بالتفصيل هنا..."
            className="w-full min-h-[120px] rounded-2xl bg-[#0F172A]/60 p-4 text-right text-base text-white placeholder-[#6B7A99]/60 outline-none resize-none"
            dir="rtl"
          />
        </div>

        <div className="mt-8">
          <h3 className="text-[#E4E1E5] font-bold text-sm mb-4">صور توضيحية</h3>
          <div className="flex gap-4">
            <div className="w-20 h-20 rounded-2xl overflow-hidden bg-[#1E2538] flex items-center justify-center">
              <span className="text-[#6B7A99] text-xs">صورة</span>
            </div>
            <div className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#46464E] flex items-center justify-center cursor-pointer hover:border-[#FFA504] transition">
              <Plus size={16} className="text-[#46464E]" />
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-28 left-0 right-0 bg-[#020617] backdrop-blur-lg border-t border-white/5 p-4">
        <div className="max-w-[512px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedTime}
            className="w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white text-xl font-medium shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            احجز الان
          </button>
        </div>
      </div>
    </div>
  )
}
