'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { CheckCircle, Calendar, MapPin, Phone } from 'lucide-react'

export default function BookingSuccessPage() {
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(false)

  return (
    <div className="fixed inset-0 bg-background flex flex-col items-center justify-center p-4">
      {/* Success Icon */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{
          type: 'spring',
          stiffness: 260,
          damping: 20,
        }}
        className="mb-8"
      >
        <CheckCircle className="w-24 h-24 text-green-500" strokeWidth={1.5} />
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-center max-w-sm space-y-6"
      >
        <div>
          <h2 className="text-3xl font-bold text-foreground mb-2 font-cairo">تم الحجز!</h2>
          <p className="text-muted-foreground font-cairo">
            تم تأكيد حجزك بنجاح. سيصل الحرفي في الموعد المحدد.
          </p>
        </div>

        {/* Booking Details */}
        <div className="bg-iron-50 rounded-lg p-4 space-y-3 text-right font-cairo">
          <div className="flex items-center gap-3">
            <span>رقم الحجز: BK-001234</span>
          </div>
          <div className="flex items-center gap-3">
            <Calendar className="w-4 h-4 text-primary" />
            <span>15 فبراير 2024 - 2:00 م</span>
          </div>
          <div className="flex items-center gap-3">
            <MapPin className="w-4 h-4 text-primary" />
            <span>القاهرة، مصر</span>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="space-y-3 pt-4">
          <Button
            onClick={() => router.push('/home')}
            className="w-full rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] border-none"
          >
            العودة للرئيسية
          </Button>
          <Button
            onClick={() => router.push('/bookings')}
            variant="outline"
            className="w-full rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] border-none"
          >
            عرض حجوزاتي
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
