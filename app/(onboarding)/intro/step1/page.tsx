'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import ToolSilhouettes from '@/components/shared/ToolSilhouettes'

export default function OnboardingStep1() {
  const router = useRouter()

  return (
    <main className="relative min-h-screen flex flex-col bg-[#000419] overflow-hidden">
      <ToolSilhouettes />

      <section className="relative z-10 flex-1 flex flex-col items-center pt-[35px] px-4">
        <div className="w-full flex items-center justify-between">
          <Image
            src="/hirfa_logo.svg"
            alt="Hirfa"
            width={67}
            height={53}
            className="w-[67px] h-[53px]"
          />
          <button
            onClick={() => router.push('/login')}
            className="text-[#C5C6D0] text-center font-cairo text-base font-semibold leading-10 tracking-[-0.64px]"
          >
            تخطي
          </button>
        </div>

        <div className="flex-1 flex items-center justify-center w-full">
          <Image
            src="https://res.cloudinary.com/dgsorkijt/image/upload/v1781787786/KKK_1_uzge6f.png"
            alt="ابحث عن حرفي"
            width={373}
            height={328}
            className="w-full max-w-[373px] h-auto"
            priority
          />
        </div>
      </section>

      <section className="relative z-10 bg-[#F8F9FF] rounded-t-[24px] px-8 pt-8 pb-6 shadow-[0_-8px_32px_0_rgba(2,27,77,0.15)]">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-6 h-2 rounded-full bg-gradient-to-r from-[#FF8A00] to-[#FFB800]" />
          <div className="w-2 h-2 rounded-full bg-[#D3E3FF]" />
          <div className="w-2 h-2 rounded-full bg-[#D3E3FF]" />
        </div>

        <div className="flex flex-col items-center gap-4">
          <h2 className="text-[#0B1C30] text-center font-cairo text-[32px] font-bold leading-10 tracking-[-0.64px]">
            كل الحرفيين اللي تحتاجهم في مكان واحد
          </h2>
          <p className="text-[#52627A] text-center font-cairo text-base font-normal leading-6 max-w-[280px]">
            اعثر على نجارين، سباكين، كهربائيين، نقاشين
            وغيرهم بسهولة وفي دقائق.
          </p>
        </div>

        <button
          onClick={() => router.push('/intro/step2')}
          className="mt-[25px] w-full h-14 flex items-center justify-center gap-3 rounded-[12px] px-6 py-4 text-white font-cairo text-base font-normal leading-6"
          style={{
            background: 'linear-gradient(90deg, #FF8A00 0%, #FFB800 100%)',
            boxShadow: '0 10px 15px -3px rgba(255,138,0,0.20), 0 4px 6px -4px rgba(255,138,0,0.20)',
          }}
        >
          التالي
        </button>
      </section>
    </main>
  )
}
