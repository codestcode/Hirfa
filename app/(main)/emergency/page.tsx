'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Droplets, Zap, DoorOpen, Flame, Wind, HelpCircle, AlertTriangle } from 'lucide-react'

const emergencyTypes = [
  { id: 'water', icon: Droplets, label: 'تسريب مياه', color: 'text-blue-500' },
  { id: 'power', icon: Zap, label: 'انقطاع كهرباء', color: 'text-yellow-500' },
  { id: 'door', icon: DoorOpen, label: 'كسر باب', color: 'text-red-600' },
  { id: 'fire', icon: Flame, label: 'حريق', color: 'text-orange-500' },
  { id: 'gas', icon: Wind, label: 'غاز', color: 'text-green-500' },
  { id: 'other', icon: HelpCircle, label: 'أخرى', color: 'text-gray-500' },
]

export default function EmergencyPage() {
  const router = useRouter()
  const [selected, setSelected] = useState<string | null>(null)
  const [isRequesting, setIsRequesting] = useState(false)

  const handleRequest = () => {
    if (!selected) return
    setIsRequesting(true)
    setTimeout(() => {
      router.push('/emergency/tracking')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white border-b border-border p-4 flex items-center justify-between">
        <Button
          onClick={() => router.back()}
          variant="ghost"
          size="icon"
          className="text-iron-600"
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-bold text-foreground font-cairo">طلب طوارئ</h1>
        <div className="w-10"></div>
      </div>

      {/* Warning Banner */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-4 mt-4 p-4 bg-red-50 border-s-4 border-red-500 rounded-lg flex gap-3"
      >
        <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-bold text-red-700 font-cairo">استجابة سريعة</p>
          <p className="text-sm text-red-600 font-cairo">سيصل حرفي معتمد خلال ١٥ دقيقة</p>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="flex-1 px-4 py-8"
      >
        <h2 className="text-xl font-bold text-foreground mb-6 font-cairo">اختر نوع الطوارئ</h2>

        <div className="grid grid-cols-2 gap-3 mb-8">
          {emergencyTypes.map((type) => {
            const Icon = type.icon
            const isSelected = selected === type.id

            return (
              <motion.button
                key={type.id}
                onClick={() => setSelected(type.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`p-4 rounded-xl border-2 transition ${
                  isSelected
                    ? 'border-primary bg-primary/5'
                    : 'border-border bg-white hover:border-iron-300'
                }`}
              >
                <Icon className={`w-8 h-8 ${type.color} mx-auto mb-2`} />
                <p className="text-sm font-cairo font-semibold text-foreground">{type.label}</p>
              </motion.button>
            )
          })}
        </div>

        {/* Description */}
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 bg-iron-50 rounded-lg mb-8"
          >
            <p className="text-sm text-muted-foreground font-cairo">
              سيتم البحث عن أقرب حرفي معتمد متخصص لمعالجة هذا النوع من الطوارئ.
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Bottom CTA */}
      <div className="p-4 border-t border-border">
        <Button
          onClick={handleRequest}
          disabled={!selected || isRequesting}
          className="w-full rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] disabled:opacity-50 disabled:cursor-not-allowed border-none"
        >
          {isRequesting ? 'جاري البحث...' : 'اطلب الآن'}
        </Button>
      </div>
    </div>
  )
}
