'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

export default function SplashPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/welcome')
    }, 2000)
    return () => clearTimeout(timer)
  }, [router])

  return (
    <div
      dir="rtl"
      className="min-h-screen flex flex-col items-center justify-center w-full font-arabic bg-bg-dark-solid"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="flex flex-col items-center gap-lg"
      >
        <div
          className="flex items-center justify-center rounded-full w-[80px] h-[80px] bg-gradient-primary shadow-[0_4px_30px_0_rgba(255,138,0,0.30)]"
        >
          <span className="text-text-white text-[40px] font-extrabold leading-none font-arabic">
            ح
          </span>
        </div>
        <h1 className="text-[32px] font-extrabold text-text-white tracking-[-0.5px]">
          حِرفة
        </h1>
      </motion.div>
    </div>
  )
}
