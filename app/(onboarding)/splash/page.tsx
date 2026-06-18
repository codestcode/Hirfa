'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { motion } from 'framer-motion'
import ToolSilhouettes from '@/components/shared/ToolSilhouettes'

export default function SplashPage() {
  const router = useRouter()
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const duration = 2000
    const interval = 30
    const step = 100 / (duration / interval)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = prev + step
        if (next >= 100) {
          clearInterval(timer)
          return 100
        }
        return next
      })
    }, interval)

    const redirectTimer = setTimeout(() => {
      router.push('/intro/step1')
    }, duration)

    return () => {
      clearInterval(timer)
      clearTimeout(redirectTimer)
    }
  }, [router])

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center bg-[#000419] overflow-hidden">
      <ToolSilhouettes />

      <section className="flex flex-col items-center z-10 px-6">
        <Image
          src="/hirfa_logo.svg"
          alt="Hirfa"
          width={167}
          height={141}
          className="w-[167px] h-[141px]"
          priority
        />

        <h1 className="text-[48px] font-bold leading-[48px] tracking-[-1.2px] text-white mt-8" style={{ fontFamily: 'Hanken Grotesk, sans-serif' }}>
          Hirfa
        </h1>

        <p className="text-center mt-2">
          <span className="text-[18px] font-medium leading-[28px] tracking-[3.6px] uppercase" style={{ color: 'rgba(179,197,255,0.8)', fontFamily: 'Inter, sans-serif' }}>
            TRUSTED HANDS,{' '}
          </span>
          <span className="text-[18px] font-extrabold leading-[28px] tracking-[3.6px] uppercase text-[#FF8A00]" style={{ fontFamily: 'Inter, sans-serif' }}>
            QUALITY WORK
          </span>
        </p>
      </section>

      <div className="absolute bottom-[56px] left-1/2 -translate-x-1/2 w-full max-w-[352px] px-12 z-10">
        <div className="h-1 w-full rounded-full bg-[#021B4D] overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-[#FF8A00] shadow-[0_0_10px_0_#FF8A00]"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[12px] font-medium leading-4 tracking-[-0.6px] uppercase text-[#C5C6D0]" style={{ fontFamily: 'Inter, sans-serif' }}>
            OPTIMIZING RESOURCES
          </span>
          <span className="text-[12px] font-medium leading-4 tracking-[-0.6px] uppercase text-[#C5C6D0]" style={{ fontFamily: 'Inter, sans-serif' }}>
            {Math.round(progress)}%
          </span>
        </div>
      </div>
    </main>
  )
}
