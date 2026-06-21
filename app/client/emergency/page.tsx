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
      router.push('/client/emergency/tracking')
    }, 1000)
  }

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
        <h1 className="font-bold text-foreground font-cairo">طلب طوارئ</h1>
        <div className="w-10"></div>
      </motion.div>

      {/* Emergency Type Selection */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="px-4 py-6"
      >
        <p className="text-center text-muted-foreground font-cairo mb-6">
          اختر نوع الطوارئ الذي تواجهه
        </p>

        <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
          {emergencyTypes.map(({ id, icon: Icon, label, color }) => (
            <button
              key={id}
              onClick={() => setSelected(id)}
              className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                selected === id
                  ? 'border-primary bg-primary/5 shadow-lg shadow-primary/10'
                  : 'border-border bg-white hover:border-iron-300 hover:shadow-md'
              }`}
            >
              <div
                className={`p-3 rounded-full ${
                  selected === id ? 'bg-primary/10' : 'bg-iron-50'
                }`}
              >
                <Icon className={`w-6 h-6 ${color}`} />
              </div>
              <span className="text-xs font-cairo font-semibold text-foreground">{label}</span>
            </button>
          ))}
        </div>
      </motion.div>

      {/* Safety Notice */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="px-4"
      >
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-800 font-cairo">في حالة الطوارئ الحقيقية</p>
            <p className="text-xs text-red-600 font-cairo mt-1">
              إذا كنت تواجه حالة طارئة تهدد السلامة، يرجى الاتصال بالجهات المختصة مباشرة (الدفاع المدني: 180)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Request Button */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-border p-4">
        <Button
          onClick={handleRequest}
          disabled={!selected || isRequesting}
          className="w-full rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[var(--gradient-primary-horizontal)] shadow-[0_10px_15px_-3px_rgba(255,138,0,0.20),0_4px_6px_-4px_rgba(255,138,0,0.20)] disabled:opacity-50 disabled:cursor-not-allowed border-none"
        >
          {isRequesting ? 'جاري إرسال الطلب...' : 'طلب مساعدة'}
        </Button>
      </div>
    </div>
  )
}
