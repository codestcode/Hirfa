'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Bell, Home, ClipboardList, MessageCircle, Wallet, User, Star, Clock, Calendar, MessageSquare, Image as ImageIcon } from 'lucide-react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { mockUser } from '@/lib/mock-data'

const quickInsights = [
  { icon: ClipboardList, label: 'طلبات اليوم', value: '12', color: '#FF8A00' },
  { icon: Wallet, label: 'الأرباح', value: '850', color: '#FFB800' },
  { icon: Star, label: 'التقييم', value: '4.9', color: '#EAB308' },
]

const professionalActions = [
  { icon: Calendar, label: 'الجدول', href: '/schedule', gradient: 'rgba(59,130,246,0.10) 0%, rgba(96,165,250,0.10) 100%', border: 'rgba(59,130,246,0.20)', iconColor: '#60A5FA', badge: null },
  { icon: MessageSquare, label: 'الرسائل', href: '/messages', gradient: 'rgba(255,138,0,0.10) 0%, rgba(255,184,0,0.10) 100%', border: 'rgba(255,138,0,0.20)', iconColor: '#FF8A00', badge: '2' },
  { icon: Wallet, label: 'المحفظة', href: '/wallet', gradient: 'rgba(16,185,129,0.10) 0%, rgba(52,211,153,0.10) 100%', border: 'rgba(16,185,129,0.20)', iconColor: '#10B981', badge: null },
  { icon: ImageIcon, label: 'المعرض', href: '/gallery', gradient: 'rgba(168,85,247,0.10) 0%, rgba(192,132,252,0.10) 100%', border: 'rgba(168,85,247,0.20)', iconColor: '#C084FC', badge: null },
]

const monthlyStats = [
  { label: 'الطلبات المكتملة', value: '24' },
  { label: 'صافي الأرباح', value: '8,400', currency: 'ج.م' },
  { label: 'سرعة الرد', value: '98%' },
  { label: 'متوسط التقييم', value: '4.9', icon: Star },
]

