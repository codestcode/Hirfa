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
            className="w-full h-12 bg-primary text-primary-foreground font-cairo font-semibold rounded-lg"
          >
            العودة للرئيسية
          </Button>
          <Button
            onClick={() => router.push('/bookings')}
            variant="outline"
            className="w-full h-12 border-2 border-iron-200 text-iron-600 font-cairo font-semibold rounded-lg"
          >
            عرض حجوزاتي
          </Button>
        </div>
      </motion.div>
    </div>
  )
}
