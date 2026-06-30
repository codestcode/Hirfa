'use client'

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { Hammer, Wrench, Zap, Paintbrush, Home, Shield, Star, Search, User, Droplets, Settings, PaintBucket, Wind } from 'lucide-react'

const ONBOARDING_STEPS = [
  {
    step: 1,
    titleParts: [{ text: 'كل الحرفيين اللي تحتاجهم في مكان واحد', highlight: false }],
    description: 'اعثر على نجارين، سباكين، كهربائيين، نقاشين وغيرهم بسهولة وفي دقائق.',
    nextRoute: '/intro/2',
    graphicType: 'home-trade',
  },
  {
    step: 2,
    titleParts: [
      { text: 'احجز وتواصل ', highlight: false },
      { text: 'بسهولة', highlight: true }
    ],
    description: 'ابحث عن الحرفي المناسب، تواصل معه مباشرة، وحدد موعد الخدمة بكل سهولة.',
    nextRoute: '/intro/3',
    graphicType: 'phone-booking',
  },
  {
    step: 3,
    titleParts: [
      { text: 'أسعار مناسبة ودفع آمن', highlight: false }
    ],
    description: 'احصل على تسعير واضح ومناسب لخدماتك مع خيارات دفع متعددة وسهلة.',
    nextRoute: '/intro/4',
    graphicType: 'payment-rating',
  },
  {
    step: 4,
    titleParts: [{ text: 'كيف تريد استخدام حرفة؟', highlight: false }],
    description: 'اختر الحساب المناسب لك للمتابعة.',
    nextRoute: '/login',
    graphicType: 'role-selection',
  }
]

const BG_ICONS: Array<{ Icon: any; top?: string; bottom?: string; left?: string; right?: string; rotate: number; size: number }> = [
  { Icon: Wrench,      top: '6%',  left: '4%',   rotate: -20, size: 72 },
  { Icon: Droplets,    top: '12%', right: '6%',  rotate: 15,  size: 52 },
  { Icon: Zap,         top: '32%', left: '2%',   rotate: 10,  size: 60 },
  { Icon: Hammer,      top: '22%', right: '3%',  rotate: -30, size: 80 },
  { Icon: Wind,        top: '68%', left: '3%',   rotate: 20,  size: 56 },
  { Icon: PaintBucket, top: '74%', right: '5%',  rotate: -15, size: 64 },
  { Icon: Settings,    top: '84%', left: '10%',  rotate: 30,  size: 48 },
  { Icon: Droplets,    top: '87%', right: '9%',  rotate: -10, size: 54 },
]

