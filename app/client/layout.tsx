'use client'

import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { profile, user, loading } = useAuth()

  useEffect(() => {
    if (!loading) {
      const role = profile?.role || user?.user_metadata?.role
      if (role !== 'client' && role !== 'admin') {
        router.replace('/login')
      }
    }
  }, [profile, user, loading, router])

  if (loading) return null

  const isActive = (href: string) => {
    if (href === '/client/home') return pathname === '/client/home' || pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <div className="relative min-h-screen pb-[100px] bg-[#050814] font-[family-name:var(--font-arabic)] text-white">
      <div className="w-full max-w-[512px] mx-auto relative">
        {children}
      </div>

      <div className="fixed bottom-0 left-0 right-0 z-50">
        <div className="relative max-w-[512px] mx-auto">
          {/* Navbar */}
          <div className="bg-[#020617] rounded-t-[12px] border-t border-white/5 shadow-[0_-4px_12px_rgba(5,11,44,0.08)]">
            <div dir="rtl" className="grid grid-cols-5 px-3 py-3">
              {/* الرئيسية */}
              <Link href="/client/home" className="flex flex-col items-center justify-center relative">
                {isActive('/client/home') || pathname === '/' ? (
                  <div className="flex flex-col items-center gap-1">
                    <div className="flex items-center justify-center w-[48px] h-[48px] rounded-[20px] bg-gradient-to-br from-[#FF8A00] to-[#FFB800] shadow-[0_4px_12px_rgba(255,138,0,0.30)]">
                      <svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path d="M0 18V6L8 0L16 6V18H10V11H6V18H0Z" fill="white" /></svg>
                    </div>
                    <span className="font-bold text-[10px] text-white">الرئيسية</span>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-1">
                    <svg width="16" height="18" viewBox="0 0 16 18" fill="none"><path d="M0 18V6L8 0L16 6V18H10V11H6V18H0Z" fill="#94A3B8" /></svg>
                    <span className="font-medium text-[10px] text-[#94A3B8]">الرئيسية</span>
                  </div>
                )}
              </Link>

              {/* طلباتي */}
              <Link href="/client/orders" className="flex flex-col items-center justify-center relative">
                <div className="flex flex-col items-center gap-1">
                  <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
                    <path d="M16.85 20.975C16.7167 20.975 16.5917 20.9542 16.475 20.9125C16.3583 20.8708 16.25 20.8 16.15 20.7L11.05 15.6C10.95 15.5 10.8792 15.3917 10.8375 15.275C10.7958 15.1583 10.775 15.0333 10.775 14.9C10.775 14.7667 10.7958 14.6417 10.8375 14.525C10.8792 14.4083 10.95 14.3 11.05 14.2L13.175 12.075C13.275 11.975 13.3833 11.9042 13.5 11.8625C13.6167 11.8208 13.7417 11.8 13.875 11.8C14.0083 11.8 14.1333 11.8208 14.25 11.8625C14.3667 11.9042 14.475 11.975 14.575 12.075L19.675 17.175C19.775 17.275 19.8458 17.3833 19.8875 17.5C19.9292 17.6167 19.95 17.7417 19.95 17.875C19.95 18.0083 19.9292 18.1333 19.8875 18.25C19.8458 18.3667 19.775 18.475 19.675 18.575L17.55 20.7C17.45 20.8 17.3417 20.8708 17.225 20.9125C17.1083 20.9542 16.9833 20.975 16.85 20.975ZM16.85 18.6L17.575 17.875L13.9 14.2L13.175 14.925L16.85 18.6ZM3.125 21C2.99167 21 2.8625 20.975 2.7375 20.925C2.6125 20.875 2.5 20.8 2.4 20.7L0.3 18.6C0.2 18.5 0.125 18.3875 0.075 18.2625C0.025 18.1375 0 18.0083 0 17.875C0 17.7417 0.025 17.6167 0.075 17.5C0.125 17.3833 0.2 17.275 0.3 17.175L5.6 11.875H7.725L8.575 11.025L4.45 6.9H3.025L0 3.875L2.825 1.05L5.85 4.075V5.5L9.975 9.625L12.875 6.725L11.8 5.65L13.2 4.25H10.375L9.675 3.55L13.225 0L13.925 0.7V3.525L15.325 2.125L18.875 5.675C19.1583 5.95833 19.375 6.27917 19.525 6.6375C19.675 6.99583 19.75 7.375 19.75 7.775C19.75 8.175 19.675 8.55833 19.525 8.925C19.375 9.29167 19.1583 9.61667 18.875 9.9L16.75 7.775L15.35 9.175L14.3 8.125L9.125 13.3V15.4L3.825 20.7C3.725 20.8 3.61667 20.875 3.5 20.925C3.38333 20.975 3.25833 21 3.125 21ZM3.125 18.6L7.375 14.35V13.625H6.65L2.4 17.875L3.125 18.6Z" fill={isActive('/client/orders') ? '#FF8A00' : '#C7C5CF'} />
                  </svg>
                  <span className={`text-[10px] ${isActive('/client/orders') ? 'font-bold text-[#FF8A00]' : 'font-medium text-[#C7C5CF]'}`}>طلباتي</span>
                </div>
              </Link>

              {/* SOS - طوارئ (center) */}
              <Link href="/client/emergency" className="flex flex-col items-center justify-center relative">
                <div className="flex flex-col items-center gap-1">
                  <div className="relative w-[72px] h-[72px] flex items-center justify-center">
                    <svg width="72" height="72" viewBox="0 0 102 102" fill="none" className="absolute inset-0">
                      <ellipse cx="51" cy="51" rx="44.6453" ry="44.582" fill="#ED4C5C" fillOpacity="0.12" />
                      <ellipse cx="51" cy="51" rx="36.7084" ry="36.6914" fill="#ED4C5C" />
                      <path d="M43.0835 44.401H38.4205C38.0083 44.401 37.613 44.5638 37.3215 44.8536C37.03 45.1434 36.8662 45.5364 36.8662 45.9462V49.0367C36.8662 49.4466 37.03 49.8396 37.3215 50.1294C37.613 50.4192 38.0083 50.582 38.4205 50.582H41.5292C41.9414 50.582 42.3367 50.7448 42.6282 51.0346C42.9197 51.3244 43.0835 51.7174 43.0835 52.1272V55.2177C43.0835 55.6276 42.9197 56.0206 42.6282 56.3104C42.3367 56.6002 41.9414 56.763 41.5292 56.763H36.8662M58.6267 56.763H63.2896C63.7019 56.763 64.0972 56.6002 64.3887 56.3104C64.6802 56.0206 64.844 55.6276 64.844 55.2177V52.1272C64.844 51.7174 64.6802 51.3244 64.3887 51.0346C64.0972 50.7448 63.7019 50.582 63.2896 50.582H60.181C59.7688 50.582 59.3734 50.4192 59.0819 50.1294C58.7904 49.8396 58.6267 49.4466 58.6267 49.0367V45.9462C58.6267 45.5364 58.7904 45.1434 59.0819 44.8536C59.3734 44.5638 59.7688 44.401 60.181 44.401H64.844M47.7464 44.401H53.9637V56.763H47.7464V44.401Z" stroke="white" strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" />
                      <ellipse cx="51" cy="51" rx="50.598" ry="50.5" fill="#ED4C5C" fillOpacity="0.05" />
                    </svg>
                  </div>
                  <span className="text-[10px] font-medium text-[#ED4C5C]">طوارئ</span>
                </div>
              </Link>

              {/* المحفظة */}
              <Link href="/client/wallet" className="flex flex-col items-center justify-center relative">
                <div className="flex flex-col items-center gap-1">
                  <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
                    <path d="M2 16V2C2 2 2 2.37083 2 3.1125C2 3.85417 2 4.81667 2 6V12C2 13.1833 2 14.1458 2 14.8875C2 15.6292 2 16 2 16ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V4.5H16V2H2V16H16V13.5H18V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM10 14C9.45 14 8.97917 13.8042 8.5875 13.4125C8.19583 13.0208 8 12.55 8 12V6C8 5.45 8.19583 4.97917 8.5875 4.5875C8.97917 4.19583 9.45 4 10 4H17C17.55 4 18.0208 4.19583 18.4125 4.5875C18.8042 4.97917 19 5.45 19 6V12C19 12.55 18.8042 13.0208 18.4125 13.4125C18.0208 13.8042 17.55 14 17 14H10ZM17 12V6H10V12H17ZM13 10.5C13.4167 10.5 13.7708 10.3542 14.0625 10.0625C14.3542 9.77083 14.5 9.41667 14.5 9C14.5 8.58333 14.3542 8.22917 14.0625 7.9375C13.7708 7.64583 13.4167 7.5 13 7.5C12.5833 7.5 12.2292 7.64583 11.9375 7.9375C11.6458 8.22917 11.5 8.58333 11.5 9C11.5 9.41667 11.6458 9.77083 11.9375 10.0625C12.2292 10.3542 12.5833 10.5 13 10.5Z" fill={isActive('/client/wallet') ? '#FF8A00' : '#C7C5CF'} />
                  </svg>
                  <span className={`text-[10px] ${isActive('/client/wallet') ? 'font-bold text-[#FF8A00]' : 'font-medium text-[#C7C5CF]'}`}>المحفظة</span>
                </div>
              </Link>

              {/* الحساب */}
              <Link href="/client/profile" className="flex flex-col items-center justify-center relative">
                <div className="flex flex-col items-center gap-1">
                  <svg width="21" height="21" viewBox="0 0 21 21" fill="none">
                    <path d="M3.81664 16.025C4.73747 15.3416 5.7406 14.8021 6.82601 14.4062C7.91142 14.0104 9.06663 13.8125 10.2916 13.8125C11.5166 13.8125 12.6718 14.0104 13.7572 14.4062C14.8427 14.8021 15.8458 15.3416 16.7666 16.025C17.4402 15.2847 17.9739 14.4278 18.3677 13.4541C18.7614 12.4805 18.9583 11.4264 18.9583 10.2916C18.9583 7.89024 18.1142 5.84545 16.426 4.15725C14.7378 2.46906 12.693 1.62496 10.2916 1.62496C7.89024 1.62496 5.84545 2.46906 4.15725 4.15725C2.46906 5.84545 1.62496 7.89024 1.62496 10.2916C1.62496 11.4264 1.82184 12.4805 2.21559 13.4541C2.60934 14.4278 3.14303 15.2847 3.81664 16.025ZM10.2916 11.1041C9.30274 11.1041 8.46872 10.7645 7.78956 10.0854C7.11039 9.4062 6.77081 8.57218 6.77081 7.58329C6.77081 6.59441 7.11039 5.76039 7.78956 5.08122C8.46872 4.40206 9.30274 4.06248 10.2916 4.06248C11.2805 4.06248 12.1145 4.40206 12.7937 5.08122C13.4729 5.76039 13.8124 6.59441 13.8124 7.58329C13.8124 8.57218 13.4729 9.4062 12.7937 10.0854C12.1145 10.7645 11.2805 11.1041 10.2916 11.1041ZM10.2916 20.5833C8.86246 20.5833 7.52185 20.3145 6.26977 19.777C5.01769 19.2395 3.92846 18.5076 3.00207 17.5812C2.07569 16.6548 1.34374 15.5656 0.806247 14.3135C0.268749 13.0614 0 11.7208 0 10.2916C0 8.86246 0.268749 7.52185 0.806247 6.26977C1.34374 5.01769 2.07569 3.92846 3.00207 3.00207C3.92846 2.07569 5.01769 1.34374 6.26977 0.806247C7.52185 0.268749 8.86246 0 10.2916 0C11.7208 0 13.0614 0.268749 14.3135 0.806247C15.5656 1.34374 16.6548 2.07569 17.5812 3.00207C18.5076 3.92846 19.2395 5.01769 19.777 6.26977C20.3145 7.52185 20.5833 8.86246 20.5833 10.2916C20.5833 11.7208 20.3145 13.0614 19.777 14.3135C19.2395 15.5656 18.5076 16.6548 17.5812 17.5812C16.6548 18.5076 15.5656 19.2395 14.3135 19.777C13.0614 20.3145 11.7208 20.5833 10.2916 20.5833Z" fill={isActive('/client/profile') ? '#FF8A00' : '#94A3B8'} />
                  </svg>
                  <span className={`text-[10px] ${isActive('/client/profile') ? 'font-bold text-[#FF8A00]' : 'font-medium text-[#94A3B8]'}`}>الحساب</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
