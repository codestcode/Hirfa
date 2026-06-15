'use client'

import { Suspense, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft } from 'lucide-react'
import { craftsmen } from '@/lib/mock-data'

function BookingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const craftsmanId = searchParams.get('craftsman')
  const craftsman = craftsmen.find((c) => c.id === craftsmanId) || craftsmen[0]

  const [step, setStep] = useState(1)
  const [booking, setBooking] = useState({
    date: '',
    time: '',
    notes: '',
    address: '',
    paymentMethod: 'card' as const,
  })

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleConfirm = () => {
    router.push(`/booking/success?booking=${btoa(JSON.stringify(booking))}`)
  }

  const timeSlots = [
    { label: 'صباحاً', time: '08:00' },
    { label: 'ظهراً', time: '12:00' },
    { label: 'عصراً', time: '16:00' },
    { label: 'مساءً', time: '20:00' },
  ]

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-20 bg-white border-b border-border p-4 flex items-center justify-between"
      >
        <Button
          onClick={() => step > 1 ? setStep(step - 1) : router.back()}
          variant="ghost"
          size="icon"
          className="text-iron-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <span className="font-cairo font-semibold">الحجز {step}/4</span>
        <div className="w-10"></div>
      </motion.div>

      {/* Step Indicator */}
      <div className="px-4 py-4">
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`flex-1 h-2 rounded-full transition-all ${
                s <= step ? 'bg-primary' : 'bg-muted'
              }`}
            ></div>
          ))}
        </div>
      </div>

      {/* Content */}
      <motion.div
        key={step}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.3 }}
        className="px-4 space-y-6"
      >
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-cairo">اختر التاريخ</h2>
            <div className="grid grid-cols-7 gap-2">
              {Array.from({ length: 30 }).map((_, i) => {
                const date = new Date()
                date.setDate(date.getDate() + i)
                const day = date.getDate()
                const isSelected = booking.date === day.toString()

                return (
                  <button
                    key={i}
                    onClick={() => setBooking({ ...booking, date: day.toString() })}
                    className={`p-2 rounded-lg font-cairo text-sm font-semibold transition ${
                      isSelected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-foreground hover:bg-iron-100'
                    }`}
                  >
                    {day}
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-cairo">اختر الوقت</h2>
            <div className="grid grid-cols-2 gap-3">
              {timeSlots.map((slot) => (
                <button
                  key={slot.time}
                  onClick={() => setBooking({ ...booking, time: slot.time })}
                  className={`p-4 rounded-lg font-cairo font-semibold transition ${
                    booking.time === slot.time
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground hover:bg-iron-100'
                  }`}
                >
                  <p className="text-sm">{slot.label}</p>
                  <p className="text-xs mt-1">{slot.time}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-cairo">تفاصيل الحجز</h2>
            
            <div>
              <label className="block text-sm font-cairo font-semibold mb-2">العنوان</label>
              <Input
                value={booking.address}
                onChange={(e) => setBooking({ ...booking, address: e.target.value })}
                placeholder="أدخل عنوان المكان"
                className="border-2 border-iron-200 rounded-lg h-12 font-cairo"
              />
            </div>

            <div>
              <label className="block text-sm font-cairo font-semibold mb-2">ملاحظات</label>
              <textarea
                value={booking.notes}
                onChange={(e) => setBooking({ ...booking, notes: e.target.value })}
                placeholder="أضف أي معلومات إضافية..."
                className="w-full border-2 border-iron-200 rounded-lg p-3 font-cairo min-h-24 focus:border-primary outline-none"
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-foreground font-cairo">تأكيد الحجز</h2>

            {/* Summary */}
            <div className="bg-iron-50 rounded-lg p-4 space-y-3 font-cairo">
              <div className="flex justify-between">
                <span>الحرفي</span>
                <span className="font-semibold">{craftsman.nameAr}</span>
              </div>
              <div className="flex justify-between">
                <span>التاريخ والوقت</span>
                <span className="font-semibold">{booking.date}/{booking.time}</span>
              </div>
              <div className="flex justify-between">
                <span>السعر</span>
                <span className="font-semibold">{craftsman.hourlyRate} جنيه</span>
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-bold">
                <span>الإجمالي</span>
                <span>{craftsman.hourlyRate + 50} جنيه</span>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <label className="block text-sm font-semibold mb-3 font-cairo">طريقة الدفع</label>
              <div className="space-y-2">
                {['card', 'cash', 'fawry'].map((method) => (
                  <button
                    key={method}
                    onClick={() => setBooking({ ...booking, paymentMethod: method as any })}
                    className={`w-full p-3 rounded-lg border-2 transition text-right font-cairo ${
                      booking.paymentMethod === method
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-iron-300'
                    }`}
                  >
                    {method === 'card' && 'بطاقة بنكية'}
                    {method === 'cash' && 'نقداً'}
                    {method === 'fawry' && 'فوري'}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4 flex gap-3">
        {step > 1 && (
          <Button
            onClick={() => setStep(step - 1)}
            variant="outline"
            className="flex-1 h-12 font-cairo"
          >
            رجوع
          </Button>
        )}
        <Button
          onClick={step === 4 ? handleConfirm : handleNext}
          className="flex-1 bg-primary text-primary-foreground h-12 font-cairo font-semibold"
        >
          {step === 4 ? 'تأكيد الحجز' : 'التالي'}
        </Button>
      </div>
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">جاري التحميل...</div>}>
      <BookingContent />
    </Suspense>
  )
}
