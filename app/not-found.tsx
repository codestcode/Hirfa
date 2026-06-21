'use client'

import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import ToolSilhouettes from '@/components/shared/ToolSilhouettes'
import { useAuth } from '@/contexts/AuthContext'

export default function NotFoundPage() {
  const router = useRouter()
  const { profile } = useAuth()

  const goHome = () => {
    if (profile?.role === 'worker') {
      router.push('/worker/home')
    } else if (profile?.role === 'client') {
      router.push('/client/home')
    } else {
      router.push('/login')
    }
  }

  return (
    <div dir="rtl" className="min-h-screen flex flex-col items-center justify-center font-arabic bg-[#000419] relative overflow-hidden">
      <ToolSilhouettes />

      <div className="absolute inset-0 pointer-events-none">
        <svg className="absolute -top-28 -right-20 w-[240px] h-[240px] opacity-[0.04]" viewBox="0 0 83 83" fill="none">
          <path d="M41.1513 82.1035C18.4973 82.1401 0.102999 63.8052 0.0663535 41.1513C0.0297075 18.4973 18.3646 0.102999 41.0186 0.0663535C63.6725 0.0297075 82.0668 18.3646 82.1035 41.0186C82.1401 63.6725 63.8052 82.0668 41.1513 82.1035ZM41.0339 9.56178C23.6242 9.58995 9.53362 23.7262 9.56179 41.1359C9.58995 58.5456 23.7262 72.6362 41.1359 72.608C58.5456 72.5799 72.6362 58.4437 72.608 41.0339C72.5799 23.6242 58.4437 9.53362 41.0339 9.56178Z" fill="white" />
        </svg>

        <svg className="absolute top-2/3 left-10 w-[90px] h-[90px] opacity-[0.04]" viewBox="0 0 64 64" fill="none">
          <path d="M31.6116 63.0703C14.2093 63.0985 0.0791223 49.014 0.0509715 31.6116C0.0228207 14.2093 14.1074 0.0791223 31.5097 0.0509715C48.912 0.0228207 63.0422 14.1074 63.0703 31.5097C63.0985 48.912 49.0139 63.0422 31.6116 63.0703ZM31.5215 7.34518C18.1476 7.36682 7.32355 18.226 7.34518 31.5998C7.36682 44.9737 18.226 55.7978 31.5998 55.7761C44.9737 55.7545 55.7978 44.8953 55.7761 31.5215C55.7545 18.1476 44.8953 7.32355 31.5215 7.34518Z" fill="white" />
        </svg>

        <svg className="absolute top-1/3 left-1/4 w-10 h-10 opacity-[0.04]" viewBox="0 0 30 30" fill="none">
          <path d="M14.5293 28.9884C6.53088 29.0013 0.0363661 22.5278 0.0234275 14.5293C0.0104888 6.53088 6.48402 0.0363661 14.4825 0.0234275C22.4809 0.0104888 28.9754 6.48402 28.9884 14.4825C29.0013 22.4809 22.5278 28.9754 14.5293 28.9884ZM14.4879 3.37599C8.34101 3.38593 3.36605 8.37702 3.37599 14.5239C3.38593 20.6708 8.37702 25.6457 14.5239 25.6358C20.6708 25.6259 25.6457 20.6348 25.6358 14.4879C25.6259 8.34101 20.6348 3.36605 14.4879 3.37599Z" fill="white" />
        </svg>

        <div className="absolute top-[30%] right-[20%] w-[47px] h-[53px]">
          <div className="absolute left-0 top-[3px] w-[52px] h-[12px] rounded-[17px] bg-white/10 rotate-[40.8deg]" />
          <div className="absolute left-[4px] top-0 w-[54px] h-[12px] rounded-[77px] bg-white/10 rotate-[120.2deg]" />
        </div>

        <div className="absolute bottom-[30%] left-[15%] w-[63px] h-[71px]">
          <div className="absolute left-0 top-[4px] w-[69px] h-[16px] rounded-[17px] bg-white/10 rotate-[40.8deg]" />
          <div className="absolute left-[5px] top-0 w-[72px] h-[16px] rounded-[77px] bg-white/10 rotate-[120.2deg]" />
        </div>

        <div className="absolute top-[45%] left-[30%] w-[21px] h-[24px]">
          <div className="absolute left-0 top-[1px] w-[23px] h-[5px] rounded-[17px] bg-white/10 rotate-[40.8deg]" />
          <div className="absolute left-[2px] top-0 w-[24px] h-[5px] rounded-[77px] bg-white/10 rotate-[120.2deg]" />
        </div>

        <div className="absolute -top-14 -left-14 w-[302px] h-[347px] rounded-full bg-primary/10 opacity-60 blur-[238px] pointer-events-none" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="flex flex-col items-center z-10 px-6 gap-4"
      >
        <div className="relative">
          <div className="text-[100px] md:text-[128px] font-bold font-[family-name:var(--font-latin)] text-white/15 leading-none select-none tracking-tight">
            404
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="flex flex-col items-center gap-4 -mt-2"
        >
          <h1 className="text-3xl md:text-[40px] font-bold text-white text-center leading-tight">
            الصفحة غير موجودة
          </h1>

          <p className="text-sm md:text-base text-[#7285bc] text-center max-w-[340px] md:max-w-[480px] leading-7">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يمكنك العودة إلى الصفحة الرئيسية
          </p>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={goHome}
            className="mt-4 px-10 py-3.5 rounded-xl bg-[#FF8A00] text-[#000419] font-bold text-base cursor-pointer border-none hover:bg-[#FF9A20] transition-all duration-200 shadow-lg shadow-[#FF8A00]/20"
          >
            العودة للرئيسية
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  )
}
