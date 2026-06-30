'use client'

import { useState, useMemo, use, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import LocationPicker from '@/components/shared/LocationPicker'

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

const defaultSchedule: Record<string, { active: boolean; start: string; end: string }> = {
  sat: { active: true, start: '09:00', end: '17:00' },
  sun: { active: true, start: '09:00', end: '17:00' },
  mon: { active: true, start: '09:00', end: '17:00' },
  tue: { active: true, start: '09:00', end: '17:00' },
  wed: { active: true, start: '09:00', end: '17:00' },
  thu: { active: true, start: '09:00', end: '17:00' },
  fri: { active: false, start: '09:00', end: '17:00' }
}

const getDayKey = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-').map(Number)
  const dateObj = new Date(year, month - 1, day)
  const days = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat']
  return days[dateObj.getDay()]
}

export default function BookingPage({ params }: { params: Promise<{ workerId: string }> }) {
  const router = useRouter()
  const { workerId } = use(params)
  const supabase = createClient()
  
  const weekDates = useMemo(() => getWeekDates(), [])
  const [selectedDate, setSelectedDate] = useState(weekDates[0].dateStr)
  const [selectedTime, setSelectedTime] = useState('')
  const [notes, setNotes] = useState('')
  const [address, setAddress] = useState('')
  const [lat, setLat] = useState<number | null>(null)
  const [lng, setLng] = useState<number | null>(null)
  const [images, setImages] = useState<string[]>([])

  const [workerProfile, setWorkerProfile] = useState<any>(null)
  const [schedule, setSchedule] = useState<any[]>([])
  const [bookedTimes, setBookedTimes] = useState<string[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    async function loadData() {
      setLoading(true)
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', workerId).single()
      if (!active) return
      setWorkerProfile(prof)
      
      if (prof && prof.verified) {
        const { data: sched } = await supabase.from('worker_schedule').select('*').eq('worker_id', workerId)
        if (active && sched) setSchedule(sched)
        
        const { data: books } = await supabase
          .from('bookings')
          .select('appointment_time')
          .eq('worker_id', workerId)
          .eq('appointment_date', selectedDate)
          .not('status', 'eq', 'cancelled')
        
        if (active && books) {
          setBookedTimes(books.map(b => b.appointment_time.slice(0, 5)))
        }
      }
      setLoading(false)
    }
    loadData()
    return () => {
      active = false
    }
  }, [workerId, selectedDate, supabase])

  const currentDayKey = useMemo(() => getDayKey(selectedDate), [selectedDate])
  
  const daySched = useMemo(() => {
    const dbSched = schedule.find(s => s.day_id === currentDayKey)
    if (dbSched) {
      return {
        active: dbSched.is_active,
        start: dbSched.start_time.substring(0, 5),
        end: dbSched.end_time.substring(0, 5)
      }
    }
    return defaultSchedule[currentDayKey]
  }, [schedule, currentDayKey])

  const isSlotAvailable = (time: string) => {
    if (!daySched || !daySched.active) return false
    if (time < daySched.start || time >= daySched.end) return false
    if (bookedTimes.includes(time)) return false
    return true
  }

  const selectedDateObj = weekDates.find(d => d.dateStr === selectedDate)
  const monthYear = selectedDateObj
    ? `${selectedDateObj.date.toLocaleDateString('ar-EG', { month: 'long' })} ${selectedDateObj.date.getFullYear()}`
    : ''

  const handleContinue = () => {
    if (!selectedTime) return
    if (images.length === 0) {
      alert('يرجى إرفاق صورة توضيحية واحدة على الأقل')
      return
    }

    if (!address && (!lat || !lng)) {
      alert('يرجى تحديد موقعك الحالي أو إدخال العنوان التفصيلي')
      return
    }

    try {
      sessionStorage.setItem('bookingImages', JSON.stringify(images))
    } catch (e) {
      alert('حجم الصور كبير جداً، يرجى اختيار صور أقل أو بحجم أصغر.')
      return
    }

    const params = new URLSearchParams(window.location.search)
    const serviceName = params.get('serviceName') || ''
    const servicePrice = params.get('servicePrice') || ''
    
    let url = `/client/booking/confirm?workerId=${workerId}&date=${selectedDate}&time=${selectedTime}&notes=${encodeURIComponent(notes)}`
    if (serviceName) url += `&serviceName=${encodeURIComponent(serviceName)}`
    if (servicePrice) url += `&servicePrice=${servicePrice}`
    if (address) url += `&address=${encodeURIComponent(address)}`
    if (lat && lng) url += `&lat=${lat}&lng=${lng}`
    
    router.push(url)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return

    const newImages: string[] = []
    let loadedCount = 0

    const processFile = (file: File) => {
      const reader = new FileReader()
      reader.onloadend = () => {
        if (reader.result) {
          newImages.push(reader.result as string)
        }
        loadedCount++
        if (loadedCount === files.length) {
          setImages(prev => [...prev, ...newImages])
        }
      }
      reader.readAsDataURL(file)
    }

    for (let i = 0; i < files.length; i++) {
      processFile(files[i])
    }
  }

  if (loading) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white">جاري التحميل...</div>
      </div>
    )
  }

  if (!workerProfile || !workerProfile.verified) {
    return (
      <div dir="rtl" className="min-h-screen bg-[#020617] flex items-center justify-center">
        <div className="text-white">الحرفي غير موجود</div>
      </div>
    )
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
              const available = isSlotAvailable(time)
              const isDisabled = isPast || !available
              
              return (
                <button
                  key={time}
                  disabled={isDisabled}
                  onClick={() => setSelectedTime(time)}
                  className={`h-12 rounded-xl font-bold text-sm transition ${
                    isSelected
                      ? 'bg-[#FFA504] text-white'
                      : 'bg-white text-[#050B2C]'
                  } ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}`}
                >
                  {time}
                </button>
              )
            })}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-[#E4E1E5] font-bold text-sm mb-4">العنوان التفصيلي (اختياري)</h3>
          <LocationPicker 
            onLocationSelected={(data) => {
              const fullAddress = [data.governorate, data.area, data.address].filter(Boolean).join(' - ')
              if (fullAddress) setAddress(fullAddress)
              if (data.lat) setLat(data.lat)
              if (data.lng) setLng(data.lng)
            }}
            className="mb-4"
          />
          <input
            type="text"
            value={address}
            onChange={e => setAddress(e.target.value)}
            placeholder="أدخل العنوان التفصيلي (مثال: شارع الجامعة، مبنى 5، شقة 12)"
            className="w-full h-12 rounded-2xl bg-[#0F172A]/60 px-4 text-right text-base text-white placeholder-[#6B7A99]/60 outline-none"
            dir="rtl"
          />
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
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[#E4E1E5] font-bold text-sm">صور توضيحية</h3>
            <span className="text-[#ED4C5C] text-xs font-bold bg-[#ED4C5C]/10 px-2 py-1 rounded-full">إلزامي *</span>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <div key={idx} className="relative w-20 h-20 rounded-2xl overflow-hidden bg-[#1E2538] flex-shrink-0">
                <Image src={img} alt="صورة توضيحية" fill className="object-cover" />
                <button 
                  onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                  className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-white"
                >
                  &times;
                </button>
              </div>
            ))}
            <label className="w-20 h-20 rounded-2xl border-2 border-dashed border-[#46464E] flex items-center justify-center cursor-pointer hover:border-[#FFA504] transition flex-shrink-0">
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              <Plus size={16} className="text-[#46464E]" />
            </label>
          </div>
        </div>
      </div>

      <div className="fixed bottom-28 left-0 right-0 bg-[#020617] backdrop-blur-lg border-t border-white/5 p-4">
        <div className="max-w-[512px] mx-auto">
          <button
            onClick={handleContinue}
            disabled={!selectedTime || images.length === 0}
            className="w-full py-4 rounded-xl bg-gradient-to-l from-[#FF8A00] to-[#FFB800] text-white text-xl font-medium shadow-lg shadow-[#FF8A00]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            احجز الان
          </button>
        </div>
      </div>
    </div>
  )
}
