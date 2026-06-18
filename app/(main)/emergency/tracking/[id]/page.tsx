'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Phone, MessageCircle, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { craftsmen } from '@/lib/mock-data'

export default function EmergencyTrackingPage() {
  const craftsman = craftsmen[0]
  const [eta, setEta] = useState(12)

  useEffect(() => {
    const interval = setInterval(() => {
      setEta((prev) => (prev > 0 ? prev - 1 : 0))
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="fixed inset-0 bg-background flex flex-col">
      {/* Map Area (placeholder) */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex-1 bg-gradient-to-b from-iron-100 to-iron-200 flex items-center justify-center relative overflow-hidden"
      >
        {/* Animated radar pulse */}
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute inset-0 border-2 border-primary/30 rounded-full"
        ></motion.div>
        <motion.div
          animate={{ scale: [1, 1.5, 1] }}
          transition={{ repeat: Infinity, duration: 2, delay: 0.3 }}
          className="absolute inset-0 border-2 border-primary/20 rounded-full"
        ></motion.div>

        {/* Center point */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="w-4 h-4 bg-primary rounded-full"
        ></motion.div>

        {/* Craftsman indicator */}
        <motion.div
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.5 }}
          className="absolute top-20 flex flex-col items-center"
        >
          <div className="w-12 h-12 rounded-full border-4 border-primary bg-white flex items-center justify-center">
            <span className="text-xl">🚗</span>
          </div>
          <p className="text-xs font-cairo font-semibold mt-2 text-foreground">في الطريق</p>
        </motion.div>
      </motion.div>

      {/* Craftsman Card */}
      <motion.div
        initial={{ y: 300 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="bg-white border-t border-border rounded-t-3xl p-6 space-y-4"
      >
        {/* Craftsman Info */}
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary">
            <Image
              src={craftsman.avatar}
              alt={craftsman.nameAr}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1">
            <p className="font-bold text-foreground font-cairo">{craftsman.nameAr}</p>
            <p className="text-sm text-muted-foreground font-cairo">{craftsman.specialtyAr}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-primary font-cairo">⭐ {craftsman.rating}</p>
          </div>
        </div>

        {/* ETA */}
        <div className="bg-iron-50 rounded-lg p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-cairo">الوقت المتبقي</p>
            <p className="text-2xl font-bold text-primary font-cairo">{eta} دقيقة</p>
          </div>
          <Clock className="w-8 h-8 text-primary" />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground font-cairo">
          <MapPin className="w-4 h-4" />
          <span>القاهرة، شارع النيل</span>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 pt-4">
          <Button
            className="rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] border-none"
          >
            <Phone className="w-4 h-4 ms-2" />
            اتصال
          </Button>
          <Button
            variant="outline"
            className="rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] border-none"
          >
            <MessageCircle className="w-4 h-4 ms-2" />
            رسالة
          </Button>
        </div>

        {/* Info Text */}
        <p className="text-xs text-muted-foreground font-cairo text-center pt-2">
          سيصل الحرفي قريباً. تأكد من وجود شخص لاستقباله.
        </p>
      </motion.div>
    </div>
  )
}