export default function HomePage() {
  const router = useRouter()
  const [isAvailable, setIsAvailable] = useState(true)

  return (
    <div dir="rtl" className="min-h-screen relative isolate flex flex-col w-full font-arabic bg-[#020617]">
      {/* Header - Top App Bar */}
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative shrink-0 w-full z-[2] border-b border-white/5 backdrop-blur-lg bg-[#020617]/80"
      >
        <div className="h-[80px] max-w-[512px] w-full flex items-center justify-between px-5 mx-auto">
          <button className="relative flex items-center justify-center rounded-full w-10 h-10 bg-bg-input">
            <Bell size={18} className="text-white" />
            <div className="absolute rounded-full w-[10px] h-[10px]" style={{ right: '8px', top: '8px', background: 'var(--color-primary)', boxShadow: '0 0 0 2px #020617' }} />
          </button>

          <div className="flex items-center gap-3">
            <div className="flex flex-col items-end" style={{ gap: '-1px' }}>
              <span className="text-[14px] font-medium leading-5 text-[#94A3B8]">
                مرحباً،
              </span>
              <span className="text-[18px] font-bold leading-[22.5px] text-white tracking-[-0.45px]">
                محمد السعدني 👋
              </span>
            </div>

            <div className="flex flex-col items-start relative">
              <div className="flex flex-col justify-center items-start rounded-full w-[44px] h-[44px] p-[2px] bg-[var(--gradient-primary)]">
                <div className="flex-1 self-stretch rounded-full overflow-hidden border-2 border-[#020617]">
                  <Image
                    src={mockUser.avatar || 'https://i.pravatar.cc/150?img=4&s=150'}
                    alt={mockUser.name}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
              <div className="absolute rounded-full w-[14px] h-[14px] bottom-0 border-2 border-[#020617] bg-[#22C55E]" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex flex-col w-full max-w-[512px] mx-auto px-5 pt-6 gap-9"
        style={{ paddingBottom: '140px' }}
      >
        {/* Section - Availability Status Card */}
        <div className="flex flex-col items-start self-stretch overflow-hidden relative rounded-[28px] p-6 border border-white/8 backdrop-blur-[6px] bg-bg-elevated">
          <div className="flex justify-between items-center self-stretch relative gap-4">
            <div className="flex flex-col items-start gap-2" style={{ maxWidth: '200px' }}>
              <div className="flex items-center gap-[10px]">
                <span className="text-[18px] font-bold leading-7 text-white tracking-[-0.45px]">
                  حالة التوفر
                </span>
                <div className="w-[10px] h-[10px] rounded-full shrink-0 bg-[#22C55E]" />
              </div>
              <span className="text-[14px] font-normal leading-[22.75px] text-right text-[#94A3B8]">
                يمكن للعملاء إرسال طلبات صيانة جديدة إليك الآن
              </span>
              {isAvailable && (
                <div className="flex justify-start items-start rounded-full px-3 py-[7.5px] border border-[rgba(34,197,94,0.20)] bg-[rgba(34,197,94,0.10)]">
                  <span className="text-[12px] font-semibold leading-4 text-[#4ADE80]">
                    متاح لاستقبال العمل
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center relative">
              <div
                className="relative rounded-full cursor-pointer transition-all duration-300 w-[64px] h-[36px]"
                style={{
                  background: isAvailable
                    ? 'var(--gradient-primary-horizontal)'
                    : 'var(--color-border-light)',
                  boxShadow: isAvailable ? '0 10px 15px -3px rgba(0,0,0,0.20), 0 4px 6px -4px rgba(0,0,0,0.20)' : 'none',
                }}
                onClick={() => setIsAvailable(!isAvailable)}
              >
                <div
                  className="rounded-full bg-white transition-all duration-300 w-[28px] h-[28px] absolute top-1"
                  style={{ right: isAvailable ? '4px' : '32px' }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section - Quick Insights */}
        <div className="grid self-stretch gap-3" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: '117px' }}>
          {quickInsights.map(({ icon: Icon, label, value, color }) => (
            <div key={label} className="flex flex-col items-center rounded-[20px] p-4 gap-1 border border-white/8 backdrop-blur-[6px] bg-bg-elevated">
              <div className="pb-1">
                <Icon size={label === 'طلبات اليوم' ? 16 : 17} style={{ color }} />
              </div>
              <span className="text-[10px] font-bold leading-[15px] text-center text-[#94A3B8] tracking-[0.5px] uppercase">
                {label}
              </span>
              <span className="text-[20px] font-bold leading-7 text-center text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Section - New Job Requests */}
        <div className="flex flex-col items-start self-stretch gap-4">
          <div className="flex justify-between items-center self-stretch px-[4px]">
            <div className="flex items-center gap-2">
              <div className="rounded-full w-[6px] h-5 bg-[var(--gradient-primary)]" />
              <span className="text-[18px] font-bold leading-7 text-white">
                طلبات جديدة
              </span>
            </div>
            <button className="text-[14px] font-bold leading-5 text-primary">
              عرض الكل
            </button>
          </div>

          <div className="flex flex-col items-start self-stretch cardgrad ">
            <div className="flex justify-between items-start self-stretch ">
              <div className="flex items-start gap-4">
                <div className="overflow-hidden rounded-[20px] shrink-0 w-14 h-14 shadow-[0_0_0_1px_rgba(255,255,255,0.10),0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]">
                  <Image
                    src="https://i.pravatar.cc/150?img=11"
                    alt="Customer"
                    width={56}
                    height={56}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="flex flex-col items-start self-stretch gap-1">
                  <span className="text-[16px] font-bold leading-6 text-white">
                    أحمد خالد
                  </span>
                  <div className="flex items-center self-stretch gap-[6px]">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9.41407 11.624C9.34377 11.624 9.27834 11.6128 9.21776 11.5903C9.15718 11.5679 9.0996 11.5294 9.045 11.4748L6.10366 8.53906C6.04907 8.48447 6.01055 8.42688 5.98812 8.36631C5.96568 8.30573 5.95446 8.24029 5.95446 8.16999C5.95446 8.0997 5.96568 8.03426 5.98812 7.97368C6.01055 7.91311 6.04907 7.85552 6.10366 7.80093L7.20862 6.69597C7.26321 6.64137 7.3208 6.60286 7.38137 6.58042C7.44195 6.55799 7.50739 6.54677 7.57769 6.54677C7.64799 6.54677 7.71342 6.55799 7.774 6.58042C7.83458 6.60286 7.89216 6.64137 7.94675 6.69597L10.8881 9.63731C10.9427 9.69191 10.9812 9.74949 11.0036 9.81007C11.0261 9.87064 11.0373 9.93608 11.0373 10.0064C11.0373 10.0767 11.0261 10.1421 11.0036 10.2027C10.9812 10.2633 10.9427 10.3209 10.8881 10.3754L9.78314 11.4748C9.72855 11.5294 9.67096 11.5679 9.61038 11.5903C9.54981 11.6128 9.48437 11.624 9.41407 11.624ZM9.41407 10.6256L10.0333 10.0064L7.58666 7.55972L6.96742 8.17897L9.41407 10.6256ZM1.6322 11.633C1.5619 11.633 1.49497 11.6203 1.4314 11.5948C1.36783 11.5694 1.30875 11.5294 1.25416 11.4748L0.158172 10.3844C0.103578 10.3298 0.0635677 10.2707 0.0381406 10.2072C0.0127135 10.1436 0 10.0767 0 10.0064C0 9.93608 0.0127135 9.86971 0.0381406 9.80726C0.0635677 9.74482 0.103578 9.6863 0.158172 9.6317L3.20496 6.58491H4.43333L4.90672 6.11152L2.46682 3.67161H1.63557L0.0168282 2.05287L1.46281 0.606891L3.08155 2.22563V3.05688L5.52145 5.49679L7.24678 3.77146L6.39532 2.92L7.13345 2.18187H5.64821L5.32402 1.86329L7.1873 0L7.50588 0.318583V1.80944L8.24402 1.0713L10.4383 3.25432C10.5923 3.40464 10.7084 3.5759 10.7866 3.7681C10.8647 3.9603 10.9038 4.16372 10.9038 4.37835C10.9038 4.56681 10.8713 4.74835 10.8062 4.92298C10.7411 5.0976 10.6465 5.25633 10.5224 5.39917L9.30525 4.18203L8.48298 5.0043L7.86487 4.38619L5.04245 7.20861V8.43922L2.00127 11.4748C1.94667 11.5294 1.88909 11.5694 1.82851 11.5948C1.76793 11.6203 1.7025 11.633 1.6322 11.633ZM1.6322 10.62L4.30769 7.94452V7.32527H3.68845L1.01295 10.0008L1.6322 10.62Z" fill="#94A3B8"/>
                    </svg>
                    <span className="text-[12px] font-normal leading-4 text-[#94A3B8]">
                      تركيب غرفة نوم
                    </span>
                  </div>
                </div>
              </div>

              <div className="rounded-[8px] px-2 py-1 border border-[var(--color-border-light)] bg-bg-input">
                <span className="text-[10px] font-medium leading-[15px] text-[#94A3B8]">
                  منذ 10 دقائق
                </span>
              </div>
            </div>

            <div className="flex items-center self-stretch rounded-[20px] py-3 bg-black/20" style={{ paddingRight: '30.5px', paddingLeft: '30.52px', gap: '61px' }}>
              <div className="flex items-center gap-2">
                <svg width="12" height="15" viewBox="0 0 12 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M5.66103 7.024C6.03507 7.024 6.35454 6.89155 6.61944 6.62665C6.88434 6.36175 7.01679 6.04228 7.01679 5.66824C7.01679 5.29421 6.88434 4.97474 6.61944 4.70984C6.35454 4.44494 6.03507 4.31249 5.66103 4.31249C5.287 4.31249 4.96753 4.44494 4.70263 4.70984C4.43773 4.97474 4.30527 5.29421 4.30527 5.66824C4.30527 6.04228 4.43773 6.36175 4.70263 6.62665C4.96753 6.89155 5.287 7.024 5.66103 7.024ZM5.66103 12.7601C7.12834 11.4466 8.25117 10.1868 9.02954 8.98051C9.80791 7.77426 10.1971 6.71776 10.1971 5.81103C10.1971 4.44372 9.76272 3.31969 8.89397 2.43892C8.02522 1.55815 6.94757 1.11776 5.66103 1.11776C4.37449 1.11776 3.29685 1.55815 2.4281 2.43892C1.55935 3.31969 1.12497 4.44372 1.12497 5.81103C1.12497 6.71776 1.51416 7.77426 2.29253 8.98051C3.07089 10.1868 4.19373 11.4466 5.66103 12.7601ZM5.66103 14.2572C3.77354 12.6216 2.35816 11.0995 1.4149 9.69083C0.471633 8.28218 0 6.98891 0 5.81103C0 4.08027 0.559853 2.67908 1.67956 1.60745C2.79926 0.535816 4.12642 0 5.66103 0C7.19564 0 8.5228 0.535816 9.64251 1.60745C10.7622 2.67908 11.3221 4.08027 11.3221 5.81103C11.3221 6.98891 10.8504 8.28218 9.90717 9.69083C8.9639 11.0995 7.54852 12.6216 5.66103 14.2572Z" fill="#FFB800"/>
                </svg>
                <span className="text-[12px] font-medium leading-4 text-[#94A3B8]">2.5 كم</span>
              </div>
              <div className="w-px h-4 bg-[var(--color-border-light)]" />
              <div className="flex items-center gap-2">
                <svg width="16" height="12" viewBox="0 0 16 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.92782 6.07207C8.40379 6.07207 7.96029 5.89058 7.59731 5.5276C7.23434 5.16463 7.05285 4.72112 7.05285 4.19709C7.05285 3.67306 7.23434 3.22956 7.59731 2.86658C7.96029 2.50361 8.40379 2.32212 8.92782 2.32212C9.45185 2.32212 9.89536 2.50361 10.2583 2.86658C10.6213 3.22956 10.8028 3.67306 10.8028 4.19709C10.8028 4.72112 10.6213 5.16463 10.2583 5.5276C9.89536 5.89058 9.45185 6.07207 8.92782 6.07207ZM3.98073 8.39419C3.6079 8.39419 3.28873 8.26143 3.02323 7.99593C2.75772 7.73043 2.62497 7.41126 2.62497 7.03843V1.35576C2.62497 0.982925 2.75772 0.663757 3.02323 0.398254C3.28873 0.132751 3.6079 0 3.98073 0H13.8749C14.2478 0 14.5669 0.132751 14.8324 0.398254C15.0979 0.663757 15.2307 0.982925 15.2307 1.35576V7.03843C15.2307 7.41126 15.0979 7.73043 14.8324 7.99593C14.5669 8.26143 14.2478 8.39419 13.8749 8.39419H3.98073ZM5.1057 7.26921H12.7499C12.7499 6.89518 12.8827 6.57571 13.1482 6.31081C13.4137 6.04591 13.7329 5.91346 14.1057 5.91346V2.48073C13.7317 2.48073 13.4122 2.34798 13.1473 2.08248C12.8824 1.81697 12.7499 1.49781 12.7499 1.12497H5.1057C5.1057 1.49901 4.97295 1.81848 4.70745 2.08338C4.44195 2.34828 4.12278 2.48073 3.74995 2.48073V5.91346C4.12398 5.91346 4.44345 6.04621 4.70835 6.31171C4.97325 6.57721 5.1057 6.89638 5.1057 7.26921ZM12.9951 11.0192H1.35576C0.982925 11.0192 0.663757 10.8864 0.398254 10.6209C0.132751 10.3554 0 10.0362 0 9.6634V2.23558H1.12497V9.6634C1.12497 9.7211 1.14901 9.77398 1.19709 9.82207C1.24517 9.87015 1.29806 9.89419 1.35576 9.89419H12.9951V11.0192ZM3.98073 7.26921H3.74995C3.74995 7.26921 3.74995 7.24638 3.74995 7.2007C3.74995 7.15502 3.74995 7.10093 3.74995 7.03843V1.35576C3.74995 1.29325 3.74995 1.23916 3.74995 1.19349C3.74995 1.14781 3.74995 1.12497 3.74995 1.12497H3.98073C3.91823 1.12497 3.86414 1.14781 3.81846 1.19349C3.77278 1.23916 3.74995 1.29325 3.74995 1.35576V7.03843C3.74995 7.10093 3.77278 7.15502 3.81846 7.2007C3.86414 7.24638 3.91823 7.26921 3.98073 7.26921Z" fill="#FFB800"/>
                </svg>
                <span className="text-[12px] font-medium leading-4 text-white">450 ج.م</span>
              </div>
            </div>

            <div className="flex justify-center items-start self-stretch gap-4">
              <button className="box-border px-[24px] py-[14px] bg-white/5 border border-white/10 rounded-[20px]">
                رفض
              </button>
              <button className="btn-primary ">
                قبول الطلب
              </button>
            </div>
          </div>
        </div>

        {/* Section - Today Appointments */}
        <div className="flex flex-col items-start self-stretch gap-4">
          <div className="flex items-center self-stretch gap-2">
            <div className="w-[6px] h-5 rounded-full bg-white/20" />
            <span className="text-[18px] font-bold leading-7 text-white">
              مواعيد اليوم
            </span>
          </div>

          <div className="flex flex-col items-start self-stretch overflow-hidden rounded-[28px] p-5 gap-6 border border-white/8 backdrop-blur-[6px] bg-bg-elevated">
            <div className="flex justify-between items-center self-stretch">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center rounded-[12px] w-10 h-10 border border-primary/20 bg-primary-subtle">
                  <Clock size={19} className="text-primary" />
                </div>

                <div className="flex flex-col items-start gap-[0.5px]">
                  <span className="text-[18px] font-bold leading-7 text-white">10:30 ص</span>
                  <span className="text-[10px] font-bold leading-[15px] text-start text-[#94A3B8] tracking-[1px] uppercase">
                    الموعد القادم
                  </span>
                </div>
              </div>

              <div className="rounded-[12px] px-3 py-[6px] border border-[rgba(34,197,94,0.20)] bg-[rgba(34,197,94,0.10)]">
                <span className="text-[10px] font-bold leading-[15px] text-[#4ADE80]">
                  مؤكد
                </span>
              </div>
            </div>

            <div className="relative">
              {/* Timeline vertical line */}
              <div className="absolute start-[10px] top-0 w-[2px] h-full opacity-20 bg-[var(--gradient-primary)]" />

              {/* Timeline item - Client & Task */}
              <div className="relative ps-[50px] pb-5">
                <div className="absolute start-[1px] top-0 flex items-center justify-center rounded-full w-5 h-5 border border-primary/30 bg-primary/20">
                  <div className="rounded-full w-2 h-2 bg-primary" />
                </div>
                <div className="flex flex-col items-start pt-[2px]">
                  <span className="text-[11px] font-normal leading-[16.5px] text-[#94A3B8]">
                    العميل والمهمة
                  </span>
                  <span className="text-[14px] font-bold leading-5 text-white">
                    أحمد خالد - تركيب غرفة نوم ماستر
                  </span>
                </div>
              </div>

              {/* Timeline item - Address */}
              <div className="relative ps-[50px] pb-5">
                <div className="absolute start-[1px] top-0 flex items-center justify-center rounded-full w-5 h-5 border border-white/20 bg-white/10">
                  <div className="rounded-full w-2 h-2 bg-white/40" />
                </div>
                <div className="flex flex-col items-start pt-[2px]">
                  <span className="text-[11px] font-normal leading-[16.5px] text-[#94A3B8]">
                    العنوان
                  </span>
                  <span className="text-[14px] font-bold leading-5 text-white">
                    كفر الشيخ، الشريف
                  </span>
                </div>
              </div>

              {/* Map button */}
              <button className="flex justify-center items-center self-stretch rounded-[12px] text-center text-[16px] font-normal leading-6 text-white px-6 py-4 h-14 bg-[linear-gradient(90deg,rgba(196,198,207,0.30)_0%,#44474E_100%)] gap-2 border-none cursor-pointer">
                <svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.92016 12.3028L4.94132 7.3759L0.0144241 5.38264L0 4.62112L12.3172 0L7.68167 12.3028H6.92016ZM7.27784 10.1769L10.4019 1.91534L2.12591 5.02496L5.80091 6.50188L7.27784 10.1769Z" fill="white"/>
                </svg>
                فتح الخريطة
              </button>
            </div>
          </div>
        </div>

        {/* Section - Professional Actions */}
        <div className="grid self-stretch gap-4" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, 130px)' }}>
          {professionalActions.map(({ icon: Icon, label, href, gradient, border, iconColor, badge }) => (
            <button
              key={label}
              onClick={() => router.push(href)}
              className="flex flex-col items-center rounded-[28px] relative p-5 gap-3 border border-white/8 backdrop-blur-[6px] bg-bg-elevated"
            >
              <div className="flex items-center justify-center rounded-[20px] w-14 h-14" style={{ border: `1px solid ${border}`, background: `linear-gradient(45deg, ${gradient})` }}>
                <Icon size={20} style={{ color: iconColor }} />
              </div>
              <span className="text-[14px] font-bold leading-5 text-white">{label}</span>
              {badge && (
                <div className="absolute flex items-center justify-center rounded-full w-5 h-5 border-2 border-[#020617] bg-primary" style={{ left: '17px', top: '17px' }}>
                  <span className="text-[10px] font-bold leading-[15px] text-white text-center">
                    {badge}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Section - Monthly Summary */}
        <div className="flex flex-col items-start self-stretch gap-4">
          <div className="flex items-center self-stretch gap-2">
            <span className="text-[18px] font-bold leading-7 text-white">
              أداؤك الشهري
            </span>
            <div className="w-[6px] h-5 rounded-full bg-[#FFB800]" />
          </div>

          <div className="flex flex-col items-start self-stretch overflow-hidden rounded-[28px] relative p-7 gap-8 border border-white/5 bg-[linear-gradient(135deg,#0F172A_0%,#1E293B_100%)]">
            <div className="grid self-stretch gap-8" style={{ gridTemplateColumns: 'repeat(2, 1fr)', gridTemplateRows: 'repeat(2, auto)' }}>
              {monthlyStats.map(({ label, value, icon: Icon, currency }) => (
                <div key={label} className="flex flex-col items-start gap-1">
                  <span className="text-[11px] font-bold leading-[16.5px] uppercase self-stretch text-right text-[#94A3B8]">
                    {label}
                  </span>
                  <div className="flex items-center self-stretch gap-[6px]">
                    {Icon && <Star size={15} className="text-yellow-400 shrink-0" />}
                    <span className="text-[30px] font-bold leading-9 text-white" style={{ fontFamily: "'Hanken Grotesk', sans-serif" }}>
                      {value}
                    </span>
                    {currency && (
                      <span className="text-[12px] leading-4 opacity-60 text-white">
                        {currency}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
