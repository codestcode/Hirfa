'use client'

import React, { useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Camera, IdCard, Images, CheckCircle2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

type UploadSlot = 'selfie' | 'idFront' | 'idBack' | 'portfolio'

interface SlotState {
  preview: string | null
  fileName: string | null
}

function UploadZone({
  id,
  label,
  hint,
  icon: Icon,
  state,
  onPick,
  multiple,
}: {
  id: UploadSlot
  label: string
  hint: string
  icon: React.ElementType
  state: SlotState
  onPick: (slot: UploadSlot, file: File) => void
  multiple?: boolean
}) {
  const ref = useRef<HTMLInputElement>(null)
  const uploaded = !!state.preview

  return (
    <div>
      <label className="text-[13px] font-semibold leading-5 text-white mb-2 block">
        {label}
      </label>

      <button
        type="button"
        onClick={() => ref.current?.click()}
        className="w-full min-h-[120px] flex flex-col items-center justify-center gap-2 bg-[#0F1322] border-2 border-dashed rounded-xl cursor-pointer transition-colors overflow-hidden relative"
        style={{ borderColor: uploaded ? '#FF8A00' : '#1E2538' }}
      >
        {uploaded ? (
          <>
            <img
              src={state.preview!}
              alt={label}
              className="w-full h-[120px] object-cover"
            />
            <div className="absolute top-2 left-2 bg-black/55 rounded-full px-2 py-0.5 flex items-center gap-1">
              <CheckCircle2 size={13} color="#4ADE80" />
              <span className="text-[0.7rem] text-[#4ADE80] font-semibold">تم الرفع</span>
            </div>
          </>
        ) : (
          <>
            <Icon size={32} color="#4B5A7A" strokeWidth={1.5} />
            <span className="text-[0.8rem] text-[#4B5A7A] font-[family-name:var(--font-arabic)]">
              {hint}
            </span>
          </>
        )}
      </button>

      <input
        ref={ref}
        type="file"
        accept="image/*"
        multiple={multiple}
        className="hidden"
        onChange={e => {
          const file = e.target.files?.[0]
          if (file) onPick(id, file)
          e.target.value = ''
        }}
      />
    </div>
  )
}

const INITIAL_STATE: SlotState = { preview: null, fileName: null }

export default function CraftsmanVerifyPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const [slots, setSlots] = useState<Record<UploadSlot, SlotState>>({
    selfie:    { ...INITIAL_STATE },
    idFront:   { ...INITIAL_STATE },
    idBack:    { ...INITIAL_STATE },
    portfolio: { ...INITIAL_STATE },
  })

  const isValid = slots.selfie.preview && slots.idFront.preview && slots.idBack.preview

  const handlePick = (slot: UploadSlot, file: File) => {
    const reader = new FileReader()
    reader.onload = ev => {
      setSlots(prev => ({
        ...prev,
        [slot]: { preview: ev.target?.result as string, fileName: file.name },
      }))
    }
    reader.readAsDataURL(file)
  }

  const handleNext = async () => {
    if (!isValid || isLoading) return

    const last = localStorage.getItem('signup_last')
    if (last && Date.now() - Number(last) < 60000) {
      setError('الرجاء الانتظار دقيقة قبل المحاولة مرة أخرى')
      return
    }

    localStorage.setItem('signup_last', Date.now().toString())
    setIsLoading(true)
    setError('')

    const email = localStorage.getItem('pendingEmail') || ''
    const phone = localStorage.getItem('pendingPhone') || ''
    const password = localStorage.getItem('pendingPassword') || ''
    const name = localStorage.getItem('pendingName') || ''

    const supabase = createClient()
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          email,
          phone: phone || null,
          role: 'worker',
          governorate: localStorage.getItem('pendingGovernorate') || null,
          area: localStorage.getItem('pendingArea') || null,
        },
      },
    })

    if (error) {
      if (error.code === 'over_email_send_rate_limit') {
        setError('لقد تجاوزت الحد المسموح به. الرجاء الانتظار بضع دقائق قبل المحاولة مرة أخرى.')
      } else {
        setError(error.message)
      }
      setIsLoading(false)
      return
    }

    localStorage.removeItem('pendingPhone')
    localStorage.removeItem('pendingPassword')
    localStorage.removeItem('pendingName')
    localStorage.removeItem('pendingEmail')
    localStorage.removeItem('pendingRole')
    localStorage.removeItem('pendingGovernorate')
    localStorage.removeItem('pendingArea')
    localStorage.removeItem('pendingProfession')
    localStorage.removeItem('pendingExperience')

    router.push('/check-email')
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen bg-[#050814] flex flex-col items-center justify-center p-4 font-[family-name:var(--font-arabic)] overflow-y-auto"
    >
      <div className="w-full max-w-[400px] flex flex-col my-8">
        <div className="flex justify-center mb-6">
          <Image
            src="/hirfa_logo.svg"
            alt="Logo"
            width={72}
            height={72}
            priority
          />
        </div>

        <div className="text-center mb-8">
          <h1 className="text-[1.75rem] font-bold text-white mb-2">
            إنشاء حساب حرفي
          </h1>
          <p className="text-xs text-[#FF8A00] font-semibold">
            توثيق الحساب
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <UploadZone
            id="selfie"
            label="رفع صورة شخصية"
            hint="اضغط هنا لرفع صورتك الشخصية"
            icon={Camera}
            state={slots.selfie}
            onPick={handlePick}
          />

          <UploadZone
            id="idFront"
            label="رفع صورة بطاقة الهوية (الوجه الأمامي)"
            hint="اضغط هنا لرفع صورة الهوية (الأمام)"
            icon={IdCard}
            state={slots.idFront}
            onPick={handlePick}
          />

          <UploadZone
            id="idBack"
            label="رفع صورة بطاقة الهوية (الوجه الخلفي)"
            hint="اضغط هنا لرفع صورة الهوية (الخلف)"
            icon={IdCard}
            state={slots.idBack}
            onPick={handlePick}
          />

          <UploadZone
            id="portfolio"
            label="رفع صور أعمال سابقة"
            hint="اضغط هنا لرفع صور الأعمال السابقة"
            icon={Images}
            state={slots.portfolio}
            onPick={handlePick}
            multiple
          />

          {error && (
            <p className="text-xs text-[#FF4D4D] text-right mt-2">{error}</p>
          )}

          <div className="grid grid-cols-[1fr_1.6fr] gap-3 mt-2">
            <button
              onClick={() => router.back()}
              className="h-12 text-sm font-bold text-white bg-[#1E2538] rounded-xl flex items-center justify-center transition-opacity active:opacity-90"
            >
              السابق
            </button>

            <button
              onClick={handleNext}
              disabled={!isValid || isLoading}
              className="h-12 text-sm font-bold text-white bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-xl flex items-center justify-center transition-opacity active:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'جاري...' : 'التالي'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
