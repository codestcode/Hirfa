'use client'

import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ToolSilhouettes from '@/components/shared/ToolSilhouettes'

export default function RoleSelectionPage() {
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
            className="text-[#C5C6D0] text-center font-[family-name:var(--font-arabic)] text-base font-semibold leading-10 tracking-[-0.64px]"
          >
            تخطي
          </button>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center w-full gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-white text-[32px] font-bold leading-10 tracking-[-0.64px] mb-4 font-[family-name:var(--font-arabic)]">
              من أنت؟
            </h1>
            <p className="text-[#C5C6D0] text-center font-[family-name:var(--font-arabic)] text-base font-normal leading-6">
              اختر نوع حسابك للمتابعة
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col gap-4 w-full max-w-[320px]"
          >
            <button
              onClick={() => router.push('/register?role=client')}
              className="relative h-[180px] rounded-2xl bg-gradient-to-br from-[#1E2538] to-[#0B0F19] border border-[#2D3748] overflow-hidden group hover:border-[#FF8A00] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                <div className="w-20 h-20 rounded-full bg-[#FF8A00]/20 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="1.5">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" strokeLinecap="round" strokeLinejoin="round" />
                    <circle cx="12" cy="7" r="4" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-white text-xl font-bold mb-1 font-[family-name:var(--font-arabic)]">عميل</h3>
                  <p className="text-[#6B7A99] text-sm font-[family-name:var(--font-arabic)]">ابحث عن حرفيين واحجز خدمات</p>
                </div>
              </div>
            </button>

            <button
              onClick={() => router.push('/register?role=craftsman')}
              className="relative h-[180px] rounded-2xl bg-gradient-to-br from-[#1E2538] to-[#0B0F19] border border-[#2D3748] overflow-hidden group hover:border-[#FF8A00] transition-all duration-300"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#FF8A00]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative z-10 flex flex-col items-center justify-center h-full gap-4">
                <div className="w-20 h-20 rounded-full bg-[#FF8A00]/20 flex items-center justify-center">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#FF8A00" strokeWidth="1.5">
                    <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-white text-xl font-bold mb-1 font-[family-name:var(--font-arabic)]">حرفي</h3>
                  <p className="text-[#6B7A99] text-sm font-[family-name:var(--font-arabic)]">قدم خدماتك واكسب العملاء</p>
                </div>
              </div>
            </button>
          </motion.div>
        </div>
      </section>
    </main>
  )
}
