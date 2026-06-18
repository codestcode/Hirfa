'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowLeft, MapPin, Clock, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { bookings } from '@/lib/mock-data'

export default function BookingsPage() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('upcoming')

  const tabs = [
    { id: 'upcoming', label: 'قادمة' },
    { id: 'active', label: 'نشطة' },
    { id: 'completed', label: 'مكتملة' },
    { id: 'cancelled', label: 'ملغاة' },
  ]

  const filteredBookings = bookings.filter((b) => b.status === activeTab)

  return (
    <div className="min-h-screen bg-background pb-32">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="sticky top-0 z-10 bg-white border-b border-border p-4 flex items-center justify-between"
      >
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="text-iron-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-bold text-foreground font-cairo">حجوزاتي</h1>
        <div className="w-10"></div>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.1 }}
        className="sticky top-14 z-10 bg-white border-b border-border px-4"
      >
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 px-4 font-cairo font-semibold text-sm whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'border-b-2 border-primary text-primary'
                  : 'text-muted-foreground'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
        className="px-4 py-6 space-y-3"
      >
        {filteredBookings.length > 0 ? (
          filteredBookings.map((booking, index) => (
            <motion.div
              key={booking.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-lg overflow-hidden border border-border hover:shadow-md transition cursor-pointer"
              onClick={() => router.push(`/booking/${booking.id}`)}
            >
              <div className="p-4 flex gap-4">
                {/* Craftsman Avatar */}
                <div className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Image
                    src={booking.craftsman.avatar}
                    alt={booking.craftsman.nameAr}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Info */}
                <div className="flex-1">
                  <h3 className="font-bold text-foreground font-cairo">
                    {booking.craftsman.nameAr}
                  </h3>
                  <p className="text-sm text-muted-foreground font-cairo mb-2">
                    {booking.serviceAr}
                  </p>

                  {/* Details */}
                  <div className="flex gap-3 text-xs text-muted-foreground font-cairo">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {booking.time}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      القاهرة
                    </div>
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex flex-col items-end justify-between">
                  <span className={`text-xs font-cairo font-semibold px-2 py-1 rounded-full ${
                    booking.status === 'upcoming'
                      ? 'bg-blue-100 text-blue-700'
                      : booking.status === 'active'
                        ? 'bg-green-100 text-green-700'
                        : booking.status === 'completed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-red-100 text-red-700'
                  }`}>
                    {booking.status === 'upcoming' && 'قادم'}
                    {booking.status === 'active' && 'نشط'}
                    {booking.status === 'completed' && 'مكتمل'}
                    {booking.status === 'cancelled' && 'ملغى'}
                  </span>
                  <p className="text-sm font-bold text-foreground">
                    {booking.totalAmount} ج.م
                  </p>
                </div>
              </div>

              {/* Action Row */}
              {booking.status === 'active' && (
                <div className="px-4 py-3 bg-iron-50 flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    className="flex-1 rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] border-none"
                  >
                    تتبع
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1 rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] border-none"
                  >
                    اتصال
                  </Button>
                </div>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground font-cairo">لا توجد حجوزات</p>
          </div>
        )}
      </motion.div>
    </div>
  )
}