export default function OnboardingIntroPage() {
  const router = useRouter()
  const params = useParams()
  const stepParam = params?.step ? parseInt(params.step as string) : 1
  
  const currentStepIndex = ONBOARDING_STEPS.findIndex(s => s.step === stepParam)
  const stepData = currentStepIndex !== -1 ? ONBOARDING_STEPS[currentStepIndex] : ONBOARDING_STEPS[0]
  const currentStep = stepData.step

  const [selectedRole, setSelectedRole] = useState<'craftsman' | 'client'>('client')

  const handleNext = () => {
    if (currentStep === 4) {
      router.push(`/register?role=${selectedRole}`)
    } else {
      router.push(stepData.nextRoute)
    }
  }

  const handlePrev = () => {
    if (currentStep > 1) {
      router.push(`/intro/${currentStep - 1}`)
    }
  }

  const handleSkip = () => {
    router.push('/login')
  }

  if (currentStep === 4) {
    return (
      <div
        dir="rtl"
        className="min-h-screen flex flex-col justify-between overflow-hidden relative font-[var(--font-arabic)] py-8 px-6"
        style={{ backgroundColor: '#0f1623' }}
      >
        {BG_ICONS.map(({ Icon, size, rotate, top, left, right, bottom }, i) => (
          <div
            key={i}
            className="absolute pointer-events-none select-none"
            style={{
              top, left: left || undefined, right: right || undefined, bottom: bottom || undefined,
              opacity: 0.07,
              transform: `rotate(${rotate}deg)`,
            }}
          >
            <Icon size={size} color="#ffffff" strokeWidth={1.5} />
          </div>
        ))}

        <div className="w-full flex items-center justify-center pt-4 z-10">
          <img
            src="/hirfa_logo.svg"
            alt="Hirfa Logo"
            className="w-16 h-16 object-contain"
          />
        </div>

        <div className="w-full text-center z-10 my-6">
          <h2 className="text-[26px] font-bold text-white mb-2 leading-tight">
            كيف تريد استخدام حرفة؟
          </h2>
          <p className="text-sm text-slate-400">
            اختر الحساب المناسب لك للمتابعة.
          </p>
        </div>

        <div className="flex-1 flex flex-col justify-center gap-4 w-full max-w-sm mx-auto z-10">
          <div
            onClick={() => setSelectedRole('craftsman')}
            className={`w-full rounded-2xl p-5 flex flex-col items-center justify-center border-2 relative cursor-pointer transition-all duration-300 ${
              selectedRole === 'craftsman'
                ? 'bg-[#1e293b]/40 border-[#FF8A00]'
                : 'bg-[#111827]/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-4 left-4">
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedRole === 'craftsman'
                    ? 'border-[#FF8A00] bg-[#FF8A00]'
                    : 'border-slate-600 bg-transparent'
                }`}
              >
                {selectedRole === 'craftsman' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>

            <div className="w-14 h-14 rounded-full bg-indigo-950/60 border border-indigo-900/50 flex items-center justify-center mb-3">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[#a5b4fc]">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3-3a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0z" />
                <path d="M17.2 8.8 8.8 17.2l-2.6-2.6 8.4-8.4" />
                <path d="m14 14 3-3a1 1 0 0 0 0-1.4l-1.6-1.6a1 1 0 0 0-1.4 0l-3 3" />
                <path d="M9 11 5 15l1.5 1.5L3 21l4.5-3.5L9 19l4-4" />
              </svg>
            </div>

            <span className="text-lg font-bold text-white mb-1">حرفي</span>
            <span className="text-xs text-slate-400">أبحث عن عمل</span>
          </div>

          <div
            onClick={() => setSelectedRole('client')}
            className={`w-full rounded-2xl p-5 flex flex-col items-center justify-center border-2 relative cursor-pointer transition-all duration-300 ${
              selectedRole === 'client'
                ? 'bg-[#1e293b]/40 border-[#FF8A00]'
                : 'bg-[#111827]/60 border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-4 left-4">
              <span
                className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                  selectedRole === 'client'
                    ? 'border-[#FF8A00] bg-[#FF8A00]'
                    : 'border-slate-600 bg-transparent'
                }`}
              >
                {selectedRole === 'client' && (
                  <span className="w-1.5 h-1.5 rounded-full bg-white" />
                )}
              </span>
            </div>

            <div className="w-14 h-14 rounded-full bg-indigo-950/60 border border-indigo-900/50 flex items-center justify-center mb-3">
              <div className="relative">
                <User className="w-6 h-6 text-[#a5b4fc]" strokeWidth={1.8} />
                <div className="absolute -bottom-1 -left-1 bg-indigo-950 rounded-full p-0.5 border border-indigo-900">
                  <Search className="w-3 h-3 text-[#a5b4fc]" strokeWidth={2.5} />
                </div>
              </div>
            </div>

            <span className="text-lg font-bold text-white mb-1">عميل</span>
            <span className="text-xs text-slate-400">أبحث عن خدمات</span>
          </div>
        </div>

        <div className="w-full max-w-sm mx-auto pt-6 z-10">
          <button
            onClick={handleNext}
            className="btn-primary w-full flex items-center justify-center h-12 bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(255,138,0,0.25)] hover:opacity-95 active:scale-[0.98] transition-all"
          >
            ابدأ الآن
          </button>
        </div>
      </div>
    )
  }

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col justify-between overflow-hidden relative font-[var(--font-arabic)]"
      style={{ backgroundColor: '#0f1623' }}
    >
      {BG_ICONS.map(({ Icon, size, rotate, top, left, right, bottom }, i) => (
        <div
          key={i}
          className="absolute pointer-events-none select-none"
          style={{
            top, left: left || undefined, right: right || undefined, bottom: bottom || undefined,
            opacity: 0.07,
            transform: `rotate(${rotate}deg)`,
          }}
        >
          <Icon size={size} color="#ffffff" strokeWidth={1.5} />
        </div>
      ))}

      <div className="w-full flex items-center justify-between px-6 pt-6 z-10">
        <div className="flex items-center gap-2">
          <img
            src="/hirfa_logo.svg"
            alt="Hirfa Logo"
            className="w-10 h-10 object-contain"
          />
        </div>

        <button
          onClick={handleSkip}
          className="text-sm font-semibold transition-colors duration-200 hover:text-white"
          style={{ color: '#94a3b8' }}
        >
          تخطي
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-[280px] aspect-square flex items-center justify-center relative"
          >
            {stepData.graphicType === 'home-trade' && (
              <div className="w-full h-full flex items-center justify-center relative">
                <div 
                  className="w-[200px] h-[200px] rounded-full border-2 flex items-center justify-center" 
                  style={{ borderColor: '#FF8A00' }}
                >
                  <Home className="w-24 h-24 text-white" strokeWidth={1.5} />
                </div>

                <div 
                  className="absolute p-3 rounded-full border-2 bg-[#0f1623] flex items-center justify-center shadow-lg"
                  style={{ borderColor: '#FF8A00', top: '5%', left: '5%' }}
                >
                  <Hammer className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>

                <div 
                  className="absolute p-3 rounded-full border-2 bg-[#0f1623] flex items-center justify-center shadow-lg"
                  style={{ borderColor: '#FF8A00', top: '5%', right: '5%' }}
                >
                  <Wrench className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>

                <div 
                  className="absolute p-3 rounded-full border-2 bg-[#0f1623] flex items-center justify-center shadow-lg"
                  style={{ borderColor: '#FF8A00', bottom: '5%', left: '5%' }}
                >
                  <Zap className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>

                <div 
                  className="absolute p-3 rounded-full border-2 bg-[#0f1623] flex items-center justify-center shadow-lg"
                  style={{ borderColor: '#FF8A00', bottom: '5%', right: '5%' }}
                >
                  <Paintbrush className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
              </div>
            )}

            {stepData.graphicType === 'phone-booking' && (
              <div className="w-full h-full flex items-center justify-center relative">
                <div className="w-[120px] h-[220px] bg-slate-800 rounded-[24px] border-[3px] border-slate-600 shadow-2xl relative overflow-hidden flex flex-col p-2 rotate-[-12deg] translate-y-4">
                  <div className="w-full h-4 bg-slate-700 rounded-md mb-2 flex items-center justify-center">
                    <div className="w-8 h-1 bg-slate-900 rounded-full" />
                  </div>
                  <div className="flex-1 bg-slate-100 rounded-lg p-1 flex flex-col justify-between">
                    <div className="space-y-1">
                      <div className="h-2 bg-slate-300 rounded w-2/3" />
                      <div className="h-2 bg-slate-200 rounded w-1/2" />
                      <div className="grid grid-cols-4 gap-1 mt-2">
                        <div className="h-3 bg-[#FF8A00]/20 rounded border border-[#FF8A00]" />
                        <div className="h-3 bg-slate-200 rounded" />
                        <div className="h-3 bg-[#FF8A00] rounded" />
                        <div className="h-3 bg-slate-200 rounded" />
                      </div>
                    </div>
                    <div className="h-6 bg-gradient-to-r from-[#FF8A00] to-[#FFB800] rounded-md flex items-center justify-center">
                      <span className="text-[7px] font-bold text-white uppercase">Book Now</span>
                    </div>
                  </div>
                </div>

                <div 
                  className="absolute bg-white rounded-2xl p-2.5 border border-slate-100 shadow-xl flex flex-col gap-1 items-start rotate-[-5deg] z-20"
                  style={{ top: '15%', left: '0%' }}
                >
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="text-[8px] font-bold text-slate-700">تحدث معنا</span>
                  </div>
                  <div className="flex gap-1 items-center">
                    <div className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px]">😊</div>
                    <span className="text-[7px] text-slate-400">نشط الآن</span>
                  </div>
                </div>

                <div 
                  className="absolute bg-white rounded-xl p-2.5 border border-slate-100 shadow-xl flex flex-col gap-1 items-center rotate-[8deg] z-20"
                  style={{ top: '5%', right: '5%' }}
                >
                  <div className="w-8 h-8 rounded-lg bg-orange-50 flex flex-col items-center justify-center border border-orange-100">
                    <div className="w-full h-2 bg-[#FF8A00] rounded-t-lg" />
                    <span className="text-[8px] font-bold text-[#FF8A00] mt-0.5">15</span>
                  </div>
                </div>
              </div>
            )}

            {stepData.graphicType === 'payment-rating' && (
              <div className="w-full h-full flex items-center justify-center relative">
                <div 
                  className="w-[200px] h-[200px] rounded-full border-2 flex items-center justify-center" 
                  style={{ borderColor: '#FF8A00' }}
                >
                  <Star className="w-24 h-24 text-white fill-white" strokeWidth={1.5} />
                </div>
                <div 
                  className="absolute p-3 rounded-full border-2 bg-[#0f1623] flex items-center justify-center shadow-lg"
                  style={{ borderColor: '#FF8A00', bottom: '5%', right: '5%' }}
                >
                  <Zap className="w-6 h-6 text-white" strokeWidth={1.5} />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="w-full bg-[#f8fafc] rounded-t-[32px] px-6 pt-8 pb-10 flex flex-col items-center shadow-2xl z-20"
      >
        <div className="flex items-center gap-2 mb-6">
          {ONBOARDING_STEPS.filter(s => s.step < 4).map((step) => {
            const isActive = step.step === currentStep
            return (
              <span
                key={step.step}
                className="h-2 rounded-full transition-all duration-300"
                style={{
                  width: isActive ? 24 : 8,
                  backgroundColor: isActive ? '#FF8A00' : '#cbd5e1',
                }}
              />
            )
          })}
        </div>

        <div className="text-center w-full max-w-sm mb-8">
          <h2
            className="text-[22px] font-bold text-[#020617] mb-3 leading-tight"
            style={{ fontFamily: 'var(--font-arabic)' }}
          >
            {stepData.titleParts.map((part, index) => (
              <span key={index} style={{ color: part.highlight ? '#FF8A00' : 'inherit' }}>
                {part.text}
              </span>
            ))}
          </h2>
          <p
            className="text-sm leading-relaxed"
            style={{ color: '#64748b', fontFamily: 'var(--font-arabic)' }}
          >
            {stepData.description}
          </p>
        </div>

        {currentStep > 1 ? (
          <div className="w-full max-w-sm flex gap-3">
            <button
              onClick={handlePrev}
              className="flex-1 h-12 bg-[#334155] text-white font-bold rounded-xl active:scale-[0.98] transition-all hover:bg-slate-700 text-sm"
            >
              السابق
            </button>
            <button
              onClick={handleNext}
              className="flex-[2] btn-primary h-12 bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(255,138,0,0.25)] hover:opacity-95 active:scale-[0.98] transition-all text-sm"
            >
              التالي
            </button>
          </div>
        ) : (
          <button
            onClick={handleNext}
            className="btn-primary w-full max-w-sm flex items-center justify-center h-12 bg-gradient-to-r from-[#FF8A00] to-[#FFB800] text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(255,138,0,0.25)] hover:opacity-95 active:scale-[0.98] transition-all"
          >
            التالي
          </button>
        )}
      </motion.div>
    </div>
  )
}


export function generateStaticParams() {
  return [
    { step: '1' },
    { step: '2' },
    { step: '3' },
    { step: '4' }
  ];
}
